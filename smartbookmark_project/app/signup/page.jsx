"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa6";

export default function AuthCard() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Use your Google account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
         <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle />
            Sign in with Google
        </Button>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <Label className="ml-1">thank you for visiting</Label>
        </CardFooter>
      </Card>
    </div>
  );
}