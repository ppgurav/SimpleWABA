// import {
//   Mic,
//   Menu,
//   X,
//   Info,
//   Plus,
//   Phone,
//   Calendar,
//   MessageSquareTextIcon,
//   Clock,
//   Download,
//   Share2,
//   FileMinus,
//   Music,
//   Video,
//   MapPin,
//   List,
//   Contact,
//   Text,
// } from "lucide-react"
// import { useState, useEffect, useRef } from "react"
// import { Link } from "react-router-dom"
// import axios from "axios"

// const BASE_URL = "https://waba.mpocket.in"

// const MessageType = {
//   TEXT: "text",
//   TEXT_WITH_BUTTON: "text_with_button",
//   IMAGE: "image",
//   DOCUMENT: "document",
//   AUDIO: "audio",
//   VIDEO: "video",
//   CONTACT: "contact",
//   LIST: "list",
//   LOCATION: "location",
//   STICKER: "sticker",
//   REACTION: "reaction",
//   musicUrl: "Music",
//   TEMPLATE: "template",
//   INTERACTIVE: "interactive",
// }

// // Date helper functions
// const isToday = (date) => {
//   const today = new Date()
//   const messageDate = new Date(date)
//   return (
//     messageDate.getDate() === today.getDate() &&
//     messageDate.getMonth() === today.getMonth() &&
//     messageDate.getFullYear() === today.getFullYear()
//   )
// }

// const isYesterday = (date) => {
//   const yesterday = new Date()
//   yesterday.setDate(yesterday.getDate() - 1)
//   const messageDate = new Date(date)
//   return (
//     messageDate.getDate() === yesterday.getDate() &&
//     messageDate.getMonth() === yesterday.getMonth() &&
//     messageDate.getFullYear() === yesterday.getFullYear()
//   )
// }

// // New function to format remaining time as date
// const formatRemainingTime = (dateString) => {
//   if (!dateString) return "No recent activity"
//   try {
//     const date = new Date(dateString)
//     // Check if it's yesterday
//     if (isYesterday(date)) {
//       return "Yesterday"
//     }
//     // Check if it's today
//     if (isToday(date)) {
//       return "Today"
//     }
//     // Format as "Wed, 04 Jun 2025"
//     const options = {
//       weekday: "short",
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }
//     return date.toLocaleDateString("en-GB", options)
//   } catch (error) {
//     return "Invalid date"
//   }
// }

// const formatDateLabel = (date) => {
//   const messageDate = new Date(date)
//   if (isToday(messageDate)) {
//     return "Today"
//   }
//   if (isYesterday(messageDate)) {
//     return "Yesterday"
//   }
//   // Format as "Wed, 04 Jul 2025"
//   const options = {
//     weekday: "short",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }
//   return messageDate.toLocaleDateString("en-GB", options)
// }

// const getMessageDate = (timestamp) => {
//   try {
//     // Handle both timestamp formats
//     let date
//     if (typeof timestamp === "string" && timestamp.includes(":")) {
//       // If it's already a time string like "10:30 AM", use current date
//       date = new Date()
//     } else {
//       // If it's a unix timestamp
//       date = new Date(Number.parseInt(timestamp) * 1000)
//     }
//     // Return date string in YYYY-MM-DD format for grouping
//     return date.toDateString()
//   } catch (error) {
//     return new Date().toDateString()
//   }
// }

// const groupMessagesByDate = (messages) => {
//   const groups = {}
//   messages.forEach((message, index) => {
//     const dateKey = getMessageDate(message.timestamp)
//     if (!groups[dateKey]) {
//       groups[dateKey] = []
//     }
//     groups[dateKey].push({ ...message, originalIndex: index })
//   })
//   return groups
// }

// // Date separator component
// const DateSeparator = ({ date }) => (
//   <div className="flex items-center justify-center my-4">
//     <div className="bg-white px-3 py-1 rounded-full shadow-sm border text-xs text-gray-600 font-medium">
//       {formatDateLabel(date)}
//     </div>
//   </div>
// )

// const formatText = (text, messageType = "text") => {
//   if (!text) return ""
//   let formattedText = text.toString()
//   formattedText = formattedText
//     // Bold: *text* -> <strong>text</strong>
//     .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
//     // Italic: _text_ -> <em>text</em>
//     .replace(/_([^_\n]+)_/g, "<em>$1</em>")
//     // Strikethrough: ~text~ -> <del>text</del>')
//     .replace(/~([^~\n]+)~/g, "<del>$1</del>")
//     // Monospace: `text` -> <code>text</code>
//     .replace(
//       /`([^`\n]+)`/g,
//       '<code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>',
//     )
//     .replace(/\n/g, "<br>")
//     .replace(/\\\*/g, "*")
//     .replace(/\\_/g, "_")
//     .replace(/\\~/g, "~")
//     .replace(/\\`/g, "`")
//   return formattedText
// }

// const TextMessage = ({ message, position }) => (
//   <div
//     className={`${position === "right" ? "bg-gradient-to-br from-gray-50 to-gray-300  shadow-lg border border-gray-300" : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"} p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative`}
//   >
//     <div
//       dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
//       className="whitespace-pre-wrap break-words"
//     />
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const TextWithButtonMessage = ({ message }) => (
//   <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
//     <div
//       className="mb-2 whitespace-pre-wrap break-words"
//       dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
//     />
//     <a
//       href={message.buttonAction}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm flex items-center justify-center w-fit"
//     >
//       <Share2 size={14} className="mr-1" />
//       {message.buttonText}
//     </a>
//     {message.timestamp && <div className="text-xs text-gray-00 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const ImageMessage = ({ message, position }) => (
//   <div
//     className={`${position === "right" ? "bg-gradient-to-br from-gray-50 to-gray-300  shadow-lg border border-gray-300" : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"} p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative`}
//   >
//     <img
//       src={message.imageUrl || "/placeholder.svg?height=240&width=240"}
//       alt={message.caption || "Shared image"}
//       className="rounded-md mb-2 w-60 h-60 object-cover"
//     />
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "image") }}
//         className="text-sm text-gray-600 whitespace-pre-wrap break-words"
//       />
//     )}
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const DocumentMessage = ({ message, position }) => (
//   <div
//     className={`${position === "right" ? "bg-gradient-to-br from-gray-50 to-gray-300  shadow-lg border border-gray-300" : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"} p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative`}
//   >
//     <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
//       <div className=" p-2 rounded-md mr-2">
//         <FileMinus size={20} className="text-blue-600" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">{message.documentName}</p>
//         <p className="text-xs text-gray-500">{message.documentSize}</p>
//       </div>
//       <Link
//         to={message.documentUrl}
//         className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
//         download
//       >
//         <Download size={18} />
//       </Link>
//     </div>
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "document") }}
//         className="text-sm text-gray-600 whitespace-pre-wrap break-words"
//       />
//     )}
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const AudioMessage = ({ message, position }) => (
//   <div className="p-3 md:p-0 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
//     <div
//       className={`${position === "right" ? "bg-gradient-to-br from-gray-50 to-gray-300  shadow-lg border border-gray-300" : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"} p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative`}
//     >
//       <div className="bg-white p-2 rounded-md mr-2">
//         <Music size={20} className="text-pink-500" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">{message.audioName || "Audio file"}</p>
//         <p className="text-xs text-gray-500">{message.audioSize || "Unknown size"}</p>
//       </div>
//       <Link to={message.audioUrl || "#"} className="text-gray-500 border-gray-500 hover:text-blue-700 p-3" download>
//         <Download size={18} />
//       </Link>
//     </div>
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "audio") }}
//         className="text-sm text-gray-600 whitespace-pre-wrap break-words"
//       />
//     )}
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const TemplateMessage = ({ message, position }) => (
//   <div
//     className={`${position === "right" ? "bg-gradient-to-br from-gray-50 to-gray-300  shadow-lg border border-gray-300" : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"} p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative`}
//   >
//     {/* Show header image if exists */}
//     {message.headerImage && (
//       <img src={message.headerImage || "/placeholder.svg"} alt="Header" className="w-full object-cover" />
//     )}
//     <div className="p-3">
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.bodyText, "template") }}
//         className="text-sm whitespace-pre-wrap break-words"
//       />
//     </div>
//     {message.timestamp && (
//       <div className="text-xs text-gray-500 mt-1 text-right">
//         {new Date(+message.timestamp * 1000).toLocaleString()}
//       </div>
//     )}
//   </div>
// )

// const VideoMessage = ({ message }) => (
//   <div className="border bg-white p-2 md:p-3 rounded-xl self-start inline-flex flex-col relative">
//     <video src={message.videoUrl || "#"} controls className="rounded-md mb-2 w-60 max-h-60 object-cover">
//       Your browser does not support the video tag.
//     </video>
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "video") }}
//         className="text-sm text-gray-600 whitespace-pre-wrap break-words"
//       />
//     )}
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const ContactMessage = ({ message }) => (
//   <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
//     <div className="bg-gray-100 border border-gray-200 rounded-md p-3 mb-2">
//       <div className="flex items-center mb-2">
//         <div className="bg-blue-100 p-2 rounded-full mr-2">
//           <Contact size={20} className="text-blue-600" />
//         </div>
//         <div className="font-medium" dangerouslySetInnerHTML={{ __html: formatText(message.contactName, "contact") }} />
//       </div>
//       <div className="space-y-1 text-sm">
//         <div className="flex items-center">
//           <span dangerouslySetInnerHTML={{ __html: formatText(message.contactPhone, "contact") }} />
//         </div>
//         {message.contactEmail && (
//           <div className="flex items-center">
//             <MessageSquareTextIcon size={14} className="text-gray-500 mr-2" />
//             <span dangerouslySetInnerHTML={{ __html: formatText(message.contactEmail, "contact") }} />
//           </div>
//         )}
//         {message.contactAddress && (
//           <div className="flex items-center">
//             <MapPin size={14} className="text-gray-500 mr-2" />
//             <span dangerouslySetInnerHTML={{ __html: formatText(message.contactAddress, "contact") }} />
//           </div>
//         )}
//       </div>
//     </div>
//     <div className="mt-0 flex justify-end space-x-4">
//       <button className="text-black text-sm px-3 py-1.5 hover:bg-gray-100 rounded-md">Save Contact</button>
//       <div className="w-px h-5 bg-gray-300"></div>
//       <button className="text-black text-sm px-3 py-1.5 hover:bg-gray-100 rounded-md">Message</button>
//     </div>
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const ListMessage = ({ message }) => (
//   <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
//     <div className="mb-2 font-medium" dangerouslySetInnerHTML={{ __html: formatText(message.title, "text") }} />
//     <div
//       className="text-sm text-gray-600 mb-3 whitespace-pre-wrap break-words"
//       dangerouslySetInnerHTML={{ __html: formatText(message.description, "text") }}
//     />
//     <div className="bg-gray-100 rounded-md overflow-hidden mb-3">
//       {message.items &&
//         message.items.map((item) => (
//           <div key={item.id} className="p-3 border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
//             <div className="font-medium" dangerouslySetInnerHTML={{ __html: formatText(item.title, "text") }} />
//             <div
//               className="text-sm text-gray-600 whitespace-pre-wrap break-words"
//               dangerouslySetInnerHTML={{ __html: formatText(item.description, "text") }}
//             />
//           </div>
//         ))}
//     </div>
//     <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm flex items-center self-center">
//       <List size={14} className="mr-1" />
//       {message.buttonText}
//     </button>
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const LocationMessage = ({ message }) => (
//   <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
//     <div className="relative mb-2">
//       <div className="bg-gray-200 w-60 h-40 rounded-md flex items-center justify-center overflow-hidden">
//         <img
//           src={`https://maps.googleapis.com/maps/api/staticmap?center=${message.latitude},${message.longitude}&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7C${message.latitude},${message.longitude}`}
//           alt="Map location"
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.onerror = null
//             e.target.src = "/placeholder.svg?height=150&width=250"
//           }}
//         />
//       </div>
//       <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
//         <MapPin size={16} className="text-red-500" />
//       </div>
//     </div>
//     <div className="flex items-center mb-1">
//       <MapPin size={16} className="text-gray-500 mr-1" />
//       <span className="text-sm font-medium">{message.locationName}</span>
//     </div>
//     <div className="text-xs text-gray-500">
//       {message.latitude.toFixed(4)}, {message.longitude.toFixed(4)}
//     </div>
//     <div className="mt-2 flex justify-end">
//       <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md text-xs flex items-center">
//         <MapPin size={12} className="mr-1" />
//         Open in Maps
//       </button>
//     </div>
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const StickerMessage = ({ message }) => (
//   <div className="inline-block relative">
//     <img
//       src={message.stickerUrl || "/placeholder.svg?height=128&width=128"}
//       alt="Sticker"
//       className={`w-32 h-32 object-contain ${message.isAnimated ? "animate-pulse" : ""}`}
//     />
//     {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//   </div>
// )

// const ReactionMessage = ({ message, userList }) => {
//   const originalMessage = { text: "Original message" }
//   return (
//     <div className="bg-gray-100 border p-2 rounded-xl max-w-xs md:max-w-sm self-start flex items-center relative">
//       <div className="bg-white p-1 rounded-full mr-2">
//         <span className="text-xl">{message.emoji}</span>
//       </div>
//       <div className="text-sm text-gray-600">
//         Reacted with {message.emoji} to "{originalMessage.text}"
//       </div>
//       {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
//     </div>
//   )
// }

// // Message renderer component - SWAPPED LOGIC HERE
// const MessageRenderer = ({ message, position = "left", userList }) => {
//   const Component = (() => {
//     switch (message.type) {
//       case MessageType.TEXT_WITH_BUTTON:
//         return TextWithButtonMessage
//       case MessageType.IMAGE:
//         return ImageMessage
//       case MessageType.DOCUMENT:
//         return DocumentMessage
//       case MessageType.AUDIO:
//         return AudioMessage
//       case MessageType.VIDEO:
//         return VideoMessage
//       case MessageType.CONTACT:
//         return ContactMessage
//       case MessageType.LIST:
//         return ListMessage
//       case MessageType.LOCATION:
//         return LocationMessage
//       case MessageType.STICKER:
//         return StickerMessage
//       case MessageType.TEMPLATE:
//         return TemplateMessage
//       case MessageType.REACTION:
//         return (props) => <ReactionMessage {...props} userList={userList} />
//       case MessageType.TEXT:
//       default:
//         return TextMessage
//     }
//   })()

//   return (
//     <div className={`flex ${position === "left" ? "justify-end" : "justify-start"}`}>
//       <Component message={message} position={position} userList={userList} />
//     </div>
//   )
// }

// // FIXED: Helper function to generate unique message keys
// const generateMessageKey = (message, index, userId) => {
//   // Create a more unique key using multiple properties and current timestamp
//   const timestamp = message.timestamp || Date.now()
//   const messageType = message.type || "text"
//   const textPreview = message.text ? message.text.substring(0, 10) : ""
//   const role = message.role || "user"
//   const randomId = Math.random().toString(36).substr(2, 9)

//   // Combine multiple unique identifiers
//   return `msg-${userId}-${timestamp}-${index}-${messageType}-${role}-${randomId}`.replace(/[^a-zA-Z0-9-]/g, "")
// }

// // FIXED: Helper function to generate unique user keys
// const generateUserKey = (user, index) => {
//   // Use multiple properties to ensure uniqueness
//   const waId = user.waId || "no-wa-id"
//   const userId = user.id || "no-id"
//   const phone = user.phone || "no-phone"
//   const randomId = Math.random().toString(36).substr(2, 9)

//   return `user-${waId}-${userId}-${phone}-${index}-${randomId}`.replace(/[^a-zA-Z0-9-]/g, "")
// }

// function Chat() {
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [userList, setUserList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [newMessage, setNewMessage] = useState("")
//   const [showSidebar, setShowSidebar] = useState(true)
//   const [isMobile, setIsMobile] = useState(false)
//   const [showInfoPanel, setShowInfoPanel] = useState(false)
//   const [messageType, setMessageType] = useState(MessageType.TEXT)
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
//   const [showAttachmentMenu2, setShowAttachmentMenu2] = useState(false)
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [selectedAudio, setSelectedAudio] = useState(null)
//   const [selectedVideo, setSelectedVideo] = useState(null)
//   const [selectedSticker, setSelectedSticker] = useState(null)
//   const [selectedLocation, setSelectedLocation] = useState(null)
//   const [selectedContact, setSelectedContact] = useState(null)
//   const [showReactionMenu, setShowReactionMenu] = useState(false)
//   const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null)
//   const [showTemplateMenu, setShowTemplateMenu] = useState(false)
//   const audioInputRef = useRef(null)
//   const videoInputRef = useRef(null)
//   const [showInteractiveMenu, setShowInteractiveMenu] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [messagesLoading, setMessagesLoading] = useState(false)
//   const [messagesError, setMessagesError] = useState(null)
//   // New states for pagination and scroll management
//   const [currentPage, setCurrentPage] = useState(1)
//   const [hasMoreMessages, setHasMoreMessages] = useState(true)
//   const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
//   const messagesContainerRef = useRef(null)
//   const [isScrolling, setIsScrolling] = useState(false)
//   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
//   const [isNearBottom, setIsNearBottom] = useState(true)

//   // Helper function to scroll to bottom
//   const scrollToBottom = (smooth = true) => {
//     if (messagesContainerRef.current) {
//       const container = messagesContainerRef.current
//       const scrollOptions = {
//         top: container.scrollHeight,
//         behavior: smooth ? "smooth" : "auto",
//       }
//       container.scrollTo(scrollOptions)
//     }
//   }

//   const checkIfNearBottom = () => {
//     if (messagesContainerRef.current) {
//       const container = messagesContainerRef.current
//       const threshold = 100
//       const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
//       setIsNearBottom(isNear)
//       return isNear
//     }
//     return false
//   }

//   const preserveScrollPosition = (previousScrollHeight) => {
//     if (messagesContainerRef.current) {
//       const container = messagesContainerRef.current
//       const newScrollHeight = container.scrollHeight
//       const scrollDifference = newScrollHeight - previousScrollHeight
//       container.scrollTop = container.scrollTop + scrollDifference
//     }
//   }

//   const parseContactName = (contactName) => {
//     if (!contactName || contactName.trim() === "") {
//       return { firstName: "Unknown", lastName: "User" }
//     }
//     const nameParts = contactName.trim().split(" ")
//     if (nameParts.length === 1) {
//       return { firstName: nameParts[0], lastName: "" }
//     }
//     return {
//       firstName: nameParts[0],
//       lastName: nameParts.slice(1).join(" "),
//     }
//   }

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return new Date().toLocaleString()
//     try {
//       const date = new Date(dateString)
//       return date.toLocaleString()
//     } catch (error) {
//       return new Date().toLocaleString()
//     }
//   }

//   const formatLastActivity = (dateString) => {
//     if (!dateString) return new Date().toISOString().slice(0, 16)
//     try {
//       const date = new Date(dateString)
//       return date.toISOString().slice(0, 16)
//     } catch (error) {
//       return new Date().toISOString().slice(0, 16)
//     }
//   }

//   const formatTimestamp = (timestamp) => {
//     try {
//       const date = new Date(Number.parseInt(timestamp) * 1000)
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     } catch (error) {
//       return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     }
//   }

//   const parseTemplateInfo = (extraInfo) => {
//     try {
//       const parsed = JSON.parse(extraInfo)
//       let headerText = parsed.name || "Template"
//       let bodyText = ""
//       let footerText = ""
//       let headerImage = null

//       if (parsed.components) {
//         parsed.components.forEach((component) => {
//           if (component.type === "HEADER") {
//             if (component.format === "TEXT" && component.text) {
//               headerText = component.text
//             } else if (component.format === "IMAGE" && component.example && component.example.header_handle) {
//               headerImage = component.example.header_handle[0]
//             }
//             if (component.parameters) {
//               component.parameters.forEach((param) => {
//                 if (param.type === "text") {
//                   headerText = param.text
//                 }
//               })
//             }
//           }
//           if (component.type === "BODY") {
//             if (component.text) {
//               bodyText = component.text
//             }
//             if (component.parameters) {
//               bodyText = component.parameters.map((param) => param.text || "").join(" ")
//             }
//           }
//           if (component.type === "FOOTER") {
//             if (component.text) {
//               footerText = component.text
//             }
//             if (component.parameters) {
//               footerText = component.parameters.map((param) => param.text || "").join(" ")
//             }
//           }
//         })
//       }

//       return { headerText, bodyText, footerText, headerImage }
//     } catch (error) {
//       console.error("Error parsing template info:", error)
//       return { headerText: "Template", bodyText: "", footerText: "", headerImage: null }
//     }
//   }

//   // SWAPPED ROLE LOGIC HERE
//   const transformApiMessage = async (apiMessage) => {
//     const timestamp = formatTimestamp(apiMessage.timestamp)
//     const isFromUser = apiMessage.sender !== null
//     // SWAPPED: user messages now get "assistant" role, assistant messages get "user" role
//     const role = isFromUser ? "assistant" : "user"

//     // Add unique identifier to each message
//     const messageId = `${apiMessage.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//     switch (apiMessage.message_type) {
//       case "text":
//         return {
//           id: messageId,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || "No message content",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "image":
//         return {
//           id: messageId,
//           type: MessageType.IMAGE,
//           imageUrl: apiMessage.file_url || "/placeholder.svg?height=240&width=240",
//           caption: apiMessage.message_body || "",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "document":
//         return {
//           id: messageId,
//           type: MessageType.DOCUMENT,
//           documentName: apiMessage.filename || "Document",
//           documentSize: "Unknown size",
//           documentUrl: apiMessage.file_url || "#",
//           caption: apiMessage.message_body || "",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "audio":
//         return {
//           id: messageId,
//           type: MessageType.AUDIO,
//           audioName: apiMessage.filename || "Audio file",
//           audioSize: "Unknown size",
//           audioUrl: apiMessage.file_url || "#",
//           caption: apiMessage.message_body || "",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "video":
//         return {
//           id: messageId,
//           type: MessageType.VIDEO,
//           videoUrl: apiMessage.file_url || "#",
//           caption: apiMessage.message_body || "",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "template": {
//         const parsed = (() => {
//           try {
//             return JSON.parse(apiMessage.extra_info || "{}")
//           } catch (e) {
//             console.error("❌ Failed to parse extra_info JSON:", e)
//             return {}
//           }
//         })()

//         const templateId = apiMessage.phone_number_id || "361462453714220"
//         const templateName = parsed.name || "unknown_template"
//         let templateData = {}

//         try {
//           const res = await fetch(
//             `https://waba.mpocket.in/api/phone/get/message_template/${templateId}/${templateName}`,
//           )
//           const json = await res.json()
//           console.log("✅ Full API Response:", JSON.stringify(json, null, 2))
//           // ✅ FIX: Access first item from array
//           templateData = Array.isArray(json.data) ? json.data[0] : json.data || {}
//         } catch (err) {
//           console.error("❌ Template fetch failed:", err)
//         }

//         // ✅ Parse the components field (which is a JSON string)
//         let components = []
//         try {
//           components =
//             typeof templateData.components === "string"
//               ? JSON.parse(templateData.components)
//               : templateData.components || []
//         } catch (e) {
//           console.error("❌ Failed to parse components:", e)
//         }

//         console.log("📦 Parsed components:", components)

//         // ✅ Find the BODY component
//         const bodyComponent = components.find((c) => c.type?.toLowerCase() === "body")
//         console.log("📨 BODY component:", bodyComponent)

//         const bodyTemplate = bodyComponent?.text || "Template"
//         console.log("📝 bodyTemplate:", bodyTemplate)

//         // ✅ Fill in variables from the message's extra_info.components
//         const bodyParams = parsed.components?.find((c) => c.type?.toLowerCase() === "body")?.parameters || []
//         const filledBody = bodyTemplate.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
//           return bodyParams[+idx - 1]?.text || ""
//         })

//         console.log("✅ filledBody:", filledBody)

//         // ✅ Footer and Header values
//         const footerText = components.find((c) => c.type?.toLowerCase() === "footer")?.text || ""
//         const headerImage =
//           parsed.components?.find((c) => c.type?.toLowerCase() === "header")?.parameters?.[0]?.image?.link || null

//         return {
//           id: messageId,
//           type: MessageType.TEMPLATE,
//           templateName,
//           headerText: templateName,
//           bodyText: filledBody,
//           footerText,
//           headerImage,
//           isRead: apiMessage.read === 1,
//           role, // ensure `role` is in scope
//           timestamp: apiMessage.timestamp,
//         }
//       }
//       case "location":
//         return {
//           id: messageId,
//           type: MessageType.LOCATION,
//           latitude: Number.parseFloat(apiMessage.latitude) || 0,
//           longitude: Number.parseFloat(apiMessage.longitude) || 0,
//           locationName: apiMessage.address || "Shared Location",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       case "contact":
//         return {
//           id: messageId,
//           type: MessageType.CONTACT,
//           contactName: apiMessage.contact_name || "Unknown Contact",
//           contactPhone: apiMessage.wa_id || "",
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//       default:
//         return {
//           id: messageId,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || `${apiMessage.message_type} message`,
//           isRead: apiMessage.read === 1,
//           role,
//           timestamp,
//         }
//     }
//   }

//   const fetchUserMessages = async (userId, page = 1, isLoadMore = false) => {
//     try {
//       if (!isLoadMore) {
//         setMessagesLoading(true)
//         setMessagesError(null)
//       } else {
//         setLoadingMoreMessages(true)
//       }

//       const wabaId = sessionStorage.getItem("361462453714220") || "361462453714220"
//       const accessToken =
//         sessionStorage.getItem("Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7") ||
//         "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

//       if (!wabaId || !accessToken) {
//         throw new Error("Missing authentication data")
//       }

//       // API call with page parameter
//       const response = await axios.get(`${BASE_URL}/api/phone/get/${wabaId}/${userId}/${page}`)
//       console.log(`Messages API Response for page ${page}:`, response.data)

//       // Transform API messages to component format
//       const transformedMessages = Array.isArray(response.data)
//         ? await Promise.all(response.data.map(transformApiMessage))
//         : []

//       // Check if there are more messages (if current page has less than expected messages, no more pages)
//       const hasMore = transformedMessages.length > 0

//       return { messages: transformedMessages, hasMore }
//     } catch (error) {
//       console.error(`Error fetching messages for page ${page}:`, error?.response?.data || error.message)
//       if (!isLoadMore) {
//         setMessagesError("Failed to load messages")
//       }
//       return { messages: [], hasMore: false }
//     } finally {
//       if (!isLoadMore) {
//         setMessagesLoading(false)
//       } else {
//         setLoadingMoreMessages(false)
//       }
//     }
//   }

//   const loadMoreMessages = async () => {
//     if (!selectedUser || !hasMoreMessages || loadingMoreMessages) return

//     const container = messagesContainerRef.current
//     if (!container) return

//     const previousScrollHeight = container.scrollHeight
//     const nextPage = currentPage + 1

//     const { messages: newMessages, hasMore } = await fetchUserMessages(selectedUser.waId, nextPage, true)

//     if (newMessages.length > 0) {
//       const updatedUser = {
//         ...selectedUser,
//         messages: [...newMessages.reverse(), ...selectedUser.messages],
//       }

//       setSelectedUser(updatedUser)

//       const updatedUsers = userList.map((u) => (u.id === selectedUser.id ? updatedUser : u))
//       setUserList(updatedUsers)

//       setCurrentPage(nextPage)

//       setTimeout(() => {
//         preserveScrollPosition(previousScrollHeight)
//       }, 50)
//     }

//     setHasMoreMessages(hasMore)
//   }

//   const handleScroll = () => {
//     if (!messagesContainerRef.current || loadingMoreMessages || !hasMoreMessages) return

//     const container = messagesContainerRef.current
//     const scrollTop = container.scrollTop
//     const scrollThreshold = 100 // Load more when 100px from top

//     // Check if user is near bottom
//     checkIfNearBottom()

//     // Load more messages when scrolled near the top
//     if (scrollTop <= scrollThreshold && !isScrolling) {
//       setIsScrolling(true)
//       loadMoreMessages().finally(() => {
//         // Reset scrolling flag after a delay
//         setTimeout(() => setIsScrolling(false), 1000)
//       })
//     }
//   }

//   // Add scroll event listener
//   useEffect(() => {
//     const container = messagesContainerRef.current
//     if (container) {
//       container.addEventListener("scroll", handleScroll)
//       return () => container.removeEventListener("scroll", handleScroll)
//     }
//   }, [selectedUser?.waId, hasMoreMessages, loadingMoreMessages, isScrolling, currentPage])

//   // Auto-scroll to bottom when messages change (only if user was near bottom)
//   useEffect(() => {
//     if (selectedUser && selectedUser.messages && shouldScrollToBottom && isNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(false) // Instant scroll for initial load
//       }, 100)
//     }
//   }, [selectedUser, shouldScrollToBottom, isNearBottom])

//   // API call function to fetch chats
//   const fetchChats = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const wabaId = sessionStorage.getItem("361462453714220") || "361462453714220"
//       const accessToken =
//         sessionStorage.getItem("Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7") ||
//         "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

//       if (!wabaId || !accessToken) {
//         console.error("Missing waba_id or auth_token in sessionStorage")
//         throw new Error("Missing authentication data")
//       }

//       const response = await axios.get(`${BASE_URL}/api/phone/get/chats/${wabaId}?accessToken=${accessToken}`)
//       console.log("API Response:", response.data)

//       const transformedData = Array.isArray(response.data)
//         ? response.data.map((chat, index) => {
//             const { firstName, lastName } = parseContactName(chat.contact_name)
//             return {
//               id: chat.User_ID || index + 1,
//               firstName: firstName,
//               lastName: lastName,
//               profileImage: `${firstName.charAt(0)}${lastName.charAt(0)}`,
//               source: "WhatsApp",
//               creationTime: formatDate(chat.first_message_date),
//               lastActivity: formatLastActivity(chat.last_message_date),
//               phone: chat.wa_id_or_sender || "+1234567890",
//               notes: "",
//               messageCount: chat.message_count || 0,
//               totalPages: chat.total_pages || 0,
//               activeLast24Hours: chat.active_last_24_hours || false,
//               remainingTime: formatRemainingTime(chat.last_message_date),
//               // chat.remaining_time || "0h 0m 0s",
//               userName: chat.user_name || "Unknown",
//               waId: chat.wa_id_or_sender,
//               messages: [],
//             }
//           })
//         : []

//       console.log("Transformed Data:", transformedData)
//       setUserList(transformedData)
//     } catch (error) {
//       console.error("Error fetching chats:", error?.response?.data || error.message)
//       setError("Failed to load chats. Please try again.")
//       setUserList([
//         {
//           id: 1,
//           firstName: "Demo",
//           lastName: "User",
//           profileImage: "DU",
//           source: "Source Web",
//           creationTime: "Mar 20, 2025, 10:54:16 PM",
//           lastActivity: "2025-04-11 14:30",
//           phone: "+1234567890",
//           notes: "",
//           waId: "918857808284",
//           messages: [
//             {
//               id: "demo-msg-1",
//               type: MessageType.TEXT,
//               text: "*API connection failed.* This is _demo data_ with ~formatting~ and `code`.\n\nNew line test.",
//               isRead: true,
//               timestamp: "10:30 AM",
//               // SWAPPED: Demo message now has "assistant" role to appear on right
//               role: "assistant",
//             },
//           ],
//         },
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch chats on component mount
//   useEffect(() => {
//     fetchChats()
//   }, [])

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 768
//       setIsMobile(mobile)
//       setShowSidebar(!mobile || !selectedUser ? true : false)
//     }

//     checkScreenSize()
//     window.addEventListener("resize", checkScreenSize)
//     return () => window.removeEventListener("resize", checkScreenSize)
//   }, [selectedUser])

//   const handleTemplateSelect = () => {
//     setMessageType(MessageType.TEMPLATE)
//     setShowTemplateMenu(false)
//   }

//   const handleInteractiveSelect = () => {
//     setMessageType(MessageType.INTERACTIVE)
//     setShowInteractiveMenu(false)
//   }

//   const handleSendMessage = () => {
//     if (
//       !newMessage.trim() &&
//       !selectedImage &&
//       !selectedFile &&
//       !selectedAudio &&
//       !selectedVideo &&
//       !selectedSticker &&
//       !selectedLocation &&
//       !selectedContact
//     )
//       return

//     let newMsg = null
//     const messageId = `new-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//     if (selectedImage) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.IMAGE,
//         imageUrl: URL.createObjectURL(selectedImage),
//         caption: newMessage.trim() || "",
//         isRead: true,
//         // SWAPPED: New messages now get "assistant" role to appear on right
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedFile) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.DOCUMENT,
//         documentName: selectedFile.name,
//         documentSize: `${Math.round(selectedFile.size / 1024)} KB`,
//         documentUrl: URL.createObjectURL(selectedFile),
//         caption: newMessage.trim() || "",
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedAudio) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.AUDIO,
//         audioName: selectedAudio.name,
//         audioSize: `${Math.round(selectedAudio.size / 1024)} KB`,
//         audioUrl: URL.createObjectURL(selectedAudio),
//         caption: newMessage.trim() || "",
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedVideo) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.VIDEO,
//         videoUrl: URL.createObjectURL(selectedVideo),
//         caption: newMessage.trim() || "",
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedSticker) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.STICKER,
//         stickerUrl: URL.createObjectURL(selectedSticker),
//         isAnimated: selectedSticker.type.includes("gif"),
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (messageType === MessageType.TEMPLATE) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.TEMPLATE,
//         templateName: "Custom Template",
//         headerText: "Custom Message",
//         bodyText: newMessage,
//         footerText: "Reply to continue",
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedLocation) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.LOCATION,
//         latitude: selectedLocation.latitude,
//         longitude: selectedLocation.longitude,
//         locationName: selectedLocation.name || "Shared Location",
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else if (selectedContact) {
//       newMsg = {
//         id: messageId,
//         type: MessageType.CONTACT,
//         contactName: selectedContact.name,
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     } else {
//       newMsg = {
//         id: messageId,
//         type: MessageType.TEXT,
//         text: newMessage,
//         isRead: true,
//         role: "assistant",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//     }

//     // Check if user is near bottom before adding message
//     const wasNearBottom = checkIfNearBottom()

//     const updatedUsers = userList.map((user) =>
//       user.id === selectedUser.id
//         ? {
//             ...user,
//             messages: [...user.messages, newMsg],
//           }
//         : user,
//     )

//     setUserList(updatedUsers)
//     const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//     setSelectedUser(updatedUser)

//     if (wasNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(true)
//       }, 100)
//     }

//     setNewMessage("")
//     setSelectedImage(null)
//     setSelectedFile(null)
//     setSelectedAudio(null)
//     setSelectedVideo(null)
//     setSelectedSticker(null)
//     setSelectedLocation(null)
//     setSelectedContact(null)

//     // Reset file inputs
//     if (audioInputRef.current) audioInputRef.current.value = ""
//     if (videoInputRef.current) videoInputRef.current.value = ""
//   }

//   const handleUserSelect = async (user) => {
//     setSelectedUser(user)
//     if (isMobile) setShowSidebar(false)

//     // Reset pagination states for new user
//     setCurrentPage(1)
//     setHasMoreMessages(true)
//     setShouldScrollToBottom(true)
//     setIsNearBottom(true)


//     if (user.waId) {
//       const { messages, hasMore } = await fetchUserMessages(user.waId, 1, false)
//       const updatedUser = { ...user, messages: messages.reverse() }
//       setSelectedUser(updatedUser)
//       setHasMoreMessages(hasMore)

//       // Update the user in the list with fetched messages
//       const updatedUsers = userList.map((u) => (u.id === user.id ? updatedUser : u))
//       setUserList(updatedUsers)
//     }
//   }

//   const handleBackToList = () => {
//     if (isMobile) setShowSidebar(true)
//   }

//   const toggleInfoPanel = () => setShowInfoPanel((prev) => !prev)

//   const toggleAttachmentMenu = () => setShowAttachmentMenu((prev) => !prev)

//   const toggleAttachmentMenu2 = () => setShowAttachmentMenu2((prev) => !prev)

//   const handleImageSelect = () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "image/*"
//     input.onchange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         setSelectedImage(file)
//         setMessageType(MessageType.IMAGE)
//         setShowAttachmentMenu(false)
//       }
//     }
//     input.click()
//   }

//   const handleDocumentSelect = () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = ".pdf,.doc,.docx,.txt,.xls,.xlsx"
//     input.onchange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         setSelectedFile(file)
//         setMessageType(MessageType.DOCUMENT)
//         setShowAttachmentMenu(false)
//       }
//     }
//     input.click()
//   }

//   const handleAudioSelect = () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "audio/*"
//     input.onchange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         setSelectedAudio(file)
//         setMessageType(MessageType.AUDIO)
//         setShowAttachmentMenu(false)
//       }
//     }
//     input.click()
//   }

//   const handleVideoSelect = () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "video/*"
//     input.onchange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         setSelectedVideo(file)
//         setMessageType(MessageType.VIDEO)
//         setShowAttachmentMenu(false)
//       }
//     }
//     input.click()
//   }

//   const handleStickerSelect = () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "image/gif,image/png,image/jpeg,image/webp"
//     input.onchange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         setSelectedSticker(file)
//         setMessageType(MessageType.STICKER)
//         setShowAttachmentMenu(false)
//       }
//     }
//     input.click()
//   }

//   const handleLocationSelect = () => {
//     const mockLocation = {
//       latitude: 40.7128,
//       longitude: -74.006,
//       name: "New York City",
//     }
//     setSelectedLocation(mockLocation)
//     setMessageType(MessageType.LOCATION)
//     setShowAttachmentMenu(false)
//   }

//   const handleContactSelect = () => {
//     const mockContact = {
//       name: "",
//       role: "assistant",
//     }
//     setSelectedContact(mockContact)
//     setMessageType(MessageType.CONTACT)
//     setShowAttachmentMenu(false)
//   }

//   const handleReaction = (messageIndex, emoji) => {
//     if (!selectedUser) return

//     const newReaction = {
//       id: `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       type: MessageType.REACTION,
//       originalMessageId: messageIndex,
//       emoji: emoji,
//       isRead: true,
//       role: "assistant",
//       timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     }

//     const updatedUsers = userList.map((user) =>
//       user.id === selectedUser.id
//         ? {
//             ...user,
//             messages: [...user.messages, newReaction],
//           }
//         : user,
//     )

//     setUserList(updatedUsers)
//     const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//     setSelectedUser(updatedUser)

//     setShowReactionMenu(false)
//     setSelectedMessageForReaction(null)
//   }

//   const toggleReactionMenu = (messageIndex) => {
//     setSelectedMessageForReaction(messageIndex)
//     setShowReactionMenu(!showReactionMenu)
//   }

//   const toggleTemplateMenu = () => setShowTemplateMenu((prev) => !prev)

//   const toggleInteractiveMenu = () => setShowInteractiveMenu((prev) => !prev)

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showAttachmentMenu && !event.target.closest(".attachment-menu-container")) {
//         setShowAttachmentMenu(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [showAttachmentMenu])

//   useEffect(() => {
//     const handleClickOutside2 = (event) => {
//       if (showAttachmentMenu2 && !event.target.closest(".attachment-smile-container")) {
//         setShowAttachmentMenu2(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside2)
//     return () => document.removeEventListener("mousedown", handleClickOutside2)
//   }, [showAttachmentMenu2])

//   useEffect(() => {
//     const handleClickOutside3 = (event) => {
//       if (showReactionMenu && !event.target.closest(".reaction-menu-container")) {
//         setShowReactionMenu(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside3)
//     return () => document.removeEventListener("mousedown", handleClickOutside3)
//   }, [showReactionMenu])

//   if (loading) {
//     return (
//       <div className="flex h-full bg-gray-100 p-2 md:p-14 lg:p-1 gap-2 md:gap-4 mt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading chats...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex h-full bg-gray-100 p-2 md:p-14 lg:p-1 gap-2 md:gap-4 mt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <p className="text-red-600 mb-4">{error}</p>
//             <button onClick={fetchChats} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-full bg-gray-100 p-2 md:p-14 lg:p-1 gap-2 md:gap-4 mt-20">
//       <div
//         className={`${
//           showSidebar ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden ${isMobile ? "w-full" : "w-full md:w-1/3"}`}
//       >
//         <div className="p-3 md:p-4 space-y-2 md:space-y-3">
//           <div className="flex items-center justify-between gap-4">
//             {isMobile && selectedUser && (
//               <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500 hover:text-gray-700">
//                 <X size={24} />
//               </button>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <Menu />
//             <h1 className="text-lg font-semibold">Chat List</h1>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 mt-6">Search</label>
//             <input
//               type="text"
//               placeholder="Searching....."
//               className="w-full p-2 border rounded-md"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <hr className="border-gray-300" />
//         </div>
//         <div className="overflow-y-auto px-3 md:px-4 pb-4 space-y-2 md:space-y-3 flex-1">
//           {userList
//             .filter((user) => {
//               const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
//               return fullName.includes(searchTerm.toLowerCase())
//             })
//             .map((user, index) => (
//               <div
//                 key={generateUserKey(user, index)}
//                 onClick={() => handleUserSelect(user)}
//                 className="flex justify-between items-start gap-2 md:gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
//               >
//                 <div className=" flex items-start gap-2 md:gap-3 min-w-0">
//                   <div className="relative">
//                     <div
//                       className={`${user.activeLast24Hours ? "bg-green-600 text-white" : "bg-gray-400 text-black"}w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0`}
//                     >
//                       {user.firstName.charAt(0)}
//                       {user.lastName.charAt(0)}
//                     </div>
//                     {user.activeLast24Hours && (
//                       <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full " />
//                     )}
//                   </div>
//                   <div className="flex flex-col min-w-0">
//                     <div className="flex items-center gap-1 md:gap-2 flex-wrap min-w-0">
//                       <p className="font-medium truncate max-w-[100px] md:max-w-[140px]">
//                         {user.firstName} {user.lastName}
//                       </p>
//                     </div>
//                     <p className="text-xs md:text-sm text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
//                       {user.remainingTime}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="text-xs md:text-sm text-black whitespace-nowrap ml-1 md:ml-2 shrink-0 mt-1">
//                   {user.messageCount} message
//                 </span>
//               </div>
//             ))}
//         </div>
//       </div>

//       <div
//         className={`${
//           !showSidebar || !isMobile ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden  ${isMobile ? "w-full" : "w-full md:w-2/3"}`}
//       >
//         {selectedUser ? (
//           <>
//             <div className="flex items-center justify-between gap-2 md:gap-4 border-b p-3 md:p-4  ">
//               <div className="flex items-center gap-2">
//                 {isMobile && (
//                   <button onClick={handleBackToList} className="md:hidden text-gray-500 hover:text-gray-700 mr-1 ">
//                     <Menu size={24} />
//                   </button>
//                 )}
//                 <div className="bg-gray-400 text-black w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold">
//                   {selectedUser.firstName.charAt(0)}
//                   {selectedUser.lastName.charAt(0)}
//                 </div>
//                 <h2 className="text-base md:text-lg font-semibold">
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h2>
//               </div>
//               <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600">
//                 <Info size={22} />
//               </button>
//             </div>

//             <div
//               ref={messagesContainerRef}
//               className="flex-1 overflow-y-auto p-3 md:p-2 space-y-2 md:space-y-3 bg-gray-200 text-left"
//               style={{ scrollBehavior: "smooth" }}
//             >
//               {loadingMoreMessages && (
//                 <div className="flex items-center justify-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-sm">Loading more messages...</span>
//                 </div>
//               )}

//               {messagesLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600">Loading messages...</span>
//                 </div>
//               ) : messagesError ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-red-600">{messagesError}</p>
//                 </div>
//               ) : selectedUser.messages.length === 0 ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-gray-500">No messages found</p>
//                 </div>
//               ) : (
//                 selectedUser.messages.map((msg, index) => (
//                   <div
//                     key={generateMessageKey(msg, index, selectedUser.waId || selectedUser.id)}
//                     className="relative group"
//                   >
//                     <MessageRenderer
//                       message={msg}
//                       // SWAPPED: user role now goes to left, assistant role goes to right
//                       position={msg.role === "user" ? "left" : "right"}
//                       userList={userList}
//                     />
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="p-3 md:p-4 border-t flex flex-col gap-2">
//               {(selectedImage ||
//                 selectedFile ||
//                 selectedAudio ||
//                 selectedVideo ||
//                 selectedSticker ||
//                 selectedLocation ||
//                 selectedContact) && (
//                 <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
//                   {selectedImage && (
//                     <div className="relative">
//                       <img
//                         src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
//                         alt="Selected"
//                         className="h-16 w-16 object-cover rounded-md"
//                       />
//                       <button
//                         onClick={() => setSelectedImage(null)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedFile && (
//                     <div className="relative flex items-center bg-white p-2 rounded-md">
//                       <FileMinus size={20} className="text-gray-600 mr-2" />
//                       <span className="text-sm truncate max-w-[150px]">{selectedFile.name}</span>
//                       <button onClick={() => setSelectedFile(null)} className="ml-2 text-red-500">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedAudio && (
//                     <div className="relative flex items-center bg-white p-2 rounded-md">
//                       <Music size={20} className="text-pink-500 mr-2" />
//                       <span className="text-sm truncate max-w-[150px]">{selectedAudio.name}</span>
//                       <button onClick={() => setSelectedAudio(null)} className="ml-2 text-red-500">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedVideo && (
//                     <div className="relative flex items-center bg-white p-2 rounded-md">
//                       <Video size={20} className="text-orange-500 mr-2" />
//                       <span className="text-sm truncate max-w-[150px]">{selectedVideo.name}</span>
//                       <button onClick={() => setSelectedVideo(null)} className="ml-2 text-red-500">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedSticker && (
//                     <div className="relative">
//                       <img
//                         src={URL.createObjectURL(selectedSticker) || "/placeholder.svg"}
//                         alt="Sticker"
//                         className="h-16 w-16 object-contain rounded-md"
//                       />
//                       <button
//                         onClick={() => setSelectedSticker(null)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                       >
//                         <X size={14} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedLocation && (
//                     <div className="relative flex items-center bg-white p-2 rounded-md">
//                       <MapPin size={20} className="text-red-500 mr-2" />
//                       <span className="text-sm truncate max-w-[150px]">{selectedLocation.name}</span>
//                       <button onClick={() => setSelectedLocation(null)} className="ml-2 text-red-500">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                   {selectedContact && (
//                     <div className="relative flex items-center bg-white p-2 rounded-md">
//                       <span className="text-sm truncate max-w-[150px]">{selectedContact.name}</span>
//                       <button onClick={() => setSelectedContact(null)} className="ml-2 text-red-500">
//                         <X size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="flex items-center gap-2 md:gap-3 bg-white">
//                 <div className="flex items-center gap-1 md:gap-2">
//                   <div className="relative attachment-smile-container">
//                     {showAttachmentMenu2 && (
//                       <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 w-36 grid grid-cols-2 z-50"></div>
//                     )}
//                   </div>
//                   <div className="relative attachment-menu-container">
//                     <button className="text-gray-500 hover:text-blue-600 mt-1" onClick={toggleAttachmentMenu}>
//                       <Plus size={20} />
//                     </button>
//                     {showAttachmentMenu && (
//                       <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 w-24 z-50">
//                         <button
//                           className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
//                           onClick={toggleTemplateMenu}
//                         >
//                           <Text size={20} className="mb-1 text-indigo-500" />
//                           Template
//                         </button>
//                         {showTemplateMenu && (
//                           <div className="absolute bottom-20 left-10 bg-white rounded-lg shadow-lg border p-2 w-64 z-50 template-menu-container">
//                             <div className="p-2">
//                               <button
//                                 onClick={handleTemplateSelect}
//                                 className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
//                               >
//                                 Marketing Template
//                               </button>
//                               <button
//                                 onClick={handleTemplateSelect}
//                                 className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
//                               >
//                                 Utility Template
//                               </button>
//                               <button
//                                 onClick={handleTemplateSelect}
//                                 className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
//                               >
//                                 Authentication Template
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                   placeholder="Type your message..."
//                   className="flex-1 border rounded-full px-3 py-1.5 md:px-4 md:py-2 focus:outline-none text-sm md:text-base"
//                 />
//                 <div className="flex items-center gap-2">
//                   <button className="text-gray-500 hover:text-blue-600">
//                     <Mic size={20} />
//                   </button>
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <line x1="22" y1="2" x2="11" y2="13"></line>
//                       <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center flex-1 p-4">
//             <img
//               src="/placeholder.svg?height=160&width=160"
//               alt="WhatsApp"
//               className="hidden lg:block w-40 h-40 mb-6"
//             />
//             <h2 className="text-xl font-semibold mb-4">Click a user to chat</h2>
//           </div>
//         )}
//       </div>

//       {showInfoPanel && selectedUser && (
//         <div className="absolute md:right-0 md:top-14 md:bottom-10 w-72 md:w-80 bg-white shadow-2xl border-l rounded-l-2xl p-4 z-20 ">
//           <div className="flex justify-between items-center mb-4 ">
//             <h3 className="font-semibold text-lg">User Info</h3>
//             <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700">
//               <X size={20} />
//             </button>
//           </div>
//           <div className="space-y-3 text-sm text-gray-700">
//             <div className="bg-gray-300 text-black w-8 h-8 md:w-14 md:h-14 md:rounded-full flex items-center justify-center text-sm font-semibold shrink-0 md:ml-32">
//               {selectedUser.firstName.charAt(0)}
//               {selectedUser.lastName.charAt(0)}
//             </div>
//             <div className="flex flex-col min-w-0 md:ml-28 ">
//               <p className="truncate max-w-[100px] md:max-w-[140px] font-semibold ">
//                 {selectedUser.firstName} {selectedUser.lastName}
//               </p>
//               <span className="text-xs bg-purple-50 text-purple-800 md:w-10 md:text-center md:ml-4 rounded-md md:mt-2">
//                 Lead
//               </span>
//             </div>
//             <hr />
//             <h1 className="font-semibold md:text-lg">Details</h1>
//             <div className="flex items-center gap-2 mt-2">
//               <MessageSquareTextIcon size={16} className="text-orange-500" />
//               <span className="font-extralight">
//                 Source <span className="text-indigo-500 text-sm">{selectedUser.source}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <Calendar size={16} className="text-cyan-500 md:mt-3" />
//               <span className="md:mt-3 font-extralight">
//                 Creation Time <span className="text-indigo-500 text-sm">{selectedUser.creationTime}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2  ">
//               <Clock size={16} className="text-orange-300 md:mt-3" />
//               <span className="md:mt-3 font-extralight">
//                 Last Activity <span className="text-indigo-500 text-sm">{selectedUser.lastActivity}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2 ">
//               <Phone size={16} className="text-green-500 md:mt-3" />
//               <span className="md:mt-3 font-extralight">
//                 Phone <span className="text-indigo-500 text-sm">{selectedUser.phone}</span>
//               </span>
//             </div>
//           </div>
//           <hr className="mt-3" />
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="font-medium">Notes</h4>
//               <button className="text-blue-600 hover:text-blue-800">
//                 <Plus size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Chat



import {
  Mic,
  Menu,
  X,
  Info,
  Plus,
  Phone,
  Calendar,
  MessageSquareTextIcon,
  Clock,
  Download,
  Share2,
  FileMinus,
  Music,
  Video,
  MapPin,
  List,
  Contact,
  Text,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const BASE_URL = "https://waba.mpocket.in"

const MessageType = {
  TEXT: "text",
  TEXT_WITH_BUTTON: "text_with_button",
  IMAGE: "image",
  DOCUMENT: "document",
  AUDIO: "audio",
  VIDEO: "video",
  CONTACT: "contact",
  LIST: "list",
  LOCATION: "location",
  STICKER: "sticker",
  REACTION: "reaction",
  musicUrl: "Music",
  TEMPLATE: "template",
  INTERACTIVE: "interactive",
}

// Date helper functions
const isToday = (date) => {
  const today = new Date()
  const messageDate = new Date(date)
  return (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  )
}

const isYesterday = (date) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const messageDate = new Date(date)
  return (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  )
}

// New function to format remaining time as date
const formatRemainingTime = (dateString) => {
  if (!dateString) return "No recent activity"
  try {
    const date = new Date(dateString)
    // Check if it's yesterday
    if (isYesterday(date)) {
      return "Yesterday"
    }
    // Check if it's today
    if (isToday(date)) {
      return "Today"
    }
    // Format as "Wed, 04 Jun 2025"
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
    return date.toLocaleDateString("en-GB", options)
  } catch (error) {
    return "Invalid date"
  }
}

const formatDateLabel = (date) => {
  const messageDate = new Date(date)
  if (isToday(messageDate)) {
    return "Today"
  }
  if (isYesterday(messageDate)) {
    return "Yesterday"
  }
  // Format as "Wed, 04 Jul 2025"
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
  return messageDate.toLocaleDateString("en-GB", options)
}

const getMessageDate = (timestamp) => {
  try {
    // Handle both timestamp formats
    let date
    if (typeof timestamp === "string" && timestamp.includes(":")) {
      // If it's already a time string like "10:30 AM", use current date
      date = new Date()
    } else {
      // If it's a unix timestamp
      date = new Date(Number.parseInt(timestamp) * 1000)
    }
    // Return date string in YYYY-MM-DD format for grouping
    return date.toDateString()
  } catch (error) {
    return new Date().toDateString()
  }
}

const groupMessagesByDate = (messages) => {
  const groups = {}
  messages.forEach((message, index) => {
    const dateKey = getMessageDate(message.timestamp)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push({ ...message, originalIndex: index })
  })
  return groups
}

// Date separator component
const DateSeparator = ({ date }) => (
  <div className="flex items-center justify-center my-2 sm:my-4">
    <div className="bg-white px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-sm border text-xs text-gray-600 font-medium">
      {formatDateLabel(date)}
    </div>
  </div>
)

const formatText = (text, messageType = "text") => {
  if (!text) return ""
  let formattedText = text.toString()
  formattedText = formattedText
    // Bold: *text* -> <strong>text</strong>
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
    // Italic: _text_ -> <em>text</em>
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    // Strikethrough: ~text~ -> <del>text</del>')
    .replace(/~([^~\n]+)~/g, "<del>$1</del>")
    // Monospace: `text` -> <code>text</code>
    .replace(
      /`([^`\n]+)`/g,
      '<code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>',
    )
    .replace(/\n/g, "<br>")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\~/g, "~")
    .replace(/\\`/g, "`")
  return formattedText
}

const TextMessage = ({ message, position }) => (
  <div
    className={`${
      position === "right"
        ? "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"
        : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start relative text-sm sm:text-base`}
  >
    <div
      dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
      className="whitespace-pre-wrap break-words"
    />
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const TextWithButtonMessage = ({ message }) => (
  <div className="bg-white border p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div
      className="mb-2 whitespace-pre-wrap break-words text-sm sm:text-base"
      dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
    />
    <a
      href={message.buttonAction}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm flex items-center justify-center w-fit"
    >
      <Share2 size={14} className="mr-1" />
      {message.buttonText}
    </a>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ImageMessage = ({ message, position }) => (
  <div
    className={`${
      position === "right"
        ? "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"
        : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start relative`}
  >
    <img
      src={message.imageUrl || "/placeholder.svg?height=240&width=240"}
      alt={message.caption || "Shared image"}
      className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
    />
    {message.caption && (
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.caption, "image") }}
        className="text-sm text-gray-600 whitespace-pre-wrap break-words"
      />
    )}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const DocumentMessage = ({ message, position }) => (
  <div
    className={`${
      position === "right"
        ? "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"
        : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start relative`}
  >
    <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
      <div className="p-2 rounded-md mr-2">
        <FileMinus size={18} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.documentName}</p>
        <p className="text-xs text-gray-500">{message.documentSize}</p>
      </div>
      <Link
        to={message.documentUrl}
        className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
        download
      >
        <Download size={16} />
      </Link>
    </div>
    {message.caption && (
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.caption, "document") }}
        className="text-sm text-gray-600 whitespace-pre-wrap break-words"
      />
    )}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const AudioMessage = ({ message, position }) => (
  <div className="p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div
      className={`${
        position === "right"
          ? "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"
          : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
      } p-2 sm:p-3 rounded-xl flex items-center`}
    >
      <div className="bg-white p-2 rounded-md mr-2">
        <Music size={18} className="text-pink-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.audioName || "Audio file"}</p>
        <p className="text-xs text-gray-500">{message.audioSize || "Unknown size"}</p>
      </div>
      <Link to={message.audioUrl || "#"} className="text-gray-500 hover:text-blue-700 p-1" download>
        <Download size={16} />
      </Link>
    </div>
    {message.caption && (
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.caption, "audio") }}
        className="text-sm text-gray-600 whitespace-pre-wrap break-words mt-2"
      />
    )}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const TemplateMessage = ({ message, position }) => (
  <div
    className={`${
      position === "right"
        ? "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"
        : "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start relative`}
  >
    {/* Show header image if exists */}
    {message.headerImage && (
      <img
        src={message.headerImage || "/placeholder.svg"}
        alt="Header"
        className="w-full object-cover rounded-md mb-2"
      />
    )}
    <div className="p-2 sm:p-3">
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.bodyText, "template") }}
        className="text-sm whitespace-pre-wrap break-words"
      />
    </div>
    {message.timestamp && (
      <div className="text-xs text-gray-500 mt-1 text-right">
        {new Date(+message.timestamp * 1000).toLocaleString()}
      </div>
    )}
  </div>
)

const VideoMessage = ({ message }) => (
  <div className="border bg-white p-2 sm:p-3 rounded-xl self-start inline-flex flex-col relative max-w-[280px] sm:max-w-xs md:max-w-sm">
    <video src={message.videoUrl || "#"} controls className="rounded-md mb-2 w-full max-h-48 sm:max-h-60 object-cover">
      Your browser does not support the video tag.
    </video>
    {message.caption && (
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.caption, "video") }}
        className="text-sm text-gray-600 whitespace-pre-wrap break-words"
      />
    )}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ContactMessage = ({ message }) => (
  <div className="bg-white border p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="bg-gray-100 border border-gray-200 rounded-md p-3 mb-2">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-full mr-2">
          <Contact size={18} className="text-blue-600" />
        </div>
        <div
          className="font-medium text-sm"
          dangerouslySetInnerHTML={{ __html: formatText(message.contactName, "contact") }}
        />
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center">
          <span dangerouslySetInnerHTML={{ __html: formatText(message.contactPhone, "contact") }} />
        </div>
        {message.contactEmail && (
          <div className="flex items-center">
            <MessageSquareTextIcon size={14} className="text-gray-500 mr-2" />
            <span dangerouslySetInnerHTML={{ __html: formatText(message.contactEmail, "contact") }} />
          </div>
        )}
        {message.contactAddress && (
          <div className="flex items-center">
            <MapPin size={14} className="text-gray-500 mr-2" />
            <span dangerouslySetInnerHTML={{ __html: formatText(message.contactAddress, "contact") }} />
          </div>
        )}
      </div>
    </div>
    <div className="mt-0 flex justify-end space-x-2 sm:space-x-4">
      <button className="text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 hover:bg-gray-100 rounded-md">
        Save Contact
      </button>
      <div className="w-px h-5 bg-gray-300"></div>
      <button className="text-black text-xs sm:text-sm px-2 sm:px-3 py-1.5 hover:bg-gray-100 rounded-md">
        Message
      </button>
    </div>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ListMessage = ({ message }) => (
  <div className="bg-white border p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="mb-2 font-medium text-sm" dangerouslySetInnerHTML={{ __html: formatText(message.title, "text") }} />
    <div
      className="text-sm text-gray-600 mb-3 whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: formatText(message.description, "text") }}
    />
    <div className="bg-gray-100 rounded-md overflow-hidden mb-3">
      {message.items &&
        message.items.map((item) => (
          <div key={item.id} className="p-2 sm:p-3 border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
            <div className="font-medium text-sm" dangerouslySetInnerHTML={{ __html: formatText(item.title, "text") }} />
            <div
              className="text-sm text-gray-600 whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: formatText(item.description, "text") }}
            />
          </div>
        ))}
    </div>
    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm flex items-center self-center">
      <List size={14} className="mr-1" />
      {message.buttonText}
    </button>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const LocationMessage = ({ message }) => (
  <div className="bg-white border p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="relative mb-2">
      <div className="bg-gray-200 w-full h-32 sm:h-40 rounded-md flex items-center justify-center overflow-hidden">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${message.latitude},${message.longitude}&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7C${message.latitude},${message.longitude}`}
          alt="Map location"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg?height=150&width=250"
          }}
        />
      </div>
      <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
        <MapPin size={14} className="text-red-500" />
      </div>
    </div>
    <div className="flex items-center mb-1">
      <MapPin size={14} className="text-gray-500 mr-1" />
      <span className="text-sm font-medium">{message.locationName}</span>
    </div>
    <div className="text-xs text-gray-500">
      {message.latitude.toFixed(4)}, {message.longitude.toFixed(4)}
    </div>
    <div className="mt-2 flex justify-end">
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md text-xs flex items-center">
        <MapPin size={12} className="mr-1" />
        Open in Maps
      </button>
    </div>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const StickerMessage = ({ message }) => (
  <div className="inline-block relative">
    <img
      src={message.stickerUrl || "/placeholder.svg?height=128&width=128"}
      alt="Sticker"
      className={`w-24 h-24 sm:w-32 sm:h-32 object-contain ${message.isAnimated ? "animate-pulse" : ""}`}
    />
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ReactionMessage = ({ message, userList }) => {
  const originalMessage = { text: "Original message" }
  return (
    <div className="bg-gray-100 border p-2 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm self-start flex items-center relative">
      <div className="bg-white p-1 rounded-full mr-2">
        <span className="text-lg sm:text-xl">{message.emoji}</span>
      </div>
      <div className="text-sm text-gray-600">
        Reacted with {message.emoji} to "{originalMessage.text}"
      </div>
      {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
    </div>
  )
}

// Message renderer component - SWAPPED LOGIC HERE
const MessageRenderer = ({ message, position = "left", userList }) => {
  const Component = (() => {
    switch (message.type) {
      case MessageType.TEXT_WITH_BUTTON:
        return TextWithButtonMessage
      case MessageType.IMAGE:
        return ImageMessage
      case MessageType.DOCUMENT:
        return DocumentMessage
      case MessageType.AUDIO:
        return AudioMessage
      case MessageType.VIDEO:
        return VideoMessage
      case MessageType.CONTACT:
        return ContactMessage
      case MessageType.LIST:
        return ListMessage
      case MessageType.LOCATION:
        return LocationMessage
      case MessageType.STICKER:
        return StickerMessage
      case MessageType.TEMPLATE:
        return TemplateMessage
      case MessageType.REACTION:
        return (props) => <ReactionMessage {...props} userList={userList} />
      case MessageType.TEXT:
      default:
        return TextMessage
    }
  })()

  return (
    <div className={`flex ${position === "left" ? "justify-end" : "justify-start"} mb-2 sm:mb-3`}>
      <Component message={message} position={position} userList={userList} />
    </div>
  )
}

// FIXED: Helper function to generate unique message keys
const generateMessageKey = (message, index, userId) => {
  // Create a more unique key using multiple properties and current timestamp
  const timestamp = message.timestamp || Date.now()
  const messageType = message.type || "text"
  const textPreview = message.text ? message.text.substring(0, 10) : ""
  const role = message.role || "user"
  const randomId = Math.random().toString(36).substr(2, 9)
  // Combine multiple unique identifiers
  return `msg-${userId}-${timestamp}-${index}-${messageType}-${role}-${randomId}`.replace(/[^a-zA-Z0-9-]/g, "")
}

// FIXED: Helper function to generate unique user keys
const generateUserKey = (user, index) => {
  // Use multiple properties to ensure uniqueness
  const waId = user.waId || "no-wa-id"
  const userId = user.id || "no-id"
  const phone = user.phone || "no-phone"
  const randomId = Math.random().toString(36).substr(2, 9)
  return `user-${waId}-${userId}-${phone}-${index}-${randomId}`.replace(/[^a-zA-Z0-9-]/g, "")
}

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [messageType, setMessageType] = useState(MessageType.TEXT)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showAttachmentMenu2, setShowAttachmentMenu2] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAudio, setSelectedAudio] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedSticker, setSelectedSticker] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showReactionMenu, setShowReactionMenu] = useState(false)
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState(null)
  const [showTemplateMenu, setShowTemplateMenu] = useState(false)
  const audioInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [showInteractiveMenu, setShowInteractiveMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState(null)
  // New states for pagination and scroll management
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
  const messagesContainerRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [isNearBottom, setIsNearBottom] = useState(true)

  // Helper function to scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const scrollOptions = {
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      }
      container.scrollTo(scrollOptions)
    }
  }

  const checkIfNearBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const threshold = 100
      const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
      setIsNearBottom(isNear)
      return isNear
    }
    return false
  }

  const preserveScrollPosition = (previousScrollHeight) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const newScrollHeight = container.scrollHeight
      const scrollDifference = newScrollHeight - previousScrollHeight
      container.scrollTop = container.scrollTop + scrollDifference
    }
  }

  const parseContactName = (contactName) => {
    if (!contactName || contactName.trim() === "") {
      return { firstName: "Unknown", lastName: "User" }
    }
    const nameParts = contactName.trim().split(" ")
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" }
    }
    return {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
    }
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleString()
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (error) {
      return new Date().toLocaleString()
    }
  }

  const formatLastActivity = (dateString) => {
    if (!dateString) return new Date().toISOString().slice(0, 16)
    try {
      const date = new Date(dateString)
      return date.toISOString().slice(0, 16)
    } catch (error) {
      return new Date().toISOString().slice(0, 16)
    }
  }

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(Number.parseInt(timestamp) * 1000)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  }

  const parseTemplateInfo = (extraInfo) => {
    try {
      const parsed = JSON.parse(extraInfo)
      let headerText = parsed.name || "Template"
      let bodyText = ""
      let footerText = ""
      let headerImage = null

      if (parsed.components) {
        parsed.components.forEach((component) => {
          if (component.type === "HEADER") {
            if (component.format === "TEXT" && component.text) {
              headerText = component.text
            } else if (component.format === "IMAGE" && component.example && component.example.header_handle) {
              headerImage = component.example.header_handle[0]
            }
            if (component.parameters) {
              component.parameters.forEach((param) => {
                if (param.type === "text") {
                  headerText = param.text
                }
              })
            }
          }
          if (component.type === "BODY") {
            if (component.text) {
              bodyText = component.text
            }
            if (component.parameters) {
              bodyText = component.parameters.map((param) => param.text || "").join(" ")
            }
          }
          if (component.type === "FOOTER") {
            if (component.text) {
              footerText = component.text
            }
            if (component.parameters) {
              footerText = component.parameters.map((param) => param.text || "").join(" ")
            }
          }
        })
      }

      return { headerText, bodyText, footerText, headerImage }
    } catch (error) {
      console.error("Error parsing template info:", error)
      return { headerText: "Template", bodyText: "", footerText: "", headerImage: null }
    }
  }

  // SWAPPED ROLE LOGIC HERE
  const transformApiMessage = async (apiMessage) => {
    const timestamp = formatTimestamp(apiMessage.timestamp)
    const isFromUser = apiMessage.sender !== null
    // SWAPPED: user messages now get "assistant" role, assistant messages get "user" role
    const role = isFromUser ? "assistant" : "user"
    // Add unique identifier to each message
    const messageId = `${apiMessage.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    switch (apiMessage.message_type) {
      case "text":
        return {
          id: messageId,
          type: MessageType.TEXT,
          text: apiMessage.message_body || "No message content",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "image":
        return {
          id: messageId,
          type: MessageType.IMAGE,
          imageUrl: apiMessage.file_url || "/placeholder.svg?height=240&width=240",
          caption: apiMessage.message_body || "",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "document":
        return {
          id: messageId,
          type: MessageType.DOCUMENT,
          documentName: apiMessage.filename || "Document",
          documentSize: "Unknown size",
          documentUrl: apiMessage.file_url || "#",
          caption: apiMessage.message_body || "",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "audio":
        return {
          id: messageId,
          type: MessageType.AUDIO,
          audioName: apiMessage.filename || "Audio file",
          audioSize: "Unknown size",
          audioUrl: apiMessage.file_url || "#",
          caption: apiMessage.message_body || "",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "video":
        return {
          id: messageId,
          type: MessageType.VIDEO,
          videoUrl: apiMessage.file_url || "#",
          caption: apiMessage.message_body || "",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "template": {
        const parsed = (() => {
          try {
            return JSON.parse(apiMessage.extra_info || "{}")
          } catch (e) {
            console.error("❌ Failed to parse extra_info JSON:", e)
            return {}
          }
        })()

        const templateId = apiMessage.phone_number_id || "361462453714220"
        const templateName = parsed.name || "unknown_template"
        let templateData = {}

        try {
          const res = await fetch(
            `https://waba.mpocket.in/api/phone/get/message_template/${templateId}/${templateName}`,
          )
          const json = await res.json()
          console.log("✅ Full API Response:", JSON.stringify(json, null, 2))
          // ✅ FIX: Access first item from array
          templateData = Array.isArray(json.data) ? json.data[0] : json.data || {}
        } catch (err) {
          console.error("❌ Template fetch failed:", err)
        }

        // ✅ Parse the components field (which is a JSON string)
        let components = []
        try {
          components =
            typeof templateData.components === "string"
              ? JSON.parse(templateData.components)
              : templateData.components || []
        } catch (e) {
          console.error("❌ Failed to parse components:", e)
        }

        console.log("📦 Parsed components:", components)

        // ✅ Find the BODY component
        const bodyComponent = components.find((c) => c.type?.toLowerCase() === "body")
        console.log("📨 BODY component:", bodyComponent)

        const bodyTemplate = bodyComponent?.text || "Template"
        console.log("📝 bodyTemplate:", bodyTemplate)

        // ✅ Fill in variables from the message's extra_info.components
        const bodyParams = parsed.components?.find((c) => c.type?.toLowerCase() === "body")?.parameters || []
        const filledBody = bodyTemplate.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
          return bodyParams[+idx - 1]?.text || ""
        })

        console.log("✅ filledBody:", filledBody)

        // ✅ Footer and Header values
        const footerText = components.find((c) => c.type?.toLowerCase() === "footer")?.text || ""
        const headerImage =
          parsed.components?.find((c) => c.type?.toLowerCase() === "header")?.parameters?.[0]?.image?.link || null

        return {
          id: messageId,
          type: MessageType.TEMPLATE,
          templateName,
          headerText: templateName,
          bodyText: filledBody,
          footerText,
          headerImage,
          isRead: apiMessage.read === 1,
          role, // ensure `role` is in scope
          timestamp: apiMessage.timestamp,
        }
      }
      case "location":
        return {
          id: messageId,
          type: MessageType.LOCATION,
          latitude: Number.parseFloat(apiMessage.latitude) || 0,
          longitude: Number.parseFloat(apiMessage.longitude) || 0,
          locationName: apiMessage.address || "Shared Location",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      case "contact":
        return {
          id: messageId,
          type: MessageType.CONTACT,
          contactName: apiMessage.contact_name || "Unknown Contact",
          contactPhone: apiMessage.wa_id || "",
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
      default:
        return {
          id: messageId,
          type: MessageType.TEXT,
          text: apiMessage.message_body || `${apiMessage.message_type} message`,
          isRead: apiMessage.read === 1,
          role,
          timestamp,
        }
    }
  }

  const fetchUserMessages = async (userId, page = 1, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setMessagesLoading(true)
        setMessagesError(null)
      } else {
        setLoadingMoreMessages(true)
      }

      const wabaId = sessionStorage.getItem("361462453714220") || "361462453714220"
      const accessToken =
        sessionStorage.getItem("Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7") ||
        "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

      if (!wabaId || !accessToken) {
        throw new Error("Missing authentication data")
      }

      // API call with page parameter
      const response = await axios.get(`${BASE_URL}/api/phone/get/${wabaId}/${userId}/${page}`)
      console.log(`Messages API Response for page ${page}:`, response.data)

      // Transform API messages to component format
      const transformedMessages = Array.isArray(response.data)
        ? await Promise.all(response.data.map(transformApiMessage))
        : []

      // Check if there are more messages (if current page has less than expected messages, no more pages)
      const hasMore = transformedMessages.length > 0

      return { messages: transformedMessages, hasMore }
    } catch (error) {
      console.error(`Error fetching messages for page ${page}:`, error?.response?.data || error.message)
      if (!isLoadMore) {
        setMessagesError("Failed to load messages")
      }
      return { messages: [], hasMore: false }
    } finally {
      if (!isLoadMore) {
        setMessagesLoading(false)
      } else {
        setLoadingMoreMessages(false)
      }
    }
  }

  const loadMoreMessages = async () => {
    if (!selectedUser || !hasMoreMessages || loadingMoreMessages) return

    const container = messagesContainerRef.current
    if (!container) return

    const previousScrollHeight = container.scrollHeight
    const nextPage = currentPage + 1

    const { messages: newMessages, hasMore } = await fetchUserMessages(selectedUser.waId, nextPage, true)

    if (newMessages.length > 0) {
      const updatedUser = {
        ...selectedUser,
        messages: [...newMessages.reverse(), ...selectedUser.messages],
      }
      setSelectedUser(updatedUser)

      const updatedUsers = userList.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      setUserList(updatedUsers)

      setCurrentPage(nextPage)

      setTimeout(() => {
        preserveScrollPosition(previousScrollHeight)
      }, 50)
    }

    setHasMoreMessages(hasMore)
  }

  const handleScroll = () => {
    if (!messagesContainerRef.current || loadingMoreMessages || !hasMoreMessages) return

    const container = messagesContainerRef.current
    const scrollTop = container.scrollTop
    const scrollThreshold = 100 // Load more when 100px from top

    // Check if user is near bottom
    checkIfNearBottom()

    // Load more messages when scrolled near the top
    if (scrollTop <= scrollThreshold && !isScrolling) {
      setIsScrolling(true)
      loadMoreMessages().finally(() => {
        // Reset scrolling flag after a delay
        setTimeout(() => setIsScrolling(false), 1000)
      })
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [selectedUser?.waId, hasMoreMessages, loadingMoreMessages, isScrolling, currentPage])

  // Auto-scroll to bottom when messages change (only if user was near bottom)
  useEffect(() => {
    if (selectedUser && selectedUser.messages && shouldScrollToBottom && isNearBottom) {
      setTimeout(() => {
        scrollToBottom(false) // Instant scroll for initial load
      }, 100)
    }
  }, [selectedUser, shouldScrollToBottom, isNearBottom])

  // API call function to fetch chats
  const fetchChats = async () => {
    try {
      setLoading(true)
      setError(null)

      const wabaId = sessionStorage.getItem("361462453714220") || "361462453714220"
      const accessToken =
        sessionStorage.getItem("Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7") ||
        "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

      if (!wabaId || !accessToken) {
        console.error("Missing waba_id or auth_token in sessionStorage")
        throw new Error("Missing authentication data")
      }

      const response = await axios.get(`${BASE_URL}/api/phone/get/chats/${wabaId}?accessToken=${accessToken}`)
      console.log("API Response:", response.data)

      const transformedData = Array.isArray(response.data)
        ? response.data.map((chat, index) => {
            const { firstName, lastName } = parseContactName(chat.contact_name)
            return {
              id: chat.User_ID || index + 1,
              firstName: firstName,
              lastName: lastName,
              profileImage: `${firstName.charAt(0)}${lastName.charAt(0)}`,
              source: "WhatsApp",
              creationTime: formatDate(chat.first_message_date),
              lastActivity: formatLastActivity(chat.last_message_date),
              phone: chat.wa_id_or_sender || "+1234567890",
              notes: "",
              messageCount: chat.message_count || 0,
              totalPages: chat.total_pages || 0,
              activeLast24Hours: chat.active_last_24_hours || false,
              remainingTime: formatRemainingTime(chat.last_message_date),
              // chat.remaining_time || "0h 0m 0s",
              userName: chat.user_name || "Unknown",
              waId: chat.wa_id_or_sender,
              messages: [],
            }
          })
        : []

      console.log("Transformed Data:", transformedData)
      setUserList(transformedData)
    } catch (error) {
      console.error("Error fetching chats:", error?.response?.data || error.message)
      setError("Failed to load chats. Please try again.")
      setUserList([
        {
          id: 1,
          firstName: "Demo",
          lastName: "User",
          profileImage: "DU",
          source: "Source Web",
          creationTime: "Mar 20, 2025, 10:54:16 PM",
          lastActivity: "2025-04-11 14:30",
          phone: "+1234567890",
          notes: "",
          waId: "918857808284",
          messages: [
            {
              id: "demo-msg-1",
              type: MessageType.TEXT,
              text: "*API connection failed.* This is _demo data_ with ~formatting~ and `code`.\n\nNew line test.",
              isRead: true,
              timestamp: "10:30 AM",
              // SWAPPED: Demo message now has "assistant" role to appear on right
              role: "assistant",
            },
          ],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch chats on component mount
  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowSidebar(!mobile || !selectedUser ? true : false)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [selectedUser])

  const handleTemplateSelect = () => {
    setMessageType(MessageType.TEMPLATE)
    setShowTemplateMenu(false)
  }

  const handleInteractiveSelect = () => {
    setMessageType(MessageType.INTERACTIVE)
    setShowInteractiveMenu(false)
  }

  const handleSendMessage = () => {
    if (
      !newMessage.trim() &&
      !selectedImage &&
      !selectedFile &&
      !selectedAudio &&
      !selectedVideo &&
      !selectedSticker &&
      !selectedLocation &&
      !selectedContact
    )
      return

    let newMsg = null
    const messageId = `new-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    if (selectedImage) {
      newMsg = {
        id: messageId,
        type: MessageType.IMAGE,
        imageUrl: URL.createObjectURL(selectedImage),
        caption: newMessage.trim() || "",
        isRead: true,
        // SWAPPED: New messages now get "assistant" role to appear on right
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedFile) {
      newMsg = {
        id: messageId,
        type: MessageType.DOCUMENT,
        documentName: selectedFile.name,
        documentSize: `${Math.round(selectedFile.size / 1024)} KB`,
        documentUrl: URL.createObjectURL(selectedFile),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedAudio) {
      newMsg = {
        id: messageId,
        type: MessageType.AUDIO,
        audioName: selectedAudio.name,
        audioSize: `${Math.round(selectedAudio.size / 1024)} KB`,
        audioUrl: URL.createObjectURL(selectedAudio),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedVideo) {
      newMsg = {
        id: messageId,
        type: MessageType.VIDEO,
        videoUrl: URL.createObjectURL(selectedVideo),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedSticker) {
      newMsg = {
        id: messageId,
        type: MessageType.STICKER,
        stickerUrl: URL.createObjectURL(selectedSticker),
        isAnimated: selectedSticker.type.includes("gif"),
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (messageType === MessageType.TEMPLATE) {
      newMsg = {
        id: messageId,
        type: MessageType.TEMPLATE,
        templateName: "Custom Template",
        headerText: "Custom Message",
        bodyText: newMessage,
        footerText: "Reply to continue",
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedLocation) {
      newMsg = {
        id: messageId,
        type: MessageType.LOCATION,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName: selectedLocation.name || "Shared Location",
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else if (selectedContact) {
      newMsg = {
        id: messageId,
        type: MessageType.CONTACT,
        contactName: selectedContact.name,
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    } else {
      newMsg = {
        id: messageId,
        type: MessageType.TEXT,
        text: newMessage,
        isRead: true,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    }

    // Check if user is near bottom before adding message
    const wasNearBottom = checkIfNearBottom()

    const updatedUsers = userList.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            messages: [...user.messages, newMsg],
          }
        : user,
    )

    setUserList(updatedUsers)
    const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
    setSelectedUser(updatedUser)

    if (wasNearBottom) {
      setTimeout(() => {
        scrollToBottom(true)
      }, 100)
    }

    setNewMessage("")
    setSelectedImage(null)
    setSelectedFile(null)
    setSelectedAudio(null)
    setSelectedVideo(null)
    setSelectedSticker(null)
    setSelectedLocation(null)
    setSelectedContact(null)

    // Reset file inputs
    if (audioInputRef.current) audioInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const handleUserSelect = async (user) => {
    setSelectedUser(user)
    if (isMobile) setShowSidebar(false)

    // Reset pagination states for new user
    setCurrentPage(1)
    setHasMoreMessages(true)
    setShouldScrollToBottom(true)
    setIsNearBottom(true)

    if (user.waId) {
      const { messages, hasMore } = await fetchUserMessages(user.waId, 1, false)
      const updatedUser = { ...user, messages: messages.reverse() }
      setSelectedUser(updatedUser)
      setHasMoreMessages(hasMore)

      // Update the user in the list with fetched messages
      const updatedUsers = userList.map((u) => (u.id === user.id ? updatedUser : u))
      setUserList(updatedUsers)
    }
  }

  const handleBackToList = () => {
    if (isMobile) setShowSidebar(true)
  }

  const toggleInfoPanel = () => setShowInfoPanel((prev) => !prev)

  const toggleAttachmentMenu = () => setShowAttachmentMenu((prev) => !prev)

  const toggleAttachmentMenu2 = () => setShowAttachmentMenu2((prev) => !prev)

  const handleImageSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedImage(file)
        setMessageType(MessageType.IMAGE)
        setShowAttachmentMenu(false)
      }
    }
    input.click()
  }

  const handleDocumentSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx,.txt,.xls,.xlsx"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedFile(file)
        setMessageType(MessageType.DOCUMENT)
        setShowAttachmentMenu(false)
      }
    }
    input.click()
  }

  const handleAudioSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "audio/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedAudio(file)
        setMessageType(MessageType.AUDIO)
        setShowAttachmentMenu(false)
      }
    }
    input.click()
  }

  const handleVideoSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "video/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedVideo(file)
        setMessageType(MessageType.VIDEO)
        setShowAttachmentMenu(false)
      }
    }
    input.click()
  }

  const handleStickerSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/gif,image/png,image/jpeg,image/webp"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setSelectedSticker(file)
        setMessageType(MessageType.STICKER)
        setShowAttachmentMenu(false)
      }
    }
    input.click()
  }

  const handleLocationSelect = () => {
    const mockLocation = {
      latitude: 40.7128,
      longitude: -74.006,
      name: "New York City",
    }
    setSelectedLocation(mockLocation)
    setMessageType(MessageType.LOCATION)
    setShowAttachmentMenu(false)
  }

  const handleContactSelect = () => {
    const mockContact = {
      name: "",
      role: "assistant",
    }
    setSelectedContact(mockContact)
    setMessageType(MessageType.CONTACT)
    setShowAttachmentMenu(false)
  }

  const handleReaction = (messageIndex, emoji) => {
    if (!selectedUser) return

    const newReaction = {
      id: `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: MessageType.REACTION,
      originalMessageId: messageIndex,
      emoji: emoji,
      isRead: true,
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedUsers = userList.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            messages: [...user.messages, newReaction],
          }
        : user,
    )

    setUserList(updatedUsers)
    const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
    setSelectedUser(updatedUser)

    setShowReactionMenu(false)
    setSelectedMessageForReaction(null)
  }

  const toggleReactionMenu = (messageIndex) => {
    setSelectedMessageForReaction(messageIndex)
    setShowReactionMenu(!showReactionMenu)
  }

  const toggleTemplateMenu = () => setShowTemplateMenu((prev) => !prev)

  const toggleInteractiveMenu = () => setShowInteractiveMenu((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAttachmentMenu && !event.target.closest(".attachment-menu-container")) {
        setShowAttachmentMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showAttachmentMenu])

  useEffect(() => {
    const handleClickOutside2 = (event) => {
      if (showAttachmentMenu2 && !event.target.closest(".attachment-smile-container")) {
        setShowAttachmentMenu2(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside2)
    return () => document.removeEventListener("mousedown", handleClickOutside2)
  }, [showAttachmentMenu2])

  useEffect(() => {
    const handleClickOutside3 = (event) => {
      if (showReactionMenu && !event.target.closest(".reaction-menu-container")) {
        setShowReactionMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside3)
    return () => document.removeEventListener("mousedown", handleClickOutside3)
  }, [showReactionMenu])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading chats...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchChats}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
          isMobile ? "w-full absolute inset-2 z-10" : "w-full md:w-1/3"
        }`}
      >
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-4">
            {isMobile && selectedUser && (
              <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Menu size={18} className="sm:w-5 sm:h-5" />
            <h1 className="text-base sm:text-lg font-semibold">Chat List</h1>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4 sm:mt-6">Search</label>
            <input
              type="text"
              placeholder="Searching....."
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <hr className="border-gray-300" />
        </div>
        <div className="overflow-y-auto px-3 sm:px-4 pb-4 space-y-2 sm:space-y-3 flex-1">
          {userList
            .filter((user) => {
              const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
              return fullName.includes(searchTerm.toLowerCase())
            })
            .map((user, index) => (
              <div
                key={generateUserKey(user, index)}
                onClick={() => handleUserSelect(user)}
                className="flex justify-between items-start gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                  <div className="relative">
                    <div
                      className={`${
                        user.activeLast24Hours ? "bg-green-600 text-white" : "bg-gray-400 text-black"
                      } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0`}
                    >
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                    {user.activeLast24Hours && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0">
                      <p className="font-medium truncate max-w-[120px] sm:max-w-[140px] text-sm sm:text-base">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {user.remainingTime}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-black whitespace-nowrap ml-1 sm:ml-2 shrink-0 mt-1">
                  {user.messageCount} message
                </span>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${
          !showSidebar || !isMobile ? "flex" : "hidden"
        } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
          isMobile ? "w-full" : "w-full md:w-2/3"
        }`}
      >
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between gap-2 sm:gap-4 border-b p-3 sm:p-4">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button onClick={handleBackToList} className="md:hidden text-gray-500 hover:text-gray-700 mr-1">
                    <Menu size={20} />
                  </button>
                )}
                <div className="bg-gray-400 text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                  {selectedUser.firstName.charAt(0)}
                  {selectedUser.lastName.charAt(0)}
                </div>
                <h2 className="text-sm sm:text-base md:text-lg font-semibold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
              </div>
              <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600">
                <Info size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gray-200 text-left"
              style={{ scrollBehavior: "smooth" }}
            >
              {loadingMoreMessages && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 text-xs sm:text-sm">Loading more messages...</span>
                </div>
              )}

              {messagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading messages...</span>
                </div>
              ) : messagesError ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-red-600 text-sm sm:text-base">{messagesError}</p>
                </div>
              ) : selectedUser.messages.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500 text-sm sm:text-base">No messages found</p>
                </div>
              ) : (
                selectedUser.messages.map((msg, index) => (
                  <div
                    key={generateMessageKey(msg, index, selectedUser.waId || selectedUser.id)}
                    className="relative group"
                  >
                    <MessageRenderer
                      message={msg}
                      // SWAPPED: user role now goes to left, assistant role goes to right
                      position={msg.role === "user" ? "left" : "right"}
                      userList={userList}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="p-2 sm:p-3 md:p-4 border-t flex flex-col gap-2">
              {(selectedImage ||
                selectedFile ||
                selectedAudio ||
                selectedVideo ||
                selectedSticker ||
                selectedLocation ||
                selectedContact) && (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md overflow-x-auto">
                  {selectedImage && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                        alt="Selected"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-md"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                      >
                        <X size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  )}
                  {selectedFile && (
                    <div className="relative flex items-center bg-white p-2 rounded-md flex-shrink-0">
                      <FileMinus size={16} className="text-gray-600 mr-2 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                        {selectedFile.name}
                      </span>
                      <button onClick={() => setSelectedFile(null)} className="ml-2 text-red-500">
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                  {selectedAudio && (
                    <div className="relative flex items-center bg-white p-2 rounded-md flex-shrink-0">
                      <Music size={16} className="text-pink-500 mr-2 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                        {selectedAudio.name}
                      </span>
                      <button onClick={() => setSelectedAudio(null)} className="ml-2 text-red-500">
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                  {selectedVideo && (
                    <div className="relative flex items-center bg-white p-2 rounded-md flex-shrink-0">
                      <Video size={16} className="text-orange-500 mr-2 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                        {selectedVideo.name}
                      </span>
                      <button onClick={() => setSelectedVideo(null)} className="ml-2 text-red-500">
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                  {selectedSticker && (
                    <div className="relative flex-shrink-0">
                      <img
                        src={URL.createObjectURL(selectedSticker) || "/placeholder.svg"}
                        alt="Sticker"
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-md"
                      />
                      <button
                        onClick={() => setSelectedSticker(null)}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                      >
                        <X size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  )}
                  {selectedLocation && (
                    <div className="relative flex items-center bg-white p-2 rounded-md flex-shrink-0">
                      <MapPin size={16} className="text-red-500 mr-2 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                        {selectedLocation.name}
                      </span>
                      <button onClick={() => setSelectedLocation(null)} className="ml-2 text-red-500">
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                  {selectedContact && (
                    <div className="relative flex items-center bg-white p-2 rounded-md flex-shrink-0">
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">
                        {selectedContact.name}
                      </span>
                      <button onClick={() => setSelectedContact(null)} className="ml-2 text-red-500">
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="relative attachment-smile-container">
                    {showAttachmentMenu2 && (
                      <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 w-36 grid grid-cols-2 z-50"></div>
                    )}
                  </div>
                  <div className="relative attachment-menu-container">
                    <button className="text-gray-500 hover:text-blue-600 p-1" onClick={toggleAttachmentMenu}>
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    {showAttachmentMenu && (
                      <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 w-20 sm:w-24 z-50">
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-xs sm:text-sm w-full"
                          onClick={toggleTemplateMenu}
                        >
                          <Text size={16} className="mb-1 text-indigo-500 sm:w-5 sm:h-5" />
                          Template
                        </button>
                        {showTemplateMenu && (
                          <div className="absolute bottom-16 left-8 sm:left-10 bg-white rounded-lg shadow-lg border p-2 w-48 sm:w-64 z-50 template-menu-container">
                            <div className="p-2">
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-xs sm:text-sm"
                              >
                                Marketing Template
                              </button>
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-xs sm:text-sm"
                              >
                                Utility Template
                              </button>
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-xs sm:text-sm"
                              >
                                Authentication Template
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border-0 outline-none px-2 sm:px-3 py-1 text-sm sm:text-base bg-transparent"
                />

                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="text-gray-500 hover:text-blue-600 p-1">
                    <Mic size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="sm:w-5 sm:h-5"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <img
              src="/chat.svg"
              alt="WhatsApp"
              className="hidden sm:block w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 sm:mb-6"
            />
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Click a user to chat</h2>
          </div>
        )}
      </div>

      {showInfoPanel && selectedUser && (
        <div
          className={`${
            isMobile
              ? "fixed inset-0 bg-white z-30 p-4"
              : "absolute right-0 top-16 bottom-4 w-64 sm:w-72 md:w-80 bg-white shadow-2xl border-l rounded-l-2xl p-4 z-20"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-base sm:text-lg">User Info</h3>
            <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700">
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-gray-300 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mx-auto sm:ml-32">
              {selectedUser.firstName.charAt(0)}
              {selectedUser.lastName.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 text-center sm:ml-28">
              <p className="truncate max-w-[200px] sm:max-w-[140px] font-semibold text-sm sm:text-base">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <span className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-md mt-2 inline-block">Lead</span>
            </div>
            <hr />
            <h1 className="font-semibold text-base sm:text-lg">Details</h1>
            <div className="flex items-center gap-2 mt-2">
              <MessageSquareTextIcon size={14} className="text-orange-500 sm:w-4 sm:h-4" />
              <span className="font-extralight text-xs sm:text-sm">
                Source <span className="text-indigo-500">{selectedUser.source}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={14} className="text-cyan-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
              <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
                Creation Time <span className="text-indigo-500">{selectedUser.creationTime}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-orange-300 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
              <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
                Last Activity <span className="text-indigo-500">{selectedUser.lastActivity}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-green-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
              <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
                Phone <span className="text-indigo-500">{selectedUser.phone}</span>
              </span>
            </div>
          </div>
          <hr className="mt-3" />
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm sm:text-base">Notes</h4>
              <button className="text-blue-600 hover:text-blue-800">
                <Plus size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
