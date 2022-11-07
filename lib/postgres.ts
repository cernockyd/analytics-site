import postgres from 'postgres';

const sql = postgres({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export default sql;
