/*
 * This is the redesigned homepage featuring a video background in the hero
 * section. The search bar has been moved to its own dedicated section
 * below the video for better user flow.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import api from '../api';
api.get('/api/products');


// Category Icon Components (no change)
const FertilizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H5.502c-.656 0-1.189-.585-1.119-1.243l1.263-12A1.875 1.875 0 017.002 8.25h9.996a1.875 1.875 0 011.856.257z" /></svg>;
const SeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75v1.5a4.5 4.5 0 01-4.5 4.5h-6.375a4.5 4.5 0 01-4.5-4.5v-1.5m15-3.75l-7.5-6-7.5 6" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v12m0 0l-3-3m3 3l3-3" /></svg>;
const PesticideIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.353-.026.692-.026 1.038 0 .93.064 1.72 1.157 1.72 2.192V7.5M8.25 7.5h7.5m-7.5 0l-1.096 1.096a1.125 1.125 0 000 1.591l1.096 1.096m7.5 0l1.096-1.096a1.125 1.125 0 000-1.591l-1.096-1.096M10.5 11.25v6.375a1.125 1.125 0 001.125 1.125h.375a1.125 1.125 0 001.125-1.125V11.25m-3.75 0h3.75" /></svg>;
const ToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-3.375A4.5 4.5 0 009.125 12.5H4.5m9-.375c1.036 0 1.933.344 2.625.938m-2.625-.938c-.968.034-1.89.46-2.625.938m-12.5 0L4.5 12.5m0 0l2.625.938M4.5 12.5l-2.625-.938M13.5 21a9 9 0 00-9-9m9 9c1.036 0 1.933.344 2.625.938m-2.625-.938c-.968.034-1.89.46-2.625.938m0-11.25L12 3.375m0 0L9.375 7.5M12 3.375v4.125" /></svg>;

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        { name: 'Fertilizer', icon: <FertilizerIcon /> },
        { name: 'Seed', icon: <SeedIcon /> },
        { name: 'Pesticide', icon: <PesticideIcon /> },
        { name: 'Tool', icon: <ToolIcon /> },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/api/products?t=${new Date().getTime()}`);
                if (response.data) {
                    setProducts(response.data);
                }
                setError(null);
            } catch (err) {
                setError("Failed to fetch products. Please make sure the backend server is running.");
                console.error("Axios error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchTerm);
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Video Hero Section */}
            <section className="relative h-[80vh] rounded-xl overflow-hidden mb-12 flex items-center justify-center text-center text-white">
                <video 
                    src="https://videos.pexels.com/video-files/3616640/3616640-hd_1920_1080_24fps.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
                ></video>
                <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
                <div className="relative z-20 p-8">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">Your Farm's Needs, Delivered.</h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-shadow">Genuine fertilizers, seeds, and tools from your trusted local stores, right to your doorstep.</p>
                </div>
            </section>

            {/* --- UPDATED --- Search Bar Section moved down */}
            <section className="mb-12">
                 <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                        <input 
                            type="text" 
                            placeholder="What are you looking for today?" 
                            className="w-full p-5 pl-6 text-gray-700 focus:outline-none text-lg"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="bg-brand-orange hover:bg-[#c9713d] text-white p-4 transition-colors">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </section>

            <section className="my-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link key={category.name} to={`/category/${category.name.toLowerCase()}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:bg-green-50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center">
                            {category.icon}
                            <h4 className="font-bold text-lg text-gray-800 mt-4">{category.name}</h4>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    {searchTerm ? `Showing results for "${searchTerm}"` : "Featured Products"}
                </h3>
                {loading && <p className="text-center text-lg">Loading products...</p>}
                {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
                {!loading && !error && (
                    filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-xl text-gray-500 mt-8">No products found.</p>
                    )
                )}
            </section>
        </div>
    );
};

export default HomePage;
