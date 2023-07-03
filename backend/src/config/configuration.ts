export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASS || '',
    name: process.env.DATABASE_NAME || 'test',
    synchronize: process.env.NODE_ENV !== 'production',
  },
});
