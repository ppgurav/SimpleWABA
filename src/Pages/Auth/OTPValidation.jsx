import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query"; 
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { api } from "../../utils/api";
import { LoaderPinwheel } from "lucide-react";


const otpValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(4, "OTP must be 4 digits").regex(/^\d{4}$/, "OTP must be numeric"),
});

const OTPValidation = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(otpValidationSchema),
  });


  const mutation = useMutation({
    mutationFn: async(data) => {
     const response = await api.post("/auth/otp-validate", data);
     return response.data
    },
    onSuccess: (data) => {
 
      toast.success(data?.message || "OTP Verification successful")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const onSubmit = (data) => {
    console.log("otp  : ", data);
    mutation.mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-center">Validate OTP</h2>

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


        <div className="mb-4">
          <label className="block text-sm font-medium">OTP</label>
          <input
            {...register("otp")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your 4-digit OTP"
          />
          {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
        </div>




<button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <LoaderPinwheel className="animate-spin" />
                ) : (
                 'Validate OTP'
                  
                )}
               
              </button>
      </form>
    </div>
  );
};

export default OTPValidation;
