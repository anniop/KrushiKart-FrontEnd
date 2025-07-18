/*
 * We apply the same efficient state update logic to this page for consistency.
 */
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    // --- UPDATED --- Get the new updateCart function
    const { userData, updateCart } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!userData.user) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.post('/api/cart/add', 
                { productId: product._id, quantity: quantity },
                { headers: { 'x-auth-token': userData.token } }
            );
            // --- UPDATED ---
            updateCart(response.data.cart);
            toast.success(`${quantity} x ${product.name} added to cart!`);
            navigate('/cart');
        } catch (err) {
            console.error("Failed to add to cart", err);
            toast.error("Could not add to cart.");
        }
    };

    if (loading) return <p className="text-center text-lg p-10">Loading product...</p>;
    if (!product) return <p className="text-center text-lg p-10">Product not found.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img 
                            src={product.imageUrl || 'https://placehold.co/600x600/F7F6F2/333333?text=KrishiKart'} 
                            alt={product.name}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-brand-green mb-2">{product.name}</h1>
                        <p className="text-lg text-gray-500 mb-4">{product.category}</p>
                        <p className="text-3xl font-bold text-brand-orange mb-6">₹{product.price}</p>
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        <div className="flex items-center space-x-4 mb-6">
                            <p className="font-semibold">Sold by:</p>
                            <p className="text-gray-600">{product.seller?.name || 'KrishiKart'}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded-md">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg">-</button>
                                <span className="px-4 py-2 text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="btn-primary flex-grow py-3 text-lg">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
