import { prisma } from '../db';
import { Prisma } from '../generated/prisma/client';
import { HttpError, NotFoundError } from '../error';
import type { Request, Response, NextFunction } from 'express';

import { assert } from 'superstruct';
import { AuthorCreationData, AuthorUpdateData, AuthorGetQueries } from '../validation/author';


export async function get_all(req: Request, res: Response) {
    assert(req.query, AuthorGetQueries);

    const filter: Prisma.AuthorWhereInput = {};

    if (req.query.lastname) {
        filter.lastname = {
            contains: String(req.query.lastname)
        };
    }

    // Inclure des books
    const assoc: Prisma.AuthorInclude = {};

    // Si on demande ?include=books
    if (req.query.include === "books") {
        assoc.books = {
            select: {
                id: true,
                title: true
            },
            orderBy: {
                title: "asc"
            }
        };
    }

    // Pagination
    const total = await prisma.author.count({
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
        const authors = await prisma.author.findMany({
            where: filter,
            include: assoc,
            orderBy: {
                lastname: 'asc'
            },
            skip: skipNumber,
            take: takeNumber
        });
        res.set("X-Total-Count", total.toString());
        res.json(authors);
    }
    catch (err) {
        throw new NotFoundError("Impossible de récupérer les auteurs");
    }
}

export async function get_one(req: Request, res: Response) {
    const authorID = Number(req.params.author_id);
    const author = await prisma.author.findUnique({
        where: { id: authorID }
    });
    if (author) {
        res.json(author);
    } else {
        throw new NotFoundError("Author not found");
    }
}

export async function create_one(req: Request, res: Response) {
    assert(req.body, AuthorCreationData);

    var author = await prisma.author.create({
        data: req.body
    });

    res.status(201).json(author);
}

export async function update_one(req: Request, res: Response) {
    assert(req.body, AuthorUpdateData);

    try {
        const authorID = Number(req.params.author_id);
        const author = await prisma.author.update({
            where: { id: authorID },
            data: req.body,
        });

        res.status(200).json(author);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Author not found');
        }
        throw err;
    }
}

export async function delete_one(req: Request, res: Response) {
    const authorID = Number(req.params.author_id);
    try {
        await prisma.author.delete({
            where: { id: authorID },
        });

        res.sendStatus(204);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Author not found');
        }
        throw err;
    }
}