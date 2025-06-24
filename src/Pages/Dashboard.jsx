
import { useMutation } from "@tanstack/react-query"
import { MessageCircle, Users, Megaphone, File } from "lucide-react"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const [stats, setStats] = useState(null) 

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

  const { mutate, isLoading, error } = useMutation({
    mutationFn: fetchMonthlyStats,
    
    onSuccess: (data) => {
      console.log("API data received:", data) 
      // console.log("Check total_messages:", data.data.total_messages)
      setStats({
        totalMessages: data.data.total_messages ,
        todayMessages: data.data.today_messages ,
        totalSent: data.data.total_sent ,
        activeSent: data.data.active_contacts ,
        totalReceived: data.data.total_received ,
        activeReceived: data.data.active_received ,
        totalTemplates: data.data.total_templates ,
        activeTemplates: data.data.active_templates ,
        monthlyStats: data.data.monthly_stats || [],
      })
    },
  })


  

  useEffect(() => {
    mutate()
  }, [mutate])

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter)
    mutate()
  }

  if (isLoading || !stats) {

    return <div className="text-center py-8">Loading statistics...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading data. Please try again.</div>
  }

  return (
    <div className="px-4 sm:px-0 lg:px-0 py-20">
      <h2 className="text-3xl font-semibold mb-4 sm:w-full lg:w-full">Welcome Back, Demo 👋</h2>
      <h1 className="text-sm font-sans mb-4">Here's what's happening with your WhatsApp business today.</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">

  <div
    className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    //eg- (transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer)this are effect card 
    onClick={() => console.log("Clicked Total Messages")}
  >
    <div className="flex items-center gap-4 mb-4">
    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg animate-pulse">
     <MessageCircle size={28} />
    </div>

      <h2 className="text-lg font-semibold">Total Messages</h2>
    </div>
    <div className="text-3xl font-bold text-gray-800">{stats.totalMessages}</div>
    <hr className="my-4" />
    <div className="text-sm text-gray-700">Messages Today: {stats.todayMessages}</div>
  </div>

  {/* Total Sent Card */}
  <div
    className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    onClick={() => console.log("Clicked Total Sent")}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-purple-100 text-purple-600 p-2 rounded-lg animate-pulse">
        <Users size={28} />
      </div>
      <h2 className="text-lg font-semibold">Total Sent</h2>
    </div>
    <div className="text-3xl font-bold text-gray-800">{stats.totalSent}</div>
    <hr className="my-4" />
    <div className="text-sm text-gray-700">Active Contacts: {stats.activeSent}</div>
  </div>

  {/* Total Received Card */}
  <div
    className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    onClick={() => console.log("Clicked Total Received")}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-green-100 text-green-600 p-2 rounded-lg animate-pulse">
        <Megaphone size={28} />
      </div>
      <h2 className="text-lg font-semibold">Total Received</h2>
    </div>
    <div className="text-3xl font-bold text-gray-800">{stats.totalReceived}</div>
    <hr className="my-4" />
    <div className="text-sm text-gray-700">Active Received: {stats.activeReceived}</div>
  </div>

  {/* Total Templates Card */}
  <div
    className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
    onClick={() => console.log("Clicked Total Templates")}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-orange-100 text-orange-500 p-2 rounded-lg animate-pulse ">
        <File size={28} />
      </div>
      <h2 className="text-lg font-semibold">Total Templates</h2>
    </div>
    <div className="text-3xl font-bold text-gray-800">{stats.totalTemplates}</div>
    <hr className="my-4" />
    <div className="text-sm text-gray-700">Active Templates: {stats.activeTemplates}</div>
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
          {stats.monthlyStats.length > 0 ? (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.month}
                      </td>
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
  )
}

export default Dashboard
