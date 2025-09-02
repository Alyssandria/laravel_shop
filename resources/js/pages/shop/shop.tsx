import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useCartContext from '@/hooks/use-cartcontext';
import { cn } from '@/lib/utils';
import { Products, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Loader2Icon, ShoppingCartIcon } from 'lucide-react';
import { ComponentProps, useState } from 'react';

type ShopPropsType = {
    products: Products[];
};

type ProductCardProps = {
    data: Products;
} & ComponentProps<'div'>;

type CartProps = {
    product: Products;
} & ComponentProps<typeof ShoppingCartIcon>;

function Cart({ product, className, ...props }: CartProps) {
    const { auth } = usePage<SharedData>().props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useCartContext();

    const handleClick = async (product: Products) => {
        // fetch data
        // check if user is logged in before fetching
        if (!auth.user) {
            return router.visit(route('login'));
        }

        setIsLoading(true);

        const responsePost = await fetch(route('cart.add', product.id), {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
            },
        });

        if (!responsePost.ok) {
            return console.log(responsePost.status);
        }

        dispatch({ type: 'ADD', payload: { product, quantity: 1 } });
        setIsLoading(false);
    };

    return isLoading ? (
        <Loader2Icon className='animate-spin' />
    ) : (
        <button type='button' onClick={() => handleClick(product)}>
            <ShoppingCartIcon className={cn('cursor-pointer', className)} {...props} />
        </button>
    );
}

function ProductCard({ data }: ProductCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={data.thumbnail} />
            </CardContent>
            <CardFooter className='flex justify-between gap-4'>
                <p>{data.price}</p>
                <Cart product={data} />
            </CardFooter>
        </Card>
    );
}

export default function Shop({ products }: ShopPropsType) {
    return (
        <div className='grid grid-cols-3 gap-8'>
            {products.map((el) => {
                return <ProductCard data={el} key={el.id} />;
            })}
        </div>
    );
}
