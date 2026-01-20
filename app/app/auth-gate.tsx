"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/register",
    "/privacy-policy",
    "/terms-of-service",
];

export default function AuthGate({children}: { children: React.ReactNode;}) {
    const pathname = usePathname();
    const router = useRouter();
    const hydrated = useUserStore((state) => state.hydrated);
    const token = useUserStore((state) => state.token);

    const is_public_path = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        // if (!hydrated) {
        //     console.log("Awaiting localStorage hydration...");
        //     return;
        // }

        if (!token && !is_public_path) {
            router.replace("/unauthorized");
        }
        if (token && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
            router.replace("/home");
        }
    }, [hydrated, token, pathname, is_public_path, router]);

    return <>{children}</>;
}
