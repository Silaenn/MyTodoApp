"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

const AuthForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        loginForm.setError("root", { message: error.message });
      } else {
        loginForm.setError("root", { message: "Something went wrong" });
      }
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        registerForm.setError("root", { message: error.message });
      } else {
        registerForm.setError("root", { message: "Something went wrong" });
      }
    }
  };

  return (
    <>
      <Card className="sm:mx-auto sm:w-full sm:max-w-md bg-[#121212] border-4 border-white rounded-none shadow-[8px_8px_0px_#ffffff]">
        <CardHeader className="border-b-4 border-white mb-6">
          <CardTitle className="text-center text-3xl font-black uppercase tracking-tighter italic text-white">
            {isLogin ? "Welcome Back" : "Join the Vibe"}
          </CardTitle>
          <CardDescription className="text-center font-bold uppercase tracking-widest text-[var(--accent-neon)]">
            {isLogin ? (
              <>
                No account?{" "}
                <Link href={"/register"} className="underline hover:text-white">
                  Register
                </Link>
              </>
            ) : (
              <>
                Have account?{""}
                <Link href={"/login"} className="underline hover:text-white">
                  {""} Login
                </Link>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black uppercase tracking-widest text-xs">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="YOUR@EMAIL.COM"
                          {...field}
                          className="h-12 bg-black border-2 border-white rounded-none text-white font-bold placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-[var(--accent-neon)]"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="font-black uppercase tracking-widest text-xs">Password</FormLabel>
                        <Link
                          href="#"
                          className="text-[10px] font-bold uppercase underline hover:text-[var(--accent-neon)]"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="h-12 bg-black border-2 border-white rounded-none text-white font-bold focus-visible:ring-0 focus-visible:border-[var(--accent-neon)]"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                {loginForm.formState.errors.root && (
                  <p className="text-red-500 font-bold uppercase text-xs">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-primary w-full h-14 text-xl"
                >
                  ENTER
                </button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black uppercase tracking-widest text-xs">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="USERNAME"
                          {...field}
                          className="h-12 bg-black border-2 border-white rounded-none text-white font-bold placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-[var(--accent-neon)]"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black uppercase tracking-widest text-xs">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="YOUR@EMAIL.COM"
                          {...field}
                          className="h-12 bg-black border-2 border-white rounded-none text-white font-bold placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-[var(--accent-neon)]"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black uppercase tracking-widest text-xs">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="h-12 bg-black border-2 border-white rounded-none text-white font-bold focus-visible:ring-0 focus-visible:border-[var(--accent-neon)]"
                        />
                      </FormControl>
                      <FormMessage className="font-bold text-red-500" />
                    </FormItem>
                  )}
                />
                {registerForm.formState.errors.root && (
                  <p className="text-red-500 font-bold uppercase text-xs">
                    {registerForm.formState.errors.root.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="brutal-btn brutal-btn-primary w-full h-14 text-xl"
                >
                  CREATE ACCOUNT
                </button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AuthForm;
