import Link from "next/link";

export default function Home() {
	return (
		<>
			<div>home</div>
			<br/>
			<Link href="/profile">profile</Link><br/>
			<Link href="/gdpr">gdpr</Link><br/>
			<Link href="/chat">chat</Link><br/>
			<Link href="/lobby">lobby</Link>
		</>
	)
}
