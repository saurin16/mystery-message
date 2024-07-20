'use client'
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"; // Importing useRouter from 'next/navigation' for Server Components
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/verify-code', {
        username: router.query.username as string, // Accessing username from router.query
        code: data.code
      });
      toast({
        title: "Account verified",
        description: "Your account has been verified. You can now login."
      });
      router.replace('/(auth)/sign-in'); // Adjust the route as per your application's routing
    } catch (error) {
      console.log("Error verifying the account", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const emsg = axiosError.response?.data.message ?? "Error verifying the account";
      toast({
        title: "Verification failed",
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
          <h2 className="text-3xl font-bold text-gray-900">Verify your Account</h2>
          <p className="text-gray-600">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Verification code"
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
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
