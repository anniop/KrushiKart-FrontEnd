/*
 * The Add/Edit Product form now includes a field for "Cost Price".
 */
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SellerContext } from '../context/SellerContext';
import api from '../api';
api.get('/api/products');
const AddProductModal = ({ onClose, onProductAdded, productToEdit }) => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        costPrice: '', // --- NEW ---
        category: 'Fertilizer',
        stock: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');
    const { sellerData } = useContext(SellerContext);

    useEffect(() => {
        if (productToEdit) {
            setProductData({
                name: productToEdit.name,
                description: productToEdit.description,
                price: productToEdit.price,
                costPrice: productToEdit.costPrice || '', // --- NEW ---
                category: productToEdit.category,
                stock: productToEdit.stock,
                imageUrl: productToEdit.imageUrl || ''
            });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (productToEdit) {
            try {
                await api.put(`/api/products/update/${productToEdit._id}`, productData, {
                    headers: { 'x-auth-token': sellerData.token }
                });
                onProductAdded();
                onClose();
            } catch (err) {
                setError(err.response?.data?.msg || "An error occurred while updating.");
            }
        } else {
            try {
                const newProduct = { ...productData };
                await axios.post('/api/products/add', newProduct, {
                    headers: { 'x-auth-token': sellerData.token }
                });
                onProductAdded();
                onClose();
            } catch (err) {
                setError(err.response?.data?.msg || "An error occurred while adding.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-center text-brand-green mb-6">
                    {productToEdit ? 'Edit Product' : 'Add a New Product'}
                </h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                    <textarea name="description" placeholder="Product Description" value={productData.description} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" name="price" placeholder="Selling Price (₹)" value={productData.price} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                        {/* --- NEW --- Cost Price Input */}
                        <input type="number" name="costPrice" placeholder="Cost Price (₹)" value={productData.costPrice} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                    </div>
                    <input type="number" name="stock" placeholder="Stock Quantity" value={productData.stock} onChange={handleChange} className="w-full p-3 border rounded-md" required />
                    <select name="category" value={productData.category} onChange={handleChange} className="w-full p-3 border rounded-md bg-white">
                        <option value="Fertilizer">Fertilizer</option>
                        <option value="Seed">Seed</option>
                        <option value="Pesticide">Pesticide</option>
                        <option value="Tool">Tool</option>
                    </select>
                    <input type="text" name="imageUrl" placeholder="Image URL (optional)" value={productData.imageUrl} onChange={handleChange} className="w-full p-3 border rounded-md" />
                    <button type="submit" className="w-full btn-primary py-3">
                        {productToEdit ? 'Save Changes' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
