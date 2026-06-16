import { app } from './infra/http/app';

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('HTTP Server Running on http://localhost:3333');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();