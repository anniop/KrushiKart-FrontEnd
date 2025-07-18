/*
 * The `handleAddToCart` function now uses the more efficient `updateCart`
 * method, which gets the updated cart directly from the API response.
 */
import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    if (!product) {
        return null;
    }

    // --- UPDATED --- Get the new updateCart function
    const { userData, updateCart } = useContext(UserContext);
    const navigate = useNavigate();

    const AddToCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!userData.user) {
            toast.error("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
        try {
            // The backend POST request returns the newly updated cart
            const response = await axios.post('/api/cart/add', 
                { productId: product._id, quantity: 1 },
                { headers: { 'x-auth-token': userData.token } }
            );

            // --- UPDATED --- Use the response to update state directly
            updateCart(response.data.cart);
            toast.success(`${product.name} added to cart!`);

        } catch (err) {
            console.error("Failed to add to cart", err.response || err);
            const errorMsg = err.response?.data?.msg || "Could not add item to cart.";
            toast.error(errorMsg);
        }
    };

    return (
        <Link to={`/product/${product._id}`} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="h-48 overflow-hidden">
                <img 
                    src={product.imageUrl || 'https://placehold.co/400x400/F7F6F2/333333?text=KrishiKart'} 
                    alt={product.name || 'Product Image'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-lg text-gray-800 truncate mb-1">{product.name || 'Unnamed Product'}</h4>
                <p className="text-sm text-gray-500 mb-2">{product.category || 'Uncategorized'}</p>
                <p className="text-sm text-gray-600 flex-grow mb-4">{(product.description || '').substring(0, 60)}...</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                    <p className="text-xl font-bold text-brand-green">₹{product.price || '0'}</p>
                    <button onClick={handleAddToCart} className="btn-secondary flex items-center z-10 relative">
                        <AddToCartIcon />
                        Add
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
