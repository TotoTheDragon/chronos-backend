import { User } from '@prisma/client';

export type APIUser = Omit<User, 'password'>;
