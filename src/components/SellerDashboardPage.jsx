/*
 * The "My Orders" tab now includes a dropdown to change the status of each order.
 * This provides the final piece of core functionality for sellers.
 */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { SellerContext } from '../context/SellerContext';
import AddProductModal from './AddProductModal';
import toast from 'react-hot-toast';

// Analytics Card and Icon components remain the same
const AnalyticsCard = ({ title, value, icon }) => ( <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"> <div className="bg-brand-orange bg-opacity-10 p-3 rounded-full">{icon}</div> <div> <p className="text-sm text-gray-500">{title}</p> <p className="text-2xl font-bold text-gray-800">{value}</p> </div> </div> );
const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 4h5m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ProfitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

const SellerDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [myProducts, setMyProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [analytics, setAnalytics] = useState({ revenue: 0, profit: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { sellerData } = useContext(SellerContext);

    const fetchMyProducts = useCallback(async () => {
        if (!sellerData.token) return;
        try {
            setLoading(true);
            const response = await axios.get('/api/sellers/my-products', {
                headers: { 'x-auth-token': sellerData.token }
            });
            setMyProducts(response.data);
        } catch (err) {
            console.error("Failed to fetch seller products", err);
        } finally {
            setLoading(false);
        }
    }, [sellerData.token]);

    const fetchMyOrdersAndAnalytics = useCallback(async () => {
        if (!sellerData.token) return;
        try {
            setLoading(true);
            const response = await axios.get('/api/sellers/my-orders', {
                headers: { 'x-auth-token': sellerData.token }
            });
            const orders = response.data;
            setMyOrders(orders);

            if (orders.length > 0) {
                const totalRevenue = orders.reduce((acc, order) => {
                    return acc + order.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                }, 0);
                const totalCost = orders.reduce((acc, order) => {
                    return acc + order.products.reduce((sum, item) => sum + ((item.product.costPrice || 0) * item.quantity), 0);
                }, 0);
                setAnalytics({
                    revenue: totalRevenue,
                    profit: totalRevenue - totalCost,
                    totalOrders: orders.length
                });
            } else {
                setAnalytics({ revenue: 0, profit: 0, totalOrders: 0 });
            }
        } catch (err) {
            console.error("Failed to fetch seller orders", err);
        } finally {
            setLoading(false);
        }
    }, [sellerData.token]);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchMyOrdersAndAnalytics();
        } else if (activeTab === 'products') {
            fetchMyProducts();
        } else if (activeTab === 'orders') {
            fetchMyOrdersAndAnalytics();
        }
    }, [activeTab, fetchMyProducts, fetchMyOrdersAndAnalytics]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`/api/products/${productId}`, {
                    headers: { 'x-auth-token': sellerData.token }
                });
                toast.success("Product deleted!");
                fetchMyProducts();
            } catch (err) {
                console.error("Failed to delete product", err);
                toast.error("Could not delete product.");
            }
        }
    };

    // --- NEW --- Function to handle order status change
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/status/${orderId}`, 
                { status: newStatus },
                { headers: { 'x-auth-token': sellerData.token } }
            );
            toast.success("Order status updated!");
            // Refresh the orders list to show the change
            fetchMyOrdersAndAnalytics();
        } catch (err) {
            console.error("Failed to update order status", err);
            toast.error("Could not update status.");
        }
    };

    return (
        <>
            <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-3xl font-bold text-brand-green mb-6">Welcome, {sellerData.seller?.name}!</h1>
                
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}>Dashboard</button>
                        <button onClick={() => setActiveTab('products')} className={`${activeTab === 'products' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}>My Products</button>
                        <button onClick={() => setActiveTab('orders')} className={`${activeTab === 'orders' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}>My Orders</button>
                    </nav>
                </div>

                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Business At a Glance</h2>
                        {loading ? <p>Loading analytics...</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <AnalyticsCard title="Total Revenue" value={`₹${analytics.revenue.toFixed(2)}`} icon={<RupeeIcon />} />
                                <AnalyticsCard title="Total Profit" value={`₹${analytics.profit.toFixed(2)}`} icon={<ProfitIcon />} />
                                <AnalyticsCard title="Total Orders" value={analytics.totalOrders} icon={<OrderIcon />} />
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'products' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Your Products</h2>
                            <button onClick={() => setIsModalOpen(true)} className="btn-primary">+ Add New Product</button>
                        </div>
                        {loading ? <p>Loading products...</p> : (
                            <div className="space-y-4">
                                {myProducts.length > 0 ? myProducts.map(product => (
                                    <div key={product._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-md hover:bg-gray-50">
                                        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                            <img src={product.imageUrl || 'https://placehold.co/100x100/F7F6F2/333333?text=Item'} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                                            <div>
                                                <p className="font-bold">{product.name}</p>
                                                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-semibold text-lg mr-4">₹{product.price}</p>
                                            <button onClick={() => handleEdit(product)} className="btn-secondary px-4 py-2">Edit</button>
                                            <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white font-semibold rounded-lg py-2 px-4 transition-all duration-300 text-sm hover:bg-red-600">Delete</button>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">You haven't added any products yet.</p>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Incoming Orders</h2>
                        {loading ? <p>Loading orders...</p> : (
                            <div className="space-y-6">
                                {myOrders.length > 0 ? myOrders.map(order => (
                                    <div key={order._id} className="border rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-3">
                                            <div>
                                                <p className="font-bold">Order ID: <span className="font-normal text-gray-500 text-sm">{order._id}</span></p>
                                                <p className="text-sm text-gray-600">Customer: {order.customer.name} ({order.customer.city})</p>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                                <label htmlFor={`status-${order._id}`} className="text-sm font-medium">Status:</label>
                                                <select
                                                    id={`status-${order._id}`}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-orange focus:border-brand-orange block w-full p-2"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                        {order.products.map(({ product, quantity }) => (
                                            <div key={product._id} className="flex justify-between items-center py-2">
                                                <p>{product.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {quantity}</p>
                                                <p className="font-semibold">₹{(product.price * quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">You have no orders yet.</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isModalOpen && ( <AddProductModal productToEdit={editingProduct} onClose={handleCloseModal} onProductAdded={fetchMyProducts} /> )}
        </>
    );
};

export default SellerDashboardPage;
