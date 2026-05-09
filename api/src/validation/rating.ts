import { object, string, size, optional, enums, integer, number } from 'superstruct';

export const RatingCreationData = object({
    value: number(),
    userName: string()
});

export const RatingUpdateData = object({
    value: optional(number()),
    userName: optional(string())
});