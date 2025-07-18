/*
 * We add a success toast when an order is placed successfully.
 */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import toast from 'react-hot-toast'; // --- NEW ---

const CartPage = () => {
    const { userData, getCart, clearCart } = useContext(UserContext);
    const { cart, token, user } = userData;
    const navigate = useNavigate();

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`/api/cart/remove/${productId}`, {
                headers: { 'x-auth-token': token }
            });
            getCart(token);
            toast.success('Item removed from cart.');
        } catch (err) {
            console.error("Failed to remove item", err);
            toast.error('Could not remove item.');
        }
    };

    const calculateSubtotal = () => {
        if (!cart || cart.length === 0) return 0;
        return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    };

    const handleCheckout = async () => {
        try {
            const shippingAddress = user.address && user.city ? `${user.address}, ${user.city}` : "Default Address";
            
            await axios.post('/api/orders/add', 
                { shippingAddress },
                { headers: { 'x-auth-token': token } }
            );

            clearCart();
            toast.success('Order placed successfully!'); // --- NEW ---
            navigate('/my-orders');

        } catch (err) {
            console.error("Failed to place order", err);
            toast.error("Could not place order. Please try again."); // --- NEW ---
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-brand-green mb-6">Your Shopping Cart</h1>
            {(!cart || cart.length === 0) ? (
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-xl text-gray-600">Your cart is empty.</p>
                    <Link to="/" className="mt-4 inline-block btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                         {cart.map(({ product, quantity }) => (
                            <div key={product._id} className="flex items-center justify-between py-4 border-b">
                                <div className="flex items-center space-x-4">
                                    <img src={product.imageUrl || 'https://placehold.co/100x100/F7F6F2/333333?text=Item'} alt={product.name} className="w-20 h-20 rounded-md object-cover" />
                                    <div>
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-gray-500">₹{product.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p>Qty: {quantity}</p>
                                    <button onClick={() => handleRemoveItem(product._id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2">
                                <p>Subtotal</p>
                                <p>₹{calculateSubtotal().toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p>Delivery</p>
                                <p>₹50.00</p>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-4">
                                <p>Total</p>
                                <p>₹{(calculateSubtotal() + 50).toFixed(2)}</p>
                            </div>
                            <button onClick={handleCheckout} className="w-full btn-primary mt-6 py-3">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
