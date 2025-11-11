import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "BotForce",
    description: "E-commerce de bots y automatizaciones",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider>
                    {children}
                    {/* ✅ Toast global para Sonner */}
                    <Toaster
                        richColors
                        position="bottom-right"
                        expand
                        toastOptions={{
                            classNames: {
                                toast:
                                    // superficie sólida + borde igual a las Cards
                                    "bg-card text-card-foreground border border-border " +
                                    // separación del fondo
                                    "shadow-xl ring-1 ring-black/10 dark:ring-white/10 " +
                                    // suavidad y consistencia
                                    "rounded-lg backdrop-blur-sm",
                            },
                        }}
                    />



                </ThemeProvider>
            </body>
        </html>
    );
}
