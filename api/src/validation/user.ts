import { object, string, size, refine } from 'superstruct';
import isEmail from 'validator/lib/isEmail';

const Email = refine(string(), 'verification_email', (value) => isEmail(value))

export const UserCreationData = object({
    email: Email,
    password: size(string(), 8),
    username: string()
});

