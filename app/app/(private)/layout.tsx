"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { LoadingPong } from "@/components/LoadingPong";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useUserStore((state) => state.hydrated);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return <LoadingPong visible={true} />;
  }

  return <>{children}</>;
}
