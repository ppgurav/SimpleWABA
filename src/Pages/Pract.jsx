import { useMutation } from "@tanstack/react-query"
import { MessageCircle, Users, Megaphone, File, Pencil, Phone, Mail, Globe } from "lucide-react"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [timeFilter, setTimeFilter] = useState("today")

  const fetchMonthlyStats = async () => {
    const response = await fetch(
      "https://waba.mpocket.in/api/messages/monthly_stats/112272475088933?accessToken=Snna4WqD8SY38zo8E17q7ETGWaDQeo77tyrsqmuHevHhxKoS40R",
    )
    if (!response.ok) {
      throw new Error("Failed to fetch monthly stats")
    }
    return response.json()
  }

  const fetchUserProfile = async () => {
    try {
      const accessToken = sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
      if (!accessToken) {
        console.error("No access token found")
        throw new Error("No access token found. Please login again.")
      }

      const response = await fetch(`https://api.tickzap.com/api/phone-profile/361462453714220`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user profile")
      }
      return response.json()
    } catch (error) {
      console.error("Profile fetch error:", error)
      throw error
    }
  }

  const {
    mutate: mutateStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useMutation({
    mutationFn: fetchMonthlyStats,
    onSuccess: (data) => {
      setStats({
        totalMessages: data.data.total_messages,
        todayMessages: data.data.today_messages,
        totalSent: data.data.total_sent,
        activeSent: data.data.active_contacts,
        totalReceived: data.data.total_received,
        activeReceived: data.data.active_received,
        totalTemplates: data.data.total_templates,
        activeTemplates: data.data.active_templates,
        monthlyStats: data.data.monthly_stats || [],
      })
    },
  })

  const {
    mutate: mutateProfile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useMutation({
    mutationFn: fetchUserProfile,
    onSuccess: (data) => {
      if (data.success) {
        setUserProfile(data.data)
      }
    },
  })

  useEffect(() => {
    mutateStats()
    mutateProfile()
  }, [mutateStats, mutateProfile])

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter)
    mutateStats()
  }

  if ((isLoadingStats || !stats) && (isLoadingProfile || !userProfile)) {
    return <div className="text-center py-8">Loading statistics...</div>
  }

  if (statsError && profileError) {
    return <div className="text-center py-8 text-red-500">Error loading data. Please try again.</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex-1 px-4 sm:px-3 lg:px-6 py-20">
        <h2 className="text-3xl font-semibold mb-4 sm:w-full lg:w-full">
          Welcome Back, {userProfile?.verified_name || "Demo"} 👋
        </h2>
        <h1 className="text-sm font-sans mb-4">Here's what's happening with your WhatsApp business today.</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-4">
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg animate-pulse">
                <MessageCircle size={28} />
              </div>
              <h2 className="text-lg font-semibold">Total Messages</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.totalMessages || 0}</div>
            <hr className="my-4" />
            <div className="text-sm text-gray-700">Messages Today: {stats?.todayMessages || 0}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg animate-pulse">
                <Users size={28} />
              </div>
              <h2 className="text-lg font-semibold">Total Sent</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.totalSent || 0}</div>
            <hr className="my-4" />
            <div className="text-sm text-gray-700">Active Contacts: {stats?.activeSent || 0}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg animate-pulse">
                <Megaphone size={28} />
              </div>
              <h2 className="text-lg font-semibold">Total Received</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.totalReceived || 0}</div>
            <hr className="my-4" />
            <div className="text-sm text-gray-700">Active Received: {stats?.activeReceived || 0}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 text-orange-500 p-2 rounded-lg animate-pulse ">
                <File size={28} />
              </div>
              <h2 className="text-lg font-semibold">Total Templates</h2>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats?.totalTemplates || 0}</div>
            <hr className="my-4" />
            <div className="text-sm text-gray-700">Active Templates: {stats?.activeTemplates || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow mt-8 px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold">Message statistics</h2>
            <div className="flex flex-wrap gap-2 text-gray-600 text-sm font-medium">
              {["today", "yesterday", "this_week", "last_week", "month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleTimeFilterChange(filter)}
                  className={`hover:text-blue-600 ${timeFilter === filter ? "text-blue-600 font-bold" : ""}`}
                >
                  {filter.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {stats?.monthlyStats?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Read
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.monthlyStats.map((stat, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.sent}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.delivered}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.read}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No monthly statistics available</div>
            )}
          </div>
        </div>
      </div>

      <div className="w-[320px] bg-white shadow-md p-6 min-h-screen border-l mt-20 flex flex-col items-center rounded-2xl">
        {/* Account Overview Title and Edit Icon */}
        <div className="flex justify-between items-center w-full mb-6 px-2">
          <h2 className="text-lg font-bold mt-3">Account Overview</h2>
          <Pencil size={20} className="text-gray-500 cursor-pointer hover:text-blue-500" />
        </div>

        <img
          src={
            userProfile?.profile_picture_url ||
            "https://pps.whatsapp.net/v/t61.24694-24/427468236_498644819772812_8332225527870182080_n.jpg?ccb=11-4&oh=01_Q5Aa1wH1u7ImglHj_83UXlcauaij9brdl0ii_KxhQ-1hadrB7Q&oe=68640908&_nc_sid=5e03e0&_nc_cat=109"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover shadow-md mt-3"
        />

        {/* Overview Items */}
        <div className="space-y-4 w-full">
          <div className="bg-gray-50 p-5 rounded-lg shadow-lg mt-5">{userProfile?.verified_name || "Technfest"}</div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-lg flex items-center gap-2 mt-5">
            <Phone size={18} className="text-blue-500" />
            {userProfile?.display_phone_number || "Phone Contact Info"}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-lg flex items-center gap-2 mt-5">
            <Mail size={18} className="text-green-500" />
            {userProfile?.email || "Email Contact Info"}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-lg flex items-center gap-2 mt-5">
            <Globe size={18} className="text-purple-500" />
            {userProfile?.websites?.[0] || "Website / Location Info"}
          </div>

          <div className="bg-gray-50 p-5 rounded-lg shadow-lg mt-5">Address: {userProfile?.address || ""}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
