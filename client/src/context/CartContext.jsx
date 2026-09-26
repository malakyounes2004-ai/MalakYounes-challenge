import { createContext, useContext, useState } from "react";
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product, quantity = 1) => {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) => item.id === product.id
    );

    const availableStock = Number(product.stock);
    const requestedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    if (existingItem) {
      return currentItems.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + requestedQuantity,
                availableStock
              ),
            }
          : item
      );
    }

    return [
      ...currentItems,
      {
        ...product,
        quantity: Math.min(requestedQuantity, availableStock),
      },
    ];
  });
};
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };
  const updateQuantity = (productId, quantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }
        const newQuantity = Math.min(
          Math.max(1, quantity),
          item.stock
        );
        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };
  const clearCart = () => {
    setCartItems([]);
  };
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  return useContext(CartContext);
};