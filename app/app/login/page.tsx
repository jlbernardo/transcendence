import Link from "next/link";

export default function Login() {
	return (
		<>
			<Link href="/home">home</Link>
			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="w-120 h-auto p-2 border-4 border-b-amber-950 border-r-amber-950 m-0 bg-amber-400">
          <p className="text-3xl mb-6 mt-2 mr-4 text-right">LOGIN</p>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border-2 text-amber-700 border-amber-950"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border-2 text-amber-700 border-amber-950"
            />
            <button
              type="submit"
              className="bg-amber-700 w-1/3 mt-4 self-center text-white p-2 border-2 border-black hover:bg-amber-800"
            >
              login
            </button>
          </form>
          <p className="mt-5 text-amber-800 text-center">
            <Link href="/register">Register</Link>
          </p>
          <p className="text-amber-800 text-center">
            <Link href="/redefine">Forgot password?</Link>
          </p>
        </div>
			</div>
		</>
	)
}
