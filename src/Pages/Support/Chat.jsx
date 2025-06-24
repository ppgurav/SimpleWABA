import { BotMessageSquare, Mic, Smile, Paperclip, Menu, X, Info, Plus, Phone, Calendar,  MessageSquareTextIcon, Clock, Download,  Share2,  FileMinus, Music,  FileText,  ImageIcon,  SmileIcon,  Video,  MapPin,  List,  Contact,  StickerIcon, Text,} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

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

const users = [
  {
    id: 1,
    firstName: "Bansari",
    lastName: "Sidd....",
    profileImage: "BS",
    source: "Source Web",
    creationTime: "Mar 20, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+915468234087",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "Hey there!", isRead: true, timestamp: "10:30 AM" },
      {
        type: MessageType.TEXT_WITH_BUTTON,
        text: "Hello, I'm sharing this platform",
        buttonText: "Visit Address",
        buttonAction: "https://example.com/address",
        musicUrl: "https://example.com/song.mp3",
        isRead: true,
        timestamp: "10:31 AM",
      },
      {
        type: MessageType.CONTACT,
        contactName: "John Smith",
        isRead: true,
        timestamp: "10:32 AM",
      },
      {
        type: MessageType.STICKER,
        stickerUrl: "/z.png?height=150&width=150",
        isAnimated: true,
        isRead: true,
        timestamp: "10:33 AM",
      },
      {
        type: MessageType.AUDIO,
        audioUrl: "https://example.com/path-to-audio-file.mp3", // must be a valid URL
        isRead: true,
        timestamp: "10:34 AM",
      },
      {
        type: MessageType.IMAGE,
        text: "Check out our new product design",
        imageUrl: "/p.svg?height=100&width=200",
        caption: "Environment Day",
        isRead: true,
        timestamp: "10:35 AM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 37.7749,
        longitude: -122.4194,
        locationName: "San Francisco, CA",
        isRead: true,
        timestamp: "10:36 AM",
      },
      {
        type: MessageType.DOCUMENT,
        text: "Here's the documentation you requested",
        documentName: "Product_Specs_2025.pdf",
        documentSize: "2.4 MB",
        documentUrl: "#",
        caption: "Contains all specifications for the new product line",
        isRead: true,
        timestamp: "10:37 AM",
      },
    ],
  },
  {
    id: 2,
    firstName: "Emre ",
    lastName: "Tanriseven",
    profileImage: "ET",
    source: "Source Web",
    creationTime: "Mar 20, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+91 878324097",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "Hey there!", isRead: true, timestamp: "11:30 AM" },
      {
        type: MessageType.IMAGE,
        text: "Check out our new product design",
        imageUrl: "/p.svg?height=100&width=200",
        caption: "Environment Day",
        isRead: true,
        timestamp: "11:31 AM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 37.7749,
        longitude: -122.4194,
        locationName: "San Francisco, CA",
        isRead: true,
        timestamp: "11:32 AM",
      },
    ],
  },
  {
    id: 3,
    firstName: "A",
    lastName: "B",
    profileImage: "AB",
    source: "Source Web",
    creationTime: "Mar 20, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+91 9854236708",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "👍", isRead: true, timestamp: "12:30 AM" },
      {
        type: MessageType.DOCUMENT,
        text: "Here's the documentation you requested",
        documentName: "Product_Specs_2025.pdf",
        documentSize: "2.4 MB",
        documentUrl: "#",
        caption: "Contains all specifications for the new product line",
        isRead: true,
        timestamp: "12:31 PM",
      },
      {
        type: MessageType.STICKER,
        stickerUrl: "/s.svg?height=150&width=150",
        isAnimated: true,
        isRead: true,
        timestamp: "12:32 PM",
      },
    ],
  },
  {
    id: 4,
    firstName: "GOODGUYS",
    lastName: "IN....",
    profileImage: "GI",
    source: "Source Web",
    creationTime: "Mar 30, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+1 255123456",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "👋 Hello Elite Digital Emporium", isRead: true, timestamp: "01:30 AM" },
      {
        type: MessageType.TEXT,
        text: "Convert WhatsApp conversations into business opportunities",
        isRead: true,
        timestamp: "01:31 PM",
      },
      {
        type: MessageType.LIST,
        title: "Available Services",
        description: "Choose from our premium services",
        buttonText: "View Options",
        items: [
          { id: "1", title: "Marketing Automation", description: "Automate your marketing campaigns" },
          { id: "2", title: "Lead Generation", description: "Generate high-quality leads" },
          { id: "3", title: "Customer Support", description: "24/7 customer support" },
        ],
        isRead: true,
        timestamp: "01:32 PM",
      },
    ],
  },
  {
    id: 5,
    firstName: "Diallo",
    lastName: "Thirno....",
    profileImage: "DT",
    source: "Source Web",
    creationTime: "Mar 01, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+1 555 123 456",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "🚀 Boost Your Business with WhatsMark!.", isRead: true, timestamp: "02:30 AM" },
      {
        type: MessageType.TEXT,
        text: "💡 Stay ahead in WhatsApp marketing with WhatsMark! 🚀",
        isRead: true,
        timestamp: "02:31 PM",
      },
      // {
      //   type: MessageType.REACTION,
      //   originalMessageId: 0,
      //   emoji: "👍",
      //   isRead: true,
      // },
      {
        type: MessageType.IMAGE,
        text: "Check out our new product design",
        imageUrl: "/p.svg?height=100&width=200",
        caption: "Environment Day",
        isRead: true,
        timestamp: "02:32 PM",
      },
      {
        type: MessageType.VIDEO,
        videoUrl: "https://example.com/product-demo.mp4",
        thumbnailUrl: "/placeholder.svg?height=200&width=300",
        caption: "Product Demo Video",
        isRead: true,
        timestamp: "02:33 PM",
      },
      {
        type: MessageType.TEMPLATE,
        templateName: "Welcome Message",
        headerText: "Welcome to Our Service",
        bodyText: "Thank you for joining our platform. We're excited to have you on board!",
        footerText: "Reply to get started",
        isRead: true,
        timestamp: "02:34 PM",
      },
    ],
  },
  {
    id: 6,
    firstName: "Kiran",
    lastName: "Khant",
    profileImage: "BS",
    source: "Source Web",
    creationTime: "Mar 10, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+1 985123456",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "👋 Hello Kiran Khant", isRead: true, timestamp: "03:30 AM" },
      {
        type: MessageType.TEXT,
        text: "📢 Exciting News! We've Just Released a Complete Video Tutorial for WhatsMark!",
        imageUrl2: "/vite.svg?height=100&width=200",
        isRead: true,
        timestamp: "03:31 AM",
      },
      {
        type: MessageType.AUDIO,
        audioUrl: "https://example.com/path-to-audio-file.mp3", // must be a valid URL
        isRead: true,
        timestamp: "03:32 PM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 12.9716,
        longitude: 77.5946,
        locationName: "Bangalore, India",
        isRead: true,
        timestamp: "03:33 PM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 51.5074,
        longitude: -0.1278,
        locationName: "London, UK",
        isRead: true,
        timestamp: "03:34 PM",
      },
    ],
  },
  {
    id: 7,
    firstName: "Ricardo",
    lastName: "Lodo",
    profileImage: "RL",
    source: "Source Web",
    creationTime: "Mar 09, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+1 755123456",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "Hey there!", isRead: true, timestamp: "04:30 AM" },
      { type: MessageType.TEXT, text: "Hello World Welcome and ", isRead: true, timestamp: "04:31 AM" },
      {
        type: MessageType.LOCATION,
        latitude: 40.7128,
        longitude: -74.006,
        locationName: "New York, USA",
        isRead: true,
        timestamp: "04:32 AM",
      },
    ],
  },
  {
    id: 8,
    firstName: "Call",
    lastName: "Center",
    profileImage: "CC",
    source: "Source Web",
    creationTime: "Mar 03, 2025, 10:54:16 PM",
    lastActivity: "2025-04-11 14:30",
    phone: "+1 325123456",
    notes: "",
    messages: [
      { type: MessageType.TEXT, text: "Hey ", isRead: true, timestamp: "05:30 AM" },
      { type: MessageType.TEXT, text: "Hello World Welcome", isRead: true, timestamp: "05:31 AM" },
      {
        type: MessageType.CONTACT,
        contactName: "Priya",
        isRead: true,
        timestamp: "05:33 AM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 28.6139,
        longitude: 77.209,
        locationName: "New Delhi, India",
        isRead: true,
        timestamp: "05:34 AM",
      },
      {
        type: MessageType.LOCATION,
        latitude: 19.076,
        longitude: 72.8777,
        locationName: "Mumbai, India",
        isRead: true,
        timestamp: "05:35 AM",
      },
    ],
  },
]

// Message components for different types
const TextMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start relative">
    <div>{message.text}</div>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const TextWithButtonMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="mb-2">{message.text}</div>
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

const ImageMessage = ({ message }) => (
  <div className=" border bg-white p-2 md:p-3 rounded-xl self-start inline-flex flex-col relative">
    {/* <div className="mb-2">{message.text}</div> */}
    <img
      src={message.imageUrl || "/p.svg" || "/placeholder.svg"}
      alt={message.caption || "Shared image"}
      className="rounded-md mb-2 w-60 h-60 object-cover"
    />

    {message.caption && <p className="text-sm text-gray-600">{message.caption}</p>}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const DocumentMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    {/* <div className="mb-2">{message.text}</div> */}
    <div className="bg-gray-200 border border-gray-200 rounded-md p-2 mb-2 flex items-center">
      <div className="bg-white p-2 rounded-md mr-2">
        <FileMinus size={20} className="text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.documentName}</p>
        <p className="text-xs text-gray-500">{message.documentSize}</p>
      </div>
      <Link
        to={message.documentUrl}
        className="text-green-500  border border-green-500 rounded-full hover:text-blue-700 p-1"
        download
      >
        <Download size={18} />
      </Link>
    </div>
    {message.caption && <p className="text-sm text-gray-600">{message.caption}</p>}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const AudioMessage = ({ message }) => (
  <div className="   p-3 md:p-0 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="bg-white border border-gray-200 rounded-md p-2 mb-2 flex items-center">
      <div className="bg-white p-2 rounded-md mr-2">
        <Music size={20} className="text-pink-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.audioName || "Audio file"}</p>
        <p className="text-xs text-gray-500">{message.audioSize || "Unknown size"}</p>
      </div>
      <Link to={message.audioUrl || "#"} className="text-gray-500  border-gray-500  hover:text-blue-700 p-3" download>
        <Download size={18} />
      </Link>
    </div>
    {message.caption && <p className="text-sm text-gray-600">{message.caption}</p>}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

// New Template Message component
const TemplateMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
      <div className="bg-blue-500 text-white p-2 text-sm font-medium">{message.headerText || message.templateName}</div>
      <div className="p-3">
        <p className="text-sm">{message.bodyText}</p>
      </div>
      {message.footerText && (
        <div className="bg-gray-100 p-2 text-xs text-gray-500 border-t border-gray-200">{message.footerText}</div>
      )}
    </div>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)
const VideoMessage = ({ message }) => (
  <div className="border bg-white p-2 md:p-3 rounded-xl self-start inline-flex flex-col relative">
    <video src={message.videoUrl || "#"} controls className="rounded-md mb-2 w-60 max-h-60 object-cover">
      Your browser does not support the video tag.
    </video>
    {message.caption && <p className="text-sm text-gray-600">{message.caption}</p>}
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

// New message components for the additional types

const ContactMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="bg-gray-100 border border-gray-200 rounded-md p-3 mb-2">
      <div className="flex items-center mb-2">
        <div className="bg-blue-100 p-2 rounded-full mr-2">
          <Contact size={20} className="text-blue-600" />
        </div>
        <div className="font-medium">{message.contactName}</div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center">
          {/* <Phone size={14} className="text-gray-500 mr-2" /> */}
          <span>{message.contactPhone}</span>
        </div>
        {message.contactEmail && (
          <div className="flex items-center">
            <MessageSquareTextIcon size={14} className="text-gray-500 mr-2" />
            <span>{message.contactEmail}</span>
          </div>
        )}
        {message.contactAddress && (
          <div className="flex items-center">
            <MapPin size={14} className="text-gray-500 mr-2" />
            <span>{message.contactAddress}</span>
          </div>
        )}
      </div>
    </div>
    <div className="mt-0 flex justify-end space-x-4">
      {/* <div className="flex items-center space-x-4 border border-gray-200 rounded-md p-2 bg-white shadow-sm"> */}
      <button className="text-black text-sm px-3 py-1.5 hover:bg-gray-100 rounded-md">Save Contact</button>

      {/* Vertical Divider */}
      <div className="w-px h-5 bg-gray-300"></div>

      <button className="text-black text-sm px-3 py-1.5 hover:bg-gray-100 rounded-md">Message</button>
      {/* </div> */}
    </div>
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ListMessage = ({ message }) => (
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="mb-2 font-medium">{message.title}</div>
    <p className="text-sm text-gray-600 mb-3">{message.description}</p>
    <div className="bg-gray-100 rounded-md overflow-hidden mb-3">
      {message.items.map((item) => (
        <div key={item.id} className="p-3 border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-gray-600">{item.description}</div>
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
  <div className="bg-white border p-2 md:p-3 rounded-xl max-w-xs md:max-w-sm self-start flex flex-col relative">
    <div className="relative mb-2">
      <div className="bg-gray-200 w-60 h-40 rounded-md flex items-center justify-center overflow-hidden">
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${message.latitude},${message.longitude}&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7C${message.latitude},${message.longitude}`}
          alt="Map location"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/map.svg?height=150&width=250"
          }}
        />
      </div>
      <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
        <MapPin size={16} className="text-red-500" />
      </div>
    </div>
    <div className="flex items-center mb-1">
      <MapPin size={16} className="text-gray-500 mr-1" />
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
      src={message.stickerUrl || "/placeholder.svg"}
      alt="Sticker"
      className={`w-32 h-32 object-contain ${message.isAnimated ? "animate-pulse" : ""}`}
    />
    {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
  </div>
)

const ReactionMessage = ({ message, userList }) => {
  // Find the original message that was reacted to
  // In a real app, you would have a more robust way to reference the original message
  const originalMessage = { text: "Original message" } // Placeholder

  return (
    <div className="bg-gray-100 border p-2 rounded-xl max-w-xs md:max-w-sm self-start flex items-center relative">
      <div className="bg-white p-1 rounded-full mr-2">
        <span className="text-xl">{message.emoji}</span>
      </div>
      <div className="text-sm text-gray-600">
        Reacted with {message.emoji} to "{originalMessage.text}"
      </div>
      {message.timestamp && <div className="text-xs text-gray-500 mt-1 text-right">{message.timestamp}</div>}
    </div>
  )
}

// Message renderer component
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
    <div className={`flex ${position === "right" ? "justify-end" : "justify-start"}`}>
      <Component message={message} position={position} userList={userList} />
    </div>
  )
}

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [userList, setUserList] = useState(users)
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
  // const [fileInputRef = useRef < HTMLInputElement > (null)
  const audioInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [showInteractiveMenu, setShowInteractiveMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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

    if (selectedImage) {
      newMsg = {
        type: MessageType.IMAGE,
        imageUrl: URL.createObjectURL(selectedImage),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedFile) {
      newMsg = {
        type: MessageType.DOCUMENT,
        documentName: selectedFile.name,
        documentSize: `${Math.round(selectedFile.size / 1024)} KB`,
        documentUrl: URL.createObjectURL(selectedFile),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedAudio) {
      newMsg = {
        type: MessageType.AUDIO,
        audioName: selectedAudio.name,
        audioSize: `${Math.round(selectedAudio.size / 1024)} KB`,
        audioUrl: URL.createObjectURL(selectedAudio),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedVideo) {
      newMsg = {
        type: MessageType.VIDEO,
        videoUrl: URL.createObjectURL(selectedVideo),
        caption: newMessage.trim() || "",
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedSticker) {
      newMsg = {
        type: MessageType.STICKER,
        stickerUrl: URL.createObjectURL(selectedSticker),
        isAnimated: selectedSticker.type.includes("gif"),
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (messageType === MessageType.TEMPLATE) {
      newMsg = {
        type: MessageType.TEMPLATE,
        templateName: "Custom Template",
        headerText: "Custom Message",
        bodyText: newMessage,
        footerText: "Reply to continue",
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedLocation) {
      newMsg = {
        type: MessageType.LOCATION,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName: selectedLocation.name || "Shared Location",
        mapImageUrl: mapImageUrl,
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else if (selectedContact) {
      newMsg = {
        type: MessageType.CONTACT,
        contactName: selectedContact.name,
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    } else {
      newMsg = {
        type: MessageType.TEXT,
        text: newMessage,
        isRead: true,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
      }
    }

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

    // Reset all states
    setNewMessage("")
    setSelectedImage(null)
    setSelectedFile(null)
    setSelectedAudio(null)
    setSelectedVideo(null)
    setSelectedSticker(null)
    setSelectedLocation(null)
    setSelectedContact(null)

    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (audioInputRef.current) audioInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    if (isMobile) setShowSidebar(false)
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

  // New handlers for the additional message types
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
    // In a real app, you would use the Geolocation API or a map picker
    // For this example, we'll use a mock location
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
    // In a real app, you would open a contact picker
    // For this example, we'll use a mock contact
    const mockContact = {
      name: "",
      role: "user",
    }

    setSelectedContact(mockContact)
    setMessageType(MessageType.CONTACT)
    setShowAttachmentMenu(false)
  }

  const handleReaction = (messageIndex, emoji) => {
    if (!selectedUser) return

    const newReaction = {
      type: MessageType.REACTION,
      originalMessageId: messageIndex,
      emoji: emoji,
      isRead: true,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Add timestamp
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

  return (
    <div className="flex h-full bg-gray-100 p-2 md:p-14 lg:p-1 gap-2 md:gap-4 mt-10">
      <div
        className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden ${isMobile ? "w-full" : "w-full md:w-1/3"}`}
      >
        <div className="p-3 md:p-4 space-y-2 md:space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <BotMessageSquare size={24} />
              </div>
              <label className="block text-sm font-medium text-gray-700">From:</label>
            </div>
            {isMobile && selectedUser && (
              <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            )}
          </div>

          <select className="w-full p-2 border rounded-md">
            <option value="">All Chats</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Searching....."
              className="w-full p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <hr className="border-gray-300" />
        </div>

        <div className="overflow-y-auto px-3 md:px-4 pb-4 space-y-2 md:space-y-3 flex-1">
          {userList
            .filter((user) => {
              const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
              return fullName.includes(searchTerm.toLowerCase())
            })
            .map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="flex justify-between items-start gap-2 md:gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >
                <div className=" flex items-start gap-2 md:gap-3 min-w-0">
                  <div className="bg-gray-400 text-black w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 flex-wrap min-w-0">
                      <p className="font-medium truncate max-w-[100px] md:max-w-[140px]">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-xs bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        Lead
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
                      {user.messages.at(-1)?.text ||
                        (user.messages.at(-1)?.caption
                          ? `[${user.messages.at(-1)?.type}] ${user.messages.at(-1)?.caption}`
                          : `${user.messages.at(-1)?.type}`)}
                    </p>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-black whitespace-nowrap ml-1 md:ml-2 shrink-0 mt-1">
                  Invite Time
                </span>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${!showSidebar || !isMobile ? "flex" : "hidden"} md:flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden  ${isMobile ? "w-full" : "w-full md:w-2/3"}`}
      >
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between gap-2 md:gap-4 border-b p-3 md:p-4  ">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button onClick={handleBackToList} className="md:hidden text-gray-500 hover:text-gray-700 mr-1 ">
                    <Menu size={24} />
                  </button>
                )}
                <div className="bg-gray-400 text-black w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                  {selectedUser.firstName.charAt(0)}
                  {selectedUser.lastName.charAt(0)}
                </div>
                <h2 className="text-base md:text-lg font-semibold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
              </div>
              <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-blue-600">
                <Info size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-2 space-y-2 md:space-y-3 bg-gray-200 text-left">
              {selectedUser.messages.map((msg, index) => (
                <div key={index} className="relative group">
                  <MessageRenderer
                    message={msg}
                    position={msg.role === "user" ? "right" : "left"}
                    userList={userList}
                  />

                  {/* Add reaction button that appears on hover */}
                  {/* <button
                    onClick={() => toggleReactionMenu(index)}
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-md transition-opacity"
                  >
                    <ThumbsUp size={14} className="text-gray-500" />
                  </button> */}

                  {/* Reaction menu */}
                  {/* {showReactionMenu && selectedMessageForReaction === index && (
                    <div className="absolute top-0 right-8 bg-white rounded-full shadow-lg p-1 flex reaction-menu-container z-10">
                      {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(index, emoji)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <span className="text-lg">{emoji}</span>
                        </button>
                      ))}
                    </div>
                  )} */}
                </div>
              ))}
            </div>

            <div className="p-3 md:p-4 border-t flex flex-col gap-2">
              {/* Preview area for selected attachments */}
              {(selectedImage ||
                selectedFile ||
                selectedAudio ||
                selectedVideo ||
                selectedSticker ||
                selectedLocation ||
                selectedContact) && (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                  {selectedImage && (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                        alt="Selected"
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {selectedFile && (
                    <div className="relative flex items-center bg-white p-2 rounded-md">
                      <FileMinus size={20} className="text-gray-600 mr-2" />
                      <span className="text-sm truncate max-w-[150px]">{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)} className="ml-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {selectedAudio && (
                    <div className="relative flex items-center bg-white p-2 rounded-md">
                      <Music size={20} className="text-pink-500 mr-2" />
                      <span className="text-sm truncate max-w-[150px]">{selectedAudio.name}</span>
                      <button onClick={() => setSelectedAudio(null)} className="ml-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {selectedVideo && (
                    <div className="relative flex items-center bg-white p-2 rounded-md">
                      <Video size={20} className="text-orange-500 mr-2" />
                      <span className="text-sm truncate max-w-[150px]">{selectedVideo.name}</span>
                      <button onClick={() => setSelectedVideo(null)} className="ml-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {selectedSticker && (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedSticker) || "/placeholder.svg"}
                        alt="Sticker"
                        className="h-16 w-16 object-contain rounded-md"
                      />
                      <button
                        onClick={() => setSelectedSticker(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {selectedLocation && (
                    <div className="relative flex items-center bg-white p-2 rounded-md">
                      <MapPin size={20} className="text-red-500 mr-2" />
                      <span className="text-sm truncate max-w-[150px]">{selectedLocation.name}</span>
                      <button onClick={() => setSelectedLocation(null)} className="ml-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {selectedContact && (
                    <div className="relative flex items-center bg-white p-2 rounded-md">
                      {/* <Contact size={20} className="text-blue-500 mr-2" /> */}
                      <span className="text-sm truncate max-w-[150px]">{selectedContact.name}</span>
                      <button onClick={() => setSelectedContact(null)} className="ml-2 text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 md:gap-3 bg-white">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="relative attachment-smile-container">
                    <button className="text-gray-500 hover:text-blue-600" onClick={toggleAttachmentMenu2}>
                      <Smile size={20} />
                    </button>
                    {showAttachmentMenu2 && (
                      <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 w-36 grid grid-cols-2 z-50">
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm">
                          <Smile size={20} className="mb-1 text-green-500" />
                          Smile
                        </button>
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm">
                          <SmileIcon size={20} className="mb-1 text-red-500" />
                          Smile
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative attachment-menu-container">
                    <button className="text-gray-500 hover:text-blue-600 mt-1" onClick={toggleAttachmentMenu}>
                      <Paperclip size={20} />
                    </button>
                    {showAttachmentMenu && (
                      <div className="absolute bottom-10 left-0 bg-white rounded-lg shadow-lg border p-2 w-64 grid grid-cols-3 gap-1 z-50">
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleImageSelect}
                        >
                          <ImageIcon size={20} className="mb-1 text-green-500" />
                          Gallery
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleDocumentSelect}
                        >
                          <FileText size={20} className="mb-1 text-yellow-500" />
                          Document
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleAudioSelect}
                        >
                          <Music size={20} className="mb-1 text-pink-500" />
                          Audio
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={toggleTemplateMenu}
                        >
                          <Text size={20} className="mb-1 text-indigo-500" />
                          Template
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={toggleInteractiveMenu}
                        >
                          <List size={20} className="mb-1 text-teal-500" />
                          Interactive
                        </button>
                        Template Menu
                        {showTemplateMenu && (
                          <div className="absolute bottom-20 left-10 bg-white rounded-lg shadow-lg border p-2 w-64 z-50 template-menu-container">
                            <div className="p-2 border-b">
                              <h3 className="font-medium text-sm">Select Template Type</h3>
                            </div>
                            <div className="p-2">
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
                              >
                                Marketing Template
                              </button>
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
                              >
                                Utility Template
                              </button>
                              <button
                                onClick={handleTemplateSelect}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm"
                              >
                                Authentication Template
                              </button>
                            </div>
                          </div>
                        )}
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleVideoSelect}
                        >
                          <Video size={20} className="mb-1 text-orange-500" />
                          Video
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleStickerSelect}
                        >
                          <StickerIcon size={20} className="mb-1 text-purple-500" />
                          Sticker
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleLocationSelect}
                        >
                          <MapPin size={20} className="mb-1 text-red-500" />
                          Location
                        </button>
                        <button
                          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm"
                          onClick={handleContactSelect}
                        >
                          <Contact size={20} className="mb-1 text-blue-500" />
                          Contact
                        </button>
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md text-sm">
                          <List size={20} className="mb-1 text-teal-500" />
                          List
                        </button>
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
                  className="flex-1 border rounded-full px-3 py-1.5 md:px-4 md:py-2 focus:outline-none text-sm md:text-base"
                />

                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:text-blue-600">
                    <Mic size={20} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
            <img src="./Image/download.jpeg" alt="whatsMArks" className="hidden lg:block w-40 h-40 mb-6" />
            <h2 className="text-xl font-semibold mb-4">Click a user to chat</h2>
          </div>
        )}
      </div>

      {/* ------Info Sidebar--------------- */}
      {showInfoPanel && selectedUser && (
        <div className="absolute md:right-0 md:top-14 md:bottom-10 w-72 md:w-80 bg-white shadow-2xl border-l rounded-l-2xl p-4 z-20 ">
          <div className="flex justify-between items-center mb-4 ">
            <h3 className="font-semibold text-lg">User Info</h3>
            <button onClick={toggleInfoPanel} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            {/* -----line 324 and 330  use for profile and names */}
            <div className="bg-gray-300 text-black w-8 h-8 md:w-14 md:h-14 md:rounded-full flex items-center justify-center text-sm font-semibold shrink-0 md:ml-32">
              {selectedUser.firstName.charAt(0)}
              {selectedUser.lastName.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 md:ml-28 ">
              <p className="truncate max-w-[100px] md:max-w-[140px] font-semibold ">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <span className="text-xs bg-purple-50 text-purple-800 md:w-10 md:text-center md:ml-4 rounded-md md:mt-2">
                Lead
              </span>
            </div>
            <hr />

            <h1 className="font-semibold md:text-lg">Details</h1>
            <div className="flex items-center gap-2 mt-2">
              <MessageSquareTextIcon size={16} className="text-orange-500" />
              <span className="font-extralight">
                Source <span className="text-indigo-500 text-sm"> web</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={16} className="text-cyan-500 md:mt-3" />
              <span className="md:mt-3 font-extralight">
                Creation Time <span className="text-indigo-500 text-sm">{selectedUser.creationTime}</span>
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Clock size={16} className="text-orange-300 md:mt-3" />
              <span className="md:mt-3 font-extralight">
                Last Activity <span className="text-indigo-500 text-sm">{selectedUser.lastActivity}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 ">
              <Phone size={16} className="text-green-500 md:mt-3" />
              <span className="md:mt-3 font-extralight">
                Phone <span className="text-indigo-500 text-sm">{selectedUser.phone}</span>
              </span>
            </div>
          </div>

          <hr className="mt-3" />
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Notes</h4>
              <button className="text-blue-600 hover:text-blue-800">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
