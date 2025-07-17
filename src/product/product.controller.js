import Product from './product.model.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'No se encontro el producto', error: id });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
}

export const createProduct = async (req, res) => {
    const data = req.body;
    try {
        const newProduct = new Product(data);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'No se encontro el producto', error: id });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'No se encontro el producto', error: id });
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
}