
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

import type { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || '34567890kjhgfdxcvbjio876543456yh';





export type LoginTokenPayloadType = {
    user_id: string;
    email: string;
    role: Role
}



type SignTokenOptions = Pick<SignOptions, 'expiresIn'>;

export function createLoginToken(
    payload: LoginTokenPayloadType,
    options?: SignTokenOptions
): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: options?.expiresIn || '7d',
    });
}


export function verifyLoginToken(token: string): LoginTokenPayloadType | null {
    try {
        return jwt.verify(token, JWT_SECRET) as LoginTokenPayloadType;
    } catch (error) {
        if (error) { return null }
        return null
    }
}
