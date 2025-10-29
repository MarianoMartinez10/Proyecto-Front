"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Game } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Game {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Game[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  toggleWishlist: (game: Game) => void;
  isInWishlist: (gameId: string) => boolean;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Game[]>([]);
  const { toast } = useToast();

  const addToCart = (game: Game) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === game.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...game, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${game.name} is now in your shopping cart.`,
    });
  };

  const removeFromCart = (gameId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== gameId));
    toast({
      title: "Removed from cart",
      variant: 'destructive'
    });
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === gameId ? { ...item, quantity } : item
        )
      );
    }
  };

  const toggleWishlist = (game: Game) => {
    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.some((item) => item.id === game.id);
      if (isInWishlist) {
        toast({
            title: "Removed from wishlist",
            description: `${game.name} has been removed from your wishlist.`,
            variant: 'destructive'
          });
        return prevWishlist.filter((item) => item.id !== game.id);
      } else {
        toast({
            title: "Added to wishlist",
            description: `${game.name} is now in your wishlist.`,
          });
        return [...prevWishlist, game];
      }
    });
  };

  const isInWishlist = (gameId: string) => {
    return wishlist.some((item) => item.id === gameId);
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
