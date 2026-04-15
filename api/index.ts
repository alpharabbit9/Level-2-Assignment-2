import app from '../src/app';
import { initDb } from '../src/config/db';

let isDbInitialized = false;

export default async (req: any, res: any) => {
  if (!isDbInitialized) {
    await initDb();
    isDbInitialized = true;
  }
  
  return app(req, res);
};
