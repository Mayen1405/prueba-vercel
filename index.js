import { buildApp } from './config/server.js';

// Vercel serverless espera un export default de la función handler
let appPromise = buildApp();

export default async function handler(req, res) {
    const app = await appPromise;
    app(req, res);
}