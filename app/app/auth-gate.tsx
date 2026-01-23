"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { LoadingPong } from "@/components/LoadingPong";

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
        if (!hydrated) {
            return;
        }

        if (!token && !is_public_path) {
            router.replace("/login");
        }
        if (token && (pathname === "/login" || pathname === "/register")) {
            router.replace("/home");
        }
    }, [hydrated, token, pathname, is_public_path, router]);

    if (!hydrated) {
        return <LoadingPong visible={true}/>;
    }

    return <>{children}</>;
}
