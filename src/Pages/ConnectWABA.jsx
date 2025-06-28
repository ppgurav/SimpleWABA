import { Heart, Key, Lock, Phone, Laptop, Camera, LayoutGrid, AlertCircle, Loader } from "lucide-react"
import { useState, useEffect } from "react"

function ConnectWABA() {
  const [showScanner, setShowScanner] = useState(false)
  const [wabaData, setWabaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrError, setQrError] = useState(null)

  useEffect(() => {
    const fetchWabaDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://waba.mpocket.in/api/waba/details?accessToken=Snna4WqD8SY38zo8E17q7ETGWaDQeo77tyrsqmuHevHhxKoS40R",
        )

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        setWabaData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching WABA details:", err)
        setError(err.message || "Failed to fetch WABA details")
      } finally {
        setLoading(false)
      }
    }

    fetchWabaDetails()
  }, [])

  const generateQRCode = async () => {
    try {
      setQrLoading(true);
      setQrError(null);
  
      // Get values from sessionStorage
      const phoneNumberId = sessionStorage.getItem("phone_number_id") || "YOUR_PHONE_NUMBER_ID";
      const accessToken = sessionStorage.getItem("token") || "YOUR_ACCESS_TOKEN";
  
      const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/message_qrdls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefilled_message: "Hello! I'd like to connect with you on WhatsApp.",
          generate_qr_image: "PNG",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`QR Code generation failed with status ${response.status}`);
      }
  
      const qrData = await response.json();
      setQrCodeUrl(qrData.qr_image_url || qrData.qr_code);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setQrError(err.message || "Failed to generate QR code");
    } finally {
      setQrLoading(false);
    }
  };
  
  return (
    <div className="w-full px-2 sm:px-0 md:px-0 py-20 mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-semibold">WhatsApp Business Account</h1>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Camera size={20} />
          </button>
          <button
            onClick={() => {
              setShowScanner(true)
              generateQRCode()
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <LayoutGrid size={20} />
            Click to get QR Code
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="w-full flex justify-center items-center py-20">
          <Loader size={40} className="animate-spin text-indigo-600" />
          <span className="ml-3 text-lg">Loading WABA details...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle size={24} className="text-red-500 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">Error loading data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl relative">
            <button
              onClick={() => {
                setShowScanner(false)
                setQrCodeUrl(null)
                setQrError(null)
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <h1 className="text-black text-xl font-bold mb-4">Scan QR Code to Start Chat</h1>
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              {qrLoading ? (
                <div className="flex flex-col items-center">
                  <Loader size={40} className="animate-spin text-indigo-600 mb-4" />
                  <p className="text-gray-600">Generating QR Code...</p>
                </div>
              ) : qrError ? (
                <div className="flex flex-col items-center text-center p-4">
                  <AlertCircle size={40} className="text-red-500 mb-4" />
                  <p className="text-red-600 mb-4">{qrError}</p>
                  <button
                    onClick={generateQRCode}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : qrCodeUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="WhatsApp QR Code"
                    className="max-w-xs max-h-80 rounded-lg shadow-lg mb-4"
                    crossOrigin="anonymous"
                  />
                  <p className="text-gray-600 text-center">Scan this QR code with WhatsApp to start a conversation</p>
                </div>
              ) : (
                <div className="bg-indigo-600 p-4 rounded-xl shadow-lg w-full max-w-2xl text-center">
                  <h1 className="text-white text-sm">
                    You can use the following QR Codes to invite people on this platform.
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && wabaData && (
        <>
          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Access Token */}
            <InfoCard icon={<Key size={28} />} title="Access Token Information" iconBg="bg-blue-100 text-blue-600">
              <InfoRow label="Access Token" value={wabaData.accessToken || "Not available"} restricted />
              <InfoRow label="Permission scopes" value={wabaData.permissionScopes?.join(", ") || "Not available"} />
              <InfoRow
                label="Issued at"
                value={wabaData.issuedAt ? new Date(wabaData.issuedAt).toLocaleString() : "Not available"}
              />
              <InfoRow label="Webhook URL" value={wabaData.webhookUrl || "Not available"} restricted />
            </InfoCard>

            {/* Phone Info */}
            <InfoCard
              icon={<Phone size={28} />}
              title="Phone"
              subtitle={wabaData.phone?.displayName || "Default phone number"}
              iconBg="bg-indigo-700 text-white"
            >
              <InfoPair
                label1="Display Phone Number"
                value1={wabaData.phone?.displayNumber || "Not available"}
                label2="Quality"
                value2={wabaData.phone?.quality || "Standard"}
              />
              <InfoPair
                label1="Verified Name"
                value1={wabaData.phone?.verifiedName || "Not available"}
                label2="Message Limit"
                value2={wabaData.phone?.messageLimit || "Standard"}
              />
              <InfoRow label="Number ID" value={wabaData.phone?.numberId || "Not available"} restricted />
            </InfoCard>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <StatusCard
              title="Overall Health"
              icon={<Heart size={20} />}
              iconBg="bg-purple-700 text-white"
              subtitle={`Last checked: ${wabaData.lastChecked ? new Date(wabaData.lastChecked).toLocaleString() : "Unknown"}`}
              status={wabaData.overallHealth?.status || "Unknown"}
            />
            <StatusCard
              title="WABA"
              icon={<Laptop size={20} />}
              iconBg="bg-blue-500 text-white"
              restricted={!wabaData.waba}
              status={wabaData.waba?.status || "Unknown"}
            />
          </div>

          {/* Business & App */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <StatusCard
              title="BUSINESS"
              icon={<Laptop size={20} />}
              iconBg="bg-blue-500 text-white"
              restricted={!wabaData.business}
              status={wabaData.business?.status || "Unknown"}
            />
            <StatusCard
              title="APP"
              icon={<Laptop size={20} />}
              iconBg="bg-blue-500 text-white"
              restricted={!wabaData.app}
              status={wabaData.app?.status || "Unknown"}
            />
          </div>
        </>
      )}
    </div>
  )
}

function InfoCard({ icon, title, subtitle, children, iconBg }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <div className="flex items-center gap-4 mb-2">
        <div className={`${iconBg} p-2 rounded-md`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <hr className="my-4" />
      {children}
    </div>
  )
}

function InfoRow({ label, value, restricted = false }) {
  return (
    <>
      <div className="text-sm text-gray-700 mb-1">{label}</div>
      <div className={`flex items-center ${restricted ? "text-red-600" : "text-gray-500"} space-x-2`}>
        {restricted ? <Lock size={20} /> : null}
        <span>{restricted ? "Not allowed to view." : value || "Information available"}</span>
      </div>
      <hr className="my-4" />
    </>
  )
}

function InfoPair({ label1, value1, label2, value2 }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-700">{label1}</div>
          <div className="text-gray-500">{value1 || "Not available"}</div>
        </div>
        <div>
          <div className="text-gray-700">{label2}</div>
          <div className="text-gray-500">{value2 || "Not available"}</div>
        </div>
      </div>
      <hr className="my-4" />
    </>
  )
}

function StatusCard({ title, subtitle, icon, iconBg, restricted = false, status }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
      case "active":
      case "healthy":
        return "text-green-600 bg-green-100"
      case "warning":
      case "limited":
        return "text-yellow-600 bg-yellow-100"
      case "error":
      case "unavailable":
      case "inactive":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <div className="flex items-center gap-4 mb-2">
        <div className={`${iconBg} p-2 rounded-md`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {restricted ? (
            <p className="text-sm text-red-600">Not Allowed to view</p>
          ) : (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      <hr className="my-4" />
      {!restricted && (
        <div className="flex justify-between text-sm">
          <span>Can Send Message</span>
          <span className={`${getStatusColor(status)} px-2 py-0.5 rounded`}>{status || "Unknown"}</span>
        </div>
      )}
    </div>
  )
}

export default ConnectWABA
