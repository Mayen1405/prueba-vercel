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

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors({
        origin: [
            'http://localhost:5173',
            'https://prueba-vercel-front.web.app',
            'https://prueba-vercel-front.firebaseapp.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true   
    }));

    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
};

const routes = (app) => {
    app.use("/cci/v1/product", productRoutes);
    app.use("/cci/v1/auth", authRoutes)
    app.use("/cci/v1/user", userRoutes);
    app.use("/cci/v1/account", accountRoutes);
    app.use("/cci/v1/transaction", transactionRoutes);
    app.use("/cci/v1/currency", currencyRoutes);
}

const connectDB = async () => {
    try {
        await dbConnection();
        await defaultData();
        await createDefaultProducts();
        await createDefaultAccounts();
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
}

export const initServer = () => {
    const app = express();
    try {
        middlewares(app);
        connectDB();
        routes(app);
        const port = process.env.PORT;
        app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};