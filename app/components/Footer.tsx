import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-amber-100/70">
      <div className="flex items-center justify-center gap-2">
        <Link
          href="/privacy-policy"
          className="hover:text-amber-100/70 transition-colors"
        >
          Privacy Policy
        </Link>
        <span>•</span>
        <Link
          href="/terms-of-service"
          className="hover:text-amber-100/70 transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
