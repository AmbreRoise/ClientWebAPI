import { prisma } from '../db';
import { Prisma } from '../generated/prisma/client';
import { HttpError, NotFoundError } from '../error';
import type { Request, Response, NextFunction } from 'express';

export async function get_all(req: Request, res: Response) {
    try {
        const tags = await prisma.tag.findMany();
        res.json(tags);
    }
    catch (err: unknown) {
        throw new NotFoundError("Impossible de récupérer les tags");
    }
}

export async function get_one(req: Request, res: Response) {
    const tagID = Number(req.params.tag_id);

    const tag = await prisma.tag.findUnique({
        where: { id: tagID }
    });

    if (tag) {
        res.json(tag);
    }
    else {
        throw new NotFoundError("Tag not found");
    }
}

export async function get_all_of_book(req: Request, res: Response) {
    const bookID = Number(req.params.book_id);

    const book = await prisma.book.findUnique({
        where: { id: bookID },
        include: { tags: true }
    });

    if (book) {
        res.json(book.tags);
    }
    else {
        throw new NotFoundError("Book not found");
    }
}

export async function create_one(req: Request, res: Response) {
    try {
        const tag = await prisma.tag.create({
            data: req.body
        });

        res.status(201).json(tag);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new HttpError('A tag with this name already exists', 409);
            }
        }
        throw err;
    }
}

export async function update_one(req: Request, res: Response) {
    try {
        const tagID = Number(req.params.tag_id);
        const tag = await prisma.tag.update({
            where: { id: tagID },
            data: req.body,
        });

        res.status(200).json(tag);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw new NotFoundError('Tag not found');
            }
            if (err.code === 'P2002') {
                throw new HttpError('A tag with this name already exists', 409);
            }
        }
        throw err;
    }
}

export async function delete_one(req: Request, res: Response) {
    const tagID = Number(req.params.tag_id);
    try {
        await prisma.tag.delete({
            where: { id: tagID }
        });
        res.sendStatus(204);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Tag not found');
        }
        throw err;
    }
}

export async function associate_tag_to_book(req: Request, res: Response) {
    const tagID = Number(req.params.tag_id);
    const bookID = Number(req.params.book_id);

    try {
        const book = await prisma.book.update({
            where: { id: bookID },
            data: {
                tags: {
                    connect: {
                        id: tagID,
                    }
                }
            },
            include: {
                tags: true,
            }
        });

        res.status(200).json(book);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw new NotFoundError('Book or tag not found');
            }
        }
        throw err;
    }
}

export async function dissociate_tag_to_book(req: Request, res: Response) {
    const tagID = Number(req.params.tag_id);
    const bookID = Number(req.params.book_id);

    try {
        const book = await prisma.book.update({
            where: { id: bookID },
            data: {
                tags: {
                    disconnect: {
                        id: tagID
                    }
                }
            },
            include: {
                tags: true,
            }
        });

        res.status(200).json(book);
    }
    catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw new NotFoundError('Book or tag not found');
            }
        }
        throw err;
    }
}