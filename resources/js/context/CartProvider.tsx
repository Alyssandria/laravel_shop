import CartContext from '@/context/CartContext';
import { Products } from '@/types';
import { useEffect, useReducer } from 'react';

export type CartItem = {
    product: Products;
    quantity: number;
};

export type CartState = {
    products: CartItem[];
};

export type CartAction =
    | {
          type: 'ADD';
          payload: CartItem;
      }
    | {
          type: 'SET';
          payload: CartItem[];
      }
    | {
          type: 'UPDATE_ITEM';
          payload: CartItem;
          index: number;
      }
    | {
          type: 'REMOVE_ITEM';
          payload: CartItem;
      }
    | {
          type: 'DELETE';
      };

const reducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD':
            return { products: [action.payload, ...state.products] };
        case 'SET':
            return { products: action.payload };
        case 'UPDATE_ITEM':
            return {
                products: [...state.products.slice(0, action.index), action.payload, ...state.products.slice(action.index + 1)],
            };
        case 'REMOVE_ITEM':
            return {
                products: [...state.products.filter((item) => item.product.id != action.payload.product.id)],
            };
        case 'DELETE':
            return { products: [] };
        default:
            return state;
    }
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, { products: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(route('cart.items'), {
                    method: 'get',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
                    },
                });

                if (!response.ok) {
                    console.error(response.status);
                }

                const products = (await response.json()).products;

                dispatch({ type: 'SET', payload: products });
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return <CartContext.Provider value={{ ...state, dispatch }}>{children}</CartContext.Provider>;
};

export default CartProvider;
