import { CartAction, CartState } from '@/context/CartProvider';
import { createContext } from 'react';

type CartContextType = {
    dispatch: React.Dispatch<CartAction>;
} & CartState;

const CartContext = createContext<CartContextType | null>(null);

export default CartContext;
