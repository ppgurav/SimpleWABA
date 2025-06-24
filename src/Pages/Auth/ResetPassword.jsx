import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const passwordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().min(4, "OTP must be at least 4 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[@$!%*?&]/, "Must contain one special character"),
});

const ResetPassword = () => {
  const [step, setStep] = useState<1 | 2>(1); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });


  const sendOtpMutation = useMutation({
    mutationFn: async ({ email }) => {
      const response = await api.post("/auth/send-otp", { email });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent to email");
      setStep(2);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    },
  });


  const resetPasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successful!");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Reset failed");
    },
  });

  const onSubmit = (data) => {
    if (step === 1) {
      sendOtpMutation.mutate({ email: data.email });
    } else {
      resetPasswordMutation.mutate(data);
    }
  };

  const emailValue = watch("email");

  return (
    <div className="max-w-sm mx-auto my-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-center">
        {step === 1 ? "Request OTP" : "Reset Password"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your email"
            disabled={step === 2}
            defaultValue={emailValue}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">OTP</label>
              <input
                {...register("otp")}
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter OTP"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">New Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter new password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md"
          disabled={sendOtpMutation.isPending || resetPasswordMutation.isPending}
        >
          {step === 1
            ? sendOtpMutation.isPending
              ? "Sending OTP..."
              : "Send OTP"
            : resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
