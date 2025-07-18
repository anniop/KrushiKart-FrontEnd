import React, { createContext, useState, useEffect } from 'react';

export const SellerContext = createContext(null);

export const SellerProvider = (props) => {
    const [sellerData, setSellerData] = useState({
        token: undefined,
        seller: undefined,
    });
    const [authIsLoading, setAuthIsLoading] = useState(true);

    useEffect(() => {
        const checkSellerLoggedIn = async () => {
            let token = localStorage.getItem("seller-auth-token");
            if (token === null) {
                localStorage.setItem("seller-auth-token", "");
                token = "";
            }
            if (token) {
                 const seller = JSON.parse(localStorage.getItem("seller-data"));
                 setSellerData({ token, seller });
            }
            setAuthIsLoading(false);
        };
        checkSellerLoggedIn();
    }, []);

    return (
        <SellerContext.Provider value={{ sellerData, setSellerData, authIsLoading }}>
            {props.children}
        </SellerContext.Provider>
    );
};
