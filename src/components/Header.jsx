/*
 * The SellerIcon component now uses the user-provided image URL.
 */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Logo = () => <svg className="h-9 w-9 text-brand-green" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm-32.3 115.7c-6.2-6.2-16.4-6.2-22.6 0l-114 114.1c-6.2 6.2-6.2 16.4 0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0l114-114.1c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6zM320.3 163.7c-6.2-6.2-16.4-6.2-22.6 0l-114 114.1c-6.2 6.2-6.2 16.4 0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0l114-114.1c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6z"/></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

// --- UPDATED --- Seller Icon now uses an <img> tag
const SellerIcon = () => <img src="https://cdn-icons-png.flaticon.com/128/8635/8635037.png" alt="Seller Icon" className="h-7 w-7" />;


const Header = () => {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const cartItemCount = userData.cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const logout = () => {
        setUserData({ token: undefined, user: undefined, cart: [] });
        localStorage.setItem("auth-token", "");
        localStorage.setItem("user-data", "");
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3 cursor-pointer">
                    <Logo />
                    <h1 className="text-2xl font-bold text-brand-green">KrishiKart</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    {userData.user ? (
                        <div className="flex items-center space-x-4">
                             <Link to="/my-orders" className="text-gray-600 hover:text-brand-green font-medium hidden sm:block">My Orders</Link>
                            <Link to="/cart" className="relative text-gray-600 hover:text-brand-green">
                                <CartIcon />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                                )}
                            </Link>
                            <button onClick={logout} className="btn-secondary">Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/seller/login" title="Seller Login / Register" className="text-gray-500 hover:text-brand-green">
                                <SellerIcon />
                            </Link>
                            <Link to="/login" className="btn-primary">Login</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
