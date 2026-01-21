import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import { StringValue } from 'ms';

export const createToken = (
    jwtPayload: {
        userId: string;
        role: string;
        organizationId?: string | null;
    },
    secret: Secret,
    expiresIn: StringValue | number
): string => {
    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign(jwtPayload, secret, options);
};


export const verifyToken = (token: string, secret: string): any => {
    return jwt.verify(token, secret);
};

export const createAccessToken = (payload: {
    userId: string;
    role: string;
    organizationId?: string | null;
}): string => {
    if (!env.jwt_secret) {
        throw new Error('JWT secret is not defined');
    }

    return createToken(
        payload,
        env.jwt_secret,
        env.jwt_expiry as StringValue
    );
};
