import { Router } from "express";
import { convertCurrency } from "./currency.controller.js";
import { convertCurrencyValidator } from "../middlewares/currency-validator.js";

const router = Router();

router.get('/convert', convertCurrencyValidator, convertCurrency);

export default router;