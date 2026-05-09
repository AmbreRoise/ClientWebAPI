import { sleep, type ReservedSQL } from 'bun';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

import { HttpError, NotFoundError } from './error';

import * as author from './requestHandlers/author';
import * as book from './requestHandlers/book';
import * as tag from './requestHandlers/tag';
import * as comment from './requestHandlers/comment';
import * as rating from './requestHandlers/rating';

import { StructError, assert } from 'superstruct';

import { object, optional, refine, string } from 'superstruct';
import { isInt } from 'validator';

import cors from 'cors';

const app = express();
const port = 3000;


interface CustomRequest extends Request {
    custom_property: number;
}

// TP2
export const ReqParams = object({
    author_id: optional(refine(string(), 'int', (value) => isInt(value))),
    book_id: optional(refine(string(), 'int', (value) => isInt(value))),
    tag_id: optional(refine(string(), 'int', (value) => isInt(value))),
    comment_id: optional(refine(string(), 'int', (value) => isInt(value))),
    rating_id: optional(refine(string(), 'int', (value) => isInt(value)))
});

const validateParams = (req: Request, res: Response, next: NextFunction) => {
    assert(req.params, ReqParams);
    next();
};

// Réception de données
app.use(express.json());

app.use(cors()); // premier middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    next();
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Middleware qui affiche la méthode, l'adresse demandé et l'adresse ip du demandeur
    const custom_req = req as CustomRequest;
    custom_req.custom_property = Date.now();

    console.log(`Requête ${req.method} : demande de ${req.hostname} par ${req.ip}`);

    // Si méthode Get => sleep(1000)
    if (req.method == 'GET') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        //(ou) await sleep(1000);
    }
    next();
});

app.use('/test/:param', async (req: Request, res: Response, next: NextFunction) => {
    const custom_req = req as CustomRequest;
    // Toutes les routes /test/:param avec :param le paramètre
    console.log(`Paramètre ${req.params.param}`);

    //Convertir le param en entier et attendre param millisecondes
    const n = Number(req.params.param);
    await sleep(n);

    //Envoi dans le corps de la réponse (dans le html)
    //res.send(`Paramètre ${req.params.param}`);

    const fin = Date.now() - custom_req.custom_property;
    res.status(203).header({
        'Content-Type': 'application/json'
    }).send(`{"request_duration": ${req.params.param}}`);       // Faire un send en précisant l'en-tête en mode json
    // res.json({ "request_duration": fin});
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.route('/authors')
    .get(author.get_all)
    .post(author.create_one);

app.route('/authors/:author_id')
    .all(validateParams)
    .get(author.get_one)
    .patch(author.update_one)
    .delete(author.delete_one);

// TP2
app.get('/books', book.get_all);

app.route('/books/:book_id')
    .all(validateParams)
    .get(book.get_one)
    .patch(book.update_one)
    .delete(book.delete_one);

app.route('/authors/:author_id/books')
    .all(validateParams)
    .get(book.get_all_of_author)
    .post(book.create_one_of_author);

// TP3
app.route('/tags')
    .get(tag.get_all)
    .post(tag.create_one);

app.route('/tags/:tag_id')
    .all(validateParams)
    .get(tag.get_one)
    .patch(tag.update_one)
    .delete(tag.delete_one);

app.route('/books/:book_id/tags')
    .all(validateParams)
    .get(tag.get_all_of_book);

app.route('/books/:book_id/tags/:tag_id')
    .all(validateParams)
    .post(tag.associate_tag_to_book)
    .delete(tag.dissociate_tag_to_book);

// TP4

app.route('/books/:book_id/comments')
    .all(validateParams)
    .get(comment.get_all_of_book)
    .post(comment.create_one);

app.route('/comments/:comment_id')
    .all(validateParams)
    .patch(comment.update_one)
    .delete(comment.delete_one);

app.route('/books/:book_id/ratings')
    .all(validateParams)
    .get(rating.get_all_of_book)
    .post(rating.create_one);

app.route('/ratings/:rating_id')
    .all(validateParams)
    .patch(rating.update_one)
    .delete(rating.delete_one);

app.route('/books/:book_id/ratings/average')
    .all(validateParams)
    .get(rating.get_average_of_book);

// Gestion d'erreurs
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof StructError) {   //TP2
        err.status = 400;
        err.message = `Bad value for field ${err.key}`;
    }

    res.status(err.status ?? 500).send(err.message);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});