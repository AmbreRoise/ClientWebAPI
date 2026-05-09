import { object, string, size, optional, enums } from 'superstruct';

export const CommentCreationData = object({
    content: string(),
    userName: string()
});

export const CommentUpdateData = object({
    content: optional(string()),
    userName: optional(string())
});