"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [watchlistCount, setWatchlistCount] = useState(0);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchuserAndCounts();
    }, []);

    const fetchuserAndCounts = async () => {
        try {
            // Check session
            const authRes = await fetch("/api/auth/me", { cache: "no-store" });
            if (authRes.ok) {
                const userData = await authRes.json();
                setUser(userData);

                // Fetch Cart Count & Items
                const cartRes = await fetch("/api/cart");
                if (cartRes.ok) {
                    const cartData = await cartRes.json();
                    const count = cartData.reduce((acc, item) => acc + item.quantity, 0);
                    setCartCount(count);
                    setCartItems(cartData.map(item => item.product.id));
                }

                // Fetch Watchlist IDs & Count
                const watchlistRes = await fetch("/api/watchlist");
                if (watchlistRes.ok) {
                    const watchlistData = await watchlistRes.json();
                    setWatchlistCount(watchlistData.length);
                    setWatchlistIds(watchlistData.map(item => item.product.id));
                }
            } else {
                setUser(null);
                setCartCount(0);
                setCartItems([]);
                setWatchlistCount(0);
                setWatchlistIds([]);
            }
        } catch (error) {
            console.error("Error fetching shop data", error);
        }
    };

    const updateCounts = () => {
        fetchuserAndCounts();
    };

    // Helper to check if item is in watchlist
    const isInWatchlist = (productId) => watchlistIds.includes(productId);

    // Helper to check if item is in cart
    const isInCart = (productId) => cartItems.includes(productId);

    return (
        <ShopContext.Provider value={{
            cartCount,
            cartItems,
            watchlistCount,
            watchlistIds,
            user,
            updateCounts,
            isInWatchlist,
            isInCart,
            setUser
        }}>
            {children}
        </ShopContext.Provider>
    );
};
