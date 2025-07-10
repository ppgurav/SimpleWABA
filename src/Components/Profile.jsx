import { useState, useEffect } from "react"
import { z } from "zod"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [apiError, setApiError] = useState("")


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")

        if (!accessToken) {
          console.error("No access token found")
          setIsLoadingUser(false)
          setApiError("No access token found. Please login again.")
          return
        }

        const response = await fetch(`${BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
         
          setFormData({
            fullName: data.name || "",
            email: data.email || "",
            phone: data.mobile || "",
          })
        } else {
          setApiError("Failed to fetch user profile")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setApiError("Failed to load user profile. Please try again.")
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMessage("")
    setApiError("")

    const result = profileSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
    } else {
      setErrors({})
      setSuccessMessage("Profile updated successfully!")
      console.log("Profile data:", formData)
      // Here you can add API call to update the profile
    }
  }

  if (isLoadingUser) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[-100px] left-[-150px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[200px] left-[300px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[500px] left-[100px]"></div>
      </div>

      <div className="relative bg-white p-10 rounded-2xl shadow-xl w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{formData.fullName || "User Profile"}</h2>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 outline-none"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Update Profile
          </button>

          {successMessage && <p className="text-green-600 text-center font-medium mt-3">{successMessage}</p>}
        </form>
      </div>
    </div>
  )
}
