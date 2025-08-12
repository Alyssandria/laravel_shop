import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Products } from '@/types';
import { Trash } from 'lucide-react';
import { ComponentProps, useState } from 'react';

type CartItem = {
    product: Products;
    quantity: number;
};

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
                                <img src={item.product.thumbnail} className="max-h-16 max-w-16" />
                            </TableCell>
                            <TableCell>{item.product.title}</TableCell>
                            <TableCell>{item.product.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{Math.round(item.product.price * item.quantity * 100) / 100}</TableCell>
                            <TableCell>
                                <Button
                                    variant="secondary"
                                    size="icon"
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

const cart = ({ products }: { products: CartItem[] }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(products);

    const removeItem = async (id: number) => {
        setCartItems(cartItems.filter((item) => item.product.id !== id));

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
        <div>
            <CartTable cartItems={cartItems} onRemove={removeItem} />
        </div>
    );
};

export default cart;
