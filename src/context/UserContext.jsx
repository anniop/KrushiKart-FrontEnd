/*
 * We've added a new, more direct function `updateCart` to our context.
 * This allows components to update the cart state without needing to
 * re-fetch all the data, making the UI much snappier.
 */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = (props) => {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
        cart: []
    });
    const [authIsLoading, setAuthIsLoading] = useState(true);

    const getCart = async (token) => {
        try {
            const res = await axios.get("/api/cart/", {
                headers: { "x-auth-token": token }
            });
            setUserData(prev => ({ ...prev, cart: res.data }));
        } catch (err) {
            console.error("Couldn't get cart.", err);
        }
    };
    
    const clearCart = () => {
        setUserData(prev => ({ ...prev, cart: [] }));
    };

    // --- NEW --- Direct state update function
    const updateCart = (newCart) => {
        setUserData(prev => ({ ...prev, cart: newCart }));
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token");
            if (token === null) {
                localStorage.setItem("auth-token", "");
                token = "";
            }
            if (token) {
                 const user = JSON.parse(localStorage.getItem("user-data"));
                 setUserData(prev => ({ ...prev, token, user }));
                 await getCart(token);
            }
            setAuthIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData, getCart, clearCart, authIsLoading, updateCart }}>
            {props.children}
        </UserContext.Provider>
    );
};
