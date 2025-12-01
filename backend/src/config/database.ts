import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString: string = process.env.DATABASE_URL ?? '';

const pool = new Pool({
  connectionString,
});

export default pool;
