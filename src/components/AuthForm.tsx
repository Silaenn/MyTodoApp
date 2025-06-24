"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthForm = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
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
          <form>
            <div className="flex flex-col gap-6">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-base">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourusername"
                    required
                    className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email..com"
                  required
                  className="text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-base">
                    Password
                  </Label>
                  {isLogin && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white text-base font-semibold"
          >
            {!isLogin ? "Register" : "Login"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/80 font-[var(--font-code)] text-sm font-medium"
          >
            {!isLogin ? "Register with Google" : "Login with Google"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AuthForm;
