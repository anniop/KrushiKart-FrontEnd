import api from '../api';
api.get('/api/products');

/*
 * This is the key fix. The login form now fetches the user's cart
 * immediately after a successful login, ensuring the cart state is
 * always up-to-date.
 */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // --- UPDATED --- Get the getCart function from context
    const { setUserData, getCart } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loginUser = { phone, password };
            const loginRes = await axios.post('/api/users/login', loginUser);
            const token = loginRes.data.token;
            
            setUserData({
                token: token,
                user: loginRes.data.user,
                cart: [] // Set a default empty cart temporarily
            });

            localStorage.setItem("auth-token", token);
            localStorage.setItem("user-data", JSON.stringify(loginRes.data.user));

            // --- NEW --- Fetch the user's actual cart from the database
            await getCart(token);
            
            toast.success(`Welcome back, ${loginRes.data.user.name.split(' ')[0]}!`);
            navigate('/'); // Redirect to homepage on successful login

        } catch (err) {
            const errorMsg = err.response?.data?.msg || "Login failed. Please check your credentials.";
            setError(errorMsg);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-12">
                <h2 className="text-3xl font-bold text-center text-brand-green mb-2">Login to KrishiKart</h2>
                <p className="text-center text-gray-500 mb-6">Welcome back!</p>
                
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
                        <button type="submit" className="w-full btn-primary py-3">Login</button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-brand-orange hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
