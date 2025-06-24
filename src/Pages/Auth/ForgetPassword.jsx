import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";  
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "../../utils/api";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";
import { LoaderPinwheel } from "lucide-react";


const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const ForgetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate()


  const mutation = useMutation({
   
    mutationFn: async (data) => {
    const response = await api.post("/auth/forgot-password", data);
    return  response.data
    },

    onSuccess: (data) => {
          toast.success(data?.message || "Email send successful")
    navigate("/otp-validate", {replace: true})
        },
    onError: (error) => {
      toast.error(error?.response?.data?.message )
  },
})

  const onSubmit = (data) => {
    console.log("forget : ", data);
    
    mutation.mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
      
        <>
        
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <LoaderPinwheel className="animate-spin" />
                ) : (
                 'Send Reset Link'
                  
                )}
               
              </button>
          </form>
        </>
      
    </div>
  );
};

export default ForgetPassword;
