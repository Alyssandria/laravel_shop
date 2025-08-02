import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Products } from "@/types"
import { ShoppingCartIcon } from "lucide-react"
import { ComponentProps } from "react"

type ProductCardProps = {
    data: Products
} & ComponentProps<"div">

type CartProps = {
    productId: number
} & ComponentProps<typeof ShoppingCartIcon>

function Cart({ productId, className, ...props }: CartProps) {
    const handleClick = async (productId: number) => {
        // fetch data

    }
    return (
        <button type="button" onClick={() => handleClick(productId)}>
            <ShoppingCartIcon className={cn("cursor-pointer", className)}{...props} />
        </button>
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

export default function Shop({ products }) {
    console.log(products);
    return (
        <div className="grid grid-cols-4 gap-2">
            {products.map((el: Products) => {
                return (
                    <ProductCard data={el} />
                )
            })}
        </div>
    )
}
