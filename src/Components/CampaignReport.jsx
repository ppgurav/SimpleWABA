import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"


function CampaignReport() {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const accessToken =
        sessionStorage.getItem("auth_token") ||
        "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7" // Use a real token in production

      const response = await axios.get(`https://waba.mpocket.in/api/campaign/report/${id}?accessToken=Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    },
  })

  if (isLoading) return <div className="p-6">Loading report...</div>
  if (error) return <div className="p-6 text-red-500">Failed to load campaign report.</div>

  const campaign = data?.campaign || {}

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">

    </div>
  )
}

export default CampaignReport
