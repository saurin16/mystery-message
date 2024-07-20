'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from 'react';
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [username, setUsername] = useState<string>('');
  const [usernameMessage, setUsernameMessage] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          console.log(error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      if (response.data.success) {
        toast({
          title: "Account created",
          description: "We've created your account for you.",
          duration: 5000,
        });
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      console.log("Error signing up the user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const emsg = axiosError.response?.data.message ?? "Error signing up the user";
      toast({
        title: "Signup failed",
        description: emsg,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Mystery Message</h2>
          <p className="text-gray-600">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        debouncedUsername(e.target.value);
                      }}
                      className={`border ${usernameMessage ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200`}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500">Checking...</span>
                      <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    </div>
                  )}
                  <span className={`text-sm ${usernameMessage?.includes('available') ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email"
                      {...field}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="password"
                      {...field}
                      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : 'Sign Up'}
            </button>
          </form>
        </Form>
        <div className="text-center">
          <Link href="/(auth)/sign-in" legacyBehavior>
            <a className="text-blue-500 hover:text-blue-600">Already have an account? Sign in</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
