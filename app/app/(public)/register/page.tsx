"use client";

import Link from "next/link";
import { RegisterData } from "@/types/user";
import { register } from "@/services/authentication";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingPong } from "@/components/LoadingPong";
import { Modal } from "@/components/Modal";
import * as z from "zod";

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState<string>("");
    const schema = z.object({
        email: z.email(),
        username: z.string().min(4).max(20),
        password: z.string().min(8).max(100).regex(/[A-Za-z]/, "Must contain at least one letter"),
        password2: z.string(),
    }).refine((data) => data.password === data.password2, {
        message: "Passwords do not match",
        path: ["password2"],
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data: RegisterData = {
            email: formData.get('email') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            password2: formData.get('password2') as string,
        };
        const result = schema.safeParse(data);

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            const [field, messages] = Object.entries(errors).find(([, v]) => v?.length) ?? [];
            const firstError = messages?.[0];

            setMessage(`Invalid ${field}: ${firstError}`);
            setIsModalOpen(true);
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await register(data);
            router.push('/login');
        } catch (error) {
            setIsModalOpen(true);
            setMessage("Registration failed! Try again.");
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
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
                        />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm your password"
                            className="p-3 mr-3 ml-2 border-2 text-amber-200 border-amber-200/40"
                        />
                        <button
                            type="submit"
                            className="bg-amber-700 w-1/3 my-4 self-center text-amber-200 p-2 border-2 border-black hover:bg-amber-800"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-amber-200 text-center">
                        <Link href="/login">Go back</Link>
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
