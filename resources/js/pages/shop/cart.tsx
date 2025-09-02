import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CartItem } from '@/context/CartProvider';
import useCartContext from '@/hooks/use-cartcontext';
import { roundNumberByDecimalPlace } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { ComponentProps, useMemo } from 'react';

type CartTableType = {
    cartItems: CartItem[];
    onRemove: (id: number) => void;
} & ComponentProps<typeof Table>;

const CartTable = ({ cartItems, onRemove, className, ...props }: CartTableType) => {
    return (
        <Table className={className} {...props}>
            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cartItems.map((item) => {
                    return (
                        <TableRow key={item.product.id}>
                            <TableCell>
                                <img src={item.product.thumbnail} className='max-h-16 max-w-16' />
                            </TableCell>
                            <TableCell>{item.product.title}</TableCell>
                            <TableCell>{item.product.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{roundNumberByDecimalPlace(item.product.price * item.quantity, 2)}</TableCell>
                            <TableCell>
                                <Button
                                    variant='secondary'
                                    size='icon'
                                    onClick={() => {
                                        onRemove(item.product.id);
                                    }}
                                >
                                    <Trash />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const Cart = () => {
    const { products: cartItems, dispatch } = useCartContext();

    const subtotal = useMemo(() => {
        return roundNumberByDecimalPlace(
            cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
            2,
        );
    }, [cartItems]);

    const total = subtotal;

    const removeItem = async (id: number) => {
        const item = cartItems.find((item) => item.product.id == id);
        if (!item) throw new Error('Cart Item Remove Failure: Cart item does not exist');
        dispatch({ type: 'REMOVE_ITEM', payload: item });

        try {
            const response = await fetch(route('cart.remove', id), {
                method: 'delete',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
                },
            });

            if (!response.ok) {
                return console.log(response.status);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className='flex flex-row'>
            <CartTable cartItems={cartItems} onRemove={removeItem} />
            <div>
                <span className='text-3xl font-semibold'>Cart Totals</span>
                <div className='test'>
                    <span>Subtotal</span>
                    <span>{subtotal}</span>
                </div>
                <div className=''>
                    <span>Total</span>
                    <span>{total}</span>
                </div>
                <Button asChild>
                    <Link href={route('checkout')}>Check Out</Link>
                </Button>
            </div>
        </div>
    );
};

export default Cart;
