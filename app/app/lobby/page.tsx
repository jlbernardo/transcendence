import Link from "next/link";

export default function Lobby() {
	return (
		<>
			<div>lobby</div>
			<br/>
			<Link href="/statistics">statistics</Link><br/>
			<Link href="/spectate">spectate</Link><br/>
			<Link href="/game">game</Link><br/>
			<Link href="/tournament">tournament</Link>
		</>
	)
}
