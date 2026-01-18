import Link from "next/link";

export default function Login() {
	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="w-120 h-auto p-2 border-black m-0 bg-black/70">
          <Link href="/" className="text-3xl text-amber-200 text-right">
            <p className="pr-3 pb-4 pt-1">x</p>
          </Link>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
            />
            <button
              type="submit"
              className="bg-amber-700 w-1/3 mt-4 self-center text-amber-200 p-2 border-2 border-black hover:bg-amber-800"
            >
              login
            </button>
          </form>
          <p className="mt-5 text-amber-200 text-center">
            <Link href="/register">Register</Link>
          </p>
          <p className="text-amber-200 text-center">
            <Link href="/redefine">Forgot your password?</Link>
          </p>
        </div>
			</div>
		</>
	)
}
