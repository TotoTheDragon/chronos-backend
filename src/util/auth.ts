import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { join } from 'path';
import { User } from '@prisma/client';

dotenv.config();

/*
    jwt
*/
const jwtPath = join(__dirname, '../../jwt');
export const privateKey = readFileSync(join(jwtPath, 'private.pem'));
export const publicKey = readFileSync(join(jwtPath, 'public.pem'));

export function encode(obj: object, expiresIn: string): string {
    return jwt.sign(
        obj,
        {
            key: privateKey,
            passphrase: process.env.JWT_PASSPHRASE,
        },
        { algorithm: 'RS256', expiresIn },
    );
}

export function decode(token: string): JwtPayload {
    return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
    }) as JwtPayload;
}
/*
    bcrypt
*/
const saltRounds = 10;

export function encrypt(password: string): string {
    return bcrypt.hashSync(password, saltRounds);
}

export function compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}

export function generateAuthTokens(user: User): {
    access_token: string;
    refresh_token: string;
} {
    return {
        access_token: encode(
            {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                verified: user.verified,
            },
            process.env.ACCESS_TOKEN_EXPIRATION,
        ),
        refresh_token: encode(
            {
                id: user.id,
            },
            process.env.REFRESH_TOKEN_EXPIRATION,
        )
    }
}
