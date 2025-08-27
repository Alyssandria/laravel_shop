import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Products } from '@/types';
import { Link } from '@inertiajs/react';
import { ShoppingCartIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type CartItem = {
    product: Products;
    quantity: number;
};

export function CartSidebar() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const subtotal = useMemo(() => {
        const total = cartItems.reduce((acc, item) => acc + item.product.price, 0);
        return total;
    }, [cartItems]);

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
                return console.log(response.status);
            }

            const items = await response.json();
            console.log(items);
            setCartItems(items.products);
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemoveItem = async (id: number) => {
        setCartItems(cartItems?.filter((item) => item.product.id !== id));

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
        <Sheet
            onOpenChange={(open) => {
                if (open) fetchData();
            }}
        >
            <SheetTrigger className="size-8 cursor-pointer">
                <ShoppingCartIcon />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead className="text-right">
                                <Button variant="destructive" size="icon" className="my-2 rounded-full">
                                    <X />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        <img src={item.product.thumbnail} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <p>{item.product.title}</p>
                                            <p>
                                                {item.quantity} X {item.product.price}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={() => {
                                                handleRemoveItem(item.product.id);
                                            }}
                                        >
                                            <X />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <SheetFooter>
                    <div className="flex justify-between">
                        {' '}
                        <p>Subtotal</p>${subtotal}
                    </div>
                    <Button asChild variant="secondary">
                        <Link href={route('cart')}>Cart Page</Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
