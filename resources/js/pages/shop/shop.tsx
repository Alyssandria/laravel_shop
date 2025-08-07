import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Products, SharedData } from "@/types"
import { router, usePage } from "@inertiajs/react"
import { Loader2Icon, ShoppingCartIcon } from "lucide-react"
import { ComponentProps, useState } from "react"

type ShopPropsType = {
    products: Products[]
}

type ProductCardProps = {
    data: Products
} & ComponentProps<"div">

type CartProps = {
    productId: number
} & ComponentProps<typeof ShoppingCartIcon>

function Cart({ productId, className, ...props }: CartProps) {
    const { auth } = usePage<SharedData>().props;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleClick = async (productId: number) => {
        // fetch data
        // check if user is logged in before fetching
        if (!auth.user) {
            return router.visit(route('login'));
        }

        setIsLoading(true);

        const response = await fetch(route('cart.add', productId), {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content,
            }
        });

        if (!response.ok) {
            return console.log(response.status);
        }

        setIsLoading(false);
        console.log(await response.json());
    }

    return (
        isLoading ?
            <Loader2Icon className="animate-spin" />
            :
            <button type="button" onClick={() => handleClick(productId)}>
                <ShoppingCartIcon className={cn("cursor-pointer", className)}{...props} />
            </button >
    )
}

function ProductCard({ data, className, ...props }: ProductCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <img src={data.thumbnail} />
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
                <p>{data.price}</p>
                <Cart productId={data.id} />
            </CardFooter>
        </Card>
    )
}

export default function Shop({ products }: ShopPropsType) {
    return (
        <div className="grid grid-cols-3 gap-8">
            {products.map((el) => {
                return (
                    <ProductCard data={el} key={el.id} />
                )
            })}
        </div>
    )
}
