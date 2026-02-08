"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { usePathname } from "next/navigation";
import CartPopup from "@/components/CartPopup";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-[#0a0a0a] text-white`} suppressHydrationWarning={true}>
                <Providers>
                    <Toast />
                    <ConfirmModal />
                    {!isAdminRoute && (
                        <>
                            <Navbar />
                            <CartPopup />
                        </>
                    )}
                    <div className={!isAdminRoute && pathname !== '/' ? "pt-16 min-h-screen flex flex-col" : "min-h-screen flex flex-col"}>
                        <main className={!isAdminRoute ? "flex-grow" : ""}>
                            {children}
                        </main>
                        {!isAdminRoute && <Footer />}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
