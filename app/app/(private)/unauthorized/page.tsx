import Link from "next/link";

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-amber-200 mb-4">404</h1>
                <h2 className="text-4xl text-amber-100 mb-6">Page not found</h2>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-amber-700 text-amber-200 px-6 py-3 border-2 border-black hover:bg-amber-800 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
