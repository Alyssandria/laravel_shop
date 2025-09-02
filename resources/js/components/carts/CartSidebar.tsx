import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useCartContext from '@/hooks/use-cartcontext';
import { roundNumberByDecimalPlace } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ShoppingCartIcon, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export function CartSidebar() {
    const { products: cartItems, dispatch } = useCartContext();
    const [open, setOpen] = useState<boolean>(false);

    const subtotal = useMemo(() => {
        return roundNumberByDecimalPlace(
            cartItems.reduce((acc, item) => acc + item.product.price, 0),
            2,
        );
    }, [cartItems]);

    const handleRemoveItem = async (id: number) => {
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
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className='size-8 cursor-pointer'>
                <ShoppingCartIcon />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-transparent'>
                            <TableHead></TableHead>
                            <TableHead></TableHead>
                            <TableHead className='text-right'>
                                <Button variant='destructive' size='icon' className='my-2 rounded-full'>
                                    <X />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map((item) => {
                            return (
                                <TableRow key={item.product.id}>
                                    <TableCell>
                                        <img src={item.product.thumbnail} />
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <p>{item.product.title}</p>
                                            <p>
                                                {item.quantity} X {item.product.price}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant='secondary'
                                            size='icon'
                                            className='rounded-full'
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
                    <div className='flex justify-between'>
                        {' '}
                        <p>Subtotal</p>${subtotal}
                    </div>
                    <Button asChild variant='secondary' onClick={() => setOpen(false)}>
                        <Link href={route('cart')}>Cart Page</Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
