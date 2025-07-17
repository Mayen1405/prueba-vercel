// Puedes ajustar el límite como prefieras
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: "Demasiadas peticiones desde esta IP, intenta más tarde."
});

export default apiLimiter;