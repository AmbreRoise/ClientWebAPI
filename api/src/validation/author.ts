import { object, string, size, optional, enums } from 'superstruct';

export const AuthorCreationData = object({
    firstname: size(string(), 1, 50),
    lastname: size(string(), 1, 50),
});

export const AuthorUpdateData = object({
    firstname: optional(size(string(), 1, 50)),
    lastname: optional(size(string(), 1, 50)),
});

export const AuthorGetQueries = object({
    lastname: optional(string()),
    include: optional(enums(['books'])),
    skip: optional(string()),
    take: optional(string())
});