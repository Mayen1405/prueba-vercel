import { body, param } from 'express-validator';
import { validateField } from './validate-fileds.js';
import { handleErrors } from './handle-errors.js';
import { validateJWT } from './validate-jwt.js';
import { hasRoles } from './validate-roles.js';

export const getProductByIdValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'USER_ROLE'),
    param('id', 'El id del producto es obligatorio').notEmpty().isMongoId(),
    param('id', 'El id del producto no es valido').isMongoId(),
    validateField,
    handleErrors
]

export const getProductsValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'USER_ROLE'),
    validateField,
    handleErrors
]

export const createProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    body('name', 'El nombre del producto es obligatorio').notEmpty(),
    body('descripcion', 'La descripcion del producto es obligatoria').notEmpty(),
    body('price', 'El precio del producto es obligatorio').notEmpty().isNumeric(),
    body('stock', 'El stock del producto es obligatorio').notEmpty().isNumeric(),
    validateField,
    handleErrors
]

export const updateProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('id', 'El id del producto es obligatorio').notEmpty().isMongoId(),
    param('id', 'El id del producto no es valido').isMongoId(),
    body('name').optional(),
    body('descripcion').optional(),
    body('price').optional().isNumeric(),
    body('stock').optional().isNumeric(),
    validateField,
    handleErrors
]

export const deleteProductValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE'),
    param('id', 'El id del producto es obligatorio').notEmpty().isMongoId(),
    param('id', 'El id del producto no es valido').isMongoId(),
    validateField,
    handleErrors
]