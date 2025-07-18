/*
 * We've also extracted the Footer into its own component for reusability.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => <svg className="h-9 w-9 text-brand-green" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm-32.3 115.7c-6.2-6.2-16.4-6.2-22.6 0l-114 114.1c-6.2 6.2-6.2 16.4 0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0l114-114.1c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6zM320.3 163.7c-6.2-6.2-16.4-6.2-22.6 0l-114 114.1c-6.2 6.2-6.2 16.4 0 22.6l22.6 22.6c6.2 6.2 16.4 6.2 22.6 0l114-114.1c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6z"/></svg>;

const Footer = () => {
    return (
        <footer className="bg-white mt-auto border-t border-gray-200">
            <div className="container mx-auto py-8 px-6 text-center text-gray-600">
                <div className="flex justify-center items-center space-x-2 mb-2">
                    <Logo/>
                    <p className="font-bold text-brand-green text-lg">KrishiKart</p>
                </div>
                <p className="text-sm">&copy; 2025 KrishiKart. All Rights Reserved.</p>
                <p className="text-xs mt-2 text-gray-500">Your trusted partner in agriculture.</p>
            </div>
        </footer>
    );
};

export default Footer;
