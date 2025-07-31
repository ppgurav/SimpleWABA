
// import { useMutation } from "@tanstack/react-query"
// import { MessageCircle, Users, Megaphone, File } from "lucide-react"
// import { useState, useEffect } from "react"

// const Dashboard = () => {
//   const [stats, setStats] = useState(null) 

//   const [timeFilter, setTimeFilter] = useState("today")

//   const fetchMonthlyStats = async () => {
//     const response = await fetch(
//       "https://waba.mpocket.in/api/messages/monthly_stats/112272475088933?accessToken=Snna4WqD8SY38zo8E17q7ETGWaDQeo77tyrsqmuHevHhxKoS40R",
//     )
//     if (!response.ok) {
//       throw new Error("Failed to fetch monthly stats")
//     }

//     return response.json()
//   }

//   const { mutate, isLoading, error } = useMutation({
//     mutationFn: fetchMonthlyStats,
    
//     onSuccess: (data) => {
//       console.log("API data received:", data) 
//       // console.log("Check total_messages:", data.data.total_messages)
//       setStats({
//         totalMessages: data.data.total_messages ,
//         todayMessages: data.data.today_messages ,
//         totalSent: data.data.total_sent ,
//         activeSent: data.data.active_contacts ,
//         totalReceived: data.data.total_received ,
//         activeReceived: data.data.active_received ,
//         totalTemplates: data.data.total_templates ,
//         activeTemplates: data.data.active_templates ,
//         monthlyStats: data.data.monthly_stats || [],
//       })
//     },
//   })


  

//   useEffect(() => {
//     mutate()
//   }, [mutate])

//   const handleTimeFilterChange = (filter) => {
//     setTimeFilter(filter)
//     mutate()
//   }

//   if (isLoading || !stats) {

//     return <div className="text-center py-8">Loading statistics...</div>
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">Error loading data. Please try again.</div>
//   }

//   return (
//     <div className="px-4 sm:px-0 lg:px-0 py-20">
//       <h2 className="text-3xl font-semibold mb-4 sm:w-full lg:w-full">Welcome Back, Demo 👋</h2>
//       <h1 className="text-sm font-sans mb-4">Here's what's happening with your WhatsApp business today.</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
//   {/* Total Messages Card */}
//   <div
//     className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
//     //eg- (transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer)this are effect card 
//     onClick={() => console.log("Clicked Total Messages")}
//   >
//     <div className="flex items-center gap-4 mb-4">
//     <div className="bg-blue-100 text-blue-600 p-2 rounded-lg animate-pulse">
//      <MessageCircle size={28} />
//     </div>

//       <h2 className="text-lg font-semibold">Total Messages</h2>
//     </div>
//     <div className="text-3xl font-bold text-gray-800">{stats.totalMessages}</div>
//     <hr className="my-4" />
//     <div className="text-sm text-gray-700">Messages Today: {stats.todayMessages}</div>
//   </div>

//   {/* Total Sent Card */}
//   <div
//     className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
//     onClick={() => console.log("Clicked Total Sent")}
//   >
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-purple-100 text-purple-600 p-2 rounded-lg animate-pulse">
//         <Users size={28} />
//       </div>
//       <h2 className="text-lg font-semibold">Total Sent</h2>
//     </div>
//     <div className="text-3xl font-bold text-gray-800">{stats.totalSent}</div>
//     <hr className="my-4" />
//     <div className="text-sm text-gray-700">Active Contacts: {stats.activeSent}</div>
//   </div>

//   {/* Total Received Card */}
//   <div
//     className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
//     onClick={() => console.log("Clicked Total Received")}
//   >
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-green-100 text-green-600 p-2 rounded-lg animate-pulse">
//         <Megaphone size={28} />
//       </div>
//       <h2 className="text-lg font-semibold">Total Received</h2>
//     </div>
//     <div className="text-3xl font-bold text-gray-800">{stats.totalReceived}</div>
//     <hr className="my-4" />
//     <div className="text-sm text-gray-700">Active Received: {stats.activeReceived}</div>
//   </div>

//   {/* Total Templates Card */}
//   <div
//     className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
//     onClick={() => console.log("Clicked Total Templates")}
//   >
//     <div className="flex items-center gap-4 mb-4">
//       <div className="bg-orange-100 text-orange-500 p-2 rounded-lg animate-pulse ">
//         <File size={28} />
//       </div>
//       <h2 className="text-lg font-semibold">Total Templates</h2>
//     </div>
//     <div className="text-3xl font-bold text-gray-800">{stats.totalTemplates}</div>
//     <hr className="my-4" />
//     <div className="text-sm text-gray-700">Active Templates: {stats.activeTemplates}</div>
//   </div>
// </div>
      


//       <div className="bg-white rounded-xl shadow mt-8 px-4 sm:px-6 py-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <h2 className="text-xl font-bold">Message statistics</h2>

//           <div className="flex flex-wrap gap-2 text-gray-600 text-sm font-medium">
//             {["today", "yesterday", "this_week", "last_week", "month"].map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => handleTimeFilterChange(filter)}
//                 className={`hover:text-blue-600 ${timeFilter === filter ? "text-blue-600 font-bold" : ""}`}
//               >
//                 {filter.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="mt-6">
//           {stats.monthlyStats.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Month
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Sent
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Delivered
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Read
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {stats.monthlyStats.map((stat, index) => (
//                     <tr key={index}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {stat.month}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.sent}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.delivered}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.read}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-4 text-gray-500">No monthly statistics available</div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard



import { useMutation } from "@tanstack/react-query"
import { MessageCircle, Users, Megaphone, File, Pencil, Phone, Mail, Globe } from "lucide-react"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [timeFilter, setTimeFilter] = useState("today")

  const BASE_URL = import.meta.env.VITE_API_BASE_URL

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
      const phoneNumbers = JSON.parse(localStorage.getItem("phone_numbers") || "[]")
      const phoneNumberId = phoneNumbers[0]?.phone_number_id
      // const phoneNumberId = localStorage.getItem("phone_number_id");
      const wabaId = sessionStorage.getItem("waba_id")
      const accessToken = sessionStorage.getItem("auth_token")
      if (!wabaId || !accessToken) {
        console.error("Missing waba_id or auth_token in sessionStorage")
        throw new Error("Missing authentication data")
      }
      const response = await fetch(`${BASE_URL}/api/phone-profile/361462453714220`, {
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
    return <div className="text-center py-8 px-4">Loading statistics...</div>
  }

  if (statsError && profileError) {
    return <div className="text-center py-8 px-4 text-red-500">Error loading data. Please try again.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-14">

      <div className="flex flex-col lg:flex-row">

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4 text-gray-800 leading-tight">
              Welcome Back, {userProfile?.verified_name || "Demo"} 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Here's what's happening with your WhatsApp business today...
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
 
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg animate-pulse">
                  <MessageCircle size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Messages</h3>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                {stats?.totalMessages || 0}
              </div>
              <hr className="border-gray-200" />
              <div className="text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                Messages Today: {stats?.todayMessages || 0}
              </div>
            </div>

            {/* Total Sent Card */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg animate-pulse">
                  <Users size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Sent</h3>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">{stats?.totalSent || 0}</div>
              <hr className="border-gray-200" />
              <div className="text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                Active Contacts: {stats?.activeSent || 0}
              </div>
            </div>

   
            <div className="bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg animate-pulse">
                  <Megaphone size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Received</h3>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                {stats?.totalReceived || 0}
              </div>
              <hr className="border-gray-200" />
              <div className="text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                Active Received: {stats?.activeReceived || 0}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-orange-100 text-orange-500 p-2 rounded-lg animate-pulse">
                  <File size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Total Templates</h3>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                {stats?.totalTemplates || 0}
              </div>
              <hr className="border-gray-200" />
              <div className="text-xs sm:text-sm text-gray-700 mt-3 sm:mt-4">
                Active Templates: {stats?.activeTemplates || 0}
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Message Statistics</h2>
              <div className="flex flex-wrap gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                {["today", "yesterday", "this_week", "last_week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleTimeFilterChange(filter)}
                    className={`px-3 py-1 rounded-full transition-colors duration-200 hover:text-blue-600 hover:bg-blue-50 ${
                      timeFilter === filter ? "text-blue-600 bg-blue-50 font-bold" : ""
                    }`}
                  >
                    {filter.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>


            <div className="overflow-x-auto -mx-4 sm:mx-0">
              {stats?.monthlyStats?.length > 0 ? (
                <div className="min-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sent
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivered
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Read
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.monthlyStats.map((stat, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stat.month}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.sent}</td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.delivered}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.read}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No monthly statistics available</div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 xl:w-96 bg-white shadow-lg lg:shadow-md p-4 sm:p-6 lg:min-h-screen lg:border-l border-gray-200 mt-4 lg:mt-0 mx-4 lg:mx-0 rounded-2xl lg:rounded-none lg:rounded-l-2xl">
     
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Account Overview</h2>
            <Pencil
              size={20}
              className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors duration-200"
            />
          </div>

  
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                // userProfile?.profile_picture_url ||
                    // "https://pps.whatsapp.net/v/t61.24694-24/427468236_498644819772812_8332225527870182080_n.jpg?ccb=11-4&oh=01_Q5Aa1wH1u7ImglHj_83UXlcauaij9brdl0ii_KxhQ-1hadrB7Q&oe=68640908&_nc_sid=5e03e0&_nc_cat=109" ||
                "file.jpeg"
              }
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border-4 border-white"
            />
          </div>


          <div className="space-y-4">
            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="font-medium text-gray-800">{userProfile?.verified_name || "Technfest"}</div>
            </div>

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
              <Phone size={18} className="text-blue-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base truncate">
                {userProfile?.display_phone_number || "Phone Contact Info"}
              </span>
            </div>

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
              <Mail size={18} className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base truncate">
                {userProfile?.email || "Email Contact Info"}
              </span>
            </div>

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
              <Globe size={18} className="text-purple-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm sm:text-base truncate">
                {userProfile?.websites || "Website / Location Info"}
              </span>
            </div>

            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-700 text-sm sm:text-base">
                <span className="font-medium">Address: </span>
                {userProfile?.address || "Not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
