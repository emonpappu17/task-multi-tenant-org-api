import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const env = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    jwt: {
        jwt_secret: process.env.JWT_SECRET as string,
        jwt_expiry: process.env.JWT_EXPIRY as string,
    },
    salt_round: process.env.SALT_ROUND,
}