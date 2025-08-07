import { CartSidebar } from '@/components/carts/CartSidebar';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LucideShoppingBasket } from 'lucide-react';
import { ComponentProps } from 'react';

export default function Layout({ children }: ComponentProps<'div'>) {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="flex min-h-screen flex-col">
            <header className="w-full p-8 text-sm not-has-[nav]:hidden">
                <nav className="flex items-center justify-end gap-4">
                    <Link
                        href={route('shop')}
                        className="inline-block rounded-sm px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Shop
                    </Link>
                    {auth.user ? (
                        <>
                            <Link href={route('cart')}>
                                <LucideShoppingBasket className="size-7 cursor-pointer" />
                            </Link>
                            <CartSidebar />
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>
            <div className="flex w-full">
                <main className="w-full p-4 text-secondary-foreground dark:text-foreground">{children}</main>
            </div>
            <div className="hidden h-14.5 lg:block"></div>
        </div>
    );
}
