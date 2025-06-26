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
      <Card className=" text-white/80 sm:mx-auto sm:w-full sm:max-w-md bg-form">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-[var(--font-heading)]">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardTitle>
          <CardDescription className="text-center text-blue-500">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href={"/register"} className="text-blue-800">
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{""}
                <Link href={"/login"} className="text-blue-800">
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
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email..com"
                          {...field}
                          className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginForm.formState.errors.root && (
                  <p className="text-red-500 text-sm">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white text-base font-semibold"
                >
                  Login
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="yourusername"
                          {...field}
                          className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email..com"
                          {...field}
                          className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {registerForm.formState.errors.root && (
                  <p className="text-red-500 text-sm">
                    {registerForm.formState.errors.root.message}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white text-base font-semibold"
                >
                  Register
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AuthForm;
