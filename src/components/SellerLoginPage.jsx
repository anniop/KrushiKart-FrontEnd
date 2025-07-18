import api from '../api';
api.get('/api/products');

/*
 * This is the login page for sellers. It looks similar to the user login
 * but hits the /api/sellers/login endpoint.
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SellerContext } from '../context/SellerContext';

const SellerLoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { setSellerData } = useContext(SellerContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loginSeller = { phone, password };
            const loginRes = await api.post('/api/sellers/login', loginSeller);
            
            setSellerData({
                token: loginRes.data.token,
                seller: loginRes.data.seller
            });

            localStorage.setItem("seller-auth-token", loginRes.data.token);
            localStorage.setItem("seller-data", JSON.stringify(loginRes.data.seller));

            navigate('/seller/dashboard');

        } catch (err) {
            err.response && err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-12">
                <h2 className="text-3xl font-bold text-center text-brand-green mb-6">Seller Login</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange" required />
                    </div>
                    <div>
                        <button type="submit" className="w-full btn-primary py-3">Login to Dashboard</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerLoginPage;
