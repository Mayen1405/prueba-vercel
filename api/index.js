import app from '../config/server.js';

export default function handler(req, res) {
  app(req, res);
}