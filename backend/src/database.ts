import {drizzle} from 'drizzle-orm/mysql2';
import {createPool, Pool, PoolOptions} from 'mysql2/promise';

const mysqlOptions: PoolOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA
}

const pool = createPool(
    mysqlOptions,
);

const db = drizzle({client: pool});

export default db;