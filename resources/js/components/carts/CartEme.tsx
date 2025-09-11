import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCartIcon, X } from 'lucide-react';
import { ComponentProps, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Products, SharedData } from '@/types';
import { cn, fetchWithHeaders } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
type cartItem = {
    product: Products,
    quantity: number
}

type CartDeleteProps = {
    productId: number,
    handleDelete: (id: number) => Promise<void>

} & ComponentProps<typeof Button>

const CartDelete = ({ productId, handleDelete, className, ...props }: CartDeleteProps) => {
    const [isLoading, setIsLoading] = useState<boolean>();
    return (
        <Button
            variant='secondary'
            size='icon'
            className={cn('rounded-full', className)}
            {...props}
            onClick={() => handleDelete(productId)}
        >
            <X />
        </Button>
    )

}
export const Carts = () => {
    const [open, setOpen] = useState<boolean>();
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [cartItems, setCartItem] = useState<cartItem[]>([]);

    useEffect(() => {
        setisLoading(true);

        const fetchData = async () => {
            const response = await fetchWithHeaders(route('cart.items'));

            if (!response.ok) {
                // HANDLE LATER
            }

            const json = await response.json();

            console.log(json);
            setCartItem(json.products);
            setisLoading(false);
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    const handleDelete = async (id: number) => {
        const response = await fetchWithHeaders(route('cart.remove', id), "DELETE");

        if (!response.ok) {

        }

        const json = await response.json();
        setCartItem(json.products);
        console.log(json);
    }

    console.log(cartItems);

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
                        {isLoading ?
                            <TableRow>
                                <TableCell>
                                    <Skeleton className='w-full h-20' />
                                </TableCell>
                            </TableRow>
                            :
                            !cartItems.length ? "No Cart Items Available" : cartItems.map((item) => {
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
                                            <CartDelete productId={item.product.id} handleDelete={handleDelete} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
                <SheetFooter>
                    <div className='flex justify-between'>
                        {' '}
                    </div>
                    <Button asChild variant='secondary' onClick={() => setOpen(false)}>
                        <Link href={route('cart')}>Cart Page</Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )

}
