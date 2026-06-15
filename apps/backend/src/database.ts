import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/pulse_fx',
});