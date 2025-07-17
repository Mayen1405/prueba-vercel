import { body, param } from "express-validator";
import { validateField } from "./validate-fileds.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("username").optional().isString().withMessage("Username must be a string"),
    body("password")
        .exists()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
]

export const createUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }).withMessage("Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"),
    body("name").notEmpty().withMessage("Name is required"),
    body("dpi").notEmpty().withMessage("DPI is required"),
    body("dpi").isNumeric().withMessage("DPI must be a number"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("workName").notEmpty().withMessage("Work name is required"),
    body("workName").isString().withMessage("Work name must be a string"),
    body("monthlyIncome").notEmpty().withMessage("Monthly income is required"),
    body("monthlyIncome").isNumeric().withMessage("Monthly income must be a number"),
    validateField,
    handleErrors
]

export const getUsersValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    validateField,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("Invalid user ID format"),
    validateField,
    handleErrors
]

export const updateUserValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("Invalid user ID format"),
    body("username").optional().notEmpty().withMessage("Username cannot be empty"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("address").optional().notEmpty().withMessage("Address cannot be empty"),
    body("phone").optional().notEmpty().withMessage("Phone cannot be empty"),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email format"),
    body("workName").optional().notEmpty().withMessage("Work name cannot be empty"),
    body("monthlyIncome").optional().isNumeric().withMessage("Monthly income must be a number"),
    validateField,
    handleErrors
]

export const deleteUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("Invalid user ID format"),
    validateField,
    handleErrors
]

export const updatePasswordValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    body("currentPassword")
        .exists()
        .withMessage("Current password is required")
        .isString()
        .withMessage("Current password must be a string")
        .isLength({ min: 6 })
        .withMessage("Current password must be at least 6 characters long"),
    body("newPassword")
        .exists()
        .withMessage("New password is required")
        .isString()
        .withMessage("New password must be a string")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
    validateField,
    handleErrors
]

export const getUserLoggedValidator = [
    validateJWT,
    hasRoles('USER_ROLE', 'ADMIN_ROLE'),
    validateField,
    handleErrors
];

export const updateMeValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    body("username").optional().notEmpty().withMessage("Username cannot be empty"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("address").optional().notEmpty().withMessage("Address cannot be empty"),
    body("phone").optional().notEmpty().withMessage("Phone cannot be empty"),
    body("workName").optional().notEmpty().withMessage("Work name cannot be empty"),
    body("monthlyIncome").optional().isNumeric().withMessage("Monthly income must be a number"),
    validateField,
    handleErrors
];

export const addFavoriteValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    body('accountNumber', 'El número de cuenta es obligatorio').notEmpty().isString(),
    body('alias', 'El alias debe ser texto').optional().isString(),
    validateField,
    handleErrors
];

export const getFavoritesValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    validateField,
    handleErrors
];

export const removeFavoriteValidator = [
    validateJWT,
    hasRoles("USER_ROLE", "ADMIN_ROLE"),
    param('accountId', 'El ID de la cuenta en la URL es inválido').isMongoId(),
    validateField,
    handleErrors
];
