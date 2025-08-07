import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Products } from '@/types';
import { ComponentProps } from 'react';

type CartItems = {
    product: Products;
    quantity: number;
};

const CartTable = ({ cartItems }: { cartItems: CartItems[] } & ComponentProps<typeof Table>) => {
    return (
        <Table>
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
                            <TableCell></TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const cart = ({ products }: { products: CartItems[] }) => {
    return (
        <div>
            <CartTable cartItems={products} />
        </div>
    );
};

export default cart;
