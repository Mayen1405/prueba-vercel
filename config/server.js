import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiLimiter from './limiter.js';
import productRoutes from '../src/product/product.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import accountRoutes from '../src/account/account.routes.js';
import transactionRoutes from '../src/transactions/transaction.routes.js';
import currencyRoutes from '../src/currency/currency.routes.js';
import dbConnection from './mongo.js';
import defaultData from './default-data.js';
import createDefaultProducts from './default-products.js';
import createDefaultAccounts from './default-accounts.js';

const middlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
};

const routes = (app) => {
    app.get('/', (req, res) => {
        res.send('API CCI funcionando!');
    });
    app.use("/cci/v1/product", productRoutes);
    app.use("/cci/v1/auth", authRoutes);
    app.use("/cci/v1/user", userRoutes);
    app.use("/cci/v1/account", accountRoutes);
    app.use("/cci/v1/transaction", transactionRoutes);
    app.use("/cci/v1/currency", currencyRoutes);
};

const connectDB = async () => {
    try {
        await dbConnection();
        await defaultData();
        await createDefaultProducts();
        await createDefaultAccounts();
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};

export const buildApp = async () => {
    const app = express();
    middlewares(app);
    await connectDB();
    routes(app);
    return app;
};