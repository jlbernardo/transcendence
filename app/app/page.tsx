import Link from "next/link";

export default function LandingPage() {
	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center">
				<p className="text-[200px] text-amber-100 mb-4">ft_pong</p>
				<Link href="/login" className="text-4xl text-amber-100">enter</Link>
			</div>
		</>
	)
}
