"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { LoadingPong } from "@/components/LoadingPong";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useUserStore((state) => state.hydrated);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!hydrated) return;
    
    if (token && (pathname === "/login" || pathname === "/register")) {
      router.replace("/home");
    }
  }, [hydrated, token, pathname, router]);

  if (!hydrated) {
    return <LoadingPong visible={true} />;
  }

  return <>{children}</>;
}