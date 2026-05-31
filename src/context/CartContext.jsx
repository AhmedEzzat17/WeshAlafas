import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Helper to get unique user identifier
  const getUserId = () => user?.id || user?.email || "guest";

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`cartItems_${getUserId()}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`wishlistItems_${getUserId()}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // When user changes (login/logout), fetch their specific cart/wishlist
  useEffect(() => {
    const userId = getUserId();
    
    try {
      const savedCart = localStorage.getItem(`cartItems_${userId}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } catch (e) {
      setCartItems([]);
    }

    try {
      const savedWishlist = localStorage.getItem(`wishlistItems_${userId}`);
      setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
    } catch (e) {
      setWishlistItems([]);
    }
  }, [user]);

  // Save changes to localStorage under specific user keys
  useEffect(() => {
    const userId = getUserId();
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
  }, [cartItems, user]);

  useEffect(() => {
    const userId = getUserId();
    localStorage.setItem(`wishlistItems_${userId}`, JSON.stringify(wishlistItems));
  }, [wishlistItems, user]);

  // ===== Cart =====
  // Add to cart – if already exists, update its quantity
  const addToCart = (product, qty = 1) => {
    toast.success(window.location.pathname.startsWith('/ar') || document.dir === 'rtl' ? "تمت إضافة المنتج للسلة بنجاح" : "Product added to cart successfully");
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: qty, selected: true } : item,
        );
      }
      return [...prev, { ...product, quantity: qty, selected: true }];
    });
  };

  // Toggle cart item (add/remove)
  const toggleCart = (product) => {
    const exists = cartItems.some((item) => item.id === product.id);
    if (exists) {
      toast.success(window.location.pathname.startsWith('/ar') || document.dir === 'rtl' ? "تم إزالة المنتج من السلة" : "Product removed from cart");
      setCartItems((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      toast.success(window.location.pathname.startsWith('/ar') || document.dir === 'rtl' ? "تمت إضافة المنتج للسلة بنجاح" : "Product added to cart successfully");
      setCartItems((prev) => [...prev, { ...product, quantity: 1, selected: true }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item,
      ),
    );
  };

  const clearCart = () => {
    // Clear only selected items (keep unselected items in the cart)
    setCartItems((prev) => prev.filter((item) => item.selected === false));
  };

  // Toggle selection for a specific item
  const toggleSelectItem = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, selected: item.selected === false } : item,
      ),
    );
  };

  // Select or deselect all items in the cart
  const toggleSelectAll = (isSelected) => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: isSelected })),
    );
  };

  // Get quantity for a specific product in cart
  const getCartItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Sum total of selected items
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.selected !== false ? item.price * item.quantity : 0),
    0,
  );

  // cartCount = number of unique products in cart
  const cartCount = cartItems.length;

  // Total quantity across all SELECTED items (for summary display)
  const cartTotalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.selected !== false ? item.quantity : 0),
    0,
  );

  // ===== Wishlist =====
  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      toast.success(window.location.pathname.startsWith('/ar') || document.dir === 'rtl' ? "تم إزالة المنتج من المفضلة" : "Product removed from wishlist");
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      toast.success(window.location.pathname.startsWith('/ar') || document.dir === 'rtl' ? "تمت إضافة المنتج للمفضلة بنجاح" : "Product added to wishlist successfully");
      setWishlistItems((prev) => [...prev, product]);
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.id === productId);
  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        toggleCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleSelectItem,
        toggleSelectAll,
        toggleWishlist,
        isInWishlist,
        isInCart,
        getCartItemQuantity,
        cartTotal,
        cartCount,
        cartTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
