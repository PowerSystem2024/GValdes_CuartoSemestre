import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/forms/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage(
    { searchParams }: { searchParams?: { redirect?: string; [k: string]: string | string[] | undefined } }
) {
    const redirect = typeof searchParams?.redirect === "string" ? searchParams.redirect : "/";

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />   
                        </div>
                        BotForce
                    </a>

                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm redirect={redirect}/>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/login-img.avif"
                    alt="Imagen de login"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>


        </div>
    )
}
