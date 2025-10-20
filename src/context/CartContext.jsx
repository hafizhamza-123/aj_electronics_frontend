import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingRemote, setLoadingRemote] = useState(false);

  // 🧠 Fetch cart from backend when user logs in
  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      if (!user) {
        // Clear cart when user logs out (optional)
        setCartItems([]);
        return;
      }

      setLoadingRemote(true);
      try {
        const res = await API.get("/cart");
        if (!cancelled) setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        if (!cancelled) setLoadingRemote(false);
      }
    }

    fetchCart();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ✅ Local update helper
  const setLocal = (updater) =>
    setCartItems((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );

  // ✅ Add to cart (guest or logged-in)
  const addToCart = async (product, qty = 1) => {
    const pid = String(product._id || product.id || product.productId);
    const quantity = Number(qty) || 1;

    // 🔹 Optimistic local update
    setLocal((prev) => {
      const existing = prev.find((i) => i.productId === pid);
      if (existing) {
        return prev.map((i) =>
          i.productId === pid
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: pid,
          id: pid,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image || product.img || "",
          quantity,
        },
      ];
    });

    // 🔹 Sync with backend (only if logged in)
    if (user) {
      try {
        const payload = {
          product: {
            id: product._id || product.id || product.productId,
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image || product.img || "",
          },
          qty: quantity,
        };

        const res = await API.post("/cart", payload);
        if (res?.data?.items) setCartItems(res.data.items);
      } catch (err) {
        console.error("addToCart API error:", err);
      }
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, qty) => {
    const quantity = Math.max(1, Number(qty));

    // Local update
    setLocal((prev) =>
      prev.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, quantity }
          : item
      )
    );

    // Backend sync
    if (user) {
      try {
        await API.put(`/cart/${productId}`, { qty: quantity });
        const res = await API.get("/cart");
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("updateQuantity API error:", err);
      }
    }
  };

  // ✅ Remove item
  const removeItem = async (productId) => {
    setLocal((prev) =>
      prev.filter((i) => String(i.productId) !== String(productId))
    );

    if (user) {
      try {
        const res = await API.delete(`/cart/${productId}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("removeItem API error:", err);
      }
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    setCartItems([]);

    if (user) {
      try {
        await API.delete("/cart");
      } catch (err) {
        console.error("clearCart API error:", err);
      }
    }
  };

  // ✅ Safe subtotal (prevents .toFixed crash)
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (acc, item) =>
          acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        loadingRemote,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
