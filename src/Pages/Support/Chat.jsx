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
//   FileMinus,
//   Check,
//   CheckCheck,
//   PaperclipIcon,
//   ImageIcon,
//   VideoIcon,
//   FileIcon,
//   ChevronDown,
// } from "lucide-react"
// import { useState, useEffect, useRef } from "react"
// import axios from "axios"

// const BASE_URL = "https://waba.mpocket.in"
// // IMPORTANT: Replace with your actual WhatsApp phone number associated with your WABA ID.
// // This number is used to identify messages sent by your system.
// const OUR_OWN_PHONE_NUMBER = "me"

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

// const MessageStatus = {
//   SENDING: "sending",
//   SENT: "sent",
//   DELIVERED: "delivered",
//   READ: "read",
//   FAILED: "failed",
// }

// const MessageTicks = ({ status, timestamp, position }) => {
//   const renderTicks = () => {
//     const alignmentClass = position === "left" ? "justify-start" : "justify-end"
//     // For messages on the left (incoming from contact), only show timestamp
//     if (position === "left") {
//       return (
//         <div className={`flex items-center gap-1 ${alignmentClass}`}>
//           <span className="text-xs text-gray-500">{timestamp}</span>
//         </div>
//       )
//     }
//     // For messages on the right (outgoing from us), render ticks based on status
//     switch (status) {
//       case MessageStatus.SENT:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <Check size={12} className="text-gray-400" />
//           </div>
//         )
//       case MessageStatus.DELIVERED:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <div className="relative w-4 h-4">
//               <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
//             </div>
//           </div>
//         )
//       case MessageStatus.READ:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <div className="relative w-4 h-4">
//               <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
//             </div>
//           </div>
//         )
//       case MessageStatus.SENDING:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <Check size={12} className="text-gray-400" />
//           </div>
//         )
//       case MessageStatus.FAILED:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <X size={12} className="text-red-500" />
//             <span className="text-xs text-red-500">Failed</span>
//           </div>
//         )
//       default:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//           </div>
//         )
//     }
//   }
//   return <div className="mt-1 text-left">{renderTicks()}</div>
// }

// const STORAGE_KEY = "whatsapp_chat_messages" // Not directly used, but good to keep
// const USER_STORAGE_KEY = "whatsapp_chat_users"

// const saveMessagesToStorage = (userList) => {
//   try {
//     localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userList))
//   } catch (error) {
//     console.error("Failed to save messages to localStorage:", error)
//   }
// }

// const loadMessagesFromStorage = () => {
//   try {
//     const stored = localStorage.getItem(USER_STORAGE_KEY)
//     return stored ? JSON.parse(stored) : []
//   } catch (error) {
//     console.error("Failed to load messages from localStorage:", error)
//     return []
//   }
// }

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

// const formatRemainingTime = (dateString) => {
//   if (!dateString) return "No recent activity"
//   try {
//     const date = new Date(dateString)
//     if (isYesterday(date)) {
//       return "Yesterday"
//     }
//     if (isToday(date)) {
//       return "Today"
//     }
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
//     let date
//     if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
//       // If it's a string that can be parsed as a number (Unix timestamp in seconds)
//       date = new Date(Number.parseInt(timestamp) * 1000)
//     } else if (typeof timestamp === "number") {
//       // If it's already a number (Unix timestamp in milliseconds)
//       date = new Date(timestamp)
//     } else {
//       // Fallback for other cases, e.g., "10:30 AM" string or invalid input
//       date = new Date()
//     }
//     return date.toDateString()
//   } catch (error) {
//     console.error("Error getting message date:", error)
//     return new Date().toDateString()
//   }
// }

// const DateSeparator = ({ date }) => (
//   <div className="flex items-center justify-center my-2 sm:my-4">
//     <div className="bg-white px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-sm border text-xs text-gray-600 font-medium">
//       {formatDateLabel(date)}
//     </div>
//   </div>
// )

// const formatText = (text, messageType = "text") => {
//   if (!text) return ""
//   let formattedText = text.toString()
//   formattedText = formattedText
//     .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
//     .replace(/_([^_\n]+)_/g, "<em>$1</em>")
//     .replace(/~([^~\n]+)~/g, "<del>$1</del>")
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

// // Define consistent classes for message bubbles
// // Outgoing (user's system) messages are on the right (indigo), incoming (contact) on the left (gray)
// const outgoingMessageClasses = "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
// const incomingMessageClasses = "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"

// const TextMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative text-sm sm:text-base`}
//   >
//     {message.headerImageUrl && ( // Conditionally render header image for templates
//       <img
//         src={message.headerImageUrl || "/placeholder.svg"}
//         alt="Template Header"
//         className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
//         onError={(e) => {
//           e.target.src = "/placeholder.svg?height=240&width=240"
//         }}
//       />
//     )}
//     <div
//       dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
//       className="whitespace-pre-wrap break-words"
//     />
//     {/* MessageTicks position is determined by the parent */}
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// const ImageMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
//   >
//     <img
//       src={message.imageUrl || message.mediaUrl || "/placeholder.svg?height=240&width=240"}
//       alt={message.caption || "Shared image"}
//       className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
//       onError={(e) => {
//         e.target.src = "/placeholder.svg?height=240&width=240"
//       }}
//     />
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// // const DocumentMessage = ({ message, position }) => (
// //   <div
// //     className={`${
// //       position === "left" ? incomingMessageClasses : outgoingMessageClasses
// //     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
// //   >
// //     <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
// //       <div className="p-2 rounded-md mr-2">
// //         <FileMinus size={18} className="text-blue-600" />
// //       </div>
// //       <div className="flex-1 min-w-0">
// //         <p className="text-sm font-medium truncate">{message.documentName || message.fileName || "Document"}</p>
// //         <p className="text-xs text-gray-500">{message.documentSize || "Unknown size"}</p>
// //       </div>
// //       <a
// //         href={message.documentUrl || message.mediaUrl}
// //         className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
// //         download
// //       >
// //         {/* <Download size={16} /> */}
// //       </a>
// //     </div>
// //     {message.caption && (
// //       <div
// //         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "document") }}
// //         className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
// //       />
// //     )}
// //     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
// //   </div>
// // )

// const DocumentMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
//   >
//     <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
//       <div className="p-2 rounded-md mr-2">
//         <FileMinus size={18} className="text-blue-600" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium truncate">
//           {message.documentName || message.fileName || "Document"}
//         </p>
//         <p className="text-xs text-gray-500">
//           {message.documentSize || "Unknown size"}
//         </p>
//       </div>
//       <a
//         href={message.documentUrl || message.mediaUrl}
//         className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <Download size={16} />
//       </a>
//     </div>

//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{
//           __html: formatText(message.caption, "document"),
//         }}
//         className={`text-sm ${
//           position === "left" ? "text-gray-600" : "text-black"
//         } whitespace-pre-wrap break-words`}
//       />
//     )}

//     <MessageTicks
//       status={message.status}
//       timestamp={message.timestamp}
//       position={position}
//     />
//   </div>
// );

// const formatBytes = (bytes, decimals = 2) => {
//   if (bytes === 0) return "0 Bytes"
//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
//   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
// }


// const TemplateMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm relative`}
//   >
//     {/* Show header image if exists */}
//     {message.headerImage && (
//       <img
//         src={message.headerImage || "/placeholder.svg?height=240&width=240"}
//         alt="Header"
//         className="w-full object-cover rounded-t-xl"
//         onError={(e) => {
//           e.target.src = "/placeholder.svg?height=240&width=240"
//         }}
//       />
//     )}
//     <div className="p-3">
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.bodyText, "template") }}
//         className="text-sm whitespace-pre-wrap break-words"
//       />
//     </div>
//     {/* Use MessageTicks for timestamp and status */}
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// const VideoMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl inline-flex flex-col relative max-w-[280px] sm:max-w-xs md:max-w-sm`}
//   >
//     <video
//       src={message.videoUrl || message.mediaUrl || "#"}
//       controls
//       className="rounded-md mb-2 w-full max-h-48 sm:max-h-60 object-cover"
//     >
//       Your browser does not support the video tag.
//     </video>
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "video") }}
//         className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
//       />
//     )}
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// // MessageRenderer now receives the 'position' prop directly
// const MessageRenderer = ({ message, position }) => {
//   const Component = (() => {
//     switch (message.type) {
//       case MessageType.IMAGE:
//         return ImageMessage
//       case MessageType.DOCUMENT:
//         return DocumentMessage
//       case MessageType.VIDEO:
//         return VideoMessage
//       case MessageType.TEMPLATE:
//         return TemplateMessage
//       case MessageType.TEXT:
//       default:
//         return TextMessage
//     }
//   })()
//   return (
//     <div className={`flex ${position === "left" ? "justify-start" : "justify-end"} mb-2 sm:mb-3`}>
//       <Component message={message} position={position} />
//     </div>
//   )
// }

// // Modified generateMessageKey to use message.id for stability
// const generateMessageKey = (message) => {
//   // Use message.id as the primary identifier.
//   // If message.id is not yet available (e.g., for a new local message),
//   // use a temporary unique ID based on timestamp and a random string.
//   return message.id || `temp-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
// }

// // Modified generateUserKey to use a stable unique identifier
// const generateUserKey = (user) => {
//   // Use a stable, unique identifier from the user object.
//   // user.id (from chat.User_ID) or user.waId (from chat.wa_id_or_sender) should be unique.
//   return user.id || user.waId || `temp-user-${Math.random().toString(36).substr(2, 9)}`
// }

// // Helper to determine status order for merging
// const getStatusOrder = (status) => {
//   switch (status) {
//     case MessageStatus.SENDING:
//       return 1
//     case MessageStatus.SENT:
//       return 2
//     case MessageStatus.DELIVERED:
//       return 3
//     case MessageStatus.READ:
//       return 4
//     default:
//       return 0
//   }
// }

// // New mergeMessages function for robust de-duplication and status prioritization
// const mergeMessages = (newMessages, existingMessages) => {
//   const uniqueMessagesMap = new Map() // Key: message.id
//   // Add existing messages first. This ensures local messages (especially pending ones) are considered.
//   existingMessages.forEach((msg) => {
//     uniqueMessagesMap.set(msg.id, msg)
//   })

//   // Now, iterate through new messages (e.g., from API fetch or new local send).
//   newMessages.forEach((newMessage) => {
//     const existing = uniqueMessagesMap.get(newMessage.id)
//     if (existing) {
//       // Message with this ID already exists. Decide which one to keep/merge.
//       // Prioritize the new message if it's an API message and the existing is local,
//       // or if the new message has a more advanced status.
//       if (
//         (!newMessage.isLocalMessage && existing.isLocalMessage) || // New is API, existing is local temp
//         getStatusOrder(newMessage.status) > getStatusOrder(existing.status) // New has higher status
//       ) {
//         uniqueMessagesMap.set(newMessage.id, { ...existing, ...newMessage }) // Merge properties, new overwrites old
//       }
//       // Otherwise, keep the existing one (it's either API and new is local, or existing has higher/equal status)
//     } else {
//       // Message is new, add it
//       uniqueMessagesMap.set(newMessage.id, newMessage)
//     }
//   })

//   // Convert map values back to an array and sort by numeric timestamp (sentAt)
//   return Array.from(uniqueMessagesMap.values()).sort((a, b) => {
//     return (a.sentAt || 0) - (b.sentAt || 0)
//   })
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
//   const [messageType, setMessageType] = useState(MessageType.TEXT) // eslint-disable-line no-unused-vars
//   const [showAttachmentMenu, setShowAttachmentMenu] = useState(false) // eslint-disable-line no-unused-vars
//   const [searchTerm, setSearchTerm] = useState("")
//   const [messagesLoading, setMessagesLoading] = useState(false)
//   const [messagesError, setMessagesError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [hasMoreMessages, setHasMoreMessages] = useState(true)
//   const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
//   const messagesContainerRef = useRef(null)
//   const [isScrolling, setIsScrolling] = useState(false)
//   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
//   const [isNearBottom, setIsNearBottom] = useState(true)
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([]) // eslint-disable-line no-unused-vars
//   const [uploadingFile, setUploadingFile] = useState(false)
//   const imageInputRef = useRef(null)
//   const videoInputRef = useRef(null)
//   const documentInputRef = useRef(null)
//   const scrollTimeoutRef = useRef(null)

//   // New states for popup functionality
//   const [showPopup, setShowPopup] = useState(false)
//   const [selectedOption, setSelectedOption] = useState("") // Stores template name or "custom"
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [dropdownContent, setDropdownContent] = useState("") // Editable content for preview/custom message

//   // New states for template fetching
//   const [templates, setTemplates] = useState([])
//   const [loadingTemplates, setLoadingTemplates] = useState(false)
//   const [templatesError, setTemplatesError] = useState(null)
//   const [selectedTemplateObject, setSelectedTemplateObject] = useState(null) // Stores the full selected template object
//   const [originalTemplateBody, setOriginalTemplateBody] = useState("") // To check if content was modified
//   const [templateBodyParameters, setTemplateBodyParameters] = useState([]) // For template variables

//   const toggleAttachmentMenu3 = () => setIsOpen((prev) => !prev)

//   const handleFileSend = async (e, type) => {
//     const file = e.target.files[0]
//     if (!file) return

//     setUploadingFile(true)
//     const messageId = `file-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Temporary local ID
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now()

//     const newFileMessage = {
//       id: messageId,
//       type: type,
//       text: type === "document" ? file.name : file.name || "",
//       mediaUrl: URL.createObjectURL(file),
//       imageUrl: type === "image" ? URL.createObjectURL(file) : undefined,
//       videoUrl: type === "video" ? URL.createObjectURL(file) : undefined,
//       documentUrl: type === "document" ? URL.createObjectURL(file) : undefined,
//       documentName: type === "document" ? file.name : undefined,
//       documentSize: selectedUser.file_size ? formatBytes(selectedUser.file_size) : "Unknown size",
//       fileName: file.name,
//       caption: file.name,
//       status: MessageStatus.SENDING,
//       timestamp: displayTimestamp,
//       role: "me", 
//       isRead: false,
//       isLocalMessage: true,
//       sentAt: numericTimestamp,
//       sender: OUR_OWN_PHONE_NUMBER,
//     }
    
//     const wasNearBottom = checkIfNearBottom()

//     // Add the new message to the selected user's messages
//     setUserList((prevUsers) => {
//       const updatedUsers = prevUsers.map((user) =>
//         user.id === selectedUser.id
//           ? {
//               ...user,
//               messages: [...(user.messages || []), newFileMessage],
//             }
//           : user,
//       )
//       const updatedSelectedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//       setSelectedUser(updatedSelectedUser)
//       saveMessagesToStorage(updatedUsers)
//       return updatedUsers
//     })

//     if (wasNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(true)
//       }, 100)
//     }

//     try {
//       // Validate selected user & phone number
//       if (!selectedUser?.wa_id_or_sender) {
//         alert("Please select a user to send message")
//         e.target.value = null
//         setUploadingFile(false)
//         // Update status to FAILED for the message
//         setUserList((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                   ),
//                 }
//               : user,
//           ),
//         )
//         return
//       }

//       let phoneNumber = selectedUser.waId || selectedUser.phone || ""
//       if (phoneNumber.startsWith("+")) phoneNumber = phoneNumber.slice(1)
//       phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//       // Replace with your actual access token and WABA ID
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//       // Upload file to server (S3)
//       const formData = new FormData()
//       formData.append("file", file)
//       const uploadResponse = await fetch(`${BASE_URL}/api/${wabaId}/upload-file`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: formData,
//       })

//       if (!uploadResponse.ok) {
//         const err = await uploadResponse.json()
//         alert(`Upload failed: ${err?.message || "Unknown error"}`)
//         throw new Error(`Upload failed: ${err?.message || "Unknown error"}`)
//       }
//       const uploadResult = await uploadResponse.json()
//       const uploadedUrl = uploadResult.data?.s3Url || uploadResult?.s3Url
//       if (!uploadedUrl) {
//         alert("Upload failed: No media URL returned")
//         throw new Error("Upload failed: No media URL returned")
//       }

//       // Prepare message body for WhatsApp send
//       const mediaObject = {
//         link: uploadedUrl,
//       }
//       if (type === "image" || type === "video") {
//         mediaObject.caption = file.name
//       }
//       if (type === "document") {
//         mediaObject.filename = file.name
//       }

//       const messageBody = {
//         messaging_product: "whatsapp",
//         to: phoneNumber,
//         type,
//         [type]: mediaObject,
//       }

//       // Send message API call
//       const sendMessageResponse = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(messageBody),
//       })

//       const sendMessageResult = await sendMessageResponse.json()

//       if (!sendMessageResponse.ok || !sendMessageResult.messages?.length) {
//         alert(
//           `Send message failed: ${
//             sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
//           }`,
//         )
//         throw new Error(
//           `Send message failed: ${
//             sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
//           }`,
//         )
//       }

//       const apiReturnedMessageId = sendMessageResult.messages[0].id

//       // Update the message in state with the API ID and confirmed status
//       setUserList((prevUsers) => {
//         const updatedUsers = prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId // Match by the temporary local ID
//                     ? {
//                         ...msg,
//                         id: apiReturnedMessageId || msg.id, // IMPORTANT: Update the message ID to API's ID
//                         mediaUrl: uploadedUrl, // Ensure mediaUrl is the S3 URL
//                         imageUrl: type === "image" ? uploadedUrl : undefined,
//                         videoUrl: type === "video" ? uploadedUrl : undefined,
//                         documentUrl: type === "document" ? uploadedUrl : undefined,
//                         status: MessageStatus.SENT, // Set initial API-confirmed status
//                         isLocalMessage: false, // No longer a local-only message
//                       }
//                     : msg,
//                 ),
//               }
//             : user,
//         )
//         const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//         setSelectedUser(updated)
//         saveMessagesToStorage(updatedUsers) // Save updated ID and status
//         return updatedUsers
//       })

//       simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       setIsOpen(false)
//     } catch (error) {
//       console.error("Error during upload/send:", error)
//       alert("Network error during upload or send.")
//       // Update status to FAILED for the message
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//     } finally {
//       setUploadingFile(false)
//       e.target.value = null
//     }
//   }

//   // Load messages from localStorage on component mount
//   useEffect(() => {
//     const storedUsers = loadMessagesFromStorage()
//     if (storedUsers.length > 0) {
//       setUserList(storedUsers)
//     }
//   }, [])

//   // Save messages to localStorage whenever userList changes
//   useEffect(() => {
//     if (userList.length > 0) {
//       saveMessagesToStorage(userList)
//     }
//   }, [userList])

//   const scrollToBottom = (smooth = true) => {
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current)
//     }
//     scrollTimeoutRef.current = setTimeout(() => {
//       if (messagesContainerRef.current) {
//         const container = messagesContainerRef.current
//         const scrollOptions = {
//           top: container.scrollHeight,
//           behavior: smooth ? "smooth" : "auto",
//         }
//         container.scrollTo(scrollOptions)
//       }
//     }, 50)
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

//   // Modified formatTimestamp to handle numeric timestamps (milliseconds)
//   const formatTimestamp = (rawTimestamp) => {
//     try {
//       let date
//       if (typeof rawTimestamp === "string" && !isNaN(Number(rawTimestamp))) {
//         // If it's a string that can be parsed as a number (Unix timestamp in seconds)
//         date = new Date(Number.parseInt(rawTimestamp) * 1000)
//       } else if (typeof rawTimestamp === "number") {
//         // If it's already a number (Unix timestamp in milliseconds)
//         date = new Date(rawTimestamp)
//       } else {
//         // Fallback for other cases, e.g., "10:30 AM" string or invalid input
//         date = new Date()
//       }
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     } catch (error) {
//       console.error("Error formatting timestamp:", error)
//       return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     }
//   }

//   // Modified transformApiMessage to store numeric sentAt, correct role, AND SENDER
//   const transformApiMessage = async (apiMessage) => {
//     const numericTimestamp = Number.parseInt(apiMessage.timestamp) * 1000 // API timestamp is in seconds, convert to milliseconds
//     const displayTimestamp = formatTimestamp(numericTimestamp) // Use the numeric timestamp to format for display

//     // The 'role' is kept for internal logic, but 'position' will be determined by sender comparison.
//     // Assuming apiMessage.sender is our phone number for outgoing messages, and null for incoming.
//     const role = apiMessage.sender !== null ? "user" : "assistant"
//     const messageId = apiMessage.id || `api-temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Use API ID if available

//     // Determine the actual sender for the message object.
//     // If apiMessage.sender is null, it's an incoming message, so the sender is the contact's WA ID.
//     // Otherwise, apiMessage.sender should be our phone number (for outgoing messages).
//     // Note: This assumes the API provides the contact's WA ID in a way that can be matched,
//     // or that `apiMessage.sender` is indeed the contact's number for incoming messages.
//     // Based on the original `role` logic, `apiMessage.sender` is null for incoming.
//     // So, for incoming messages, we'll use the selectedUser's wa_id_or_sender as the sender.
//     // This requires passing selectedUser.wa_id_or_sender to this function.
//     // For simplicity, we'll assume `apiMessage.sender` is the actual sender's phone number if present,
//     // otherwise, it's an incoming message from the selected user.
//     // This is a simplification and might need adjustment based on actual API response structure.
//     const senderIdentifier = apiMessage.sender || selectedUser?.wa_id_or_sender // Fallback for incoming messages

//     const commonProps = {
//       id: messageId,
//       isRead: apiMessage.read === 1,
//       role, // Keep role as is
//       timestamp: displayTimestamp, // Display string
//       sentAt: numericTimestamp, // Numeric for sorting
//       status: apiMessage.read === 1 ? MessageStatus.READ : MessageStatus.DELIVERED,
//       isLocalMessage: false, // This message came from API
//       sender: senderIdentifier, // IMPORTANT: Add the sender ID from the API or inferred
//     }

//     switch (apiMessage.message_type) {
//       case "text":
//         return {
//           ...commonProps,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || "No message content",
//         }
//       case "image":
//         return {
//           ...commonProps,
//           type: MessageType.IMAGE,
//           imageUrl: apiMessage.file_url || apiMessage.url || "/placeholder.svg?height=240&width=240",
//           mediaUrl: apiMessage.file_url || apiMessage.url,
//           caption: apiMessage.message_body || "",
//         }
//         case "document":
//           return {
//             ...commonProps,
//             type: MessageType.DOCUMENT,
//             documentName: apiMessage.filename || "Document",
//             documentSize: apiMessage.file_size ? formatBytes(apiMessage.file_size) : "Unknown size", // ✅ Fixed
//             documentUrl: apiMessage.file_url || "#",
//             mediaUrl: apiMessage.file_url,
//             caption: apiMessage.message_body || "",
//           }
        
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
//           const res = await fetch(`${BASE_URL}/api/phone/get/message_template/${templateId}/${templateName}`)
//           const json = await res.json()
//           templateData = Array.isArray(json.data) ? json.data[0] : json.data || {}
//         } catch (err) {
//           console.error("❌ Template fetch failed:", err)
//         }

//         let components = []
//         try {
//           components =
//             typeof templateData.components === "string"
//               ? JSON.parse(templateData.components)
//               : templateData.components || []
//         } catch (e) {
//           console.error("❌ Failed to parse components:", e)
//         }

//         const bodyComponent = components.find((c) => c.type?.toLowerCase() === "body")
//         const bodyTemplate = bodyComponent?.text || "Template"
//         const bodyParamsFromApi = parsed.components?.find((c) => c.type?.toLowerCase() === "body")?.parameters || []

//         const filledBody = bodyTemplate.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
//           return bodyParamsFromApi[+idx - 1]?.text || ""
//         })

//         const footerText = components.find((c) => c.type?.toLowerCase() === "footer")?.text || ""
//         const headerComponent = components.find((c) => c.type?.toLowerCase() === "header")
//         let headerImage = null
//         if (headerComponent && headerComponent.format === "IMAGE" && headerComponent.example?.header_handle?.[0]) {
//           headerImage = headerComponent.example.header_handle[0]
//         }

//         return {
//           ...commonProps,
//           type: MessageType.TEMPLATE,
//           templateName,
//           headerText: templateName,
//           bodyText: filledBody, // Use the filled body for template messages
//           footerText,
//           headerImage, // Use the headerImage derived from the fetched templateData
//         }
//       }
//       case "video":
//         return {
//           ...commonProps,
//           type: MessageType.VIDEO,
//           videoUrl: apiMessage.file_url || "#",
//           mediaUrl: apiMessage.file_url,
//           caption: apiMessage.message_body || "",
//         }
//       default:
//         return {
//           ...commonProps,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || `${apiMessage.message_type} message`,
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

//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220" // Corrected key
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7" // Corrected key

//       if (!wabaId || !accessToken) {
//         throw new Error("Missing authentication data")
//       }

//       const response = await axios.get(`${BASE_URL}/api/phone/get/${wabaId}/${userId}/${page}`)
//       console.log(`Messages API Response for page ${page}:`, response.data)

//       // Pass userId (which is selectedUser.wa_id_or_sender) to transformApiMessage
//       const transformedMessages = Array.isArray(response.data)
//         ? await Promise.all(response.data.map((msg) => transformApiMessage(msg)))
//         : []

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
//     setLoadingMoreMessages(true)

//     const { messages: newApiMessages, hasMore } = await fetchUserMessages(selectedUser.wa_id_or_sender, nextPage, true)

//     if (newApiMessages.length > 0) {
//       // Merge new API messages with existing messages in selectedUser.messages
//       // The existing messages in selectedUser.messages already include local messages and previous API messages.
//       const mergedAndDedupedMessages = mergeMessages(newApiMessages, selectedUser.messages)

//       const updatedUser = {
//         ...selectedUser,
//         messages: mergedAndDedupedMessages,
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
//     setLoadingMoreMessages(false) // Ensure this is set to false
//   }

//   const handleScroll = () => {
//     if (loadingMoreMessages || !hasMoreMessages) return
//     const container = messagesContainerRef.current
//     if (!container) return

//     if (container.scrollTop === 0) {
//       loadMoreMessages()
//     }
//   }

//   useEffect(() => {
//     const container = messagesContainerRef.current
//     if (container) {
//       container.addEventListener("scroll", handleScroll)
//       return () => container.removeEventListener("scroll", handleScroll)
//     }
//   }, [selectedUser?.wa_id_or_sender, hasMoreMessages, loadingMoreMessages, isScrolling, currentPage])

//   useEffect(() => {
//     if (selectedUser && selectedUser.messages && shouldScrollToBottom && isNearBottom) {
//       scrollToBottom(false)
//     }
//   }, [selectedUser, shouldScrollToBottom, isNearBottom])

//   const fetchChats = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220" // Corrected key
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7" // Corrected key

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
//               userName: chat.user_name || "Unknown",
//               waId: chat.wa_id_or_sender,
//               wa_id_or_sender: chat.wa_id_or_sender,
//               messages: [], // Messages will be fetched on user select
//             }
//           })
//         : []

//       console.log("Transformed Data:", transformedData)

//       // Merge with stored users to preserve local messages and their statuses
//       const storedUsers = loadMessagesFromStorage()
//       const mergedUsers = transformedData.map((apiUser) => {
//         const storedUser = storedUsers.find((stored) => stored.wa_id_or_sender === apiUser.wa_id_or_sender)
//         if (storedUser) {
//           // Just attach the messages from localStorage.
//           // The actual merge with API messages for a selected user happens in handleUserSelect.
//           return { ...apiUser, messages: storedUser.messages || [] }
//         }
//         return apiUser
//       })
//       setUserList(mergedUsers)
//     } catch (error) {
//       console.error("Error fetching chats:", error?.response?.data || error.message)
//       setError("Failed to load chats. Please try again.")
//       // Load from localStorage as fallback
//       const storedUsers = loadMessagesFromStorage()
//       if (storedUsers.length > 0) {
//         setUserList(storedUsers)
//       } else {
//         setUserList([
//           {
//             id: 1,
//             firstName: "Demo",
//             lastName: "User",
//             profileImage: "DU",
//             source: "Source Web",
//             creationTime: "Mar 20, 2025, 10:54:16 PM",
//             lastActivity: "2025-04-11 14:30",
//             phone: "+1234567890",
//             waId: "918857808284",
//             wa_id_or_sender: "918857808284",
//             messages: [
//               {
//                 id: "demo-msg-1",
//                 type: MessageType.TEXT,
//                 text: "*API connection failed.* This is _demo data_ with ~formatting~ and `code`.\n\nNew line test.",
//                 isRead: true,
//                 timestamp: "10:30 AM", // Display string
//                 sentAt: Date.now() - 60 * 60 * 1000, // Numeric timestamp for sorting
//                 role: "assistant", // This message is from the "assistant" (contact)
//                 status: MessageStatus.READ,
//                 isLocalMessage: false,
//                 sender: "918857808284", // Assuming this is the contact's number
//               },
//             ],
//           },
//         ])
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

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

//   const simulateMessageStatusUpdates = (messageIdToUpdate, userWaId) => {
//     const updateMessageStatus = (status) => {
//       setUserList((prevUsers) => {
//         const newUsers = prevUsers.map((user) =>
//           user.wa_id_or_sender === userWaId
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) => (msg.id === messageIdToUpdate ? { ...msg, status } : msg)),
//               }
//             : user,
//         )
//         const updated = newUsers.find((u) => u.wa_id_or_sender === userWaId)
//         setSelectedUser(updated)
//         saveMessagesToStorage(newUsers) // Save after each status update
//         return newUsers
//       })
//     }

//     setTimeout(() => updateMessageStatus(MessageStatus.SENT), 500)
//     setTimeout(() => updateMessageStatus(MessageStatus.DELIVERED), 2000)
//     setTimeout(() => updateMessageStatus(MessageStatus.READ), 5000)
//   }

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return

//     const messageId = `new-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Temporary local ID
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now() // Numeric timestamp for sorting

//     const newMsg = {
//       id: messageId, // Temporary local ID
//       type: MessageType.TEXT,
//       text: newMessage,
//       isRead: false, // Not read yet
//       role: "user", // Role for outgoing messages
//       timestamp: displayTimestamp, // Display string
//       sentAt: numericTimestamp, // Numeric for sorting
//       status: MessageStatus.SENDING,
//       isLocalMessage: true,
//       sender: OUR_OWN_PHONE_NUMBER, // Set sender for outgoing messages
//     }

//     const wasNearBottom = checkIfNearBottom()

//     setUserList((prevUsers) => {
//       const updatedUsers = prevUsers.map((user) =>
//         user.id === selectedUser.id
//           ? {
//               ...user,
//               messages: [...user.messages, newMsg],
//             }
//           : user,
//       )
//       const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//       setSelectedUser(updatedUser)
//       saveMessagesToStorage(updatedUsers) // Save immediately
//       return updatedUsers
//     })

//     if (wasNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(true)
//       }, 100)
//     }

//     setNewMessage("")

//     try {
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//       let phoneNumber = selectedUser.wa_id_or_sender || ""
//       if (phoneNumber.startsWith("+")) {
//         phoneNumber = phoneNumber.substring(1)
//       }
//       phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//       const requestBody = {
//         messaging_product: "whatsapp",
//         to: phoneNumber,
//         type: "text",
//         text: {
//           body: newMessage,
//         },
//       }

//       const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       })

//       if (!res.ok) {
//         const errorText = await res.text()
//         throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
//       } else {
//         const result = await res.json()
//         const apiReturnedMessageId = result.messages?.[0]?.id

//         // Update the message in state with the API ID and confirmed status
//         setUserList((prevUsers) => {
//           const updatedUsers = prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId // Match by the temporary local ID
//                       ? {
//                           ...msg,
//                           id: apiReturnedMessageId || msg.id,
//                           status: MessageStatus.SENT,
//                           isLocalMessage: false,
//                         } // Update ID and status
//                       : msg,
//                   ),
//                 }
//               : user,
//           )
//           const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//           setSelectedUser(updated)
//           saveMessagesToStorage(updatedUsers) // Save updated ID and status
//           return updatedUsers
//         })

//         // Start status simulation after successful API call
//         simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       }
//     } catch (error) {
//       console.error("API Error:", error.message)
//       // Update message status to failed
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.wa_id_or_sender === selectedUser.wa_id_or_sender
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, 
// 
//  } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//       alert(`Failed to send message: ${error.message}`)
//     }
//   }

//   const handleUserSelect = async (user) => {
//     setSelectedUser(user)
//     if (isMobile) setShowSidebar(false)
//     setCurrentPage(1)
//     setHasMoreMessages(true)
//     setShouldScrollToBottom(true)
//     setIsNearBottom(true)

//     if (user.wa_id_or_sender) {
//       // 1. Load local messages for this specific user from storage
//       const storedUsers = loadMessagesFromStorage()
//       const storedUser = storedUsers.find((u) => u.wa_id_or_sender === user.wa_id_or_sender)
//       const localMessagesForUser = storedUser ? storedUser.messages : []

//       // 2. Fetch API messages for the first page
//       const { messages: apiMessagesPage1, hasMore } = await fetchUserMessages(user.wa_id_or_sender, 1, false)

//       // 3. Merge API messages with local messages, de-duplicating and prioritizing statuses
//       const mergedMessages = mergeMessages(apiMessagesPage1, localMessagesForUser)

//       const updatedUser = { ...user, messages: mergedMessages }
//       setSelectedUser(updatedUser)
//       setHasMoreMessages(hasMore)

//       // Update the user in the main userList
//       const updatedUsers = userList.map((u) => (u.id === user.id ? updatedUser : u))
//       setUserList(updatedUsers)
//       saveMessagesToStorage(updatedUsers) // Save the merged messages
//     }
//   }

//   const handleBackToList = () => {
//     if (isMobile) setShowSidebar(true)
//   }

//   const toggleInfoPanel = () => setShowInfoPanel((prev) => !prev)

//   // --- New popup functions and template fetching logic ---
//   const fetchTemplates = async () => {
//     setLoadingTemplates(true)
//     setTemplatesError(null)
//     try {
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

//       if (!wabaId || !accessToken) {
//         throw new Error("Missing authentication data for templates")
//       }

//       const response = await axios.get(
//         `${BASE_URL}/api/phone/get/message_templates/${wabaId}?accessToken=${accessToken}`,
//       )
//       if (response.data && Array.isArray(response.data.data)) {
//         setTemplates(response.data.data)
//       } else {
//         setTemplates([])
//       }
//     } catch (error) {
//       console.error("Error fetching templates:", error?.response?.data || error.message)
//       setTemplatesError("Failed to load templates.")
//     } finally {
//       setLoadingTemplates(false)
//     }
//   }

//   const handlePlusClick = () => {
//     setShowPopup(true)
//     setSelectedOption("")
//     setDropdownContent("")
//     setShowDropdown(false)
//     setSelectedTemplateObject(null)
//     setOriginalTemplateBody("")
//     setTemplateBodyParameters([]) // Clear parameters
//     fetchTemplates() // Fetch templates when the popup opens
//   }

//   const handlePopupCancel = () => {
//     setShowPopup(false)
//     setSelectedOption("")
//     setDropdownContent("")
//     setShowDropdown(false)
//     setSelectedTemplateObject(null)
//     setOriginalTemplateBody("")
//     setTemplateBodyParameters([]) // Clear parameters
//   }

//   const handlePopupSend = async () => {
//     if (!selectedUser?.wa_id_or_sender) {
//       alert("Please select a user to send message.")
//       return
//     }

//     let phoneNumber = selectedUser.wa_id_or_sender || ""
//     if (phoneNumber.startsWith("+")) {
//       phoneNumber = phoneNumber.substring(1)
//     }
//     phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//     const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//     const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//     const messageId = `popup-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now()

//     let requestBody = {}
//     let messageToSend = {}
//     let headerImageUrlForLocal = null 

//     try {
//       if (selectedOption === "custom") {
//         if (!dropdownContent.trim()) {
//           alert("Custom message cannot be empty.")
//           return
//         }
//         requestBody = {
//           messaging_product: "whatsapp",
//           to: phoneNumber,
//           type: "text",
//           text: {
//             body: dropdownContent,
//           },
//         }
//         messageToSend = {
//           id: messageId,
//           type: MessageType.TEXT,
//           text: dropdownContent,
//           isRead: false,
//           role: "user",
//           timestamp: displayTimestamp,
//           sentAt: numericTimestamp,
//           status: MessageStatus.SENDING,
//           isLocalMessage: true,
//           sender: OUR_OWN_PHONE_NUMBER, // Set sender for outgoing
//         }
//       } else if (selectedTemplateObject) {
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(selectedTemplateObject.components)
//         } catch (e) {
//           console.error("Error parsing template components:", e)
//           alert("Error preparing template message. Sending as plain text.")
//           // Fallback to sending as plain text if parsing fails
//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "text",
//             text: {
//               body: dropdownContent,
//             },
//           }
//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEXT,
//             text: dropdownContent,
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER, // Set sender for outgoing
//           }
//         }

//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         const originalBodyText = bodyComponent?.text || ""

//         // Check if any template parameters are empty
//         if (templateBodyParameters.length > 0 && templateBodyParameters.some((param) => param.trim() === "")) {
//           alert("Please fill all template parameters.")
//           return
//         }

//         // Determine if sending as template or plain text
//         let sendAsPlainText = false
//         if (templateBodyParameters.length > 0) {
//           let currentPreviewText = originalBodyText
//           templateBodyParameters.forEach((paramValue, i) => {
//             currentPreviewText = currentPreviewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//           })
//           if (dropdownContent !== currentPreviewText) {
//             sendAsPlainText = true
//           }
//         } else if (dropdownContent !== originalBodyText) {
//           sendAsPlainText = true
//         }

//         if (sendAsPlainText) {
//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "text",
//             text: {
//               body: dropdownContent,
//             },
//           }
//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEXT,
//             text: dropdownContent,
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER, // Set sender for outgoing
//           }
//         } else {
//           // Send as template message
//           const componentsForApi = []
//           const headerComponent = componentsArray.find((comp) => comp.type === "HEADER")
//           if (headerComponent) {
//             if (headerComponent.format === "IMAGE" && headerComponent.example?.header_handle?.[0]) {
//               componentsForApi.push({
//                 type: "header",
//                 parameters: [{ type: "image", image: { link: headerComponent.example.header_handle[0] } }],
//               })
//               headerImageUrlForLocal = headerComponent.example.header_handle[0] // Capture header image URL
//             }
//             // If header is TEXT and has variables, add parameters here.
//             // For static text headers, no parameters are needed in the API call.
//           }

//           if (bodyComponent && templateBodyParameters.length > 0) {
//             componentsForApi.push({
//               type: "body",
//               parameters: templateBodyParameters.map((param) => ({ type: "text", text: param })),
//             })
//           }

//           // For BUTTONS and FOOTER components:
//           // These are part of the template definition and do NOT need to be
//           // included in the 'components' array of the API request unless they have dynamic parameters.
//           // The provided templates have static buttons and footers, so they are omitted here.
//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "template",
//             template: {
//               name: selectedTemplateObject.name,
//               language: {
//                 code: selectedTemplateObject.language || "en_US",
//               },
//               components: componentsForApi, // Use the correctly constructed componentsForApi
//             },
//           }

//           // RESOLUTION: Set `bodyText` for the local message object so TemplateMessage can render it.
//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEMPLATE,
//             bodyText: dropdownContent, // Use the preview content for local display
//             headerImage: headerImageUrlForLocal, // Use the captured header image URL
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER, // Set sender for outgoing
//           }
//         }
//       } else {
//         alert("Please select a template or type a custom message.")
//         return
//       }

//       const wasNearBottom = checkIfNearBottom()

//       setUserList((prevUsers) => {
//         const updatedUsers = prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: [...user.messages, messageToSend],
//               }
//             : user,
//         )
//         const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//         setSelectedUser(updatedUser)
//         saveMessagesToStorage(updatedUsers)
//         return updatedUsers
//       })

//       if (wasNearBottom) {
//         setTimeout(() => {
//           scrollToBottom(true)
//         }, 100)
//       }

//       const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       })

//       if (!res.ok) {
//         const errorText = await res.text()
//         throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
//       } else {
//         const result = await res.json()
//         const apiReturnedMessageId = result.messages?.[0]?.id

//         setUserList((prevUsers) => {
//           const updatedUsers = prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId
//                       ? {
//                           ...msg,
//                           id: apiReturnedMessageId || msg.id,
//                           status: MessageStatus.SENT,
//                           isLocalMessage: false,
//                         }
//                       : msg,
//                   ),
//                 }
//               : user,
//           )
//           const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//           setSelectedUser(updated)
//           saveMessagesToStorage(updatedUsers)
//           return updatedUsers
//         })

//         simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       }
//     } catch (error) {
//       console.error("API Error:", error.message)
//       alert(`Failed to send message: ${error.message}`)
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.wa_id_or_sender === selectedUser.wa_id_or_sender
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//     } finally {
//       setShowPopup(false)
//       setSelectedOption("")
//       setDropdownContent("")
//       setShowDropdown(false)
//       setSelectedTemplateObject(null)
//       setOriginalTemplateBody("")
//       setTemplateBodyParameters([]) // Clear parameters on close
//     }
//   }

//   const handleDropdownSelect = (e) => {
//     const selectedValue = e.target.value
//     setSelectedOption(selectedValue)
//     setShowDropdown(true)

//     if (selectedValue === "custom") {
//       setSelectedTemplateObject(null)
//       setDropdownContent("Enter your custom message here...")
//       setOriginalTemplateBody("")
//       setTemplateBodyParameters([]) // Clear parameters for custom
//     } else {
//       const template = templates.find((t) => t.name === selectedValue)
//       if (template) {
//         setSelectedTemplateObject(template)
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(template.components)
//         } catch (e) {
//           console.error("Error parsing template components:", e)
//         }

//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         const bodyText = bodyComponent?.text || ""
//         setOriginalTemplateBody(bodyText)

//         // Extract variables and prepare parameter inputs using template's example data
//         const variableMatches = [...bodyText.matchAll(/\{\{(\d+)\}\}/g)]
//         if (variableMatches.length > 0) {
//           const maxVarIndex = Math.max(...variableMatches.map((match) => Number.parseInt(match[1])))
//           // Use template's example body_text if available, otherwise empty strings
//           const templateExampleParams = bodyComponent?.example?.body_text?.[0] || []
//           const initialParams = Array(maxVarIndex)
//             .fill("")
//             .map((_, i) => {
//               // Use the template's example parameter if available, otherwise an empty string
//               return templateExampleParams[i] !== undefined ? templateExampleParams[i] : ""
//             })
//           setTemplateBodyParameters(initialParams)

//           // Set dropdownContent to the template body with filled initial parameters for preview
//           let previewText = bodyText
//           initialParams.forEach((paramValue, i) => {
//             previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//           })
//           setDropdownContent(previewText)
//         } else {
//           setTemplateBodyParameters([])
//           setDropdownContent(bodyText)
//         }
//       } else {
//         setDropdownContent("")
//         setSelectedTemplateObject(null)
//         setOriginalTemplateBody("")
//         setTemplateBodyParameters([])
//       }
//     }
//   }

//   const handleTemplateParameterChange = (index, value) => {
//     setTemplateBodyParameters((prev) => {
//       const newParams = [...prev]
//       newParams[index] = value
//       // Update dropdownContent to reflect changes in parameters for preview
//       if (selectedTemplateObject) {
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(selectedTemplateObject.components)
//         } catch (e) {
//           console.error("Error parsing template components for preview update:", e)
//         }
//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         let previewText = bodyComponent?.text || ""
//         newParams.forEach((paramValue, i) => {
//           previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//         })
//         setDropdownContent(previewText)
//       }
//       return newParams
//     })
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isOpen && !event.target.closest(".attachment-menu-container")) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [isOpen])

//   // Cleanup scroll timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current)
//       }
//     }
//   }, [])

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600 text-sm sm:text-base">Loading chats...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
//             <button
//               onClick={fetchChats}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm sm:text-base"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl">
//             <h3 className="text-lg font-semibold mb-4">Select Template</h3>
//             {/* Dropdown */}
//             <div className="mb-4">
//               <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
//                 Choose Template
//               </label>
//               <div className="relative">
//                 <select
//                   id="template-select"
//                   value={selectedOption}
//                   onChange={handleDropdownSelect}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   disabled={loadingTemplates}
//                 >
//                   <option value="">{loadingTemplates ? "Loading templates..." : "Select an option..."}</option>
//                   {templatesError && (
//                     <option value="" disabled>
//                       {templatesError}
//                     </option>
//                   )}
//                   {templates.map((template) => (
//                     <option key={template.name} value={template.name}>
//                       {template.name}
//                     </option>
//                   ))}
//                   <option value="custom">Custom Message</option>
//                 </select>
//                 <ChevronDown
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
//                   size={20}
//                 />
//               </div>
//             </div>

//             {/* Content area that shows when dropdown is selected */}
//             {showDropdown && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
//                 {selectedOption === "custom" ? (
//                   <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
//                     <h4 className="font-medium text-sm text-gray-800 mb-2">Custom Message:</h4>
//                     <textarea
//                       value={dropdownContent}
//                       onChange={(e) => setDropdownContent(e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="5"
//                       placeholder="Enter your custom message here..."
//                     />
//                   </div>
//                 ) : (
//                   selectedTemplateObject && (
//                     <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
//                       <h4 className="font-medium text-sm text-gray-800 mb-2">Template Preview:</h4>
//                       {(() => {
//                         let componentsArray = []
//                         try {
//                           componentsArray = JSON.parse(selectedTemplateObject.components)
//                         } catch (e) {
//                           console.error("Error parsing template components for preview:", e)
//                           return <p className="text-red-500 text-xs">Error loading template preview.</p>
//                         }
//                         return (
//                           <>
//                             {componentsArray.map((comp, compIndex) => {
//                               if (comp.type === "HEADER") {
//                                 if (comp.format === "IMAGE" && comp.example?.header_handle?.[0]) {
//                                   return (
//                                     <div key={compIndex} className="mb-2">
//                                       <img
//                                         src={comp.example.header_handle[0] || "/placeholder.svg"}
//                                         alt="Template Header Image"
//                                         className="w-full h-32 object-cover rounded-md"
//                                         onError={(e) => (e.target.src = "/placeholder.svg?height=128&width=128")}
//                                       />
//                                     </div>
//                                   )
//                                 } else if (comp.format === "TEXT" && comp.text) {
//                                   return (
//                                     <div key={compIndex} className="font-semibold text-base mb-2">
//                                       {comp.text}
//                                     </div>
//                                   )
//                                 }
//                               } else if (comp.type === "BODY") {
//                                 return (
//                                   <div key={compIndex} className="mb-2">
//                                     <p className="text-sm text-gray-600 mb-1">Body Preview:</p>
//                                     <textarea
//                                       value={dropdownContent} // This shows the current preview with filled params
//                                       onChange={(e) => setDropdownContent(e.target.value)} // Allow editing preview
//                                       className="w-full p-2 border border-gray-300 rounded text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                       rows="3"
//                                     />
//                                     {templateBodyParameters.length > 0 && (
//                                       <div className="mt-2 space-y-2">
//                                         <p className="text-sm font-medium text-gray-700">Fill Parameters:</p>
//                                         {templateBodyParameters.map((param, paramIndex) => (
//                                           <input
//                                             key={paramIndex}
//                                             type="text"
//                                             value={param}
//                                             onChange={(e) => handleTemplateParameterChange(paramIndex, e.target.value)}
//                                             className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             placeholder={`Field ${paramIndex + 1}`}
//                                           />
//                                         ))}
//                                       </div>
//                                     )}
//                                   </div>
//                                 )
//                               } else if (comp.type === "FOOTER" && comp.text) {
//                                 return (
//                                   <div key={compIndex} className="text-xs text-gray-500 mt-2">
//                                     {comp.text}
//                                   </div>
//                                 )
//                               } else if (comp.type === "BUTTONS" && comp.buttons?.length > 0) {
//                                 return (
//                                   <div key={compIndex} className="flex flex-wrap gap-2 mt-2">
//                                     {comp.buttons.map((button, btnIndex) => (
//                                       <button
//                                         key={btnIndex}
//                                         className="px-3 py-1.5 border border-blue-500 text-blue-500 rounded-md text-xs hover:bg-blue-50"
//                                       >
//                                         {button.text}
//                                       </button>
//                                     ))}
//                                   </div>
//                                 )
//                               }
//                               return null
//                             })}
//                           </>
//                         )
//                       })()}
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handlePopupCancel}
//                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePopupSend}
//                 disabled={
//                   !selectedOption ||
//                   (selectedOption === "custom" && !dropdownContent.trim()) ||
//                   (selectedOption !== "custom" &&
//                     selectedTemplateObject &&
//                     templateBodyParameters.length > 0 &&
//                     templateBodyParameters.some((param) => param.trim() === ""))
//                 }
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         className={`${
//           showSidebar ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
//           isMobile ? "w-full absolute inset-2 z-10" : "w-full md:w-1/3"
//         }`}
//       >
//         <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//           <div className="flex items-center justify-between gap-4">
//             {isMobile && selectedUser && (
//               <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500 hover:text-gray-700">
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <Menu size={18} className="sm:w-5 sm:h-5" />
//             <h1 className="text-base sm:text-lg font-semibold">Chat List</h1>
//           </div>
//           <div>
//             <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1 mt-4 sm:mt-6">
//               Search
//             </label>
//             <input
//               id="search-input"
//               type="text"
//               placeholder="Searching....."
//               className="w-full p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <hr className="border-gray-300" />
//         </div>
//         <div className="overflow-y-auto px-3 sm:px-4 pb-4 space-y-2 sm:space-y-3 flex-1">
//           {userList
//             .filter((user) => {
//               const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
//               return fullName.includes(searchTerm.toLowerCase())
//             })
//             .map((user) => (
//               <div
//                 key={generateUserKey(user)}
//                 onClick={() => handleUserSelect(user)}
//                 className="flex justify-between items-start gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
//               >
//                 <div className="flex items-start gap-2 sm:gap-3 min-w-0">
//                   <div className="relative">
//                     <div
//                       className={`${
//                         user.activeLast24Hours ? "bg-green-600 text-white" : "bg-gray-400 text-black"
//                       } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0`}
//                     >
//                       {user.firstName.charAt(0)}
//                       {user.lastName.charAt(0)}
//                     </div>
//                     {user.activeLast24Hours && (
//                       <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full" />
//                     )}
//                   </div>
//                   <div className="flex flex-col min-w-0">
//                     <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0">
//                       <p className="font-medium truncate max-w-[120px] sm:max-w-[140px] text-sm sm:text-base">
//                         {user.firstName} {user.lastName}
//                       </p>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
//                       {user.remainingTime}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="text-xs sm:text-sm text-black whitespace-nowrap ml-1 sm:ml-2 shrink-0 mt-1">
//                   {user.messageCount} message
//                 </span>
//               </div>
//             ))}
//         </div>
//       </div>

//       <div
//         className={`${
//           !showSidebar || !isMobile ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
//           isMobile ? "w-full" : "w-full md:w-2/3"
//         }`}
//       >
//         {selectedUser ? (
//           <>
//             <div className="flex items-center justify-between gap-2 sm:gap-4 border-b p-3 sm:p-4">
//               <div className="flex items-center gap-2">
//                 {isMobile && (
//                   <button onClick={handleBackToList} className="md:hidden text-gray-500 hover:text-gray-700 mr-1">
//                     <Menu size={20} />
//                   </button>
//                 )}
//                 <div className="bg-gray-400 text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
//                   {selectedUser.firstName.charAt(0)}
//                   {selectedUser.lastName.charAt(0)}
//                 </div>
//                 <h2 className="text-sm sm:text-base md:text-lg font-semibold">
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h2>
//               </div>
//               <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600 p-2 rounded-full">
//                 <Info size={18} className="sm:w-5 sm:h-5" />
//               </button>
//             </div>

//             <div
//               ref={messagesContainerRef}
//               className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gray-200 text-left"
//               style={{ scrollBehavior: "smooth" }}
//             >
//               {loadingMoreMessages && (
//                 <div className="flex items-center justify-center py-4">
//                   <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-xs sm:text-sm">Loading more messages...</span>
//                 </div>
//               )}
//               {messagesLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading messages...</span>
//                 </div>
//               ) : messagesError ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-red-600 text-sm sm:text-base">{messagesError}</p>
//                 </div>
//               ) : selectedUser.messages.length === 0 ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-gray-500 text-sm sm:text-base">No messages found</p>
//                 </div>
//               ) : (
//                 // selectedUser.messages.map((msg, index) => {
//                 //   const showDateSeparator =
//                 //     index === 0 ||
//                 //     getMessageDate(msg.sentAt) !== getMessageDate(selectedUser.messages[index - 1].sentAt)
//                 //   // Determine message position based on sender
//                 //   // If msg.sender matches the selected user's WA ID, it's an incoming message (from contact)
//                 //   // Otherwise, it's an outgoing message (from our system)
//                 //   const isMessageFromContact = msg.sender === selectedUser.wa_id_or_sender
//                 //   const position = isMessageFromContact ? "left" : "right"
//                 //   return (
//                 //     <div key={generateMessageKey(msg)} className="relative group">
//                 //       {showDateSeparator && <DateSeparator date={msg.sentAt} />}
//                 //       <MessageRenderer message={msg} position={position} /> {/* Pass calculated position */}
//                 //     </div>
//                 //   )
//                 // })
//                 selectedUser.messages.map((msg, index) => {
//                   const showDateSeparator =
//                     index === 0 ||
//                     getMessageDate(msg.sentAt) !== getMessageDate(selectedUser.messages[index - 1].sentAt)
                
//                     // const isMessageFromContact = msg.role === "user" // 'user' = incoming, 'me' = outgoing
//                     // const isMessageFromContact = msg.sender === selectedUser.wa_id_or_sender; 
//                     const isMessageFromContact = msg.role === "user" && msg.sender === selectedUser.wa_id_or_sender;
//                   const position = isMessageFromContact ? "left" : "right"
                
//                   return (
//                     <div key={generateMessageKey(msg)} className="relative group">
//                       {showDateSeparator && <DateSeparator date={msg.sentAt} />}
//                       <MessageRenderer message={msg} position={position} />
//                     </div>
//                   )
//                 })
                
//               )}
//             </div>

//             <div className="p-2 sm:p-3 md:p-4 border-t flex flex-col gap-2">
//               <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <div className="relative attachment-menu-container">
//                     <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full" onClick={handlePlusClick}>
//                       <Plus size={18} className="sm:w-5 sm:h-5" />
//                     </button>
//                   </div>
//                   <div className="relative inline-block text-left attachment-menu-container">
//                     <button
//                       className="text-gray-500 hover:text-blue-600 p-2 rounded-full"
//                       onClick={toggleAttachmentMenu3}
//                       disabled={uploadingFile}
//                     >
//                       <PaperclipIcon size={18} />
//                     </button>
//                     {isOpen && (
//                       <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 w-40 sm:w-48 z-50 space-y-2">
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => imageInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <ImageIcon size={18} className="text-green-700" />
//                           <span className="text-sm">Image</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           ref={imageInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "image")}
//                         />
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => videoInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <VideoIcon size={18} className="text-red-700" />
//                           <span className="text-sm">Video</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept="video/*"
//                           ref={videoInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "video")}
//                         />
//                         {/* Document Upload */}
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => documentInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <FileIcon size={18} className="text-blue-700" />
//                           <span className="text-sm">Document</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept=".pdf,.doc,.docx,.txt"
//                           ref={documentInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "document")}
//                         />
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
//                   className="flex-1 border-0 outline-none px-2 sm:px-3 py-1 text-sm sm:text-base bg-transparent focus:ring-0"
//                 />
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full">
//                     <Mic size={18} className="sm:w-5 sm:h-5" />
//                   </button>
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-600"
//                     disabled={uploadingFile}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="sm:w-5 sm:h-5"
//                     >
//                       <line x1="22" y1="2" x2="11" y2="13"></line>
//                       <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//               {uploadingFile && (
//                 <div className="flex items-center justify-center py-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-sm">Uploading file...</span>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center flex-1 p-4">
//             <img
//               src="/placeholder.svg?height=160&width=160"
//               alt="WhatsApp"
//               className="hidden sm:block w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 sm:mb-6"
//             />
//             <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Click a user to chat</h2>
//           </div>
//         )}
//       </div>

//       {showInfoPanel && selectedUser && (
//         <div
//           className={`${
//             isMobile
//               ? "fixed inset-0 bg-white z-30 p-4"
//               : "absolute right-0 top-16 bottom-4 w-64 sm:w-72 md:w-80 bg-white shadow-2xl border-l rounded-l-2xl p-4 z-20"
//           }`}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-base sm:text-lg">User Info</h3>
//             <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
//               <X size={18} className="sm:w-5 sm:h-5" />
//             </button>
//           </div>
//           <div className="space-y-3 text-sm text-gray-700">
//             <div className="bg-gray-300 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mx-auto sm:ml-32">
//               {selectedUser.firstName.charAt(0)}
//               {selectedUser.lastName.charAt(0)}
//             </div>
//             <div className="flex flex-col min-w-0 text-center sm:ml-28">
//               <p className="truncate max-w-[200px] sm:max-w-[140px] font-semibold text-sm sm:text-base">
//                 {selectedUser.firstName} {selectedUser.lastName}
//               </p>
//               <span className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-md mt-2 inline-block">Lead</span>
//             </div>
//             <hr className="border-gray-300" />
//             <h1 className="font-semibold text-base sm:text-lg">Details</h1>
//             <div className="flex items-center gap-2 mt-2">
//               <MessageSquareTextIcon size={14} className="text-orange-500 sm:w-4 sm:h-4" />
//               <span className="font-extralight text-xs sm:text-sm">
//                 Source <span className="text-indigo-500">{selectedUser.source}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <Calendar size={14} className="text-cyan-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Creation Time <span className="text-indigo-500">{selectedUser.creationTime}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock size={14} className="text-orange-300 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Last Activity <span className="text-indigo-500">{selectedUser.lastActivity}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Phone size={14} className="text-green-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Phone <span className="text-indigo-500">{selectedUser.phone}</span>
//               </span>
//             </div>
//           </div>
//           <hr className="border-gray-300 mt-3" />
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="font-medium text-sm sm:text-base">Notes</h4>
//               <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full">
//                 <Plus size={16} className="sm:w-4 sm:h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Chat



// import {
//   Mic,
//   Menu,
//   X,
//   Info,
//   Plus,
//   Phone,
//   Calendar,
//   MessageSquareText,
//   Clock,
//   Download,
//   FileMinus,
//   Check,
//   CheckCheck,
//   Paperclip,
//   ImageIcon,
//   Video,
//   File,
//   ChevronDown,
// } from "lucide-react"
// import { useState, useEffect, useRef } from "react"
// import axios from "axios"

// const BASE_URL = "https://waba.mpocket.in"
// const OUR_OWN_PHONE_NUMBER = "me"

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

// const MessageStatus = {
//   SENDING: "sending",
//   SENT: "sent",
//   DELIVERED: "delivered",
//   READ: "read",
//   FAILED: "failed",
// }

// const MessageTicks = ({ status, timestamp, position }) => {
//   const renderTicks = () => {
//     const alignmentClass = position === "left" ? "justify-start" : "justify-end"
//     if (position === "left") {
//       return (
//         <div className={`flex items-center gap-1 ${alignmentClass}`}>
//           <span className="text-xs text-gray-500">{timestamp}</span>
//         </div>
//       )
//     }
//     switch (status) {
//       case MessageStatus.SENT:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <Check size={12} className="text-gray-400" />
//           </div>
//         )
//       case MessageStatus.DELIVERED:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <div className="relative w-4 h-4">
//               <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
//             </div>
//           </div>
//         )
//       case MessageStatus.READ:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <div className="relative w-4 h-4">
//               <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
//             </div>
//           </div>
//         )
//       case MessageStatus.SENDING:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//             <Check size={12} className="text-gray-400" />
//           </div>
//         )
//       case MessageStatus.FAILED:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <X size={12} className="text-red-500" />
//             <span className="text-xs text-red-500">Failed</span>
//           </div>
//         )
//       default:
//         return (
//           <div className={`flex items-center gap-1 ${alignmentClass}`}>
//             <span className="text-xs text-gray-500">{timestamp}</span>
//           </div>
//         )
//     }
//   }
//   return <div className="mt-1 text-left">{renderTicks()}</div>
// }

// const STORAGE_KEY = "whatsapp_chat_messages"
// const USER_STORAGE_KEY = "whatsapp_chat_users"

// const saveMessagesToStorage = (userList) => {
//   try {
//     sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userList))
//   } catch (error) {
//     console.error("Failed to save messages to localStorage:", error)
//   }
// }

// const loadMessagesFromStorage = () => {
//   try {
//     const stored = sessionStorage.getItem(USER_STORAGE_KEY)
//     return stored ? JSON.parse(stored) : []
//   } catch (error) {
//     console.error("Failed to load messages from localStorage:", error)
//     return []
//   }
// }

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

// const formatRemainingTime = (dateString) => {
//   if (!dateString) return "No recent activity"
//   try {
//     const date = new Date(dateString)
//     if (isYesterday(date)) {
//       return "Yesterday"
//     }
//     if (isToday(date)) {
//       return "Today"
//     }
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
//     let date
//     if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
//       date = new Date(Number.parseInt(timestamp) * 1000)
//     } else if (typeof timestamp === "number") {
//       date = new Date(timestamp)
//     } else {
//       date = new Date()
//     }
//     return date.toDateString()
//   } catch (error) {
//     console.error("Error getting message date:", error)
//     return new Date().toDateString()
//   }
// }

// const DateSeparator = ({ date }) => (
//   <div className="flex items-center justify-center my-2 sm:my-4">
//     <div className="bg-white px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-sm border text-xs text-gray-600 font-medium">
//       {formatDateLabel(date)}
//     </div>
//   </div>
// )

// const formatText = (text, messageType = "text") => {
//   if (!text) return ""
//   let formattedText = text.toString()
//   formattedText = formattedText
//     .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
//     .replace(/_([^_\n]+)_/g, "<em>$1</em>")
//     .replace(/~([^~\n]+)~/g, "<del>$1</del>")
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

// const outgoingMessageClasses = "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
// const incomingMessageClasses = "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"

// const TextMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative text-sm sm:text-base`}
//   >
//     {message.headerImageUrl && (
//       <img
//         src={message.headerImageUrl || "/placeholder.svg"}
//         alt="Template Header"
//         className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
//         onError={(e) => {
//           e.target.src = "/placeholder.svg?height=240&width=240"
//         }}
//       />
//     )}
//     <div
//       dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
//       className="whitespace-pre-wrap break-words"
//     />
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// const ImageMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
//   >
//     <img
//       src={message.imageUrl || message.mediaUrl || "/placeholder.svg?height=240&width=240"}
//       // alt={message.caption || "Shared image"}
//       alt={message.caption ? message.caption : ""}

//       className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
//       onError={(e) => {
//         e.target.src = "/placeholder.svg?height=240&width=240"
//       }}
//     />
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// // const DocumentMessage = ({ message, position }) => {
// //   console.log("📄 DocumentMessage received:", message)

// //   return (
// //     <div
// //       className={`${
// //         position === "left" ? incomingMessageClasses : outgoingMessageClasses
// //       } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
// //     >
// //       <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
// //         <div className="p-2 rounded-md mr-2">
// //           <FileMinus size={18} className="text-blue-600" />
// //         </div>
// //         <div className="flex-1 min-w-0">
// //           <p className="text-sm font-medium truncate">
// //             {message.documentName || message.fileName || message.caption || "Document"}
// //           </p>
// //           {/* <p className="text-xs text-gray-500">{message.documentSize || "Unknown size"}</p> */}
// //           <p className="text-xs text-gray-500">
// //   {message.documentSize !== undefined && message.documentSize !== null && message.documentSize !== ""
// //     ? message.documentSize
// //     : "Unknown size"}
// // </p>

// //         </div>
// //         {(message.documentUrl || message.mediaUrl) && message.documentUrl !== "#" && (
// //           <a
// //             href={message.documentUrl || message.mediaUrl}
// //             className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Download size={16} />
// //           </a>
// //         )}
// //       </div>
// //       {message.caption && message.caption !== (message.documentName || message.fileName) && (
// //         <div
// //           dangerouslySetInnerHTML={{
// //             __html: formatText(message.caption, "document"),
// //           }}
// //           className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
// //         />
// //       )}
// //       <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
// //     </div>
// //   )
// // }

// // const formattedSize = message.documentSize
// //   ? `${message.documentSize} KB`
// //   : "Unknown size"


// const DocumentMessage = ({ message, position }) => {
//   console.log("📄 DocumentMessage received:", message)

//   // ✅ Define formattedSize here, inside the component
//   // const formattedSize =
//   // typeof message.documentSize === "number"
//   //   ? formatBytes(message.documentSize)
//   //   : message.documentSize || "Unknown size"


//   return (
//     <div
//       className={`${
//         position === "left" ? incomingMessageClasses : outgoingMessageClasses
//       } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
//     >
//       <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
//         <div className="p-2 rounded-md mr-2">
//           <FileMinus size={18} className="text-blue-600" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium truncate">
//             {message.documentName || message.fileName || message.caption || "Document"}
//           </p>
//           {/* <p className="text-xs text-gray-500">{formattedSize}</p> */}
//         </div>
//         {(message.documentUrl || message.mediaUrl) && message.documentUrl !== "#" && (
//           <a
//             href={message.documentUrl || message.mediaUrl}
//             className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Download size={16} />
//           </a>
//         )}
//       </div>

//       {message.caption &&
//         message.caption !== (message.documentName || message.fileName) && (
//           <div
//             dangerouslySetInnerHTML={{
//               __html: formatText(message.caption, "document"),
//             }}
//             className={`text-sm ${
//               position === "left" ? "text-gray-600" : "text-black"
//             } whitespace-pre-wrap break-words`}
//           />
//         )}
//       <MessageTicks
//         status={message.status}
//         timestamp={message.timestamp}
//         position={position}
//       />
//     </div>
//   )
// }

// // const formatBytes = (bytes, decimals = 2) => {
// //   if (bytes === 0) return "0 Bytes"
// //   const k = 1024
// //   const dm = decimals < 0 ? 0 : decimals
// //   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
// //   const i = Math.floor(Math.log(bytes) / Math.log(k))
// //   return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
// // }

// const TemplateMessage = ({ message, position }) => {
//   const handleButtonClick = (button) => {
//     if (button.type === "PHONE_NUMBER" && button.phone_number) {
//       window.open(`tel:${button.phone_number}`, "_self")
//     } else if (button.type === "URL" && button.url) {
//       window.open(button.url, "_blank")
//     }
//   }

//   return (
//     <div
//       className={`${
//         position === "left" ? incomingMessageClasses : outgoingMessageClasses
//       } p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm relative`}
//     >
//       {message.headerImage && (
//         <img
//           src={message.headerImage || "/placeholder.svg?height=240&width=240"}
//           alt="Header"
//           className="w-full object-cover rounded-t-xl mb-2"
//           onError={(e) => {
//             e.target.src = "/placeholder.svg?height=240&width=240"
//           }}
//         />
//       )}
//       <div className="p-1">
//         <div
//           dangerouslySetInnerHTML={{ __html: formatText(message.bodyText, "template") }}
//           className="text-sm whitespace-pre-wrap break-words mb-2"
//         />
//         {message.buttons && message.buttons.length > 0 && (
//           <div className="flex flex-col gap-2 mt-3">
//             {message.buttons.map((button, btnIndex) => (
//               <button
//                 key={btnIndex}
//                 onClick={() => handleButtonClick(button)}
//                 className="px-3 py-2 border border-blue-500 text-white bg-blue-600 rounded-md text-sm hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 transition-colors"
//               >
//                 {button.type === "PHONE_NUMBER" && <Phone size={16} />}
//                 {button.type === "URL" && <Paperclip size={16} className="text-gray-200" />}
//                 {button.text}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//     </div>
//   )
// }

// const VideoMessage = ({ message, position }) => (
//   <div
//     className={`${
//       position === "left" ? incomingMessageClasses : outgoingMessageClasses
//     } p-2 sm:p-3 rounded-xl inline-flex flex-col relative max-w-[280px] sm:max-w-xs md:max-w-sm`}
//   >
//     <video
//       src={message.videoUrl || message.mediaUrl || "#"}
//       controls
//       className="rounded-md mb-2 w-full max-h-48 sm:max-h-60 object-cover"
//     >
//       Your browser does not support the video tag.
//     </video>
//     {message.caption && (
//       <div
//         dangerouslySetInnerHTML={{ __html: formatText(message.caption, "video") }}
//         className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
//       />
//     )}
//     <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
//   </div>
// )

// const MessageRenderer = ({ message, position }) => {
//   const Component = (() => {
//     switch (message.type) {
//       case MessageType.IMAGE:
//         return ImageMessage
//       case MessageType.DOCUMENT:
//         return DocumentMessage
//       case MessageType.VIDEO:
//         return VideoMessage
//       case MessageType.TEMPLATE:
//         return TemplateMessage
//       case MessageType.TEXT:
//       default:
//         return TextMessage
//     }
//   })()

//   return (
//     <div className={`flex ${position === "left" ? "justify-start" : "justify-end"} mb-2 sm:mb-3`}>
//       <Component message={message} position={position} />
//     </div>
//   )
// }

// const generateMessageKey = (message) => {
//   return message.id || `temp-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
// }

// // const generateUserKey = (user) => {
// //   return user.id || user.waId || `temp-user-${Math.random().toString(36).substr(2, 9)}`
// // }
// const generateUserKey = (user) => {
//   return user.wa_id_or_sender || user.id || `${user.firstName}-${user.lastName}`.toLowerCase()
// }



// const getStatusOrder = (status) => {
//   switch (status) {
//     case MessageStatus.SENDING:
//       return 1
//     case MessageStatus.SENT:
//       return 2
//     case MessageStatus.DELIVERED:
//       return 3
//     case MessageStatus.READ:
//       return 4
//     default:
//       return 0
//   }
// }

// // FIXED: Better message merging logic to prevent duplicates
// const mergeMessages = (newMessages, existingMessages) => {
//   const uniqueMessagesMap = new Map()


//   existingMessages.forEach((msg) => {
//     uniqueMessagesMap.set(msg.id, msg)
//   })

//   // Add new messages, updating existing ones if needed
//   newMessages.forEach((newMessage) => {
//     const existing = uniqueMessagesMap.get(newMessage.id)
//     if (existing) {
//       // Only update if the new message has better status or is not local
//       if (
//         (!newMessage.isLocalMessage && existing.isLocalMessage) ||
//         getStatusOrder(newMessage.status) > getStatusOrder(existing.status) ||
//         (newMessage.mediaUrl && !existing.mediaUrl) // Update with actual media URL
//       ) {
//         uniqueMessagesMap.set(newMessage.id, { ...existing, ...newMessage })
//       }
//     } else {
//       uniqueMessagesMap.set(newMessage.id, newMessage)
//     }
//   })

//   return Array.from(uniqueMessagesMap.values()).sort((a, b) => {
//     return (a.sentAt || 0) - (b.sentAt || 0)
//   })
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
//   const [searchTerm, setSearchTerm] = useState("")
//   const [messagesLoading, setMessagesLoading] = useState(false)
//   const [messagesError, setMessagesError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [hasMoreMessages, setHasMoreMessages] = useState(true)
//   const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
//   const messagesContainerRef = useRef(null)
//   const [isScrolling, setIsScrolling] = useState(false)
//   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
//   const [isNearBottom, setIsNearBottom] = useState(true)
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([])
//   const [uploadingFile, setUploadingFile] = useState(false)
//   const imageInputRef = useRef(null)
//   const videoInputRef = useRef(null)
//   const documentInputRef = useRef(null)
//   const scrollTimeoutRef = useRef(null)
//   const attachmentMenuRef = useRef(null)

//   // Popup functionality states
//   const [showPopup, setShowPopup] = useState(false)
//   const [selectedOption, setSelectedOption] = useState("")
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [dropdownContent, setDropdownContent] = useState("")

//   // Template fetching states
//   const [templates, setTemplates] = useState([])
//   const [loadingTemplates, setLoadingTemplates] = useState(false)
//   const [templatesError, setTemplatesError] = useState(null)
//   const [selectedTemplateObject, setSelectedTemplateObject] = useState(null)
//   const [originalTemplateBody, setOriginalTemplateBody] = useState("")
//   const [templateBodyParameters, setTemplateBodyParameters] = useState([])

//   // Custom header image states
//   const [customHeaderImageUrl, setCustomHeaderImageUrl] = useState("")
//   const [showImageUrlInput, setShowImageUrlInput] = useState(false)

//   const toggleAttachmentMenu3 = () => setIsOpen((prev) => !prev)

//   // FIXED: Better file handling with proper deduplication
//   const handleFileSend = async (e, type) => {
//     const file = e.target.files[0]
//     if (!file) return

//     setUploadingFile(true)
//     const messageId = `file-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now()

//     const newFileMessage = {
//       id: messageId,
//       type: type,
//       text: type === "document" ? file.name : file.name || "",
//       mediaUrl: URL.createObjectURL(file),
//       imageUrl: type === "image" ? URL.createObjectURL(file) : undefined,
//       videoUrl: type === "video" ? URL.createObjectURL(file) : undefined,
//       documentUrl: type === "document" ? URL.createObjectURL(file) : undefined,
//       documentName: type === "document" ? file.name : undefined,
//       // documentSize: file.size ? formatBytes(file.size) : "Unknown size",
//       documentSize: file.size, // store raw bytes

//       fileName: file.name,
//       caption: file.name,
//       status: MessageStatus.SENDING,
//       timestamp: displayTimestamp,
//       role: "me",
//       isRead: false,
//       isLocalMessage: true,
//       sentAt: numericTimestamp,
//       sender: OUR_OWN_PHONE_NUMBER,
//     }

//     console.log("📄 New file message:", newFileMessage)

//     const wasNearBottom = checkIfNearBottom()

//     // Update user list with new message
//     setUserList((prevUsers) => {
//       const updatedUsers = prevUsers.map((user) =>
//         user.id === selectedUser.id
//           ? {
//               ...user,
//               messages: [...(user.messages || []), newFileMessage],
//             }
//           : user,
//       )
//       const updatedSelectedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//       setSelectedUser(updatedSelectedUser)
//       saveMessagesToStorage(updatedUsers)
//       return updatedUsers
//     })

//     if (wasNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(true)
//       }, 100)
//     }

//     try {
//       if (!selectedUser?.wa_id_or_sender) {
//         alert("Please select a user to send message")
//         e.target.value = null
//         setUploadingFile(false)
//         // Mark message as failed
//         setUserList((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                   ),
//                 }
//               : user,
//           ),
//         )
//         return
//       }

//       let phoneNumber = selectedUser.waId || selectedUser.phone || ""
//       if (phoneNumber.startsWith("+")) phoneNumber = phoneNumber.slice(1)
//       phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//       // Upload file
//       const formData = new FormData()
//       formData.append("file", file)

//       const uploadResponse = await fetch(`${BASE_URL}/api/${wabaId}/upload-file`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: formData,
//       })

//       if (!uploadResponse.ok) {
//         const err = await uploadResponse.json()
//         alert(`Upload failed: ${err?.message || "Unknown error"}`)
//         throw new Error(`Upload failed: ${err?.message || "Unknown error"}`)
//       }

//       const uploadResult = await uploadResponse.json()
//       const uploadedUrl = uploadResult.data?.s3Url || uploadResult?.s3Url

//       if (!uploadedUrl) {
//         alert("Upload failed: No media URL returned")
//         throw new Error("Upload failed: No media URL returned")
//       }

//       // Prepare message object
//       const mediaObject = {
//         link: uploadedUrl,
//       }

//       if (type === "image" || type === "video") {
//         mediaObject.caption = file.name
//       }

//       if (type === "document") {
//         mediaObject.filename = file.name
//       }

//       const messageBody = {
//         messaging_product: "whatsapp",
//         to: phoneNumber,
//         type,
//         [type]: mediaObject,
//       }

//       // Send message
//       const sendMessageResponse = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(messageBody),
//       })

//       const sendMessageResult = await sendMessageResponse.json()

//       if (!sendMessageResponse.ok || !sendMessageResult.messages?.length) {
//         alert(
//           `Send message failed: ${
//             sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
//           }`,
//         )
//         throw new Error(
//           `Send message failed: ${
//             sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
//           }`,
//         )
//       }

//       const apiReturnedMessageId = sendMessageResult.messages[0].id

//       // FIXED: Update message with proper deduplication
//       setUserList((prevUsers) => {
//         const updatedUsers = prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId
//                     ? {
//                         ...msg,
//                         id: apiReturnedMessageId || msg.id,
//                         mediaUrl: uploadedUrl,
//                         imageUrl: type === "image" ? uploadedUrl : msg.imageUrl,
//                         videoUrl: type === "video" ? uploadedUrl : msg.videoUrl,
//                         documentUrl: type === "document" ? uploadedUrl : msg.documentUrl,
//                         status: MessageStatus.SENT,
//                         isLocalMessage: false,
//                       }
//                     : msg,
//                 ),
//               }
//             : user,
//         )
//         const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//         setSelectedUser(updated)
//         saveMessagesToStorage(updatedUsers)
//         return updatedUsers
//       })

//       console.log("✅ Updated message ID:", apiReturnedMessageId)
//       console.log("📦 Uploaded URL:", uploadedUrl)

//       simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       setIsOpen(false)
//     } catch (error) {
//       console.error("Error during upload/send:", error)
//       // alert("Network error during upload or send.")
//       // Mark message as failed
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//     } finally {
//       setUploadingFile(false)
//       e.target.value = null
//     }
//   }

//   useEffect(() => {
//     const storedUsers = loadMessagesFromStorage()
//     if (storedUsers.length > 0) {
//       setUserList(storedUsers)
//     }
//   }, [])

//   useEffect(() => {
//     if (userList.length > 0) {
//       saveMessagesToStorage(userList)
//     }
//   }, [userList])

//   const scrollToBottom = (smooth = true) => {
//     if (scrollTimeoutRef.current) {
//       clearTimeout(scrollTimeoutRef.current)
//     }
//     scrollTimeoutRef.current = setTimeout(() => {
//       if (messagesContainerRef.current) {
//         const container = messagesContainerRef.current
//         const scrollOptions = {
//           top: container.scrollHeight,
//           behavior: smooth ? "smooth" : "auto",
//         }
//         container.scrollTo(scrollOptions)
//       }
//     }, 50)
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

//   const formatTimestamp = (rawTimestamp) => {
//     try {
//       let date
//       if (typeof rawTimestamp === "string" && !isNaN(Number(rawTimestamp))) {
//         date = new Date(Number.parseInt(rawTimestamp) * 1000)
//       } else if (typeof rawTimestamp === "number") {
//         date = new Date(rawTimestamp)
//       } else {
//         date = new Date()
//       }
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     } catch (error) {
//       console.error("Error formatting timestamp:", error)
//       return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     }
//   }

//   // FIXED: Better API message transformation with proper document handling
//   const transformApiMessage = async (apiMessage) => {
//     const numericTimestamp = Number.parseInt(apiMessage.timestamp) * 1000
//     const displayTimestamp = formatTimestamp(numericTimestamp)
//     const role = apiMessage.sender !== null ? "user" : "assistant"
//     const messageId = apiMessage.id || `api-temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     const senderIdentifier = apiMessage.sender || selectedUser?.wa_id_or_sender

//     const commonProps = {
//       id: messageId,
//       isRead: apiMessage.read === 1,
//       role,
//       timestamp: displayTimestamp,
//       sentAt: numericTimestamp,
//       status: apiMessage.read === 1 ? MessageStatus.READ : MessageStatus.DELIVERED,
//       isLocalMessage: false,
//       sender: senderIdentifier,
//     }

//     switch (apiMessage.message_type) {
//       case "text":
//         return {
//           ...commonProps,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || "No message content",
//         }

//       case "image":
//         return {
//           ...commonProps,
//           type: MessageType.IMAGE,
//           imageUrl: apiMessage.file_url || apiMessage.url || "/placeholder.svg?height=240&width=240",
//           mediaUrl: apiMessage.file_url || apiMessage.url,
//           // caption: apiMessage.message_body || "",
//           caption: "",
        
//         }

//       case "document": {
//         console.log("📥 Incoming API document message:", apiMessage)

//         // Get file URL
//         const fileUrl = apiMessage.file_url || apiMessage.url || apiMessage.media_url || null

//         // Clean filename - remove timestamp prefix if present
//         const rawFilename =
//           apiMessage.filename ||
//           apiMessage.name ||
//           apiMessage.caption ||
//           (fileUrl ? fileUrl.split("/").pop() : "Document")
//         const cleanFilename = decodeURIComponent(rawFilename).replace(/^\d{10,16}-/, "")

//         const fileSize = apiMessage.file_size || apiMessage.size || null

//         console.log("📄 Document details:", {
//           fileUrl,
//           rawFilename,
//           cleanFilename,
//           fileSize,
//         })

//         // Handle send errors
//         let sendError = null
//         if (apiMessage.extra_info2) {
//           try {
//             const parsed = JSON.parse(apiMessage.extra_info2)
//             if (Array.isArray(parsed) && parsed[0]?.code) sendError = parsed[0]
//           } catch (_) {
//             // ignore JSON parse errors
//           }
//         }

//         return {
//           ...commonProps,
//           type: MessageType.DOCUMENT,
//           documentName: cleanFilename,
//           // documentSize: fileSize ? formatBytes(fileSize) : "Unknown size",
//           documentUrl: fileUrl || "#",
//           mediaUrl: fileUrl,
//           caption: cleanFilename,
//           fileName: cleanFilename,
//           status: sendError ? MessageStatus.FAILED : apiMessage.status || MessageStatus.DELIVERED,
//           isRead: apiMessage.status === "read" || apiMessage.isRead === true || false,
//           sendError,
//         }
//       }

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
//           const res = await fetch(`${BASE_URL}/api/phone/get/message_template/${templateId}/${templateName}`)
//           const json = await res.json()
//           templateData = Array.isArray(json.data) ? json.data[0] : json.data || {}
//         } catch (err) {
//           console.error("❌ Template fetch failed:", err)
//         }

//         let components = []
//         try {
//           components =
//             typeof templateData.components === "string"
//               ? JSON.parse(templateData.components)
//               : templateData.components || []
//         } catch (e) {
//           console.error("❌ Failed to parse components:", e)
//         }

//         const bodyComponent = components.find((c) => c.type?.toLowerCase() === "body")
//         const bodyTemplate = bodyComponent?.text || "Template"
//         const bodyParamsFromApi = parsed.components?.find((c) => c.type?.toLowerCase() === "body")?.parameters || []

//         const filledBody = bodyTemplate.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
//           return bodyParamsFromApi[+idx - 1]?.text || ""
//         })

//         const footerText = components.find((c) => c.type?.toLowerCase() === "footer")?.text || ""
//         const headerComponent = components.find((c) => c.type?.toLowerCase() === "header")
//         let headerImage = null

//         if (headerComponent && headerComponent.format === "IMAGE" && headerComponent.example?.header_handle?.[0]) {
//           headerImage = headerComponent.example.header_handle[0]
//         }

//         // Extract buttons from template
//         const buttonsComponent = components.find((c) => c.type?.toLowerCase() === "buttons")
//         let buttons = []
//         if (buttonsComponent && buttonsComponent.buttons) {
//           buttons = buttonsComponent.buttons.map((btn) => ({
//             text: btn.text,
//             type: btn.type,
//             phone_number: btn.phone_number,
//             url: btn.url,
//           }))
//         }

//         return {
//           ...commonProps,
//           type: MessageType.TEMPLATE,
//           templateName,
//           headerText: templateName,
//           bodyText: filledBody,
//           footerText,
//           headerImage,
//           buttons,
//         }
//       }

//       case "video":
//         return {
//           ...commonProps,
//           type: MessageType.VIDEO,
//           videoUrl: apiMessage.file_url || "#",
//           mediaUrl: apiMessage.file_url,
//           caption: apiMessage.message_body || "",
//         }

//       default:
//         return {
//           ...commonProps,
//           type: MessageType.TEXT,
//           text: apiMessage.message_body || `${apiMessage.message_type} message`,
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

//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

//       if (!wabaId || !accessToken) {
//         throw new Error("Missing authentication data")
//       }

//       const response = await axios.get(`${BASE_URL}/api/phone/get/${wabaId}/${userId}/${page}`)
//       console.log(`Messages API Response for page ${page}:`, response.data)

//       const transformedMessages = Array.isArray(response.data)
//         ? await Promise.all(response.data.map((msg) => transformApiMessage(msg)))
//         : []

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

//   // FIXED: Load more messages function
//   const loadMoreMessages = async () => {
//     if (!selectedUser || !hasMoreMessages || loadingMoreMessages) return

//     const container = messagesContainerRef.current
//     if (!container) return

//     // Store current scroll position and height
//     const previousScrollHeight = container.scrollHeight
//     const previousScrollTop = container.scrollTop

//     const nextPage = currentPage + 1
//     setLoadingMoreMessages(true)

//     const { messages: newApiMessages, hasMore } = await fetchUserMessages(selectedUser.wa_id_or_sender, nextPage, true)

//     if (newApiMessages.length > 0) {
//       // Merge messages properly - new messages should be added to the beginning
//       const currentMessages = selectedUser.messages || []

//       // Create a map to avoid duplicates
//       const messageMap = new Map()

//       // Add new messages first (older messages)
//       newApiMessages.forEach((msg) => {
//         messageMap.set(msg.id, msg)
//       })

//       // Add existing messages (newer messages)
//       currentMessages.forEach((msg) => {
//         if (!messageMap.has(msg.id)) {
//           messageMap.set(msg.id, msg)
//         }
//       })

//       // Convert back to array and sort by timestamp
//       const mergedMessages = Array.from(messageMap.values()).sort((a, b) => {
//         return (a.sentAt || 0) - (b.sentAt || 0)
//       })

//       const updatedUser = {
//         ...selectedUser,
//         messages: mergedMessages,
//       }

//       setSelectedUser(updatedUser)
//       const updatedUsers = userList.map((u) => (u.id === selectedUser.id ? updatedUser : u))
//       setUserList(updatedUsers)
//       setCurrentPage(nextPage)

//       // Preserve scroll position after DOM update
//       setTimeout(() => {
//         if (container) {
//           const newScrollHeight = container.scrollHeight
//           const heightDifference = newScrollHeight - previousScrollHeight
//           container.scrollTop = previousScrollTop + heightDifference
//         }
//       }, 50)
//     }

//     setHasMoreMessages(hasMore)
//     setLoadingMoreMessages(false)
//   }

//   const handleScroll = () => {
//     if (loadingMoreMessages || !hasMoreMessages) return

//     const container = messagesContainerRef.current
//     if (!container) return

//     // Load more messages when scrolled to top
//     if (container.scrollTop === 0) {
//       loadMoreMessages()
//     }

//     // Check if user is near bottom for auto-scroll behavior
//     checkIfNearBottom()
//   }

//   useEffect(() => {
//     const container = messagesContainerRef.current
//     if (container) {
//       container.addEventListener("scroll", handleScroll)
//       return () => container.removeEventListener("scroll", handleScroll)
//     }
//   }, [selectedUser?.wa_id_or_sender, hasMoreMessages, loadingMoreMessages, currentPage])

//   useEffect(() => {
//     if (selectedUser && selectedUser.messages && shouldScrollToBottom && isNearBottom) {
//       scrollToBottom(false)
//     }
//   }, [selectedUser, shouldScrollToBottom, isNearBottom])

//   const fetchChats = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

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
//               userName: chat.user_name || "Unknown",
//               waId: chat.wa_id_or_sender,
//               wa_id_or_sender: chat.wa_id_or_sender,
//               messages: [],
//             }
//           })
//         : []

//       console.log("Transformed Data:", transformedData)

//       const storedUsers = loadMessagesFromStorage()
//       const mergedUsers = transformedData.map((apiUser) => {
//         const storedUser = storedUsers.find((stored) => stored.wa_id_or_sender === apiUser.wa_id_or_sender)
//         if (storedUser) {
//           return { ...apiUser, messages: storedUser.messages || [] }
//         }
//         return apiUser
//       })

//       setUserList(mergedUsers)
//     } catch (error) {
//       console.error("Error fetching chats:", error?.response?.data || error.message)
//       setError("Failed to load chats. Please try again.")

//       const storedUsers = loadMessagesFromStorage()
//       if (storedUsers.length > 0) {
//         setUserList(storedUsers)
//       } else {
//         setUserList([
//           {
//             id: 1,
//             firstName: "Demo",
//             lastName: "User",
//             profileImage: "DU",
//             source: "Source Web",
//             creationTime: "Mar 20, 2025, 10:54:16 PM",
//             lastActivity: "2025-04-11 14:30",
//             phone: "+1234567890",
//             waId: "918857808284",
//             wa_id_or_sender: "918857808284",
//             messages: [
//               {
//                 id: "demo-msg-1",
//                 type: MessageType.TEXT,
//                 text: "*API connection failed.* This is _demo data_ with ~formatting~ and `code`.\n\nNew line test.",
//                 isRead: true,
//                 timestamp: "10:30 AM",
//                 sentAt: Date.now() - 60 * 60 * 1000,
//                 role: "assistant",
//                 status: MessageStatus.READ,
//                 isLocalMessage: false,
//                 sender: "918857808284",
//               },
//             ],
//           },
//         ])
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

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

//   const simulateMessageStatusUpdates = (messageIdToUpdate, userWaId) => {
//     const updateMessageStatus = (status) => {
//       setUserList((prevUsers) => {
//         const newUsers = prevUsers.map((user) =>
//           user.wa_id_or_sender === userWaId
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) => (msg.id === messageIdToUpdate ? { ...msg, status } : msg)),
//               }
//             : user,
//         )
//         const updated = newUsers.find((u) => u.wa_id_or_sender === userWaId)
//         setSelectedUser(updated)
//         saveMessagesToStorage(newUsers)
//         return newUsers
//       })
//     }

//     setTimeout(() => updateMessageStatus(MessageStatus.SENT), 500)
//     setTimeout(() => updateMessageStatus(MessageStatus.DELIVERED), 2000)
//     setTimeout(() => updateMessageStatus(MessageStatus.READ), 5000)
//   }

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return

//     const messageId = `new-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now()

//     const newMsg = {
//       id: messageId,
//       type: MessageType.TEXT,
//       text: newMessage,
//       isRead: false,
//       role: "user",
//       timestamp: displayTimestamp,
//       sentAt: numericTimestamp,
//       status: MessageStatus.SENDING,
//       isLocalMessage: true,
//       sender: OUR_OWN_PHONE_NUMBER,
//     }

//     const wasNearBottom = checkIfNearBottom()

//     setUserList((prevUsers) => {
//       const updatedUsers = prevUsers.map((user) =>
//         user.id === selectedUser.id
//           ? {
//               ...user,
//               messages: [...user.messages, newMsg],
//             }
//           : user,
//       )
//       const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//       setSelectedUser(updatedUser)
//       saveMessagesToStorage(updatedUsers)
//       return updatedUsers
//     })

//     if (wasNearBottom) {
//       setTimeout(() => {
//         scrollToBottom(true)
//       }, 100)
//     }

//     setNewMessage("")

//     try {
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//       let phoneNumber = selectedUser.wa_id_or_sender || ""
//       if (phoneNumber.startsWith("+")) {
//         phoneNumber = phoneNumber.substring(1)
//       }
//       phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//       const requestBody = {
//         messaging_product: "whatsapp",
//         to: phoneNumber,
//         type: "text",
//         text: {
//           body: newMessage,
//         },
//       }

//       const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       })

//       if (!res.ok) {
//         const errorText = await res.text()
//         throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
//       } else {
//         const result = await res.json()
//         const apiReturnedMessageId = result.messages?.[0]?.id

//         setUserList((prevUsers) => {
//           const updatedUsers = prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId
//                       ? {
//                           ...msg,
//                           id: apiReturnedMessageId || msg.id,
//                           status: MessageStatus.SENT,
//                           isLocalMessage: false,
//                         }
//                       : msg,
//                   ),
//                 }
//               : user,
//           )
//           const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//           setSelectedUser(updated)
//           saveMessagesToStorage(updatedUsers)
//           return updatedUsers
//         })

//         simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       }
//     } catch (error) {
//       console.error("API Error:", error.message)
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.wa_id_or_sender === selectedUser.wa_id_or_sender
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//       alert(`Failed to send message: ${error.message}`)
//     }
//   }

//   // FIXED: Better user selection with proper message merging
//   // const handleUserSelect = async (user) => {
//   //   setSelectedUser(user)
//   //   if (isMobile) setShowSidebar(false)
//   //   setCurrentPage(1)
//   //   setHasMoreMessages(true)
//   //   setShouldScrollToBottom(true)
//   //   setIsNearBottom(true)

//   //   if (user.wa_id_or_sender) {
//   //     const storedUsers = loadMessagesFromStorage()
//   //     const storedUser = storedUsers.find((u) => u.wa_id_or_sender === user.wa_id_or_sender)
//   //     const localMessagesForUser = storedUser ? storedUser.messages : []

//   //     const { messages: apiMessagesPage1, hasMore } = await fetchUserMessages(user.wa_id_or_sender, 1, false)

//   //     // FIXED: Better message merging to prevent duplicates
//   //     const mergedMessages = mergeMessages(apiMessagesPage1, localMessagesForUser)

//   //     const updatedUser = { ...user, messages: mergedMessages }
//   //     setSelectedUser(updatedUser)
//   //     setHasMoreMessages(hasMore)

//   //     const updatedUsers = userList.map((u) => (u.id === user.id ? updatedUser : u))
//   //     setUserList(updatedUsers)
//   //     saveMessagesToStorage(updatedUsers)
//   //   }
//   // }

//   const handleUserSelect = async (user) => {
//     setSelectedUser(user)
//     if (isMobile) setShowSidebar(false)
  
//     setCurrentPage(1)
//     setHasMoreMessages(true)
//     setShouldScrollToBottom(true)
//     setIsNearBottom(true)
  
//     if (user.wa_id_or_sender) {
//       const storedUsers = loadMessagesFromStorage()
//       const storedUser = storedUsers.find(
//         (u) => u.wa_id_or_sender === user.wa_id_or_sender
//       )
//       const localMessagesForUser = storedUser ? storedUser.messages : []
  
//       const { messages: apiMessagesPage1, hasMore } = await fetchUserMessages(
//         user.wa_id_or_sender,
//         1,
//         false
//       )
  
//       const mergedMessages = mergeMessages(apiMessagesPage1, localMessagesForUser)
  
//       // ✅ Use the user from `userList` to preserve all correct properties
//       const originalUser = userList.find(
//         (u) =>
//           (user.id && u.id && user.id === u.id) ||
//           (user.wa_id_or_sender && user.wa_id_or_sender === u.wa_id_or_sender)
//       )
  
//       if (!originalUser) return
  
//       const updatedUser = {
//         ...originalUser, // ✅ Preserve all original state (like activeLast24Hours)
//         messages: mergedMessages, // 👈 Only update messages
//       }
  
//       setSelectedUser(updatedUser)
//       setHasMoreMessages(hasMore)
  
//       const updatedUsers = userList.map((u) =>
//         u === originalUser ? updatedUser : u
//       )
  
//       setUserList(updatedUsers)
//       saveMessagesToStorage(updatedUsers)
//     }
//   }
  
//   useEffect(() => {
//     const activeUsers = userList.filter(u => u.activeLast24Hours === true)
//     console.log("Total users:", userList.length)
//     console.log("Active users count:", activeUsers.length)
//     console.log("Active users keys:", activeUsers.map(u => generateUserKey(u)))
//   }, [userList])

  
//   const handleBackToList = () => {
//     if (isMobile) setShowSidebar(true)
//   }

//   const toggleInfoPanel = () => setShowInfoPanel((prev) => !prev)

//   const fetchTemplates = async () => {
//     setLoadingTemplates(true)
//     setTemplatesError(null)
//     try {
//       const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
//       const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"

//       if (!wabaId || !accessToken) {
//         throw new Error("Missing authentication data for templates")
//       }

//       const response = await axios.get(
//         `${BASE_URL}/api/phone/get/message_templates/${wabaId}?accessToken=${accessToken}`,
//       )

//       if (response.data && Array.isArray(response.data.data)) {
//         setTemplates(response.data.data)
//       } else {
//         setTemplates([])
//       }
//     } catch (error) {
//       console.error("Error fetching templates:", error?.response?.data || error.message)
//       setTemplatesError("Failed to load templates.")
//     } finally {
//       setLoadingTemplates(false)
//     }
//   }

//   const handlePlusClick = () => {
//     setShowPopup(true)
//     setSelectedOption("")
//     setDropdownContent("")
//     setShowDropdown(false)
//     setSelectedTemplateObject(null)
//     setOriginalTemplateBody("")
//     setTemplateBodyParameters([])
//     // Reset custom image states
//     setCustomHeaderImageUrl("")
//     setShowImageUrlInput(false)
//     fetchTemplates()
//   }

//   const handlePopupCancel = () => {
//     setShowPopup(false)
//     setSelectedOption("")
//     setDropdownContent("")
//     setShowDropdown(false)
//     setSelectedTemplateObject(null)
//     setOriginalTemplateBody("")
//     setTemplateBodyParameters([])
//     // Reset custom image states
//     setCustomHeaderImageUrl("")
//     setShowImageUrlInput(false)
//   }

//   const handlePopupSend = async () => {
//     if (!selectedUser?.wa_id_or_sender) {
//       alert("Please select a user to send message.")
//       return
//     }

//     let phoneNumber = selectedUser.wa_id_or_sender || ""
//     if (phoneNumber.startsWith("+")) {
//       phoneNumber = phoneNumber.substring(1)
//     }
//     phoneNumber = phoneNumber.replace(/[^\d]/g, "")

//     const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
//     const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"

//     const messageId = `popup-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//     const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     const numericTimestamp = Date.now()

//     let requestBody = {}
//     let messageToSend = {}
//     let headerImageUrlForLocal = null

//     try {
//       if (selectedOption === "custom") {
//         if (!dropdownContent.trim()) {
//           alert("Custom message cannot be empty.")
//           return
//         }

//         requestBody = {
//           messaging_product: "whatsapp",
//           to: phoneNumber,
//           type: "text",
//           text: {
//             body: dropdownContent,
//           },
//         }

//         messageToSend = {
//           id: messageId,
//           type: MessageType.TEXT,
//           text: dropdownContent,
//           isRead: false,
//           role: "user",
//           timestamp: displayTimestamp,
//           sentAt: numericTimestamp,
//           status: MessageStatus.SENDING,
//           isLocalMessage: true,
//           sender: OUR_OWN_PHONE_NUMBER,
//         }
//       } else if (selectedTemplateObject) {
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(selectedTemplateObject.components)
//         } catch (e) {
//           console.error("Error parsing template components:", e)
//           alert("Error preparing template message. Sending as plain text.")
//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "text",
//             text: {
//               body: dropdownContent,
//             },
//           }
//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEXT,
//             text: dropdownContent,
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER,
//           }
//         }

//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         const originalBodyText = bodyComponent?.text || ""

//         if (templateBodyParameters.length > 0 && templateBodyParameters.some((param) => param.trim() === "")) {
//           alert("Please fill all template parameters.")
//           return
//         }

//         let sendAsPlainText = false
//         if (templateBodyParameters.length > 0) {
//           let currentPreviewText = originalBodyText
//           templateBodyParameters.forEach((paramValue, i) => {
//             currentPreviewText = currentPreviewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//           })
//           if (dropdownContent !== currentPreviewText) {
//             sendAsPlainText = true
//           }
//         } else if (dropdownContent !== originalBodyText) {
//           sendAsPlainText = true
//         }

//         // Extract buttons from template
//         const buttonsComponent = componentsArray.find((comp) => comp.type === "BUTTONS")
//         let buttons = []
//         if (buttonsComponent && buttonsComponent.buttons) {
//           buttons = buttonsComponent.buttons.map((btn) => ({
//             text: btn.text,
//             type: btn.type,
//             phone_number: btn.phone_number,
//             url: btn.url,
//           }))
//         }

//         if (sendAsPlainText) {
//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "text",
//             text: {
//               body: dropdownContent,
//             },
//           }
//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEXT,
//             text: dropdownContent,
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER,
//           }
//         } else {
//           const componentsForApi = []
//           const headerComponent = componentsArray.find((comp) => comp.type === "HEADER")

//           if (headerComponent) {
//             if (headerComponent.format === "IMAGE") {
//               // Use custom image URL if provided, otherwise use template default
//               const imageUrl = customHeaderImageUrl.trim() || headerComponent.example?.header_handle?.[0]
//               if (imageUrl) {
//                 componentsForApi.push({
//                   type: "header",
//                   parameters: [{ type: "image", image: { link: imageUrl } }],
//                 })
//                 headerImageUrlForLocal = imageUrl
//               }
//             }
//           }

//           if (bodyComponent && templateBodyParameters.length > 0) {
//             componentsForApi.push({
//               type: "body",
//               parameters: templateBodyParameters.map((param) => ({ type: "text", text: param })),
//             })
//           }

//           requestBody = {
//             messaging_product: "whatsapp",
//             to: phoneNumber,
//             type: "template",
//             template: {
//               name: selectedTemplateObject.name,
//               language: {
//                 code: selectedTemplateObject.language || "en_US",
//               },
//               components: componentsForApi,
//             },
//           }

//           messageToSend = {
//             id: messageId,
//             type: MessageType.TEMPLATE,
//             bodyText: dropdownContent,
//             headerImage: headerImageUrlForLocal,
//             buttons: buttons, // Add buttons to the message
//             isRead: false,
//             role: "user",
//             timestamp: displayTimestamp,
//             sentAt: numericTimestamp,
//             status: MessageStatus.SENDING,
//             isLocalMessage: true,
//             sender: OUR_OWN_PHONE_NUMBER,
//           }
//         }
//       } else {
//         alert("Please select a template or type a custom message.")
//         return
//       }

//       const wasNearBottom = checkIfNearBottom()

//       setUserList((prevUsers) => {
//         const updatedUsers = prevUsers.map((user) =>
//           user.id === selectedUser.id
//             ? {
//                 ...user,
//                 messages: [...user.messages, messageToSend],
//               }
//             : user,
//         )
//         const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
//         setSelectedUser(updatedUser)
//         saveMessagesToStorage(updatedUsers)
//         return updatedUsers
//       })

//       if (wasNearBottom) {
//         setTimeout(() => {
//           scrollToBottom(true)
//         }, 100)
//       }

//       const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       })

//       if (!res.ok) {
//         const errorText = await res.text()
//         throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
//       } else {
//         const result = await res.json()
//         const apiReturnedMessageId = result.messages?.[0]?.id

//         setUserList((prevUsers) => {
//           const updatedUsers = prevUsers.map((user) =>
//             user.id === selectedUser.id
//               ? {
//                   ...user,
//                   messages: user.messages.map((msg) =>
//                     msg.id === messageId
//                       ? {
//                           ...msg,
//                           id: apiReturnedMessageId || msg.id,
//                           status: MessageStatus.SENT,
//                           isLocalMessage: false,
//                         }
//                       : msg,
//                   ),
//                 }
//               : user,
//           )
//           const updated = updatedUsers.find((u) => u.id === selectedUser.id)
//           setSelectedUser(updated)
//           saveMessagesToStorage(updatedUsers)
//           return updatedUsers
//         })

//         simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
//       }
//     } catch (error) {
//       console.error("API Error:", error.message)
//       alert(`Failed to send message: ${error.message}`)
//       setUserList((prevUsers) =>
//         prevUsers.map((user) =>
//           user.wa_id_or_sender === selectedUser.wa_id_or_sender
//             ? {
//                 ...user,
//                 messages: user.messages.map((msg) =>
//                   msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
//                 ),
//               }
//             : user,
//         ),
//       )
//     } finally {
//       setShowPopup(false)
//       setSelectedOption("")
//       setDropdownContent("")
//       setShowDropdown(false)
//       setSelectedTemplateObject(null)
//       setOriginalTemplateBody("")
//       setTemplateBodyParameters([])
//       // Reset custom image states
//       setCustomHeaderImageUrl("")
//       setShowImageUrlInput(false)
//     }
//   }

//   const handleDropdownSelect = (e) => {
//     const selectedValue = e.target.value
//     setSelectedOption(selectedValue)
//     setShowDropdown(true)

//     // Reset custom image states when changing selection
//     setCustomHeaderImageUrl("")
//     setShowImageUrlInput(false)

//     if (selectedValue === "custom") {
//       setSelectedTemplateObject(null)
//       setDropdownContent("Enter your custom message here...")
//       setOriginalTemplateBody("")
//       setTemplateBodyParameters([])
//     } else {
//       const template = templates.find((t) => t.name === selectedValue)
//       if (template) {
//         setSelectedTemplateObject(template)
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(template.components)
//         } catch (e) {
//           console.error("Error parsing template components:", e)
//         }

//         // Check if template has header image
//         const headerComponent = componentsArray.find((comp) => comp.type === "HEADER")
//         if (headerComponent && headerComponent.format === "IMAGE") {
//           setShowImageUrlInput(true)
//           // Don't pre-fill the custom image URL - leave it empty so user can enter their own
//         }

//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         const bodyText = bodyComponent?.text || ""
//         setOriginalTemplateBody(bodyText)

//         const variableMatches = [...bodyText.matchAll(/\{\{(\d+)\}\}/g)]
//         if (variableMatches.length > 0) {
//           const maxVarIndex = Math.max(...variableMatches.map((match) => Number.parseInt(match[1])))
//           const templateExampleParams = bodyComponent?.example?.body_text?.[0] || []
//           const initialParams = Array(maxVarIndex)
//             .fill("")
//             .map((_, i) => {
//               return templateExampleParams[i] !== undefined ? templateExampleParams[i] : ""
//             })

//           setTemplateBodyParameters(initialParams)

//           let previewText = bodyText
//           initialParams.forEach((paramValue, i) => {
//             previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//           })
//           setDropdownContent(previewText)
//         } else {
//           setTemplateBodyParameters([])
//           setDropdownContent(bodyText)
//         }
//       } else {
//         setDropdownContent("")
//         setSelectedTemplateObject(null)
//         setOriginalTemplateBody("")
//         setTemplateBodyParameters([])
//       }
//     }
//   }

//   const handleTemplateParameterChange = (index, value) => {
//     setTemplateBodyParameters((prev) => {
//       const newParams = [...prev]
//       newParams[index] = value

//       if (selectedTemplateObject) {
//         let componentsArray = []
//         try {
//           componentsArray = JSON.parse(selectedTemplateObject.components)
//         } catch (e) {
//           console.error("Error parsing template components for preview update:", e)
//         }

//         const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
//         let previewText = bodyComponent?.text || ""
//         newParams.forEach((paramValue, i) => {
//           previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
//         })
//         setDropdownContent(previewText)
//       }

//       return newParams
//     })
//   }

//   const handleCustomImageUrlChange = (e) => {
//     setCustomHeaderImageUrl(e.target.value)
//   }
  

//   // Fixed useEffect for handling click outside - now properly targets the attachment menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isOpen && attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [isOpen])

//   useEffect(() => {
//     return () => {
//       if (scrollTimeoutRef.current) {
//         clearTimeout(scrollTimeoutRef.current)
//       }
//     }
//   }, [])

//   if (loading) {
//     return (
//       <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <p className="text-gray-600 text-sm sm:text-base">Loading chats...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//         <div className="flex items-center justify-center w-full">
//           <div className="text-center">
//             <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
//             <button
//               onClick={fetchChats}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm sm:text-base"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-screen bg-gray-100 p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 pt-16 sm:pt-20">
//       {/* Popup Modal */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
//             <h3 className="text-lg font-semibold mb-4">Select Template</h3>
//             {/* Dropdown */}
//             <div className="mb-4">
//               <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
//                 Choose Template
//               </label>
//               <div className="relative">
//                 <select
//                   id="template-select"
//                   value={selectedOption}
//                   onChange={handleDropdownSelect}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
//                   disabled={loadingTemplates}
//                 >
//                   <option value="">{loadingTemplates ? "Loading templates..." : "Select an option..."}</option>
//                   {templatesError && (
//                     <option value="" disabled>
//                       {templatesError}
//                     </option>
//                   )}
//                   {templates.map((template) => (
//                     <option key={template.name} value={template.name}>
//                       {template.name}
//                     </option>
//                   ))}
//                   <option value="custom">Custom Message</option>
//                 </select>
//                 <ChevronDown
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
//                   size={20}
//                 />
//               </div>
//             </div>

//             {/* Custom Image URL Input - Show only for templates with image headers */}
//             {showImageUrlInput && selectedTemplateObject && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
//                 <input
//                   type="url"
//                   value={customHeaderImageUrl}
//                   onChange={handleCustomImageUrlChange}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter Image URL"
//                 />
//                 {customHeaderImageUrl && (
//                   <div className="mt-2">
//                     <img
//                       src={customHeaderImageUrl || "/placeholder.svg"}
//                       alt="Custom Header Preview"
//                       className="w-full h-32 object-cover rounded-md border"
//                       onError={(e) => {
//                         e.target.src = "/placeholder.svg?height=128&width=300"
//                       }}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Content area that shows when dropdown is selected */}
//             {showDropdown && (
//               <div className="mb-4">
//                 {selectedOption === "custom" ? (
//                   <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
//                     <textarea
//                       value={dropdownContent}
//                       onChange={(e) => setDropdownContent(e.target.value)}
//                       className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows="5"
//                       placeholder="Enter your custom message here..."
//                     />
//                   </div>
//                 ) : (
//                   selectedTemplateObject && (
//                     <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
//                       {(() => {
//                         let componentsArray = []
//                         try {
//                           componentsArray = JSON.parse(selectedTemplateObject.components)
//                         } catch (e) {
//                           console.error("Error parsing template components for preview:", e)
//                           return <p className="text-red-500 text-xs">Error loading template preview.</p>
//                         }

//                         return (
//                           <>
//                             {componentsArray.map((comp, compIndex) => {
//                               if (comp.type === "HEADER") {
//                                 if (comp.format === "IMAGE") {
//                                   // Show custom image if provided, otherwise show template default
//                                   const imageUrl = customHeaderImageUrl || comp.example?.header_handle?.[0]
//                                   return (
//                                     <div key={compIndex} className="mb-2">
//                                       <img
//                                         src={imageUrl || "/placeholder.svg"}
//                                         alt="Template Header Image"
//                                         className="w-full h-32 object-cover rounded-md"
//                                         onError={(e) => (e.target.src = "/placeholder.svg?height=128&width=128")}
//                                       />
//                                     </div>
//                                   )
//                                 } else if (comp.format === "TEXT" && comp.text) {
//                                   return (
//                                     <div key={compIndex} className="font-semibold text-base mb-2">
//                                       {comp.text}
//                                     </div>
//                                   )
//                                 }
//                               } else if (comp.type === "BODY") {
//                                 return (
//                                   <div key={compIndex} className="mb-2">
//                                     <textarea
//                                       value={dropdownContent}
//                                       onChange={(e) => setDropdownContent(e.target.value)}
//                                       className="w-full p-2 border border-gray-300 rounded text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                       rows="3"
//                                     />
//                                     {templateBodyParameters.length > 0 && (
//                                       <div className="mt-2 space-y-2">
//                                         <p className="text-sm font-medium text-gray-700">Fields:</p>
//                                         {templateBodyParameters.map((param, paramIndex) => (
//                                           <input
//                                             key={paramIndex}
//                                             type="text"
//                                             value={param}
//                                             onChange={(e) => handleTemplateParameterChange(paramIndex, e.target.value)}
//                                             className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             placeholder={`Field ${paramIndex + 1}`}
//                                           />
//                                         ))}
//                                       </div>
//                                     )}
//                                   </div>
//                                 )
//                               } else if (comp.type === "FOOTER" && comp.text) {
//                                 return (
//                                   <div key={compIndex} className="text-xs text-gray-500 mt-2">
//                                     {comp.text}
//                                   </div>
//                                 )
//                               } else if (comp.type === "BUTTONS" && comp.buttons?.length > 0) {
//                                 return (
//                                   <div key={compIndex} className="flex flex-col gap-2 mt-2">
//                                     {comp.buttons.map((button, btnIndex) => (
//                                       <button
//                                         key={btnIndex}
//                                         className="px-3 py-2 border border-blue-500 text-blue-600 bg-white rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2"
//                                       >
//                                         {button.type === "PHONE_NUMBER" && <Phone size={16} />}
//                                         {button.text}
//                                       </button>
//                                     ))}
//                                   </div>
//                                 )
//                               }
//                               return null
//                             })}
//                           </>
//                         )
//                       })()}
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handlePopupCancel}
//                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePopupSend}
//                 disabled={
//                   !selectedOption ||
//                   (selectedOption === "custom" && !dropdownContent.trim()) ||
//                   (selectedOption !== "custom" &&
//                     selectedTemplateObject &&
//                     templateBodyParameters.length > 0 &&
//                     templateBodyParameters.some((param) => param.trim() === ""))
//                 }
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         className={`${
//           showSidebar ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
//           isMobile ? "w-full absolute inset-2 z-10" : "w-full md:w-1/3"
//         }`}
//       >
//         <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//           <div className="flex items-center justify-between gap-4">
//             {isMobile && selectedUser && (
//               <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500 hover:text-gray-700">
//                 <X size={20} />
//               </button>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <Menu size={18} className="sm:w-5 sm:h-5" />
//             <h1 className="text-base sm:text-lg font-semibold">Chat List</h1>
//             <h1 className="text-base sm:text-lg font-semibold ml-20">Total: {userList.length}</h1>
//             {/* <h1 className="text-base sm:text-lg font-semibold ml-20">
//             Active: {userList.filter((user) => user.activeLast24Hours === true).length}
//             </h1> */}
//             <h1 className="text-base sm:text-lg font-semibold ml-20">
//   Active: {
//     Array.from(
//       new Set(
//         userList
//           .filter(user => user.activeLast24Hours)
//           .map(user => user.wa_id_or_sender)
//       )
//     ).length
//   }
// </h1>

//           </div>
          
//           <div>
//             <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1 mt-4 sm:mt-6">
//               Search
//             </label>
//             <input
//               id="search-input"
//               type="text"
//               placeholder="Searching....."
//               className="w-full p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <hr className="border-gray-300" />
//         </div>

//         <div className="overflow-y-auto px-3 sm:px-4 pb-4 space-y-2 sm:space-y-3 flex-1">
          
//           {userList
//             .filter((user) => {
//               const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
//               return fullName.includes(searchTerm.toLowerCase())
//             })
//             .map((user) => (
              
//               <div
//                 key={generateUserKey(user)}
//                 onClick={() => handleUserSelect(user)}
//                 className="flex justify-between items-start gap-2 sm:gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
//               >
//                 <div className="flex items-start gap-2 sm:gap-3 min-w-0">
//                   <div className="relative">
//                     <div
//                       className={`${
//                         user.activeLast24Hours ? "bg-green-600 text-white" : "bg-gray-400 text-black"
//                       } w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0`}
//                     >
//                       {user.firstName.charAt(0)}
//                       {user.lastName.charAt(0)}
//                     </div>
//                     {user.activeLast24Hours && (
//                       <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full" />
//                     )}
                    
//                   </div>
//                   <div className="flex flex-col min-w-0">
//                     <div className="flex items-center gap-1 sm:gap-2 flex-wrap min-w-0">
//                       <p className="font-medium truncate max-w-[120px] sm:max-w-[140px] text-sm sm:text-base">
//                         {user.firstName} {user.lastName}
//                       </p>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
//                       {user.remainingTime}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="text-xs sm:text-sm text-black whitespace-nowrap ml-1 sm:ml-2 shrink-0 mt-1">
//                   {user.messageCount} message
//                 </span>
//               </div>
//             ))}
            
//         </div>
//       </div>

//       <div
//         className={`${
//           !showSidebar || !isMobile ? "flex" : "hidden"
//         } md:flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden ${
//           isMobile ? "w-full" : "w-full md:w-2/3"
//         }`}
//       >
//         {selectedUser ? (
//           <>
//             <div className="flex items-center justify-between gap-2 sm:gap-4 border-b p-3 sm:p-4">
//               <div className="flex items-center gap-2">
//                 {isMobile && (
//                   <button onClick={handleBackToList} className="md:hidden text-gray-500 hover:text-gray-700 mr-1">
//                     <Menu size={20} />
//                   </button>
//                 )}
//                 <div className="bg-gray-400 text-black w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
//                   {selectedUser.firstName.charAt(0)}
//                   {selectedUser.lastName.charAt(0)}
//                 </div>
//                 <h2 className="text-sm sm:text-base md:text-lg font-semibold">
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h2>
//               </div>
//               <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600 p-2 rounded-full">
//                 <Info size={18} className="sm:w-5 sm:h-5" />
//               </button>
//             </div>

//             <div
//               ref={messagesContainerRef}
//               className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gray-200 text-left"
//               style={{ scrollBehavior: "smooth" }}
//             >
//               {loadingMoreMessages && (
//                 <div className="flex items-center justify-center py-4">
//                   <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-xs sm:text-sm">Loading more messages...</span>
//                 </div>
//               )}

//               {messagesLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading messages...</span>
//                 </div>
//               ) : messagesError ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-red-600 text-sm sm:text-base">{messagesError}</p>
//                 </div>
//               ) : selectedUser.messages.length === 0 ? (
//                 <div className="flex items-center justify-center py-8">
//                   <p className="text-gray-500 text-sm sm:text-base">No messages found</p>
//                 </div>
//               ) : (
//                 selectedUser.messages.map((msg, index) => {
//                   const showDateSeparator =
//                     index === 0 ||
//                     getMessageDate(msg.sentAt) !== getMessageDate(selectedUser.messages[index - 1].sentAt)

//                   const isMessageFromContact = msg.role === "user" && msg.sender === selectedUser.wa_id_or_sender
//                   const position = isMessageFromContact ? "left" : "right"

//                   return (
//                     <div key={generateMessageKey(msg)} className="relative group">
//                       {showDateSeparator && <DateSeparator date={msg.sentAt} />}
//                       <MessageRenderer message={msg} position={position} />
//                     </div>
//                   )
//                 })
//               )}
//             </div>

//             <div className="p-2 sm:p-3 md:p-4 border-t flex flex-col gap-2">
//               <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <div className="relative">
//                     <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full" onClick={handlePlusClick}>
//                       <Plus size={18} className="sm:w-5 sm:h-5" />
//                     </button>
//                   </div>
//                   <div className="relative inline-block text-left" ref={attachmentMenuRef}>
//                     <button
//                       className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
//                       onClick={toggleAttachmentMenu3}
//                       disabled={uploadingFile}
//                     >
//                       <Paperclip size={18} />
//                     </button>
//                     {isOpen && (
//                       <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 w-40 sm:w-48 z-50 space-y-2">
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => imageInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <ImageIcon size={18} className="text-green-700" />
//                           <span className="text-sm">Image</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept="image/*"
//                           ref={imageInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "image")}
//                         />
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => videoInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <Video size={18} className="text-red-700" />
//                           <span className="text-sm">Video</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept="video/*"
//                           ref={videoInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "video")}
//                         />
//                         <button
//                           className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
//                           onClick={() => documentInputRef.current?.click()}
//                           disabled={uploadingFile}
//                         >
//                           <File size={18} className="text-blue-700" />
//                           <span className="text-sm">Document</span>
//                         </button>
//                         <input
//                           type="file"
//                           accept=".pdf,.doc,.docx,.txt"
//                           ref={documentInputRef}
//                           className="hidden"
//                           onChange={(e) => handleFileSend(e, "document")}
//                         />
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
//                   className="flex-1 border-0 outline-none px-2 sm:px-3 py-1 text-sm sm:text-base bg-transparent focus:ring-0"
//                 />
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full">
//                     <Mic size={18} className="sm:w-5 sm:h-5" />
//                   </button>
//                   <button
//                     onClick={handleSendMessage}
//                     className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-600"
//                     disabled={uploadingFile}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="sm:w-5 sm:h-5"
//                     >
//                       <line x1="22" y1="2" x2="11" y2="13"></line>
//                       <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//               {uploadingFile && (
//                 <div className="flex items-center justify-center py-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//                   <span className="ml-2 text-gray-600 text-sm">Uploading file...</span>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center flex-1 p-4">
//             <img
//               src="/placeholder.svg?height=160&width=160"
//               alt="WhatsApp"
//               className="hidden sm:block w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-4 sm:mb-6"
//             />
//             <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Click a user to chat</h2>
//           </div>
//         )}
//       </div>

//       {showInfoPanel && selectedUser && (
//         <div
//           className={`${
//             isMobile
//               ? "fixed inset-0 bg-white z-30 p-4"
//               : "absolute right-0 top-16 bottom-4 w-64 sm:w-72 md:w-80 bg-white shadow-2xl border-l rounded-l-2xl p-4 z-20"
//           }`}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-base sm:text-lg">User Info</h3>
//             <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
//               <X size={18} className="sm:w-5 sm:h-5" />
//             </button>
//           </div>
//           <div className="space-y-3 text-sm text-gray-700">
//             <div className="bg-gray-300 text-black w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mx-auto sm:ml-32">
//               {selectedUser.firstName.charAt(0)}
//               {selectedUser.lastName.charAt(0)}
//             </div>
//             <div className="flex flex-col min-w-0 text-center sm:ml-28">
//               <p className="truncate max-w-[200px] sm:max-w-[140px] font-semibold text-sm sm:text-base">
//                 {selectedUser.firstName} {selectedUser.lastName}
//               </p>
//               <span className="text-xs bg-purple-50 text-purple-800 px-2 py-1 rounded-md mt-2 inline-block">Lead</span>
//             </div>
//             <hr className="border-gray-300" />
//             <h1 className="font-semibold text-base sm:text-lg">Details</h1>
//             <div className="flex items-center gap-2 mt-2">
//               <MessageSquareText size={14} className="text-orange-500 sm:w-4 sm:h-4" />
//               <span className="font-extralight text-xs sm:text-sm">
//                 Source <span className="text-indigo-500">{selectedUser.source}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <Calendar size={14} className="text-cyan-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Creation Time <span className="text-indigo-500">{selectedUser.creationTime}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock size={14} className="text-orange-300 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Last Activity <span className="text-indigo-500">{selectedUser.lastActivity}</span>
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Phone size={14} className="text-green-500 mt-1 sm:mt-3 sm:w-4 sm:h-4" />
//               <span className="mt-1 sm:mt-3 font-extralight text-xs sm:text-sm">
//                 Phone <span className="text-indigo-500">{selectedUser.phone}</span>
//               </span>
//             </div>
//           </div>
//           <hr className="border-gray-300 mt-3" />
//           <div className="mt-4">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="font-medium text-sm sm:text-base">Notes</h4>
//               <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full">
//                 <Plus size={16} className="sm:w-4 sm:h-4" />
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
  MessageSquareText,
  Clock,
  Download,
  FileMinus,
  Check,
  CheckCheck,
  Paperclip,
  ImageIcon,
  Video,
  File,
  ChevronDown,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

const BASE_URL = "https://waba.mpocket.in"
const OUR_OWN_PHONE_NUMBER = "me"

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

const MessageStatus = {
  SENDING: "sending",
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
  FAILED: "failed",
}

const MessageTicks = ({ status, timestamp, position }) => {
  const renderTicks = () => {
    const alignmentClass = position === "left" ? "justify-start" : "justify-end"
    if (position === "left") {
      return (
        <div className={`flex items-center gap-1 ${alignmentClass}`}>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
      )
    }
    switch (status) {
      case MessageStatus.SENT:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
            <Check size={12} className="text-gray-400" />
          </div>
        )
      case MessageStatus.DELIVERED:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
            <div className="relative w-4 h-4">
              <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
            </div>
          </div>
        )
      case MessageStatus.READ:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
            <div className="relative w-4 h-4">
              <CheckCheck size={12} className="absolute left-0 top-0 text-blue-400" />
            </div>
          </div>
        )
      case MessageStatus.SENDING:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
            <Check size={12} className="text-gray-400" />
          </div>
        )
      case MessageStatus.FAILED:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <X size={12} className="text-red-500" />
            <span className="text-xs text-red-500">Failed</span>
          </div>
        )
      default:
        return (
          <div className={`flex items-center gap-1 ${alignmentClass}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        )
    }
  }
  return <div className="mt-1 text-left">{renderTicks()}</div>
}

const STORAGE_KEY = "whatsapp_chat_messages"
const USER_STORAGE_KEY = "whatsapp_chat_users"

const saveMessagesToStorage = (userList) => {
  try {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userList))
  } catch (error) {
    console.error("Failed to save messages to localStorage:", error)
  }
}

const loadMessagesFromStorage = () => {
  try {
    const stored = sessionStorage.getItem(USER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load messages from localStorage:", error)
    return []
  }
}

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

const formatRemainingTime = (dateString) => {
  if (!dateString) return "No recent activity"
  try {
    const date = new Date(dateString)
    if (isYesterday(date)) {
      return "Yesterday"
    }
    if (isToday(date)) {
      return "Today"
    }
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
    let date
    if (typeof timestamp === "string" && !isNaN(Number(timestamp))) {
      date = new Date(Number.parseInt(timestamp) * 1000)
    } else if (typeof timestamp === "number") {
      date = new Date(timestamp)
    } else {
      date = new Date()
    }
    return date.toDateString()
  } catch (error) {
    console.error("Error getting message date:", error)
    return new Date().toDateString()
  }
}

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
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/~([^~\n]+)~/g, "<del>$1</del>")
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

const outgoingMessageClasses = "bg-gradient-to-br from-indigo-200 to-indigo-50 shadow-lg border border-blue-300"
const incomingMessageClasses = "bg-gradient-to-br from-gray-50 to-gray-300 shadow-lg border border-gray-300"

const TextMessage = ({ message, position }) => (
  <div
    className={`${
      position === "left" ? incomingMessageClasses : outgoingMessageClasses
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative text-sm sm:text-base`}
  >
    {message.headerImageUrl && (
      <img
        src={message.headerImageUrl || "/placeholder.svg"}
        alt="Template Header"
        className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=240&width=240"
        }}
      />
    )}
    <div
      dangerouslySetInnerHTML={{ __html: formatText(message.text, "text") }}
      className="whitespace-pre-wrap break-words"
    />
    <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
  </div>
)

const ImageMessage = ({ message, position }) => (
  <>
  <div
    className={`${
      position === "left" ? incomingMessageClasses : outgoingMessageClasses
    } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
  >
    <img
      src={message.imageUrl || message.mediaUrl || "/placeholder.svg?height=240&width=240"}
      // alt={message.caption || "Shared image"}
      alt={message.caption ? message.caption : ""}
      className="rounded-md mb-2 w-full max-w-[240px] h-48 sm:h-60 object-cover"
      onError={(e) => {
        e.target.src = "/placeholder.svg?height=240&width=240"
      }}
    />
    <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
  </div>
  </>
)

const DocumentMessage = ({ message, position }) => {
  // console.log("📄 DocumentMessage received:", message)
  return (
    <div
      className={`${
        position === "left" ? incomingMessageClasses : outgoingMessageClasses
      } p-2 sm:p-3 rounded-xl max-w-[280px] sm:max-w-xs md:max-w-sm relative`}
    >
      <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
        <div className="p-2 rounded-md mr-2">
          <FileMinus size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {message.documentName || message.fileName || message.caption || "Document"}
          </p>
          {/* <p className="text-xs text-gray-500">{formattedSize}</p> */}
        </div>
        {(message.documentUrl || message.mediaUrl) && message.documentUrl !== "#" && (
          <a
            href={message.documentUrl || message.mediaUrl}
            className="text-green-500 border border-green-500 rounded-full hover:text-blue-700 p-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} />
          </a>
        )}
      </div>
      {message.caption && message.caption !== (message.documentName || message.fileName) && (
        <div
          dangerouslySetInnerHTML={{
            __html: formatText(message.caption, "document"),
          }}
          className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
        />
      )}
      <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
    </div>
  )
}

const TemplateMessage = ({ message, position }) => {
  const handleButtonClick = (button) => {
    if (button.type === "PHONE_NUMBER" && button.phone_number) {
      window.open(`tel:${button.phone_number}`, "_self")
    } else if (button.type === "URL" && button.url) {
      window.open(button.url, "_blank")
    }
  }

  // Fix: Use headerImage property consistentl
  const headerImageUrl = message.headerImage || message.headerImageUrl || null

  return (
    <div
      className={`${
        position === "left" ? incomingMessageClasses : outgoingMessageClasses
      } p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm relative`}
    >
      {headerImageUrl && (
        <img
          src={headerImageUrl || "/placeholder.svg?height=240&width=240"}
          alt="Header"
          className="w-full object-cover rounded-t-xl mb-2"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=240&width=240"
          }}
        />
      )}
      <div className="p-1">
        <div
          dangerouslySetInnerHTML={{ __html: formatText(message.bodyText, "template") }}
          className="text-sm whitespace-pre-wrap break-words mb-2"
        />
        {message.buttons && message.buttons.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {message.buttons.map((button, btnIndex) => (
              <button
                key={btnIndex}
                onClick={() => handleButtonClick(button)}
                className="px-3 py-2 border border-blue-500 text-white bg-blue-600 rounded-md text-sm hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                {button.type === "PHONE_NUMBER" && <Phone size={16} />}
                {button.type === "URL" && <Paperclip size={16} className="text-gray-200" />}
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
    </div>
  )
}

const VideoMessage = ({ message, position }) => (
  <div
    className={`${
      position === "left" ? incomingMessageClasses : outgoingMessageClasses
    } p-2 sm:p-3 rounded-xl inline-flex flex-col relative max-w-[280px] sm:max-w-xs md:max-w-sm`}
  >
    <video
      src={message.videoUrl || message.mediaUrl || "#"}
      controls
      className="rounded-md mb-2 w-full max-h-48 sm:max-h-60 object-cover"
    >
      Your browser does not support the video tag.
    </video>
    {/* {message.caption && (
      <div
        dangerouslySetInnerHTML={{ __html: formatText(message.caption, "video") }}
        className={`text-sm ${position === "left" ? "text-gray-600" : "text-black"} whitespace-pre-wrap break-words`}
      />
    )} */}
    <MessageTicks status={message.status} timestamp={message.timestamp} position={position} />
  </div>
)

const MessageRenderer = ({ message, position }) => {
  const Component = (() => {
    switch (message.type) {
      case MessageType.IMAGE:
        return ImageMessage
      case MessageType.DOCUMENT:
        return DocumentMessage
      case MessageType.VIDEO:
        return VideoMessage
      case MessageType.TEMPLATE:
        return TemplateMessage
      case MessageType.TEXT:
      default:
        return TextMessage
    }
  })()
  return (
    <div className={`flex ${position === "left" ? "justify-start" : "justify-end"} mb-2 sm:mb-3`}>
      <Component message={message} position={position} />
    </div>
  )
}

const generateMessageKey = (message) => {
  return message.id || `temp-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const generateUserKey = (user) => {
  return user.wa_id_or_sender || user.id || `${user.firstName}-${user.lastName}`.toLowerCase()
}

const getStatusOrder = (status) => {
  switch (status) {
    case MessageStatus.SENDING:
      return 1
    case MessageStatus.SENT:
      return 2
    case MessageStatus.DELIVERED:
      return 3
    case MessageStatus.READ:
      return 4
    default:
      return 0
  }
}

// FIXED: Better message merging logic to prevent duplicates
const mergeMessages = (newMessages, existingMessages) => {
  const uniqueMessagesMap = new Map()
  existingMessages.forEach((msg) => {
    uniqueMessagesMap.set(msg.id, msg)
  })
  // Add new messages, updating existing ones if needed
  newMessages.forEach((newMessage) => {
    const existing = uniqueMessagesMap.get(newMessage.id)
    if (existing) {
      // Only update if the new message has better status or is not local
      if (
        (!newMessage.isLocalMessage && existing.isLocalMessage) ||
        getStatusOrder(newMessage.status) > getStatusOrder(existing.status) ||
        (newMessage.mediaUrl && !existing.mediaUrl) // Update with actual media URL
      ) {
        uniqueMessagesMap.set(newMessage.id, { ...existing, ...newMessage })
      }
    } else {
      uniqueMessagesMap.set(newMessage.id, newMessage)
    }
  })
  return Array.from(uniqueMessagesMap.values()).sort((a, b) => {
    return (a.sentAt || 0) - (b.sentAt || 0)
  })
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
  const [searchTerm, setSearchTerm] = useState("")
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)
  const messagesContainerRef = useRef(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const documentInputRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const attachmentMenuRef = useRef(null)
  // Popup functionality states
  const [showPopup, setShowPopup] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownContent, setDropdownContent] = useState("")
  // Template fetching states
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [templatesError, setTemplatesError] = useState(null)
  const [selectedTemplateObject, setSelectedTemplateObject] = useState(null)
  const [originalTemplateBody, setOriginalTemplateBody] = useState("")
  const [templateBodyParameters, setTemplateBodyParameters] = useState([])
  // Custom header image states
  const [customHeaderImageUrl, setCustomHeaderImageUrl] = useState("")
  const [showImageUrlInput, setShowImageUrlInput] = useState(false)
  const toggleAttachmentMenu3 = () => setIsOpen((prev) => !prev)

  // FIXED: Better file handling with proper deduplication
  const handleFileSend = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingFile(true)
    const messageId = `file-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const numericTimestamp = Date.now()
    const newFileMessage = {
      id: messageId,
      type: type,
      text: type === "document" ? file.name : file.name || "",
      mediaUrl: URL.createObjectURL(file),
      imageUrl: type === "image" ? URL.createObjectURL(file) : undefined,
      videoUrl: type === "video" ? URL.createObjectURL(file) : undefined,
      documentUrl: type === "document" ? URL.createObjectURL(file) : undefined,
      documentName: type === "document" ? file.name : undefined,
      // documentSize: file.size ? formatBytes(file.size) : "Unknown size",
      documentSize: file.size, // store raw bytes
      fileName: file.name,
      // caption: file.name,
      status: MessageStatus.SENDING,
      timestamp: displayTimestamp,
      role: "me",
      isRead: false,
      isLocalMessage: true,
      sentAt: numericTimestamp,
      sender: OUR_OWN_PHONE_NUMBER,
    }
    // console.log("📄 New file message:", newFileMessage)
    const wasNearBottom = checkIfNearBottom()
    // Update user list with new message
    setUserList((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              messages: [...(user.messages || []), newFileMessage],
            }
          : user,
      )
      const updatedSelectedUser = updatedUsers.find((user) => user.id === selectedUser.id)
      setSelectedUser(updatedSelectedUser)
      saveMessagesToStorage(updatedUsers)
      return updatedUsers
    })
    if (wasNearBottom) {
      setTimeout(() => {
        scrollToBottom(true)
      }, 100)
    }
    try {
      if (!selectedUser?.wa_id_or_sender) {
        alert("Please select a user to send message")
        e.target.value = null
        setUploadingFile(false)
        // Mark message as failed
        setUserList((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  messages: user.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
                  ),
                }
              : user,
          ),
        )
        return
      }
      let phoneNumber = selectedUser.waId || selectedUser.phone || ""
      if (phoneNumber.startsWith("+")) phoneNumber = phoneNumber.slice(1)
      phoneNumber = phoneNumber.replace(/[^\d]/g, "")
      const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
      const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
      // Upload file
      const formData = new FormData()
      formData.append("file", file)
      const uploadResponse = await fetch(`${BASE_URL}/api/${wabaId}/upload-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })
      if (!uploadResponse.ok) {
        const err = await uploadResponse.json()
        alert(`Upload failed: ${err?.message || "Unknown error"}`)
        throw new Error(`Upload failed: ${err?.message || "Unknown error"}`)
      }
      const uploadResult = await uploadResponse.json()
      const uploadedUrl = uploadResult.data?.s3Url || uploadResult?.s3Url
      if (!uploadedUrl) {
        alert("Upload failed: No media URL returned")
        throw new Error("Upload failed: No media URL returned")
      }
      // Prepare message object
      const mediaObject = {
        link: uploadedUrl,
      }
      if (type === "image" || type === "video") {
        // mediaObject.caption = file.name
      }
      if (type === "document") {
        mediaObject.filename = file.name
      }
      const messageBody = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type,
        [type]: mediaObject,
      }
      console.log("message ",messageBody);
      // Send message
      const sendMessageResponse = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      })
      const sendMessageResult = await sendMessageResponse.json()
      if (!sendMessageResponse.ok || !sendMessageResult.messages?.length) {
        alert(
          `Send message failed: ${
            sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
          }`,
        )
        throw new Error(
          `Send message failed: ${
            sendMessageResult?.error?.message || sendMessageResult?.message || JSON.stringify(sendMessageResult)
          }`,
        )
      }
      const apiReturnedMessageId = sendMessageResult.messages[0].id
      // FIXED: Update message with proper deduplication
      setUserList((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                messages: user.messages.map((msg) =>
                  msg.id === messageId
                    ? {
                        ...msg,
                        id: apiReturnedMessageId || msg.id,
                        mediaUrl: uploadedUrl,
                        imageUrl: type === "image" ? uploadedUrl : msg.imageUrl,
                        videoUrl: type === "video" ? uploadedUrl : msg.videoUrl,
                        documentUrl: type === "document" ? uploadedUrl : msg.documentUrl,
                        status: MessageStatus.SENT,
                        isLocalMessage: false,
                      }
                    : msg,
                ),
              }
            : user,
        )
        const updated = updatedUsers.find((u) => u.id === selectedUser.id)
        setSelectedUser(updated)
        saveMessagesToStorage(updatedUsers)
        return updatedUsers
      })
      // console.log("✅ Updated message ID:", apiReturnedMessageId)
      // console.log("📦 Uploaded URL:", uploadedUrl)
      simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
      setIsOpen(false)
    } catch (error) {
      console.error("Error during upload/send:", error)
      // alert("Network error during upload or send.")
      // Mark message as failed
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                messages: user.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
                ),
              }
            : user,
        ),
      )
    } finally {
      setUploadingFile(false)
      e.target.value = null
    }
  }

  useEffect(() => {
    const storedUsers = loadMessagesFromStorage()
    if (storedUsers.length > 0) {
      setUserList(storedUsers)
    }
  }, [])

  useEffect(() => {
    if (userList.length > 0) {
      saveMessagesToStorage(userList)
    }
  }, [userList])

  const scrollToBottom = (smooth = true) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current
        const scrollOptions = {
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        }
        container.scrollTo(scrollOptions)
      }
    }, 50)
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

  const formatTimestamp = (rawTimestamp) => {
    try {
      let date
      if (typeof rawTimestamp === "string" && !isNaN(Number(rawTimestamp))) {
        date = new Date(Number.parseInt(rawTimestamp) * 1000)
      } else if (typeof rawTimestamp === "number") {
        date = new Date(rawTimestamp)
      } else {
        date = new Date()
      }
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      console.error("Error formatting timestamp:", error)
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  }

  // FIXED: Better API message transformation with proper document handling
  const transformApiMessage = async (apiMessage) => {
    const numericTimestamp = Number.parseInt(apiMessage.timestamp) * 1000
    const displayTimestamp = formatTimestamp(numericTimestamp)
    const role = apiMessage.sender !== null ? "user" : "assistant"
    const messageId = apiMessage.id || `api-temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const senderIdentifier = apiMessage.sender || selectedUser?.wa_id_or_sender
    const commonProps = {
      id: messageId,
      isRead: apiMessage.read === 1,
      role,
      timestamp: displayTimestamp,
      sentAt: numericTimestamp,
      status: apiMessage.read === 1 ? MessageStatus.READ : MessageStatus.DELIVERED,
      isLocalMessage: false,
      sender: senderIdentifier,
    }
    // console.log("Image",);
    switch (apiMessage.message_type) {
      case "text":
        return {
          ...commonProps,
          type: MessageType.TEXT,
          text: apiMessage.message_body || "No message content",
        }
      case "image":
        return {
          ...commonProps,
          type: MessageType.IMAGE,
          imageUrl: apiMessage.file_url || apiMessage.url || "/placeholder.svg?height=240&width=240",
          mediaUrl: apiMessage.file_url || apiMessage.url,
          // caption: apiMessage.message_body || "",
          // caption: "",
          
        }
      case "document": {
        // console.log("📥 Incoming API document message:", apiMessage)
        // Get file URL
        const fileUrl = apiMessage.file_url || apiMessage.url || apiMessage.media_url || null
        // Clean filename - remove timestamp prefix if present
        const rawFilename =
          apiMessage.filename ||
          apiMessage.name ||
          apiMessage.caption ||
          (fileUrl ? fileUrl.split("/").pop() : "Document")
        const cleanFilename = decodeURIComponent(rawFilename).replace(/^\d{10,16}-/, "")
        const fileSize = apiMessage.file_size || apiMessage.size || null
        // console.log("📄 Document details:", {
        //   fileUrl,
        //   rawFilename,
        //   cleanFilename,
        //   fileSize,
        // })
        // Handle send errors
        let sendError = null
        if (apiMessage.extra_info2) {
          try {
            const parsed = JSON.parse(apiMessage.extra_info2)
            if (Array.isArray(parsed) && parsed[0]?.code) sendError = parsed[0]
          } catch (_) {
            // ignore JSON parse errors
          }
        }
        return {
          ...commonProps,
          type: MessageType.DOCUMENT,
          documentName: cleanFilename,
          // documentSize: fileSize ? formatBytes(fileSize) : "Unknown size",
          documentUrl: fileUrl || "#",
          mediaUrl: fileUrl,
          caption: cleanFilename,
          fileName: cleanFilename,
          status: sendError ? MessageStatus.FAILED : apiMessage.status || MessageStatus.DELIVERED,
          isRead: apiMessage.status === "read" || apiMessage.isRead === true || false,
          sendError,
        }
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
          const res = await fetch(`${BASE_URL}/api/phone/get/message_template/${templateId}/${templateName}`)
          const json = await res.json()
          templateData = Array.isArray(json.data) ? json.data[0] : json.data || {}
        } catch (err) {
          console.error("❌ Template fetch failed:", err)
        }
        let components = []
        try {
          components =
            typeof templateData.components === "string"
              ? JSON.parse(templateData.components)
              : templateData.components || []
        } catch (e) {
          console.error("❌ Failed to parse components:", e)
        }
        const bodyComponent = components.find((c) => c.type?.toLowerCase() === "body")
        const bodyTemplate = bodyComponent?.text || "Template"
        const bodyParamsFromApi = parsed.components?.find((c) => c.type?.toLowerCase() === "body")?.parameters || []
        const filledBody = bodyTemplate.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
          return bodyParamsFromApi[+idx - 1]?.text || ""
        })
        const footerText = components.find((c) => c.type?.toLowerCase() === "footer")?.text || ""
        const headerComponent = components.find((c) => c.type?.toLowerCase() === "header")

        // Fix: Store the header image URL properly
        let headerImage = null
        if (headerComponent && headerComponent.format === "IMAGE") {
          // Check for header image in API message first
          if (parsed.components) {
            const headerParams = parsed.components.find((c) => c.type?.toLowerCase() === "header")?.parameters || []
            const imageParam = headerParams.find((p) => p.type === "image")
            if (imageParam && imageParam.image && imageParam.image.link) {
              headerImage = imageParam.image.link
            }
          }

          // Fallback to example image if no actual image was found
          if (!headerImage && headerComponent.example?.header_handle?.[0]) {
            headerImage = headerComponent.example.header_handle[0]
          }
        }

        // Extract buttons from template
        const buttonsComponent = components.find((c) => c.type?.toLowerCase() === "buttons")
        let buttons = []
        if (buttonsComponent && buttonsComponent.buttons) {
          buttons = buttonsComponent.buttons.map((btn) => ({
            text: btn.text,
            type: btn.type,
            phone_number: btn.phone_number,
            url: btn.url,
          }))
        }

        return {
          ...commonProps,
          type: MessageType.TEMPLATE,
          templateName,
          headerText: templateName,
          bodyText: filledBody,
          footerText,
          headerImage, // Fix: Store the header image URL
          headerImageUrl: headerImage, // Fix: Also store as headerImageUrl for consistency
          buttons,
        }
      }
      case "video":
        return {
          ...commonProps,
          type: MessageType.VIDEO,
          videoUrl: apiMessage.file_url || "#",
          mediaUrl: apiMessage.file_url,
          caption: apiMessage.message_body || "",
        }
      default:
        return {
          ...commonProps,
          type: MessageType.TEXT,
          text: apiMessage.message_body || `${apiMessage.message_type} message`,
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
      const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
      const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
      if (!wabaId || !accessToken) {
        throw new Error("Missing authentication data")
      }
      const response = await axios.get(`${BASE_URL}/api/phone/get/${wabaId}/${userId}/${page}`)
      // console.log(`Messages API Response for page ${page}:`, response.data)
      const transformedMessages = Array.isArray(response.data)
        ? await Promise.all(response.data.map((msg) => transformApiMessage(msg)))
        : []
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

  // FIXED: Load more messages function
  const loadMoreMessages = async () => {
    if (!selectedUser || !hasMoreMessages || loadingMoreMessages) return
    const container = messagesContainerRef.current
    if (!container) return
    // Store current scroll position and height
    const previousScrollHeight = container.scrollHeight
    const previousScrollTop = container.scrollTop
    const nextPage = currentPage + 1
    setLoadingMoreMessages(true)
    const { messages: newApiMessages, hasMore } = await fetchUserMessages(selectedUser.wa_id_or_sender, nextPage, true)
    if (newApiMessages.length > 0) {
      // Merge messages properly - new messages should be added to the beginning
      const currentMessages = selectedUser.messages || []
      // Create a map to avoid duplicates
      const messageMap = new Map()
      // Add new messages first (older messages)
      newApiMessages.forEach((msg) => {
        messageMap.set(msg.id, msg)
      })
      // Add existing messages (newer messages)
      currentMessages.forEach((msg) => {
        if (!messageMap.has(msg.id)) {
          messageMap.set(msg.id, msg)
        }
      })
      // Convert back to array and sort by timestamp
      const mergedMessages = Array.from(messageMap.values()).sort((a, b) => {
        return (a.sentAt || 0) - (b.sentAt || 0)
      })
      const updatedUser = {
        ...selectedUser,
        messages: mergedMessages,
      }
      setSelectedUser(updatedUser)
      const updatedUsers = userList.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      setUserList(updatedUsers)
      setCurrentPage(nextPage)
      // Preserve scroll position after DOM update
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight
          const heightDifference = newScrollHeight - previousScrollHeight
          container.scrollTop = previousScrollTop + heightDifference
        }
      }, 50)
    }
    setHasMoreMessages(hasMore)
    setLoadingMoreMessages(false)
  }

  const handleScroll = () => {
    if (loadingMoreMessages || !hasMoreMessages) return
    const container = messagesContainerRef.current
    if (!container) return
    // Load more messages when scrolled to top
    if (container.scrollTop === 0) {
      loadMoreMessages()
    }
    // Check if user is near bottom for auto-scroll behavior
    checkIfNearBottom()
  }

  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [selectedUser?.wa_id_or_sender, hasMoreMessages, loadingMoreMessages, currentPage])

  useEffect(() => {
    if (selectedUser && selectedUser.messages && shouldScrollToBottom && isNearBottom) {
      scrollToBottom(false)
    }
  }, [selectedUser, shouldScrollToBottom, isNearBottom])

  const fetchChats = async () => {
    try {
      setLoading(true)
      setError(null)
      const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
      const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
      if (!wabaId || !accessToken) {
        console.error("Missing waba_id or auth_token in sessionStorage")
        throw new Error("Missing authentication data")
      }
      const response = await axios.get(`${BASE_URL}/api/phone/get/chats/${wabaId}?accessToken=${accessToken}`)
      // console.log("API Response:", response.data)
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
              userName: chat.user_name || "Unknown",
              waId: chat.wa_id_or_sender,
              wa_id_or_sender: chat.wa_id_or_sender,
              messages: [],
            }
          })
        : []
      // console.log("Transformed Data:", transformedData)
      const storedUsers = loadMessagesFromStorage()
      const mergedUsers = transformedData.map((apiUser) => {
        const storedUser = storedUsers.find((stored) => stored.wa_id_or_sender === apiUser.wa_id_or_sender)
        if (storedUser) {
          return { ...apiUser, messages: storedUser.messages || [] }
        }
        return apiUser
      })
      setUserList(mergedUsers)
    } catch (error) {
      console.error("Error fetching chats:", error?.response?.data || error.message)
      setError("Failed to load chats. Please try again.")
      const storedUsers = loadMessagesFromStorage()
      if (storedUsers.length > 0) {
        setUserList(storedUsers)
      } else {
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
            waId: "918857808284",
            wa_id_or_sender: "918857808284",
            messages: [
              {
                id: "demo-msg-1",
                type: MessageType.TEXT,
                text: "*API connection failed.* This is _demo data_ with ~formatting~ and `code`.\n\nNew line test.",
                isRead: true,
                timestamp: "10:30 AM",
                sentAt: Date.now() - 60 * 60 * 1000,
                role: "assistant",
                status: MessageStatus.READ,
                isLocalMessage: false,
                sender: "918857808284",
              },
            ],
          },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

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

  const simulateMessageStatusUpdates = (messageIdToUpdate, userWaId) => {
    const updateMessageStatus = (status) => {
      setUserList((prevUsers) => {
        const newUsers = prevUsers.map((user) =>
          user.wa_id_or_sender === userWaId
            ? {
                ...user,
                messages: user.messages.map((msg) => (msg.id === messageIdToUpdate ? { ...msg, status } : msg)),
              }
            : user,
        )
        const updated = newUsers.find((u) => u.wa_id_or_sender === userWaId)
        setSelectedUser(updated)
        saveMessagesToStorage(newUsers)
        return newUsers
      })
    }
    setTimeout(() => updateMessageStatus(MessageStatus.SENT), 500)
    setTimeout(() => updateMessageStatus(MessageStatus.DELIVERED), 2000)
    setTimeout(() => updateMessageStatus(MessageStatus.READ), 5000)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    const messageId = `new-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const numericTimestamp = Date.now()
    const newMsg = {
      id: messageId,
      type: MessageType.TEXT,
      text: newMessage,
      isRead: false,
      role: "user",
      timestamp: displayTimestamp,
      sentAt: numericTimestamp,
      status: MessageStatus.SENDING,
      isLocalMessage: true,
      sender: OUR_OWN_PHONE_NUMBER,
    }
    const wasNearBottom = checkIfNearBottom()
    setUserList((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              messages: [...user.messages, newMsg],
            }
          : user,
      )
      const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
      setSelectedUser(updatedUser)
      saveMessagesToStorage(updatedUsers)
      return updatedUsers
    })
    if (wasNearBottom) {
      setTimeout(() => {
        scrollToBottom(true)
      }, 100)
    }
    setNewMessage("")
    try {
      const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
      const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
      let phoneNumber = selectedUser.wa_id_or_sender || ""
      if (phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.substring(1)
      }
      phoneNumber = phoneNumber.replace(/[^\d]/g, "")
      const requestBody = {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: newMessage,
        },
      }
      const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
      } else {
        const result = await res.json()
        const apiReturnedMessageId = result.messages?.[0]?.id
        setUserList((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  messages: user.messages.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          id: apiReturnedMessageId || msg.id,
                          status: MessageStatus.SENT,
                          isLocalMessage: false,
                        }
                      : msg,
                  ),
                }
              : user,
          )
          const updated = updatedUsers.find((u) => u.id === selectedUser.id)
          setSelectedUser(updated)
          saveMessagesToStorage(updatedUsers)
          return updatedUsers
        })
        simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
      }
    } catch (error) {
      console.error("API Error:", error.message)
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user.wa_id_or_sender === selectedUser.wa_id_or_sender
            ? {
                ...user,
                messages: user.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
                ),
              }
            : user,
        ),
      )
      alert(`Failed to send message: ${error.message}`)
    }
  }

  const handleUserSelect = async (user) => {
    setSelectedUser(user)
    if (isMobile) setShowSidebar(false)

    setCurrentPage(1)
    setHasMoreMessages(true)
    setShouldScrollToBottom(true)
    setIsNearBottom(true)

    if (user.wa_id_or_sender) {
      const storedUsers = loadMessagesFromStorage()
      const storedUser = storedUsers.find((u) => u.wa_id_or_sender === user.wa_id_or_sender)
      const localMessagesForUser = storedUser ? storedUser.messages : []

      const { messages: apiMessagesPage1, hasMore } = await fetchUserMessages(user.wa_id_or_sender, 1, false)

      const mergedMessages = mergeMessages(apiMessagesPage1, localMessagesForUser)

      // ✅ Use the user from `userList` to preserve all correct properties
      const originalUser = userList.find(
        (u) =>
          (user.id && u.id && user.id === u.id) || (user.wa_id_or_sender && user.wa_id_or_sender === u.wa_id_or_sender),
      )

      if (!originalUser) return

      const updatedUser = {
        ...originalUser, // ✅ Preserve all original state (like activeLast24Hours)
        messages: mergedMessages, // 👈 Only update messages
      }

      setSelectedUser(updatedUser)
      setHasMoreMessages(hasMore)

      const updatedUsers = userList.map((u) => (u === originalUser ? updatedUser : u))

      setUserList(updatedUsers)
      saveMessagesToStorage(updatedUsers)
    }
  }

  useEffect(() => {
    const activeUsers = userList.filter((u) => u.activeLast24Hours === true)
    // console.log("Total users:", userList.length)
    // console.log("Active users count:", activeUsers.length)
    // console.log(
    //   "Active users keys:",
    //   activeUsers.map((u) => generateUserKey(u)),
    // )
  }, [userList])

  const handleBackToList = () => {
    if (isMobile) setShowSidebar(true)
  }

  const toggleInfoPanel = () => setShowInfoPanel((prev) => !prev)

  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    setTemplatesError(null)
    try {
      const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
      const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
      if (!wabaId || !accessToken) {
        throw new Error("Missing authentication data for templates")
      }
      const response = await axios.get(
        `${BASE_URL}/api/phone/get/message_templates/${wabaId}?accessToken=${accessToken}`,
      )
      if (response.data && Array.isArray(response.data.data)) {
        setTemplates(response.data.data)
      } else {
        setTemplates([])
      }
    } catch (error) {
      console.error("Error fetching templates:", error?.response?.data || error.message)
      setTemplatesError("Failed to load templates.")
    } finally {
      setLoadingTemplates(false)
    }
  }

  const handlePlusClick = () => {
    setShowPopup(true)
    setSelectedOption("")
    setDropdownContent("")
    setShowDropdown(false)
    setSelectedTemplateObject(null)
    setOriginalTemplateBody("")
    setTemplateBodyParameters([])
    // Reset custom image states
    setCustomHeaderImageUrl("")
    setShowImageUrlInput(false)
    fetchTemplates()
  }

  const handlePopupCancel = () => {
    setShowPopup(false)
    setSelectedOption("")
    setDropdownContent("")
    setShowDropdown(false)
    setSelectedTemplateObject(null)
    setOriginalTemplateBody("")
    setTemplateBodyParameters([])
    // Reset custom image states
    setCustomHeaderImageUrl("")
    setShowImageUrlInput(false)
  }

  const handlePopupSend = async () => {
    if (!selectedUser?.wa_id_or_sender) {
      alert("Please select a user to send message.")
      return
    }
    let phoneNumber = selectedUser.wa_id_or_sender || ""
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.substring(1)
    }
    phoneNumber = phoneNumber.replace(/[^\d]/g, "")
    const accessToken = sessionStorage.getItem("accessToken") || "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
    const wabaId = sessionStorage.getItem("wabaId") || "361462453714220"
    const messageId = `popup-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const displayTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const numericTimestamp = Date.now()
    let requestBody = {}
    let messageToSend = {}
    let headerImageUrlForLocal = null
    try {
      if (selectedOption === "custom") {
        if (!dropdownContent.trim()) {
          alert("Custom message cannot be empty.")
          return
        }
        requestBody = {
          messaging_product: "whatsapp",
          to: phoneNumber,
          type: "text",
          text: {
            body: dropdownContent,
          },
        }
        messageToSend = {
          id: messageId,
          type: MessageType.TEXT,
          text: dropdownContent,
          isRead: false,
          role: "user",
          timestamp: displayTimestamp,
          sentAt: numericTimestamp,
          status: MessageStatus.SENDING,
          isLocalMessage: true,
          sender: OUR_OWN_PHONE_NUMBER,
        }
      } else if (selectedTemplateObject) {
        let componentsArray = []
        try {
          componentsArray = JSON.parse(selectedTemplateObject.components)
        } catch (e) {
          console.error("Error parsing template components:", e)
          alert("Error preparing template message. Sending as plain text.")
          requestBody = {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "text",
            text: {
              body: dropdownContent,
            },
          }
          messageToSend = {
            id: messageId,
            type: MessageType.TEXT,
            text: dropdownContent,
            isRead: false,
            role: "user",
            timestamp: displayTimestamp,
            sentAt: numericTimestamp,
            status: MessageStatus.SENDING,
            isLocalMessage: true,
            sender: OUR_OWN_PHONE_NUMBER,
          }
        }
        const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
        const originalBodyText = bodyComponent?.text || ""
        if (templateBodyParameters.length > 0 && templateBodyParameters.some((param) => param.trim() === "")) {
          alert("Please fill all template parameters.")
          return
        }
        let sendAsPlainText = false
        if (templateBodyParameters.length > 0) {
          let currentPreviewText = originalBodyText
          templateBodyParameters.forEach((paramValue, i) => {
            currentPreviewText = currentPreviewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
          })
          if (dropdownContent !== currentPreviewText) {
            sendAsPlainText = true
          }
        } else if (dropdownContent !== originalBodyText) {
          sendAsPlainText = true
        }
        // Extract buttons from template
        const buttonsComponent = componentsArray.find((comp) => comp.type === "BUTTONS")
        let buttons = []
        if (buttonsComponent && buttonsComponent.buttons) {
          buttons = buttonsComponent.buttons.map((btn) => ({
            text: btn.text,
            type: btn.type,
            phone_number: btn.phone_number,
            url: btn.url,
          }))
        }
        if (sendAsPlainText) {
          requestBody = {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "text",
            text: {
              body: dropdownContent,
            },
          }
          messageToSend = {
            id: messageId,
            type: MessageType.TEXT,
            text: dropdownContent,
            isRead: false,
            role: "user",
            timestamp: displayTimestamp,
            sentAt: numericTimestamp,
            status: MessageStatus.SENDING,
            isLocalMessage: true,
            sender: OUR_OWN_PHONE_NUMBER,
          }
        } else {
          const componentsForApi = []
          const headerComponent = componentsArray.find((comp) => comp.type === "HEADER")
          if (headerComponent) {
            if (headerComponent.format === "IMAGE") {
              // Use custom image URL if provided, otherwise use template default
              const imageUrl = customHeaderImageUrl.trim() || headerComponent.example?.header_handle?.[0]
              if (imageUrl) {
                componentsForApi.push({
                  type: "header",
                  parameters: [{ type: "image", image: { link: imageUrl } }],
                })
                headerImageUrlForLocal = imageUrl
              }
            }
          }
          if (bodyComponent && templateBodyParameters.length > 0) {
            componentsForApi.push({
              type: "body",
              parameters: templateBodyParameters.map((param) => ({ type: "text", text: param })),
            })
          }
          requestBody = {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "template",
            template: {
              name: selectedTemplateObject.name,
              language: {
                code: selectedTemplateObject.language || "en_US",
              },
              components: componentsForApi,
            },
          }

          // Fix: Store the header image URL properly in the message object
          messageToSend = {
            id: messageId,
            type: MessageType.TEMPLATE,
            bodyText: dropdownContent,
            headerImage: headerImageUrlForLocal, // Fix: Store the image URL
            headerImageUrl: headerImageUrlForLocal, // Fix: Also store as headerImageUrl for consistency
            buttons: buttons, // Add buttons to the message
            isRead: false,
            role: "user",
            timestamp: displayTimestamp,
            sentAt: numericTimestamp,
            status: MessageStatus.SENDING,
            isLocalMessage: true,
            sender: OUR_OWN_PHONE_NUMBER,
          }
        }
      } else {
        alert("Please select a template or type a custom message.")
        return
      }
      const wasNearBottom = checkIfNearBottom()
      setUserList((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                messages: [...user.messages, messageToSend],
              }
            : user,
        )
        const updatedUser = updatedUsers.find((user) => user.id === selectedUser.id)
        setSelectedUser(updatedUser)
        saveMessagesToStorage(updatedUsers)
        return updatedUsers
      })
      if (wasNearBottom) {
        setTimeout(() => {
          scrollToBottom(true)
        }, 100)
      }
      const res = await fetch(`${BASE_URL}/api/${wabaId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to send message: ${res.status} - ${errorText}`)
      } else {
        const result = await res.json()
        const apiReturnedMessageId = result.messages?.[0]?.id

        // Fix: Update the message in storage with the API returned ID while preserving the image URL
        setUserList((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  messages: user.messages.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          id: apiReturnedMessageId || msg.id,
                          status: MessageStatus.SENT,
                          isLocalMessage: false,
                          // Fix: Preserve the header image URL
                          headerImage: msg.headerImage,
                          headerImageUrl: msg.headerImageUrl,
                        }
                      : msg,
                  ),
                }
              : user,
          )
          const updated = updatedUsers.find((u) => u.id === selectedUser.id)
          setSelectedUser(updated)
          saveMessagesToStorage(updatedUsers)
          return updatedUsers
        })
        simulateMessageStatusUpdates(apiReturnedMessageId || messageId, selectedUser.wa_id_or_sender)
      }
    } catch (error) {
      console.error("API Error:", error.message)
      alert(`Failed to send message: ${error.message}`)
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user.wa_id_or_sender === selectedUser.wa_id_or_sender
            ? {
                ...user,
                messages: user.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, status: MessageStatus.FAILED } : msg,
                ),
              }
            : user,
        ),
      )
    } finally {
      setShowPopup(false)
      setSelectedOption("")
      setDropdownContent("")
      setShowDropdown(false)
      setSelectedTemplateObject(null)
      setOriginalTemplateBody("")
      setTemplateBodyParameters([])
      // Reset custom image states
      setCustomHeaderImageUrl("")
      setShowImageUrlInput(false)
    }
  }

  const handleDropdownSelect = (e) => {
    const selectedValue = e.target.value
    setSelectedOption(selectedValue)
    setShowDropdown(true)
    // Reset custom image states when changing selection
    setCustomHeaderImageUrl("")
    setShowImageUrlInput(false)
    if (selectedValue === "custom") {
      setSelectedTemplateObject(null)
      setDropdownContent("Enter your custom message here...")
      setOriginalTemplateBody("")
      setTemplateBodyParameters([])
    } else {
      const template = templates.find((t) => t.name === selectedValue)
      if (template) {
        setSelectedTemplateObject(template)
        let componentsArray = []
        try {
          componentsArray = JSON.parse(template.components)
        } catch (e) {
          console.error("Error parsing template components:", e)
        }
        // Check if template has header image
        const headerComponent = componentsArray.find((comp) => comp.type === "HEADER")
        if (headerComponent && headerComponent.format === "IMAGE") {
          setShowImageUrlInput(true)
          // Don't pre-fill the custom image URL - leave it empty so user can enter their own
        }
        const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
        const bodyText = bodyComponent?.text || ""
        setOriginalTemplateBody(bodyText)
        const variableMatches = [...bodyText.matchAll(/\{\{(\d+)\}\}/g)]
        if (variableMatches.length > 0) {
          const maxVarIndex = Math.max(...variableMatches.map((match) => Number.parseInt(match[1])))
          const templateExampleParams = bodyComponent?.example?.body_text?.[0] || []
          const initialParams = Array(maxVarIndex)
            .fill("")
            .map((_, i) => {
              return templateExampleParams[i] !== undefined ? templateExampleParams[i] : ""
            })
          setTemplateBodyParameters(initialParams)
          let previewText = bodyText
          initialParams.forEach((paramValue, i) => {
            previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
          })
          setDropdownContent(previewText)
        } else {
          setTemplateBodyParameters([])
          setDropdownContent(bodyText)
        }
      } else {
        setDropdownContent("")
        setSelectedTemplateObject(null)
        setOriginalTemplateBody("")
        setTemplateBodyParameters([])
      }
    }
  }

  const handleTemplateParameterChange = (index, value) => {
    setTemplateBodyParameters((prev) => {
      const newParams = [...prev]
      newParams[index] = value
      if (selectedTemplateObject) {
        let componentsArray = []
        try {
          componentsArray = JSON.parse(selectedTemplateObject.components)
        } catch (e) {
          console.error("Error parsing template components for preview update:", e)
        }
        const bodyComponent = componentsArray.find((comp) => comp.type === "BODY")
        let previewText = bodyComponent?.text || ""
        newParams.forEach((paramValue, i) => {
          previewText = previewText.replace(new RegExp(`\\{\\{${i + 1}\\}\\}`, "g"), paramValue)
        })
        setDropdownContent(previewText)
      }
      return newParams
    })
  }

  const handleCustomImageUrlChange = (e) => {
    setCustomHeaderImageUrl(e.target.value)
  }

  // Fixed useEffect for handling click outside - now properly targets the attachment menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

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
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select Template</h3>
            {/* Dropdown */}
            <div className="mb-4">
              <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
                Choose Template
              </label>
              <div className="relative">
                <select
                  id="template-select"
                  value={selectedOption}
                  onChange={handleDropdownSelect}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  disabled={loadingTemplates}
                >
                  <option value="">{loadingTemplates ? "Loading templates..." : "Select an option..."}</option>
                  {templatesError && (
                    <option value="" disabled>
                      {templatesError}
                    </option>
                  )}
                  {templates.map((template) => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                  <option value="custom">Custom Message</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
            {/* Custom Image URL Input - Show only for templates with image headers */}
            {showImageUrlInput && selectedTemplateObject && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={customHeaderImageUrl}
                  onChange={handleCustomImageUrlChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Image URL"
                />
                {customHeaderImageUrl && (
                  <div className="mt-2">
                    <img
                      src={customHeaderImageUrl || "/placeholder.svg"}
                      alt="Custom Header Preview"
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=128&width=300"
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {/* Content area that shows when dropdown is selected */}
            {showDropdown && (
              <div className="mb-4">
                {selectedOption === "custom" ? (
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <textarea
                      value={dropdownContent}
                      onChange={(e) => setDropdownContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                      placeholder="Enter your custom message here..."
                    />
                  </div>
                ) : (
                  selectedTemplateObject && (
                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                      {(() => {
                        let componentsArray = []
                        try {
                          componentsArray = JSON.parse(selectedTemplateObject.components)
                        } catch (e) {
                          console.error("Error parsing template components for preview:", e)
                          return <p className="text-red-500 text-xs">Error loading template preview.</p>
                        }
                        return (
                          <>
                            {componentsArray.map((comp, compIndex) => {
                              if (comp.type === "HEADER") {
                                if (comp.format === "IMAGE") {
                                  // Show custom image if provided, otherwise show template default
                                  const imageUrl = customHeaderImageUrl || comp.example?.header_handle?.[0]
                                  return (
                                    <div key={compIndex} className="mb-2">
                                      <img
                                        src={imageUrl || "/placeholder.svg"}
                                        alt="Template Header Image"
                                        className="w-full h-32 object-cover rounded-md"
                                        onError={(e) => (e.target.src = "/placeholder.svg?height=128&width=128")}
                                      />
                                    </div>
                                  )
                                } else if (comp.format === "TEXT" && comp.text) {
                                  return (
                                    <div key={compIndex} className="font-semibold text-base mb-2">
                                      {comp.text}
                                    </div>
                                  )
                                }
                              } else if (comp.type === "BODY") {
                                return (
                                  <div key={compIndex} className="mb-2">
                                    <textarea
                                      value={dropdownContent}
                                      onChange={(e) => setDropdownContent(e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      rows="3"
                                    />
                                    {templateBodyParameters.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Fields:</p>
                                        {templateBodyParameters.map((param, paramIndex) => (
                                          <input
                                            key={paramIndex}
                                            type="text"
                                            value={param}
                                            onChange={(e) => handleTemplateParameterChange(paramIndex, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Field ${paramIndex + 1}`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )
                              } else if (comp.type === "FOOTER" && comp.text) {
                                return (
                                  <div key={compIndex} className="text-xs text-gray-500 mt-2">
                                    {comp.text}
                                  </div>
                                )
                              } else if (comp.type === "BUTTONS" && comp.buttons?.length > 0) {
                                return (
                                  <div key={compIndex} className="flex flex-col gap-2 mt-2">
                                    {comp.buttons.map((button, btnIndex) => (
                                      <button
                                        key={btnIndex}
                                        className="px-3 py-2 border border-blue-500 text-blue-600 bg-white rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2"
                                      >
                                        {button.type === "PHONE_NUMBER" && <Phone size={16} />}
                                        {button.text}
                                      </button>
                                    ))}
                                  </div>
                                )
                              }
                              return null
                            })}
                          </>
                        )
                      })()}
                    </div>
                  )
                )}
              </div>
            )}
            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handlePopupCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupSend}
                disabled={
                  !selectedOption ||
                  (selectedOption === "custom" && !dropdownContent.trim()) ||
                  (selectedOption !== "custom" &&
                    selectedTemplateObject &&
                    templateBodyParameters.length > 0 &&
                    templateBodyParameters.some((param) => param.trim() === ""))
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h1 className="text-base sm:text-lg font-semibold ml-20">Total: {userList.length}</h1>
            <h1 className="text-base sm:text-lg font-semibold ml-20">
              Active:{" "}
              {
                Array.from(
                  new Set(userList.filter((user) => user.activeLast24Hours).map((user) => user.wa_id_or_sender)),
                ).length
              }
            </h1>
          </div>

          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1 mt-4 sm:mt-6">
              Search
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="Searching....."
              className="w-full p-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            .map((user) => (
              <div
                key={generateUserKey(user)}
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
              <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600 p-2 rounded-full">
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
                selectedUser.messages.map((msg, index) => {
                  const showDateSeparator =
                    index === 0 ||
                    getMessageDate(msg.sentAt) !== getMessageDate(selectedUser.messages[index - 1].sentAt)
                  const isMessageFromContact = msg.role === "user" && msg.sender === selectedUser.wa_id_or_sender
                  const position = isMessageFromContact ? "left" : "right"
                  return (
                    <div key={generateMessageKey(msg)} className="relative group">
                      {showDateSeparator && <DateSeparator date={msg.sentAt} />}
                      <MessageRenderer message={msg} position={position} />
                    </div>
                  )
                })
              )}
            </div>
            <div className="p-2 sm:p-3 md:p-4 border-t flex flex-col gap-2">
              <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="relative">
                    <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full" onClick={handlePlusClick}>
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <div className="relative inline-block text-left" ref={attachmentMenuRef}>
                    <button
                      className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
                      onClick={toggleAttachmentMenu3}
                      disabled={uploadingFile}
                    >
                      <Paperclip size={18} />
                    </button>
                    {isOpen && (
                      <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 w-40 sm:w-48 z-50 space-y-2">
                        <button
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          <ImageIcon size={18} className="text-green-700" />
                          <span className="text-sm">Image</span>
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          className="hidden"
                          onChange={(e) => handleFileSend(e, "image")}
                        />
                        <button
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          <Video size={18} className="text-red-700" />
                          <span className="text-sm">Video</span>
                        </button>
                        <input
                          type="file"
                          accept="video/*"
                          ref={videoInputRef}
                          className="hidden"
                          onChange={(e) => handleFileSend(e, "video")}
                        />
                        <button
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left py-1 px-2 rounded-md"
                          onClick={() => documentInputRef.current?.click()}
                          disabled={uploadingFile}
                        >
                          <File size={18} className="text-blue-700" />
                          <span className="text-sm">Document</span>
                        </button>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          ref={documentInputRef}
                          className="hidden"
                          onChange={(e) => handleFileSend(e, "document")}
                        />
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
                  className="flex-1 border-0 outline-none px-2 sm:px-3 py-1 text-sm sm:text-base bg-transparent focus:ring-0"
                />
                <div className="flex items-center gap-1 sm:gap-2">
                  <button className="text-gray-500 hover:text-blue-600 p-1 rounded-full">
                    <Mic size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-600"
                    disabled={uploadingFile}
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
              {uploadingFile && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600 text-sm">Uploading file...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <img
              src="/placeholder.svg?height=160&width=160"
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
            <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
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
            <hr className="border-gray-300" />
            <h1 className="font-semibold text-base sm:text-lg">Details</h1>
            <div className="flex items-center gap-2 mt-2">
              <MessageSquareText size={14} className="text-orange-500 sm:w-4 sm:h-4" />
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
          <hr className="border-gray-300 mt-3" />
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm sm:text-base">Notes</h4>
              <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full">
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


