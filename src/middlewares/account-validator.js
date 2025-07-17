import { body, param } from 'express-validator';
import { validateField } from './validate-fileds.js';
import { handleErrors } from './handle-errors.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';

export const registerAccountValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('user').isMongoId().withMessage('El id del usuario no es válido'),
    body('typeAccount')
        .notEmpty()
        .withMessage('El tipo de cuenta es obligatorio')
        .isIn(['AHORRO', 'MONETARIO', 'CREDITO'])
        .withMessage('Tipo de cuenta no válido'),
    body('balance')
        .notEmpty()
        .withMessage('El saldo es obligatorio')
        .isNumeric()
        .withMessage('El saldo debe ser un número'),
    validateField,
    handleErrors
];

export const getAccountsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE' , 'USER_ROLE'),
    validateField,
    handleErrors
];

export const getMyAccountsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'USER_ROLE'),
    validateField,
    handleErrors
];

export const deleteAccountValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('id').isMongoId().withMessage('El id de la cuenta no es válido'),
    validateField,
    handleErrors
];