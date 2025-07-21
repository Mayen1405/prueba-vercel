import { buildApp } from './config/server.js';

export default async function handler(req, res) {
  try {
    const app = await buildApp();
    return new Promise((resolve, reject) => {
      app.handle(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  } catch (error) {
    console.error("Error en la inicialización:", error);
    res.status(500).send("Error interno del servidor");
  }
}