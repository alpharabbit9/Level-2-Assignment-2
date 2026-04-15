import app from '../src/app';

console.log('Vercel Function Initialized');

export default (req: any, res: any) => {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('CRITICAL STARTUP ERROR:', err);
    res.status(500).json({ success: false, message: 'Startup Crash', error: err.message });
  }
};
