'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from 'react';
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password 
        });

        if (result?.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
        } else if (result?.url) {
            router.push(result.url);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Join Mystery Message</h2>
                    <p className="text-gray-600">Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
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
                            ) : 'Sign In'}
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
