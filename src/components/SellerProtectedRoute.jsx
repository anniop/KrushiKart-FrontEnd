/*
 * This component now checks the `authIsLoading` state. It will show a
 * loading message instead of immediately redirecting, which fixes the bug.
 */
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SellerContext } from '../context/SellerContext';

const SellerProtectedRoute = ({ children }) => {
    const { sellerData, authIsLoading } = useContext(SellerContext);

    // --- NEW --- If we are still checking, show a loading message
    if (authIsLoading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    // If loading is finished and there's no seller, redirect
    if (!sellerData.seller) {
        return <Navigate to="/seller/login" />;
    }

    // If loading is finished and there is a seller, show the page
    return children;
};

export default SellerProtectedRoute;
