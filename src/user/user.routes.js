import { Router } from 'express';
import {
    createUserValidator,
    getUsersValidator,
    getUserByIdValidator,
    deleteUserValidator,
    updateUserValidator,
    updatePasswordValidator,
    getUserLoggedValidator,
    updateMeValidator,
    addFavoriteValidator,
    getFavoritesValidator,
    removeFavoriteValidator
} from '../middlewares/user-validator.js';
import {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    updateMe,
    updatePassword,
    getUserLogged,
    addFavorite,
    getFavorites,
    removeFavorite
} from './user.controller.js';

const router = Router();

// Rutas para Favoritos
router.post('/me/favorites', addFavoriteValidator, addFavorite);
router.get('/me/favorites', getFavoritesValidator, getFavorites);
router.delete('/me/favorites/:accountId', removeFavoriteValidator, removeFavorite);

// Rutas para el usuario logueado
router.get('/me/information', getUserLoggedValidator, getUserLogged);
router.put('/me', updateMeValidator, updateMe);
router.patch('/password', updatePasswordValidator, updatePassword);

// Rutas de gestión de usuarios (CRUD para admin)
router.post('/', createUserValidator, createUser);
router.get('/', getUsersValidator, getUsers);
router.get('/:uid', getUserByIdValidator, getUserById);
router.put('/:uid', updateUserValidator, updateUser);
router.delete('/:uid', deleteUserValidator, deleteUser);

export default router;
