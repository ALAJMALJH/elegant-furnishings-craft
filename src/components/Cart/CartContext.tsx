
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  id: string; // Unique cart ID
  items: CartItem[];
  total: number;
  lastUpdated: number;
}

type CartAction = 
  | { type: 'INIT_CART'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SYNC_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  generateWhatsAppLink: () => string;
  isLoading: boolean;
} | undefined>(undefined);

const initialCartState: CartState = {
  id: '',
  items: [],
  total: 0,
  lastUpdated: Date.now()
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'INIT_CART':
      return action.payload;
      
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          lastUpdated: Date.now()
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newState = {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          lastUpdated: Date.now()
        };
      }
      return newState;
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        lastUpdated: Date.now()
      };
      return newState;
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      newState = {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        lastUpdated: Date.now()
      };
      return newState;
    }
    
    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
        total: 0,
        lastUpdated: Date.now()
      };
      return newState;
      
    case 'SYNC_CART':
      // Only sync if the incoming cart is newer
      if (action.payload.lastUpdated > state.lastUpdated) {
        return action.payload;
      }
      return state;
      
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user session
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for user authentication
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Initialize cart state with a unique ID
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      
      try {
        // Try to get cart from localStorage
        const localCart = localStorage.getItem('cart');
        let cartState: CartState | null = null;
        
        if (localCart) {
          const parsedCart = JSON.parse(localCart) as CartState;
          
          // Ensure cart has an ID
          if (!parsedCart.id) {
            parsedCart.id = uuidv4();
          }
          
          // Initialize with local cart data
          cartState = parsedCart;
        } 
        
        // If no local cart, create a new one
        if (!cartState) {
          cartState = {
            ...initialCartState,
            id: uuidv4()
          };
        }
        
        // If user is logged in, try to fetch cart from database and merge if needed
        if (userId) {
          const { data: dbCart } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (dbCart && dbCart.cart_data) {
            const dbCartData = dbCart.cart_data as unknown as CartState;
            
            // Use the more recently updated cart (or database cart if timestamps match)
            if (!cartState.lastUpdated || dbCartData.lastUpdated >= cartState.lastUpdated) {
              cartState = dbCartData;
            } else {
              // Local cart is newer, update the database
              await supabase
                .from('carts')
                .upsert({
                  user_id: userId,
                  cart_id: cartState.id,
                  cart_data: cartState,
                  updated_at: new Date().toISOString()
                });
            }
          } else {
            // No database cart, save the local cart to database
            await supabase
              .from('carts')
              .upsert({
                user_id: userId,
                cart_id: cartState.id,
                cart_data: cartState,
                updated_at: new Date().toISOString()
              });
          }
        }
        
        // Initialize the cart
        dispatch({ type: 'INIT_CART', payload: cartState });
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Fallback to a new cart if something goes wrong
        const newCart = {
          ...initialCartState,
          id: uuidv4()
        };
        dispatch({ type: 'INIT_CART', payload: newCart });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeCart();
  }, [userId]);
  
  // Subscribe to realtime cart updates
  useRealtimeSubscription(
    userId ? [
      { table: 'carts', event: 'UPDATE', filter: 'user_id=eq.?', filterValues: [userId] }
    ] : [],
    {
      carts: (payload) => {
        if (payload.new && payload.new.cart_data && payload.new.user_id === userId) {
          const cartData = payload.new.cart_data as unknown as CartState;
          dispatch({ type: 'SYNC_CART', payload: cartData });
        }
      }
    },
    false
  );
  
  // Save cart to localStorage and database when it changes
  useEffect(() => {
    if (!isLoading && state.id) {
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
      
      // Save to database if user is logged in
      if (userId) {
        const saveCart = async () => {
          try {
            await supabase
              .from('carts')
              .upsert({
                user_id: userId,
                cart_id: state.id,
                cart_data: state,
                updated_at: new Date().toISOString()
              });
          } catch (error) {
            console.error('Error saving cart to database:', error);
          }
        };
        
        saveCart();
      }
    }
  }, [state, userId, isLoading]);
  
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const generateWhatsAppLink = () => {
    const baseUrl = 'https://wa.me/971559143341'; // WhatsApp business number
    const cartUrl = `${window.location.origin}/cart`;
    const items = state.items.map(item => 
      `• ${item.name} (${item.quantity}x) - AED ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `New Order Request:\n\nCart Link: ${cartUrl}\n\n${items}\n\nTotal: AED ${state.total.toFixed(2)}`;
    
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  };
  
  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      generateWhatsAppLink,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
