import api from '../api';
api.get('/api/products');

/*
 * This version adds dynamic color-coding to the order status badge,
 * making it easier for users to quickly see the state of their orders.
 */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userData } = useContext(UserContext);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userData.token) return;
            try {
                setLoading(true);
                const response = await axios.get('/api/orders', {
                    headers: { 'x-auth-token': userData.token }
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userData.token]);

    // --- NEW --- Helper function to get the color class for a status
    const getStatusClass = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'Shipped':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-brand-green mb-6">My Orders</h1>
            {loading ? (
                <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
                <div className="text-center bg-white p-8 rounded-lg shadow">
                    <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
                    <Link to="/" className="mt-4 inline-block btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="font-bold">Order ID: <span className="font-normal text-gray-600 text-sm">{order._id}</span></p>
                                    <p className="font-bold">Date: <span className="font-normal text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                </div>
                                {/* --- UPDATED --- Use the helper function for dynamic classes */}
                                <div className={`mt-4 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full self-start ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>
                            <div>
                                {order.products.map(({ product, quantity }) => (
                                    <div key={product._id} className="flex items-center justify-between py-2">
                                        <p>{product.name} <span className="text-gray-500">x {quantity}</span></p>
                                        <p>₹{(product.price * quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right font-bold text-lg mt-4 pt-4 border-t">
                                Total: ₹{order.totalAmount.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
