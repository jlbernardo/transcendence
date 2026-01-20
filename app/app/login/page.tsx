"use client";

import Link from "next/link";
import { LoginData } from "@/types/user";
import { login } from "@/services/authentication";
import { getProfile } from "@/services/profile"
import { useRouter } from "next/navigation";
import api from "@/lib/axios_instance";
import { useUserStore } from "@/store/userStore";

export default function Login() {
  const router = useRouter()
  const { setProfile, setToken } = useUserStore().getState();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: LoginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await login(data);
      console.log("Full response:", response);

      setToken(response.token)
      api.defaults.headers.common["Authorization"] = `token ${response.token}`;

      const profile_response = await getProfile();
      console.log("Profile response:", profile_response);
      setProfile(profile_response)

      alert("Login successful");
      router.push('/home');
    } catch (error: any) {
      console.error("ERROR: ", error);
      alert("Login failed! Check console for details.");
    }
   
  }
	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="w-120 h-auto p-2 border-black m-0 bg-black/70">
          <Link href="/" className="text-3xl text-amber-200 text-right">
            <p className="pr-3 pb-4 pt-1">x</p>
          </Link>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
            />
            <input
              type="password"
              name="password"
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
