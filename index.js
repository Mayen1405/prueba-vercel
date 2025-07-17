import { buildApp } from '../config/server.js';

// Vercel serverless expects a default export of your handler
let appPromise = buildApp();

export default async function handler(req, res) {
    const app = await appPromise;
    app(req, res);
}