import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { join } from 'path';

dotenv.config();

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
