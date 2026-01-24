import Link from "next/link";

export default function Chat() {
	return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
                <h3 className="text-9xl font-bold text-amber-200 mb-4">COMING SOON</h3>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/home"
                        className="bg-amber-700 text-amber-200 px-6 py-3 border-2 border-black hover:bg-amber-800 transition-colors"
                    >
                        Go back
                    </Link>
                </div>
            </div>
        </div>
    );
}
