import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Products } from '@/types';
import { Trash } from 'lucide-react';
import { ComponentProps } from 'react';

type CartItem = {
    product: Products;
    quantity: number;
};

const DeleteItemButton = ({ item }: { item: CartItem }) => {
    const handleItemRemove = async (productId: number) => {
        //remove item from cart

        try {
            console.log(productId);

            const response = await fetch(route('cart.remove', productId), {
                method: 'delete',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
                },
            });

            if (!response.ok) {
                return console.log(response.status);
            }

            console.log(await response.json());
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <Button
            variant="secondary"
            size="icon"
            onClick={() => {
                handleItemRemove(item.product.id);
            }}
        >
            <Trash />
        </Button>
    );
};

const CartTable = ({ cartItems, className, ...props }: { cartItems: CartItem[] } & ComponentProps<typeof Table>) => {
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
                                <DeleteItemButton item={item} />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const cart = ({ products }: { products: CartItem[] }) => {
    return (
        <div>
            <CartTable cartItems={products} />
        </div>
    );
};

export default cart;
