"use client";

import Link from "next/link";
import { LoginData } from "@/types/user";
import { login } from "@/services/authentication";
import { getProfile } from "@/services/profile"
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { LoadingPong } from "@/components/LoadingPong";
import { Modal } from "@/components/Modal";
import { Button } from "@headlessui/react";
import z from "zod"
import axios from "axios"

export default function Login() {
  const router = useRouter()
  const setProfile = useUserStore((state) => state.setProfile);
  const setToken = useUserStore((state) => state.setToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const schema = z.object({
    email: z.email(),
    password: z.string().nonempty("Password is required"),
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: LoginData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = schema.safeParse(data);

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      const errors = result.error.flatten().fieldErrors;

      const [field, messages] = Object.entries(errors).find(([, v]) => v?.length) ?? [];
      const firstError = messages?.[0];

      setMessage(`Invalid ${field}: ${firstError}`);
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(data);
      console.log("Full response:", response);

      setToken(response.token);

      const profile_response = await getProfile();
      console.log("Profile response:", profile_response);
      setProfile(profile_response);
      router.push('/home');
    } catch (error) {
      let message = "Something went wrong. Try again.";

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400 || status === 401) {
          message = "Invalid email or password.";
        }
      }
      setIsModalOpen(true);
      setMessage(message);
    } finally {
      setIsLoading(false);
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
            <Button 
            onClick={() => {setIsModalOpen(true); setMessage("Password reset feature coming soon!")}}
            className="cursor-pointer">
              Forgot your password?
            </Button>
          </p>
        </div>
			</div>
      <LoadingPong visible={isLoading} />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}>
        <p className="text-black">{message}</p>
      </Modal>
		</>
	)
}
