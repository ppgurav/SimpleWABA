// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { Link, useNavigate } from "react-router-dom"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import toast from "react-hot-toast"
// import axios from "axios"

// const BASE_URL = import.meta.env.VITE_API_BASE_URL

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address").nonempty("Email is required"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(/[a-z]/, "Password must contain at least one small letter")
//     .regex(/[0-9]/, "Password must contain at least one number")
//     .nonempty("Password is required"),
// })

// const setCookie = (name, value, days) => {
//   const expires = new Date()
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
// }

// const storeAuthData = (data, rememberMe) => {
//   const { token, jwtToken, user_id, user_type, waba_id, phone_number_id } = data

//   sessionStorage.setItem("auth_token", token)
//   sessionStorage.setItem("jwt", jwtToken)
//   sessionStorage.setItem("user_id", user_id)
//   sessionStorage.setItem("user_type", user_type)
//   sessionStorage.setItem("waba_id", waba_id)
//   sessionStorage.setItem("phone_number_id", phone_number_id)

//   if (rememberMe) {
//     setCookie("auth_token", token, 30)
//     setCookie("jwt", jwtToken, 30)
//     setCookie("user_id", user_id, 30)
//     setCookie("user_type", user_type, 30)
//     setCookie("waba_id", waba_id, 30)
//     setCookie("phone_number_id", phone_number_id, 30)
//   }
// }

// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: zodResolver(loginSchema) })

//   const [rememberMe, setRememberMe] = useState(false)
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()

//   const login = useMutation({
//     mutationFn: async (formData) => {
//       const response = await axios.post(`${BASE_URL}/api/users/login`, {
//         email: formData.email,
//         password: formData.password,
//       })
//       return response.data
//     },
//     // onSuccess: (data) => {
//     //   if (!sessionStorage.getItem("auth_token")) {
//     //     storeAuthData(data, rememberMe)
//     //     queryClient.invalidateQueries(["authUser"])
//     //     toast.success("Login successful")
//     //     navigate("/dashboard", { replace: true })
//     //   }
//     onSuccess: (data) => {
//       storeAuthData(data, rememberMe)
//       queryClient.invalidateQueries(["authUser"])
//       toast.success("Login successful")
//       navigate("/dashboard", { replace: true })
    
    
//     },

//     onError: (error) => {
//       const message = error?.response?.data?.message || "Login failed"
//       toast.error(message)
//     },
//   })

//   const onSubmit = (data) => {
//     login.mutate(data)
//   }

  
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 relative ">

//       <div className="mb-6 text-center">
//         {/* <img
//           src="/waba logo 18-04-2025 (1).svg"
//           alt="Logo"
//           className="w-auto h-24 md:h-32 object-contain mx-auto"
//         /> */}
//       </div>


//       <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl border border-gray-200 relative">

//         <div className="flex flex-col items-center mb-8">
//         <img
//           src="/waba logo 18-04-2025 (1).svg"
//           alt="Logo"
//           className="w-full h-32 md:h-32 object-contain mx-auto"
//         />
//           {/* <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2> */}
//           <p className="text-sm text-gray-500 ">Please sign in to your account</p>
//         </div>


//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//           <div>
//             <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               {...register("email")}
//               className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 transition ${
//                 errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//             )}
//           </div>


//           <div>
//             <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               {...register("password")}
//               className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 transition ${
//                 errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
//               }`}
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//             )}
//           </div>


//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="rememberMe"
//               checked={rememberMe}
//               onChange={() => setRememberMe(!rememberMe)}
//               className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
//             />
//             <label htmlFor="rememberMe" className="text-sm text-gray-700">
//               Remember Me
//             </label>
//           </div>


//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
//             disabled={login.isLoading}
//           >
//             {login.isLoading ? "Logging in..." : "Login"}
//           </button>


//           <div className="text-right mt-2">
//             <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>


//           <div className="flex items-center my-4">
//             <hr className="flex-grow border-gray-300" />
//             <span className="mx-3 text-gray-500 text-sm">Or continue with</span>
//             <hr className="flex-grow border-gray-300" />
//           </div>


//           <div className="flex gap-4 justify-center">
//             <button
//               type="button"
//               className="flex items-center justify-center w-full bg-white  hover:bg-gray-100  text-gray-500 font-medium py-3 rounded-xl shadow-md transition gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
//              <path fill="#1877F2" d="M16 0C7.164 0 0 7.163 0 16c0 7.732 5.479 14.132 12.656 15.717V20.653H9.058v-4.653h3.598v-3.542c0-3.562 2.112-5.53 5.34-5.53 1.549 0 3.167.277 3.167.277v3.49h-1.785c-1.76 0-2.31 1.09-2.31 2.208v2.638h3.933l-.629 4.653h-3.304v11.064C26.522 30.13 32 23.732 32 16c0-8.837-7.163-16-16-16z"/>
//              </svg>
//              {/* <img src="/facebook.svg" alt="Facebook" className="h-5 w-5 mr-2" /> */}
//               Facebook
//             </button>

//             <button
//               type="button"
//               className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 rounded-xl shadow-md transition gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
//                <path fill="#fbc02d" d="M43.611 20.083h-1.611v-.083H24v8h11.3c-1.63 4.657-6.08 8-11.3 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.057 0 5.84 1.147 7.953 3.027l6.025-6.026C34.305 6.055 29.4 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.34-.138-2.652-.389-3.917z"/>
//                <path fill="#e53935" d="M6.306 14.691l6.572 4.82C14.443 16.072 18.961 14 24 14c3.057 0 5.84 1.147 7.953 3.027l6.025-6.026C34.305 6.055 29.4 4 24 4c-7.723 0-14.41 4.392-17.694 10.691z"/>
//               <path fill="#4caf50" d="M24 44c5.17 0 9.864-1.977 13.409-5.188l-6.188-5.206C28.538 35.79 26.376 36.5 24 36.5c-5.2 0-9.607-3.345-11.23-7.984l-6.516 5.025C9.537 40.092 16.25 44 24 44z"/>
//               <path fill="#1565c0" d="M43.611 20.083h-1.611v-.083H24v8h11.3c-.732 2.09-2.11 3.86-3.882 5.1.002-.001.003-.002.005-.003l6.188 5.206C39.923 34.672 44 29.791 44 24c0-1.34-.138-2.652-.389-3.917z"/>
//             </svg>

//               {/* <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2" /> */}
//               Google
//             </button>
//           </div>

  
//           <div className="text-center mt-6 text-sm">
//             <span className="text-gray-600">Don't have an account?</span>
//             <Link to="/signup" className="text-indigo-600 hover:underline ml-1 font-medium">
//               Sign Up
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Login

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one small letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    .nonempty("Password is required"),
});

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const storeAuthData = (data, rememberMe) => {
  const { token, jwtToken, user_id, user_type, waba_id, phone_number_id } = data;

  sessionStorage.setItem("auth_token", token);
  sessionStorage.setItem("jwt", jwtToken);
  sessionStorage.setItem("user_id", user_id);
  sessionStorage.setItem("user_type", user_type);
  sessionStorage.setItem("waba_id", waba_id);
  sessionStorage.setItem("phone_number_id", phone_number_id);

  if (rememberMe) {
    setCookie("auth_token", token, 30);
    setCookie("jwt", jwtToken, 30);
    setCookie("user_id", user_id, 30);
    setCookie("user_type", user_type, 30);
    setCookie("waba_id", waba_id, 30);
    setCookie("phone_number_id", phone_number_id, 30);
  }
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      storeAuthData(data, rememberMe);
      queryClient.invalidateQueries(["authUser"]);
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    login.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4">
      <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/waba logo 18-04-2025 (1).svg"
            alt="Logo"
            className="w-full h-32 md:h-32 object-contain mx-auto"
          />
          <p className="text-sm text-gray-500 ">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 transition ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 transition ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition"
            disabled={login.isLoading}
          >
            {login.isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to="/signup" className="text-indigo-600 hover:underline ml-1 font-medium">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
