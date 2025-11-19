'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import type { Game } from '@/lib/types'; // Asegúrate de importar el tipo Game

// Definición del item del carrito
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // Propiedades adicionales para coincidir con la UI si es necesario
  platform?: { name: string };
  imageId?: string;
}

interface CartContextType {
  // --- CARRITO ---
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number; // Renombrado para consistencia con tu frontend
  cartCount: number; // Renombrado para consistencia
  isLoading: boolean;
  
  // --- WISHLIST (LO QUE FALTABA) ---
  wishlist: Game[];
  toggleWishlist: (game: Game) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Estado del Carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado de la Wishlist
  const [wishlist, setWishlist] = useState<Game[]>([]);

  const { user, token } = useAuth();

  // --- LÓGICA DEL CARRITO ---

  // Calcular totales
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sincronizar carrito con el backend
  const syncCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await ApiClient.getCart(user?.id, token ?? undefined);
      
      // Adaptamos la respuesta del backend a la estructura interna
      const adaptedItems = (cartData.cart?.items || []).map((item: any) => ({
        id: item._id || item.id,
        productId: item.product?._id || item.product?.id || item.productId,
        name: item.product?.nombre || item.name,
        price: item.product?.precio || item.price,
        quantity: item.quantity,
        image: item.product?.imagenUrl || item.image,
        imageId: item.product?.imagenUrl, // Para compatibilidad con imágenes locales
        platform: item.product?.plataformaId ? { name: item.product.plataformaId.nombre || 'Plataforma' } : undefined
      }));

      setCart(adaptedItems);
    } catch (error) {
      console.error('Error al sincronizar carrito:', error);
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try { setCart(JSON.parse(localCart)); } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- LÓGICA DE WISHLIST ---

  // Cargar Wishlist de localStorage al inicio
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, []);

  // Guardar Wishlist cuando cambie
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (game: Game) => {
    if (isInWishlist(game.id)) {
      removeFromWishlist(game.id);
    } else {
      setWishlist((prev) => [...prev, game]);
    }
  };

  const removeFromWishlist = (gameId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== gameId));
  };

  const isInWishlist = (gameId: string) => {
    return wishlist.some((item) => item.id === gameId);
  };

  // --- EFECTOS GLOBALES ---

  useEffect(() => {
    if (user || token) {
      syncCart();
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        try { setCart(JSON.parse(localCart)); } catch {}
      }
      setIsLoading(false);
    }
  }, [user, token]);

  // --- MÉTODOS DEL CARRITO ---

  const addToCart = async (product: any, quantity: number = 1) => {
    try {
      // Optimistic update (opcional) o llamada directa
      if (user && token) {
        // El backend espera productId, no el objeto entero
        const prodId = product.id || product._id; 
        await ApiClient.addToCart(prodId, quantity, token);
        await syncCart();
      } else {
        // Carrito Local (sin login)
        const existingItemIndex = cart.findIndex(item => item.productId === product.id);
        let newCart = [...cart];

        if (existingItemIndex > -1) {
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart.push({
            id: `local-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.imageId || product.imageUrl, // Ajuste según tus datos
            imageId: product.imageId,
            platform: product.platform
          });
        }
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
        // Opcional: eliminar si baja a 0
        return; 
    }
    try {
        if (user && token) {
            // Busca el item real para obtener su ID de base de datos si es necesario
            // Dependiendo de tu API, puede requerir el ID del item del carrito o del producto
            // Asumiremos que tu API de 'updateCartItem' usa el ID del item del carrito
            const cartItem = cart.find(item => item.productId === productId || item.id === productId);
            if(cartItem) {
               // Nota: Tu api-client.ts llama a /cart (PUT) con productId.
               await ApiClient.updateCartItem(cartItem.productId, quantity, token);
               await syncCart();
            }
        } else {
            const newCart = cart.map(item => 
                (item.productId === productId || item.id === productId) ? { ...item, quantity } : item
            );
            setCart(newCart);
            localStorage.setItem('cart', JSON.stringify(newCart));
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user && token) {
        await ApiClient.removeFromCart(itemId, token);
        await syncCart();
      } else {
        const newCart = cart.filter(item => item.id !== itemId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    } catch (error) {
      console.error('Error al remover del carrito:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (user && token) {
        await ApiClient.clearCart(token);
        await syncCart();
      } else {
        setCart([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isLoading,
    // Wishlist
    wishlist,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}