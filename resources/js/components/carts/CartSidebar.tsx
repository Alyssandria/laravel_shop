import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, fetchWithHeaders, roundNumberByDecimalPlace } from '@/lib/utils';
import { Products } from '@/types';
import { Link } from '@inertiajs/react';
import { Loader2Icon, ShoppingCartIcon, X } from 'lucide-react';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type cartItem = {
    product: Products;
    quantity: number;
};

type CartDeleteProps = {
    productId: number;
    handleDelete: (id: number) => Promise<void>;
} & ComponentProps<typeof Button>;

const CartDelete = ({ productId, handleDelete, className, ...props }: CartDeleteProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = async () => {
        setIsLoading(true);
        await handleDelete(productId);
        setIsLoading(false);
    };

    return (
        <Button variant='secondary' size='icon' className={cn('rounded-full', className)} {...props} onClick={handleClick}>
            {isLoading ? <Loader2Icon className='animate-spin' /> : <X />}
        </Button>
    );
};

export const CartSidebar = () => {
    const [open, setOpen] = useState<boolean>();
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [cartItems, setCartItem] = useState<cartItem[]>([]);

    const subtotal = useMemo(() => {
        return roundNumberByDecimalPlace(
            cartItems.reduce((acc, item) => acc + item.product.price, 0),
            2,
        );
    }, [cartItems]);

    useEffect(() => {
        setisLoading(true);

        const fetchData = async () => {
            const response = await fetchWithHeaders(route('cart.items'));

            if (!response.ok) {
                // HANDLE LATER
            }

            const json = await response.json();

            setCartItem(json.products);
            setisLoading(false);
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    const handleDelete = async (id: number) => {
        const response = await fetchWithHeaders(route('cart.remove', id), 'DELETE');

        if (!response.ok) {
            //HANDLE LATER
        }

        const json = await response.json();
        setCartItem(json.products);
    };

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
                        {isLoading ? (
                            <TableRow>
                                <TableCell>
                                    <Skeleton className='h-20 w-full' />
                                </TableCell>
                            </TableRow>
                        ) : !cartItems.length ? (
                            'No Cart Items Available'
                        ) : (
                            cartItems.map((item) => {
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
                        )}
                    </TableBody>
                </Table>
                <SheetFooter>
                    <div className='flex justify-between'>
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                    </div>
                    <Button asChild variant='secondary' onClick={() => setOpen(false)}>
                        <Link href={route('cart')}>Cart Page</Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
