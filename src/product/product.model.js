import mongoose, { Schema } from 'mongoose';

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'El producto es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

productSchema.methods.toJSON = function() {
    const { __v, _id, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

export default mongoose.model('Product', productSchema);