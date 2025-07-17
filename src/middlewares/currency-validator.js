import { query } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const convertCurrencyValidator = [
    validateJWT,
    hasRoles('USER_ROLE', 'ADMIN_ROLE'), // Permitimos a ambos roles
    query('from', 'El código de la moneda de origen es obligatorio (ej. USD)')
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .isUppercase()
        .withMessage('El código de moneda debe tener 3 letras mayúsculas'),
    query('to', 'El código de la moneda de destino es obligatorio (ej. GTQ)')
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .isUppercase()
        .withMessage('El código de moneda debe tener 3 letras mayúsculas'),
    query('amount', 'La cantidad a convertir es obligatoria y debe ser un número')
        .notEmpty()
        .isNumeric(),
    validateField,
    handleErrors
];