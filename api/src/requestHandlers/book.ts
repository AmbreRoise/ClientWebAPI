import { prisma } from '../db';
import { Prisma } from '../generated/prisma/client';
import { HttpError, NotFoundError } from '../error';
import type { Request, Response, NextFunction } from 'express';

import { assert } from 'superstruct';
import { BookCreationData, BookUpdateData, BookGetQueries } from '../validation/book';


export async function get_all(req: Request, res: Response) {
    assert(req.query, BookGetQueries);

    const filter: Prisma.BookWhereInput = {};

    if (req.query.title) {
        filter.title = {
            contains: String(req.query.title)
        };
    }

    if (req.query.average) {
        const avgValue = Number(req.query.average);

        // GroupBy et Having pour avoir les livres avec une note moyenne égale à celle demandée
        const groups = await prisma.rating.groupBy({
            by: ['bookId'],
            _avg: { value: true },
            having: {
                value: {
                    _avg: {
                        equals: avgValue
                    }
                }
            }
        });

        const bookIds = groups.map(g => g.bookId);

        // Si aucun résultat, on retourne immédiatement
        if (bookIds.length === 0) {
            res.set("X-Total-Count", "0");
            res.json([]);
            return;
        }

        filter.id = { in: bookIds };
    }

    // Si on demande les auteurs
    const assoc: Prisma.BookInclude = {};

    // Si on demande ?include=author
    if (req.query.include === "author") {
        assoc.author = {
            select: {
                id: true,
                firstname: true,
                lastname: true
            }
        };
    }

    // Pagination
    const total = await prisma.book.count({
        where: filter
    });

    let skipNumber: number | undefined;
    let takeNumber: number | undefined;

    if (req.query.skip !== undefined) {
        skipNumber = Number(req.query.skip);
    }

    if (req.query.take !== undefined) {
        takeNumber = Number(req.query.take);
    }

    try {
        const books = await prisma.book.findMany({
            where: filter,
            include: assoc,
            orderBy: { title: 'asc' },
            skip: skipNumber,
            take: takeNumber
        });
        res.set("X-Total-Count", total.toString());
        res.json(books);
    }
    catch (err: unknown) {
        throw new NotFoundError("Impossible de récupérer les livres.");
    }
}

export async function get_one(req: Request, res: Response) {
    const book_id = Number(req.params.book_id);

    const book = await prisma.book.findUnique({
        where: { id: book_id }
    });

    if (book) {
        res.json(book);
    }
    else {
        throw new NotFoundError('Book not found');
    }
}

export async function create_one_of_author(req: Request, res: Response) {
    assert(req.body, BookCreationData);

    const authorID = Number(req.params.author_id);
    try {
        const book = await prisma.book.create({
            data: {
                title: req.body.title,
                publication_year: req.body.publication_year ?? null,
                author: {
                    connect: { id: authorID }
                }
            }
        });

        res.status(201).json(book);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Author not found');
        }
        throw err;
    }
}

export async function get_all_of_author(req: Request, res: Response) {
    assert(req.query, BookGetQueries);

    const authorID = Number(req.params.author_id);

    const author = await prisma.author.findUnique({
        where: {
            id: authorID
        }
    });
    if (!author) {
        throw new NotFoundError("Author not found");
    }

    // Filtre
    const filter: Prisma.BookWhereInput = {};
    filter.authorId = authorID;

    if (req.query.title) {
        filter.title = {
            contains: String(req.query.title)
        }
    }

    // Pagination
    const total = await prisma.book.count({
        where: filter
    });


    let skipNumber: number | undefined;
    let takeNumber: number | undefined;

    if (req.query.skip !== undefined) {
        skipNumber = Number(req.query.skip);
    }

    if (req.query.take !== undefined) {
        takeNumber = Number(req.query.take);
    }

    const books = await prisma.book.findMany({
        where: filter,
        orderBy: {
            title: 'asc'
        },
        skip: skipNumber,
        take: takeNumber
    });

    res.set("X-Total-Count", total.toString());
    res.json(books);
}

export async function update_one(req: Request, res: Response) {
    assert(req.body, BookUpdateData);

    try {
        const bookID = Number(req.params.book_id);
        const book = await prisma.book.update({
            where: { id: bookID },
            data: req.body,
        });

        res.status(200).json(book);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Book not found');
        }
        throw err;
    }
}

export async function delete_one(req: Request, res: Response) {
    const bookID = Number(req.params.book_id);
    try {
        await prisma.book.delete({
            where: { id: bookID }
        });
        res.sendStatus(204);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Book not found');
        }
        throw err;
    }
}

