import { Router } from 'express';
import {
    getProductsValidator,
    getProductByIdValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
} from '../middlewares/product-validator.js';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from './product.controller.js';

const router = Router();

router.get('/getProducts', getProductsValidator, getProducts);

router.get('/getProducts/:id', getProductByIdValidator, getProductById);

router.post('/createProduct', createProductValidator, createProduct);

router.put('/updateProduct/:id', updateProductValidator, updateProduct);

router.delete('/deleteProduct/:id', deleteProductValidator, deleteProduct);

export default router;