
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { Json } from '@/integrations/supabase/types';

// Export the CartItem interface so it can be imported elsewhere
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  id: string;
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
      // Only sync carts if they have the same ID to prevent cross-user cart contamination
      if (action.payload.id === state.id && action.payload.lastUpdated > state.lastUpdated) {
        return action.payload;
      }
      return state;
      
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [clientIdentifier, setClientIdentifier] = useState<string>('');
  
  // Generate a consistent client identifier
  useEffect(() => {
    // Try to get existing client ID from localStorage
    const existingClientId = localStorage.getItem('furniture_client_id');
    
    if (existingClientId) {
      setClientIdentifier(existingClientId);
    } else {
      // Generate a new client ID if none exists
      const newClientId = uuidv4();
      localStorage.setItem('furniture_client_id', newClientId);
      setClientIdentifier(newClientId);
    }
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
    
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
  
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  useEffect(() => {
    // Don't initialize cart until we have a client identifier
    if (!clientIdentifier) return;
    
    const initializeCart = async () => {
      setIsLoading(true);
      
      try {
        const cartStorageKey = `cart_${clientIdentifier}`;
        const localCart = localStorage.getItem(cartStorageKey);
        let cartState: CartState | null = null;
        
        if (localCart) {
          const parsedCart = JSON.parse(localCart) as CartState;
          if (!parsedCart.id) {
            parsedCart.id = uuidv4();
          }
          cartState = parsedCart;
        } 
        
        if (!cartState) {
          cartState = {
            ...initialCartState,
            id: uuidv4()
          };
        }
        
        if (userId) {
          // For logged in users, use their user ID to find their cart
          const { data, error } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching cart from database:', error);
          }
          
          if (data && data.cart_data) {
            const dbCartData = data.cart_data as unknown as CartState;
            
            if (!cartState.lastUpdated || dbCartData.lastUpdated >= cartState.lastUpdated) {
              cartState = dbCartData;
            } else {
              await supabase
                .from('carts')
                .upsert({
                  user_id: userId,
                  cart_id: cartState.id,
                  cart_data: cartState as unknown as Json
                });
            }
          } else {
            await supabase
              .from('carts')
              .upsert({
                user_id: userId,
                cart_id: cartState.id,
                cart_data: cartState as unknown as Json
              });
          }
        } else {
          // For non-logged in users, use their client ID to find their cart
          const { data, error } = await supabase
            .from('carts')
            .select('*')
            .eq('cart_id', cartState.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching cart from database:', error);
          }
          
          if (data && data.cart_data) {
            const dbCartData = data.cart_data as unknown as CartState;
            
            if (!cartState.lastUpdated || dbCartData.lastUpdated >= cartState.lastUpdated) {
              cartState = dbCartData;
            }
          }
        }
        
        dispatch({ type: 'INIT_CART', payload: cartState });
      } catch (error) {
        console.error('Error initializing cart:', error);
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
  }, [userId, clientIdentifier]);
  
  // Only subscribe to realtime updates for the current cart
  useRealtimeSubscription(
    userId && state.id ? [
      { 
        table: 'carts', 
        event: 'UPDATE', 
        filter: 'user_id=eq.?', 
        filterValues: [userId] 
      }
    ] : [],
    {
      carts: (payload) => {
        if (payload.new && payload.new.cart_data && payload.new.user_id === userId) {
          const cartData = payload.new.cart_data as unknown as CartState;
          
          // Only sync if this is the same cart ID as the current one
          if (cartData.id === state.id) {
            dispatch({ type: 'SYNC_CART', payload: cartData });
          }
        }
      }
    },
    false
  );
  
  useEffect(() => {
    // Don't save cart until we have a client identifier
    if (!clientIdentifier || !state.id || isLoading) return;
    
    const cartStorageKey = `cart_${clientIdentifier}`;
    localStorage.setItem(cartStorageKey, JSON.stringify(state));
    
    const saveCart = async () => {
      try {
        if (userId) {
          // For logged in users, use their user ID
          await supabase
            .from('carts')
            .upsert({
              user_id: userId,
              cart_id: state.id,
              cart_data: state as unknown as Json
            });
        } else {
          // For non-logged in users, just use the cart ID
          await supabase
            .from('carts')
            .upsert({
              user_id: null,
              cart_id: state.id,
              cart_data: state as unknown as Json
            });
        }
      } catch (error) {
        console.error('Error saving cart to database:', error);
      }
    };
    
    saveCart();
  }, [state, userId, isLoading, clientIdentifier]);
  
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
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  const generateWhatsAppLink = () => {
    const baseUrl = 'https://wa.me/971559143341';
    const cartUrl = `${window.location.origin}/cart`;
    const items = state.items.map(item => 
      `• ${item.name} (${item.quantity}x) - AED ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `New Order Request:\n\nCart ID: ${state.id}\nClient ID: ${clientIdentifier}\n\nCart Link: ${cartUrl}\n\n${items}\n\nTotal: AED ${state.total.toFixed(2)}`;
    
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
