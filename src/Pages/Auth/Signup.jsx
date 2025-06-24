import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { api } from "../../utils/api"

const signUpSchema = z.object({
  name: z.string().min(1, "Name should be entered").nonempty("Name is required"),
  user_type: z.string().min(1, "User type should be entered").nonempty("User type is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one small letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .nonempty("Password is required"),
  mobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number can't be more than 10 digits")
    .regex(/^[0-9]+$/, "Mobile number should only contain digits"),
})

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
      user_type: "reseller",
    },
  })

  const signUp = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/signup", data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Signup Successful")
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Sign up Failed"
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data) => {
    console.log("sign-up : ", data)
    signUp.mutate(data)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 px-4 relative ">
     {/* <div className="flex justify-center items-center min-h-screen px-6 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"> */}
     <div className="flex flex-col items-center mb-8">
          {/* <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2> */}
         
        </div>
    <div className="w-full  max-w-xl bg-white rounded-lg shadow-md px-6 py-8 sm:px-8 sm:py-10">
    <img
          src="/waba logo 18-04-2025 (1).svg"
          alt="Logo"
          className="w-full h-32 md:h-32 object-contain mx-auto"
        />
         {/* <p className="text-lg text-gray-900 ">Please create  your account</p> */}
        <p className="text-sm sm:text-xl font-serif text-center text-gray-700 mb-6">Please create  your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full p-2 sm:p-3 mt-1 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full p-2 sm:p-3 mt-1 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="text"
              {...register("mobile")}
              className={`w-full p-2 sm:p-3 mt-1 border rounded-md ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full p-2 sm:p-3 mt-1 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="user_type" className="block text-sm font-medium text-gray-600">
              User Type
            </label>
            <input
              id="user_type"
              type="text"
              {...register("user_type")}
              className={`w-full p-2 sm:p-3 mt-1 border rounded-md ${
                errors.user_type ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.user_type && <p className="text-red-500 text-xs mt-1">{errors.user_type.message}</p>}
          </div>
          <div className="mb-4 flex items-start">
  <input
    type="checkbox"
    id="agree"
    {...register("agree")}
    className="mt-1 mr-2"
  />
  <label htmlFor="agree" className="text-sm text-gray-600 select-none">
    I agree to the <a href="/signup" className="text-blue-500 hover:underline">terms </a> and <a href="/signup" className="text-blue-500 hover:underline"> conditions</a>
  </label>
</div>
{errors.agree && (
  <p className="text-red-500 text-xs mt-1">{errors.agree.message}</p>
)}


          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-md hover:bg-blue-600 transition-colors"
            disabled={signUp.isPending}
          >
            {signUp.isPending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                <span>Signing Up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-500 text-sm select-none">or sign up with</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Social buttons */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png"
            alt="Facebook"
            className="h-5 w-5"
          />
          <span className="text-gray-700 text-sm font-medium">Facebook</span>
        </button>

        <button
          type="button"
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
               <path fill="#fbc02d" d="M43.611 20.083h-1.611v-.083H24v8h11.3c-1.63 4.657-6.08 8-11.3 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.057 0 5.84 1.147 7.953 3.027l6.025-6.026C34.305 6.055 29.4 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.34-.138-2.652-.389-3.917z"/>
               <path fill="#e53935" d="M6.306 14.691l6.572 4.82C14.443 16.072 18.961 14 24 14c3.057 0 5.84 1.147 7.953 3.027l6.025-6.026C34.305 6.055 29.4 4 24 4c-7.723 0-14.41 4.392-17.694 10.691z"/>
              <path fill="#4caf50" d="M24 44c5.17 0 9.864-1.977 13.409-5.188l-6.188-5.206C28.538 35.79 26.376 36.5 24 36.5c-5.2 0-9.607-3.345-11.23-7.984l-6.516 5.025C9.537 40.092 16.25 44 24 44z"/>
              <path fill="#1565c0" d="M43.611 20.083h-1.611v-.083H24v8h11.3c-.732 2.09-2.11 3.86-3.882 5.1.002-.001.003-.002.005-.003l6.188 5.206C39.923 34.672 44 29.791 44 24c0-1.34-.138-2.652-.389-3.917z"/>
            </svg>
          <span className="text-gray-700 text-sm font-medium">Google</span>
        </button>
      </div>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
