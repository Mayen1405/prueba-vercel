import { dbConnection } from "./mongo.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import productRoutes from "../src/product/product.routes.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import accountRoutes from "../src/account/account.routes.js";
import transactionRoutes from "../src/transactions/transaction.routes.js";
import defaultData from "./default-data.js";
import { createDefaultProducts } from "./default-products.js";
import { createDefaultAccounts } from "./default-accounts.js";
import currencyRoutes from "../src/currency/currency.routes.js";

// --- INICIALIZACIÓN DE LA APP ---
const app = express();

// --- CONEXIÓN A DB Y DATOS POR DEFECTO ---
// Esta función autoinvocada se asegura de que la conexión y la creación de datos
// ocurra solo una vez cuando la instancia del servidor de Vercel se inicia.
(async () => {
    try {
        await dbConnection();
        await defaultData();
        await createDefaultProducts();
        await createDefaultAccounts();
        console.log("Database and default data initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize database and default data:", error);
    }
})();


// --- MIDDLEWARES ---
// Tu configuración de CORS está bien. Se asegura que solo tu frontend pueda conectarse.
app.use(cors({
    origin: [
        'http://localhost:5173', // Para desarrollo local
        'https://prueba-vercel-front.web.app', // Tu dominio de producción
        'https://prueba-vercel-front.firebaseapp.com' // Dominio alternativo de Firebase
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(apiLimiter);


// --- RUTAS DE LA API ---
// Se mantiene la estructura de rutas que ya tenías.
app.get('/', (req, res) => {
  res.send('API Backend funcionando 🚀');
});

app.use("/cci/v1/product", productRoutes);
app.use("/cci/v1/auth", authRoutes);
app.use("/cci/v1/user", userRoutes);
app.use("/cci/v1/account", accountRoutes);
app.use("/cci/v1/transaction", transactionRoutes);
app.use("/cci/v1/currency", currencyRoutes);


// --- EXPORTACIÓN PARA VERCEL ---
export default app;
