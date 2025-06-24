import { ChevronDown, Copy, CornerUpLeft, EllipsisVertical,  FileText,  LandPlot, Megaphone,  Mic,  NotepadText,  PencilLine,  PhoneCall,  Plus,  ShieldCheck,  Smile,  SquareArrowOutUpRight,  Video,  X,  Bold,  Italic,  Underline,  Strikethrough,} from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Phone } from "lucide-react"
import { useTranslation } from "react-i18next"

function CreateTemp() {
  const [activeStep, setActiveStep] = useState(1)
  const [message, setMessage] = useState("")
  const [selectCategory, setSelectCategory] = useState("Marketing")
  const [selectedOption, setSelectedOption] = useState("Custom")
  const [templateName, setTemplateName] = useState("")
  const [buttons, setButtons] = useState([])
  const [showAll, setShowAll] = useState(false)
  const maxLength = 521
  const maxWebLength = 2000
  const maxVisitLength = 25
  const maxQuickLength = 25
  const maxPromotionLength = 25
  const maxButtonPhoneLength = 25
  const maxPhoneNumberLength = 20
  const maxCopyCodeLength = 15
  const MAX_PREVIEW_BUTTON = 2
  const navigate = useNavigate()

  const handleDiscard = () => {
    navigate(-1) // Go back to previous page
  }
  // for show less-more
  const hasMoreButtons = buttons.length > MAX_PREVIEW_BUTTON
  const visibleButtons = showAll ? buttons : buttons.slice(0, MAX_PREVIEW_BUTTON)
  const [selectedDropdown, setSelectedDropdown] = useState({})
  const [urlTypes, setUrlTypes] = useState({}) // Add this to track URL type for each visit button

  const [headerOption, setHeaderOption] = useState("")
  // New state variables for template content
  const [headerText, setHeaderText] = useState("")
  const [bodyText, setBodyText] = useState("")
  const [headerImage, setHeaderImage] = useState(null)
  const [headerVideo, setHeaderVideo] = useState(null)
  const [headerDocument, setHeaderDocument] = useState(null)
  const [locationName, setLocationName] = useState("")
  const [selectedVariable, setSelectedVariable] = useState("")
  const [footer, setFooter] = useState(false)
  const [showInputInPreview, setShowInputInPreview] = useState(false)

  const [showOptions, setShowOptions] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [variableFormatError, setVariableFormatError] = useState("")

  // Text formatting states
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrick, setIsStrick] = useState(false)
  const [showFormatting, setShowFormatting] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [showModals, setShowModals] = useState(false)

  // Update the handlePreviousClick function to show the modal
  const handlePreviousClick = () => {
    setShowModal(true)
  }
  const handlePreviousClick2 = () => {
    setShowModals(true)
  }

  // Update the closeModal function to just close the modal
  const closeModal = () => {
    setShowModal(false)
  }

  const closeModals = () => {
    setShowModals(false)
  }

  // Add a new function to handle the "Next" button click in step 2
  const handleNextClick = () => {
    if (activeStep === 1) {
      setActiveStep(2)
    } else if (activeStep === 2) {
      setActiveStep(3)
    }
  }

  // Function to check if text contains empty variable placeholders {{}}
  const hasEmptyVariables = (text) => {
    return text.includes("{{}}")
  }

  // Function to check if text contains numbered variable placeholders {{1}}, {{2}}, etc.
  const hasNumberedVariables = (text) => {
    const regex = /{{(\d+)}}/g
    return regex.test(text)
  }

  // Check for mixed variable formats whenever text changes
  useEffect(() => {
    checkVariableFormats()
  }, [headerText, bodyText, selectedVariable])

  // Set default selection on component mount
  useEffect(() => {
    setSelectCategory("Marketing")
    setSelectedOption("Custom")
  }, [])

  // Function to check for mixed variable formats
  const checkVariableFormats = () => {
    if (selectedVariable === "") {
      // Number is selected
      if (hasEmptyVariables(headerText) || hasEmptyVariables(bodyText)) {
        setVariableFormatError(
          "This template contains variable parameters with incorrect formatting. Empty variables {{}} cannot be used with Number format.",
        )
      } else {
        setVariableFormatError("")
      }
    } else if (selectedVariable === "1") {
      // Name is selected
      if (hasNumberedVariables(headerText) || hasNumberedVariables(bodyText)) {
        setVariableFormatError(
          "This template contains variable parameters with incorrect formatting. Numbered variables {{1}} cannot be used with Name format.",
        )
      } else {
        setVariableFormatError("")
      }
    }
  }

  // Replace the handleInputBlur function with this improved version
  const handleInputBlur = (e) => {
    const { value, name, dataset } = e.target
    const instanceId = dataset.instanceId

    if (!value.trim()) {
      setErrorMessage(`Button text cannot be empty!`)
    } else {
      // Check if this value already exists in other custom buttons
      const isDuplicate = Object.entries(customValues)
        .filter(([id]) => id !== instanceId)
        .some(([_, val]) => val === value)

      if (isDuplicate) {
        setErrorMessage(`"${value}" is already used in another button!`)
      } else {
        setErrorMessage("")
      }
    }
  }

  const handleRemoveVariable = (removedKey, section) => {
    const placeholderRegex = new RegExp(`{{\\s*${removedKey}\\s*}}`, "g")

    if (section === "header") {
      // Only update header text and header variables
      const updatedHeaderText = headerText.replace(placeholderRegex, "")
      setHeaderText(updatedHeaderText)
      setHeaderVariableValues((prev) => {
        const updated = { ...prev }
        delete updated[removedKey]
        return updated
      })
    } else if (section === "body") {
      // Only update body text and body variables
      const updatedBodyText = bodyText.replace(placeholderRegex, "")
      setBodyText(updatedBodyText)
      setVariableValues((prev) => {
        const updated = { ...prev }
        delete updated[removedKey]
        return updated
      })
    }

    // Check variable formats after removing a variable
    setTimeout(checkVariableFormats, 0)
  }

  // Track multiple open cards instead of a single showCard state
  const [openCards, setOpenCards] = useState({
    custom: false,
    flow: false,
    call: false,
    visit: false,
    marketing: false,
    copy: false,
  })

  // Track the count of open cards per type
  const [openCardCounts, setOpenCardCounts] = useState({
    custom: 0,
    flow: 0,
    call: 0,
    visit: 0,
    marketing: 0,
    copy: 0,
  })

  // Track the total count of open cards
  const [totalOpenCards, setTotalOpenCards] = useState(0)

  // Track the instances of each card type
  const [cardInstances, setCardInstances] = useState({
    custom: [],
    flow: [],
    call: [],
    visit: [],
    marketing: [],
    copy: [],
  })

  // Track custom button values individually by instance ID
  const [customValues, setCustomValues] = useState({})

  // Replace these single state variables
  const [visitValues, setVisitValues] = useState({})
  const [websiteValues, setWebsiteValues] = useState({})
  const [website, setWebsite] = useState("")

  const [viewValue, setViewValue] = useState("")
  const [copyCode, setCopyCode] = useState("")
  const [copyCodes, setCopyCodes] = useState("")
  const [showCustomPreview, setShowCustomPreview] = useState(false)
  const [marketValue, setMarketValue] = useState("")
  const [marketValues, setMarketValues] = useState("")
  const [callValue, setCallValue] = useState("")
  const [callValues, setCallValues] = useState("")

  const generateInstanceId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Handle input change
  const handleFooterChange = (event) => {
    setFooter(event.target.value)
  }
  const { i18n } = useTranslation()

  const handleChange = (e) => {
    const selectedLang = e.target.value
    i18n.changeLanguage(selectedLang) // This triggers the language change
  }

  const toggleFields = () => setShowOptions(!showOptions)

  // Function to handle text formatting
  const applyFormatting = (type) => {
    let formattedText = ""
    const selectionStart = document.getElementById("bodyTextArea").selectionStart
    const selectionEnd = document.getElementById("bodyTextArea").selectionEnd
    const selectedText = bodyText.substring(selectionStart, selectionEnd)

    if (selectedText) {
      const beforeText = bodyText.substring(0, selectionStart)
      const afterText = bodyText.substring(selectionEnd)

      switch (type) {
        case "bold":
          formattedText = beforeText + "*" + selectedText + "*" + afterText
          break
        case "italic":
          formattedText = beforeText + "_" + selectedText + "_" + afterText
          break
        case "underline":
          formattedText = beforeText + "-" + selectedText + "-" + afterText
          break
        case "newline":
          formattedText = beforeText + "\n" + selectedText + afterText
          break
        case "line-through":
          formattedText = beforeText + "~" + selectedText + "~" + afterText
          break
        default:
          formattedText = bodyText
      }

      setBodyText(formattedText)
    }
  }

  // Modified to handle multiple cards with type limits
  const handleOptionClick = (type) => {
    // Check if we've reached the maximum limit for this type (2)
    if (openCardCounts[type] >= 15) {
      alert(`You can only have a maximum of 15 ${type} buttons open at once.`)
      return
    }

    // Create a new instance ID for this card
    let instanceId = Date.now()

    // For custom buttons, get the instanceId from the custom handler
    if (type === "custom") {
      instanceId = generateInstanceId()

      // Default value for custom buttons
      const defaultValue = "Quick Reply"

      // Check if the default value already exists in other custom buttons
      const isDuplicate = Object.values(customValues).some((val) => val === defaultValue)

      // Add initial value for this instance with default text
      setCustomValues((prev) => ({
        ...prev,
        [instanceId]: defaultValue,
      }))

      // Set error message if default value is a duplicate
      if (isDuplicate) {
        setErrorMessage(`"${defaultValue}" is already used in another button!`)
      }

      if (openCardCounts[type] + 1 >= 1) {
        setShowCustomPreview(true)
      }
    }

    // Add the new instance to the instances array for this type
    setCardInstances((prev) => ({
      ...prev,
      [type]: [...prev[type], instanceId],
    }))

    setButtons((prev) => [...prev, { type, id: instanceId }])

    // Increment the count for this type
    setOpenCardCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))

    // Increment the total open card count
    setTotalOpenCards((prev) => prev + 1)

    // Set the selected option
    setSelectedOption(type)
    setShowOptions(false)

    // Set appropriate values based on the type
    if (type === "marketing") {
      setMarketValue("Stop Promotions")
    } else if (type === "call") {
      setCallValue("Call Phone Number")
    } else if (type === "flow") {
      setViewValue("View flow")
    } else if (type === "copy") {
      setCopyCode("Copy Offer Code")
    } else if (type === "visit") {
      // Check if we already have a visit button with the same text
      const isDuplicate = Object.values(visitValues).some((val) => val === "Visit Website")

      if (isDuplicate) {
        // Just show error message without adding a new button
        setErrorMessage(`"Visit Website" is already used in another button!`)
        return // Exit the function early without adding a new button
      }

      // Initialize values for this instance ID
      setVisitValues((prev) => ({
        ...prev,
        [instanceId]: "Visit Website",
      }))
      setWebsiteValues((prev) => ({
        ...prev,
        [instanceId]: "",
      }))

      // Check if this is the second visit button, if so show input in preview
      if (openCardCounts[type] + 1 === 2) {
        setShowInputInPreview(true)
      }
    }
  }

  // Function to close a specific card instance
  const closeCard = (type, instanceId) => {
    // Remove this instance from the instances array
    setCardInstances((prev) => ({
      ...prev,
      [type]: prev[type].filter((id) => id !== instanceId),
    }))

    setButtons((prev) => prev.filter((btn) => btn.id !== instanceId))

    // Decrement the count for this type
    setOpenCardCounts((prev) => ({
      ...prev,
      [type]: prev[type] - 1,
    }))

    // Decrement the total open card count
    setTotalOpenCards((prev) => prev - 1)

    // Hide input in preview if we're removing a visit button and now have less than 2
    if (type === "visit") {
      if (openCardCounts[type] - 1 < 2) {
        setShowInputInPreview(false)
      }
    }
    if (type === "custom") {
      setCustomValues((prev) => {
        const updated = { ...prev }
        delete updated[instanceId]
        return updated
      })

      if (openCardCounts[type] - 1 < 1) {
        setShowCustomPreview(false)
      }
    }

    // Clear error message when closing a card
    setErrorMessage("")
  }

  const [headerVariableValues, setHeaderVariableValues] = useState({})

  const handleHeaderTextChange = (text) => {
    setHeaderText(text)

    const regex = /{{(.*?)}}/g
    const matches = [...text.matchAll(regex)]
    const newVars = {}

    matches.forEach((match) => {
      const key = match[1]
      if (!headerVariableValues.hasOwnProperty(key)) {
        newVars[key] = ""
      }
    })

    setHeaderVariableValues((prev) => ({ ...prev, ...newVars }))

    // Check for variable format issues after text change
    setTimeout(checkVariableFormats, 0)
  }

  const handleHeaderVariableInputChange = (key, value) => {
    setHeaderVariableValues((prev) => ({ ...prev, [key]: value }))
  }

  const [variableValues, setVariableValues] = useState({})
  const [variableCount, setVariableCount] = useState(1) // Track next variable number
  const [headervariableCount, setHeaderVariableCount] = useState(1)

  // When typing, auto-detect any new variables
  const handleBodyTextChange = (text) => {
    setBodyText(text)

    const regex = /{{(.*?)}}/g
    const matches = [...text.matchAll(regex)]
    const newVars = {}

    matches.forEach((match) => {
      const key = match[1]
      if (!variableValues.hasOwnProperty(key)) {
        newVars[key] = ""
      }
    })

    setVariableValues((prev) => ({ ...prev, ...newVars }))

    // Check for variable format issues after text change
    setTimeout(checkVariableFormats, 0)
  }

  const handleAddHeaderVariable = () => {
    // Check for mixed variable formats before adding
    if (variableFormatError) {
      return // Don't add if there's a format error
    }

    if (selectedVariable === "1") {
      // For "Name" option, add an empty placeholder
      const newVarSyntax = `{{}}`
      const updatedText = headerText + " " + newVarSyntax
      setHeaderText(updatedText)
      setHeaderVariableValues((prev) => ({ ...prev, [""]: "" }))
    } else {
      // For "Number" option (default), add numbered placeholders
      const usedKeys = Object.keys(headerVariableValues)
        .filter((key) => /^\d+$/.test(key)) // Only consider numeric keys
        .map(Number)
        .sort((a, b) => a - b)

      let newVarKey = 1
      for (let i = 0; i < usedKeys.length; i++) {
        if (usedKeys[i] !== i + 1) {
          newVarKey = i + 1
          break
        } else {
          newVarKey = usedKeys.length + 1
        }
      }

      const newVarSyntax = `{{${newVarKey}}}`
      const updatedText = headerText + " " + newVarSyntax

      setHeaderText(updatedText)
      setHeaderVariableValues((prev) => ({ ...prev, [newVarKey]: "" }))
      setHeaderVariableCount((prev) => Number.parseInt(newVarKey) + 1)
    }
  }

  const handleAddVariable = () => {
    // Check for mixed variable formats before adding
    if (variableFormatError) {
      return // Don't add if there's a format error
    }

    if (selectedVariable === "1") {
      // For "Name" option, add an empty placeholder
      const newVarSyntax = `{{}}`
      const updatedText = bodyText + " " + newVarSyntax
      setBodyText(updatedText)
      setVariableValues((prev) => ({ ...prev, [""]: "" }))
    } else {
      // For "Number" option (default), add numbered placeholders
      const usedKeys = Object.keys(variableValues)
        .filter((key) => /^\d+$/.test(key)) // Only consider numeric keys
        .map(Number)
        .sort((a, b) => a - b)

      let newVarKey = 1
      for (let i = 0; i < usedKeys.length; i++) {
        if (usedKeys[i] !== i + 1) {
          newVarKey = i + 1
          break
        } else {
          newVarKey = usedKeys.length + 1
        }
      }

      const newVarSyntax = `{{${newVarKey}}}`
      const updatedText = bodyText + " " + newVarSyntax

      setBodyText(updatedText)
      setVariableValues((prev) => ({ ...prev, [newVarKey]: "" }))
    }
  }

  // Handle input change for variable value
  const handleVariableInputChange = (key, value) => {
    setVariableValues((prev) => ({ ...prev, [key]: value }))
  }

  // Function to handle Next button click
  // Function to handle Next button click

  // ---------------------------
  const getProcessedHeaderText = () => {
    return headerText.replace(/{{(.*?)}}/g, (_, key) => headerVariableValues[key] || "")
  }

  // Function to process text formatting for display
  const getProcessedText = () => {
    let processedText = bodyText.replace(/{{(.*?)}}/g, (_, key) => variableValues[key] || "")

    // Process WhatsApp-like formatting
    processedText = processedText
      .replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>')
      .replace(/_(.*?)_/g, '<span class="italic">$1</span>')
      .replace(/-(.*?)-/g, '<span class="underline">$1</span>')
      .replace(/\n/g, "<br/>")
      .replace(/~(.*?)~/g, '<p class="line-through">$1</p>')

    return processedText
  }

  const getMarketValue = () => {
    return marketValue.replace(/{{(.*?)}}/g, (_, key) => marketValue[key] || "")
  }
  const getCallValue = () => {
    return callValue.replace(/{{(.*?)}}/g, (_, key) => callValue[key] || "")
  }
  const getViewValue = () => {
    return viewValue.replace(/{{(.*?)}}/g, (_, key) => viewValue[key] || "")
  }
  const getCopyCode = () => {
    return copyCode.replace(/{{(.*?)}}/g, (_, key) => copyCode[key] || "")
  }
  const getCopyCodes = () => {
    return copyCodes.replace(/{{(.*?)}}/g, (_, key) => copyCodes[key] || "")
  }

  const getVisitVebsite = () => {
    return website.replace(/{{(.*?)}}/g, (_, key) => website[key] || "")
  }

  // Function to handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (type === "image") {
        setHeaderImage(event.target.result)
      } else if (type === "video") {
        setHeaderVideo(event.target.result)
      } else if (type === "document") {
        setHeaderDocument(file.name)
      }
    }

    if (type === "image" || type === "video") {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  // Function to show fullscreen preview
  const showFullscreenPreview = (imageUrl) => {
    // Create overlay element
    const overlay = document.createElement("div")
    overlay.className = "fullscreen-overlay"

    // Create image element
    const img = document.createElement("img")
    img.src = imageUrl
    img.className = "fullscreen-image"

    // Add close instruction
    const closeText = document.createElement("div")
    closeText.textContent = "Click anywhere to close"
    closeText.style.position = "absolute"
    closeText.style.bottom = "20px"
    closeText.style.color = "white"
    closeText.style.textAlign = "center"
    closeText.style.width = "100%"

    // Add elements to DOM
    overlay.appendChild(img)
    overlay.appendChild(closeText)
    overlay.onclick = () => document.body.removeChild(overlay)
    document.body.appendChild(overlay)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Set up your template</h1>
            <p className="text-gray-600 mb-4 text-sm">
              Choose the category that best describes your message template. Then select the type of message you want to
              send.
            </p>
            <div className="flex justify-start text-sm mb-4">
              <Link to="" className="text-cyan-500">
                Learn more about categories
              </Link>
            </div>
            <div className="flex w-full bg-gray-100">
              <button
                className={`flex-1 flex items-center justify-center px-5 py-3  text-md ${selectCategory === "Marketing" ? "bg-white text-cyan-500 border-b-4 border-cyan-500" : "hover:bg-white hover:text-cyan-500 hover:border-b-4 hover:border-cyan-500"}`}
                onClick={() => setSelectCategory("Marketing")}
              >
                <Megaphone className="w-4 h-6 mr-1" /> Marketing
              </button>

              <button
                className={`flex-1 flex items-center justify-center px-5 py-3 text-md ${selectCategory === "Utility" ? "bg-white text-cyan-500 border-b-4 border-cyan-500" : "hover:bg-white hover:text-cyan-500 hover:border-b-4 hover:border-cyan-500"}`}
                onClick={() => setSelectCategory("Utility")}
              >
                Utility
              </button>

              <button
                className={`flex-1 flex items-center justify-center px-5 py-3 text-md ${selectCategory === "Authentication" ? "bg-white text-cyan-500 border-b-4 border-cyan-500" : "hover:bg-white hover:text-cyan-500 hover:border-b-4 hover:border-cyan-500"}`}
                onClick={() => setSelectCategory("Authentication")}
              >
                Authentication
              </button>
            </div>
            {selectCategory === "Authentication" && (
              <div className="mt-4 p-4 bg-blue-50 border rounded-xl hover:border-cyan-500">
                <div className="flex justify-between gap-2">
                  <input type="radio" name="authOption" className="form-radio text-cyan-500" />
                  <h1 className="mr-auto">One-time Passscode</h1>
                </div>
                <p className="text-sm text-gray-600 ml-5">Send codes to verify a transaction or login</p>
              </div>
            )}
            {/* -------------------Marketing------------- */}
            {selectCategory === "Marketing" && (
              <>
                {[
                  {
                    label: "Custom",
                    description: "Send promotions or announcements to increase awareness and engagement",
                  },
                  {
                    label: "Catalog",
                    description: "Send message about your entire catalog or multiple products from it.",
                  },
                  {
                    label: "Flow",
                    description: "Send a form to capture customer interests, appointment request, or run surveys",
                  },
                  { label: "Order details", description: "Send message through which customers can pay you." },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`mt-4 p-4 border rounded-xl cursor-pointer ${
                      selectedOption === item.label ? "bg-blue-50 border-cyan-500" : "bg-white hover:border-cyan-500"
                    }`}
                    onClick={() => setSelectedOption(item.label)}
                  >
                    <div className="flex justify-between gap-2">
                      <input
                        type="radio"
                        name="authOption"
                        value={item.label}
                        checked={selectedOption === item.label}
                        onChange={() => setSelectedOption(item.label)}
                        className="form-radio text-cyan-500"
                      />
                      <h1 className="mr-auto">{item.label}</h1>
                    </div>
                    <p className="text-sm ml-5 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </>
            )}
            {selectCategory === "Utility" && (
              <>
                {[
                  { label: "Custom", description: "Send messages about an existing order or account" },
                  { label: "Flow", description: "Send a form to collect feedback, send reminders orders." },
                  {
                    label: "order Status",
                    description: "Send a message to tell customers about the progress of their orders",
                  },
                  { label: "Order details", description: "Send message through which customers can pay you." },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`mt-4 p-4 border rounded-xl cursor-pointer ${
                      selectedOption === item.label ? "bg-blue-50 border-cyan-500" : "bg-white hover:border-cyan-500"
                    }`}
                    onClick={() => setSelectedOption(item.label)}
                  >
                    <div className="flex justify-between gap-2">
                      <input
                        type="radio"
                        name="authOption"
                        value={item.label}
                        checked={selectedOption === item.label}
                        onChange={() => setSelectedOption(item.label)}
                        className="form-radio text-cyan-500"
                      />
                      <h1 className="mr-auto">{item.label}</h1>
                    </div>
                    <p className="text-sm ml-5 text-gray-600">{item.description}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )

      case 2:
        return (
          <>
            {/* line 141-171 this are 1st div inside edit temp and div is (template and language) */}
            <div className="mt-4 bg-white p-4 rounded-xl shadow">
              <h1 className="text-lg">Template Name and Language</h1>
              <hr />
              <div className="flex justify-between items-center mt-4">
                <label className="text-sm font-semibold">Name your Template</label>
                <label className="text-sm font-semibold mr-24">Language</label>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col mt-3 w-96">
                  <input
                    type="text"
                    placeholder="Enter template name..."
                    maxLength={maxLength}
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="mt-1 w-96 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {templateName.length}/{maxLength} available
                  </div>
                </div>
                <select
                  onChange={handleChange}
                  className="border w-32 p-2 mt-5 mr-10 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">Select</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-4 bg-white p-4 rounded-xl shadow">
              <h1 className="text-lg bg-gray-100 p-1">Content</h1>
              <hr />
              <p className="text-sm mt-3 p-1">Fill out the header, body and footer section of your template.</p>

              {/* Variable Picker */}
              <h1 className="text-sm font-semibold mt-3 p-1">Add Variable</h1>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <select
                    value={selectedVariable}
                    onChange={(e) => setSelectedVariable(e.target.value)}
                    className="border p-2 rounded-md w-60"
                  >
                    <option value="">Number</option>
                    <option value="1">Name</option>
                  </select>
                </div>

                {/* Display variable format error message */}
                {variableFormatError && (
                  <div className="text-red-500 text-sm mt-1 p-1 bg-red-50 border border-red-200 rounded-md">
                    {variableFormatError}
                  </div>
                )}
              </div>

              {/* Header Section */}
              <h1 className="text-sm font-semibold mt-4 p-1">Header - Optional</h1>
              <div className=" w-full mt-1">
                <select
                  value={headerOption}
                  onChange={(e) => setHeaderOption(e.target.value)}
                  className="w-full border p-2 rounded-md appearance-none focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">None</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="location">Location</option>
                </select>

                {headerOption && (
                  <button
                    onClick={() => setHeaderOption("")}
                    className="absolute top-1/2 right-10 -translate-y-1/2 text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-500">
                  <ChevronDown size={25} />
                </div>
              </div>

              {headerOption === "text" && (
                <div className="mt-2">
                  <label className="text-sm font-semibold">Header Text</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter header text..."
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                      value={headerText}
                      onChange={(e) => handleHeaderTextChange(e.target.value)}
                    />
                    <button
                      className={`whitespace-nowrap ${variableFormatError ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-3 py-2 rounded`}
                      onClick={handleAddHeaderVariable}
                      disabled={!!variableFormatError}
                    >
                      Add Variable
                    </button>
                  </div>

                  {/* Auto-generated inputs for header variables */}
                  {Object.keys(headerVariableValues).length > 0 && (
                    <>
                      <div className="space-y-2 mt-2">
                        {Object.keys(headerVariableValues).map((key) => (
                          <div key={key} className="relative flex items-center space-x-2">
                            <button
                              onClick={() => handleRemoveVariable(key, "header")}
                              className="absolute right-2 text-gray-500 hover:text-gray-700 font-bold z-10"
                            >
                              ✕
                            </button>

                            <span className="font-medium whitespace-nowrap">{`{{${key}}}`}:</span>
                            <input
                              type="text"
                              className="border p-1 rounded w-full"
                              value={headerVariableValues[key]}
                              onChange={(e) => handleHeaderVariableInputChange(key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {headerOption === "image" && (
                <div className="mt-2">
                  <label className="text-sm font-semibold capitalize">Image Upload</label>
                  <div className="flex flex-col gap-2">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e, "image")
                        }
                      }}
                    />

                    {/* Image preview in the editor */}
                    {headerImage ? (
                      <div className="image-preview-container mt-2">
                        <img
                          src={headerImage || "/placeholder.svg"}
                          alt="Preview"
                          className="image-upload-preview w-full h-auto max-h-48 object-contain rounded-md cursor-pointer"
                          onClick={() => {
                            // Create fullscreen preview
                            const overlay = document.createElement("div")
                            overlay.className = "fullscreen-overlay"
                            overlay.style.position = "fixed"
                            overlay.style.top = "0"
                            overlay.style.left = "0"
                            overlay.style.right = "0"
                            overlay.style.bottom = "0"
                            overlay.style.backgroundColor = "rgba(0,0,0,0.8)"
                            overlay.style.zIndex = "9999"
                            overlay.style.display = "flex"
                            overlay.style.alignItems = "center"
                            overlay.style.justifyContent = "center"

                            const img = document.createElement("img")
                            img.src = headerImage
                            img.className = "max-w-full max-h-full"

                            const closeText = document.createElement("div")
                            closeText.textContent = "Click anywhere to close"
                            closeText.style.position = "absolute"
                            closeText.style.bottom = "20px"
                            closeText.style.color = "white"
                            closeText.style.textAlign = "center"
                            closeText.style.width = "100%"

                            overlay.appendChild(img)
                            overlay.appendChild(closeText)
                            overlay.onclick = () => document.body.removeChild(overlay)
                            document.body.appendChild(overlay)
                          }}
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </label>
                    )}

                    {/* Custom file selector buttons */}
                    <div className="flex items-center gap-2 mt-1">
                      <label
                        htmlFor="image-upload"
                        className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors cursor-pointer"
                      >
                        {headerImage ? "Change Image" : "Select Image"}
                      </label>
                      {headerImage && (
                        <button
                          type="button"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "image")}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {headerOption === "video" && (
                <div className="mt-2">
                  <label className="text-sm font-semibold capitalize">Video Upload</label>
                  <input
                    type="file"
                    accept="video/*"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    onChange={(e) => handleFileUpload(e, "video")}
                  />
                </div>
              )}

              {headerOption === "document" && (
                <div className="mt-2">
                  <label className="text-sm font-semibold capitalize">Document Upload</label>
                  <input
                    type="file"
                    accept="application/pdf,application/msword"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    onChange={(e) => handleFileUpload(e, "document")}
                  />
                </div>
              )}

              {headerOption === "location" && (
                <div className="mt-2">
                  <label className="text-sm font-semibold">Location Name</label>
                  <input
                    type="text"
                    placeholder="Enter location name or coordinates"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
              )}
              {/* ------Body----- */}

              <h1 className="mt-2">Body</h1>

              {/* Text formatting toolbar line 1041-1074 */}
              <div className="bg-white flex justify-end">
                <div className="flex items-center gap-1 mb-1 p-1 rounded-md">
                  <button
                    onClick={() => applyFormatting("bold")}
                    className={`p-1 rounded ${isBold ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Bold (surround text with *asterisks*)"
                  >
                    <Bold className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => applyFormatting("italic")}
                    className={`p-1 rounded ${isItalic ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Italic (surround text with _underscores_)"
                  >
                    <Italic className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => applyFormatting("line-through")}
                    className={`p-1 rounded ${isStrick ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Strikethrough (surround text with ~~line-through~~)"
                  >
                    <Strikethrough className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => applyFormatting("underline")}
                    className={`p-1 rounded ${isUnderline ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Underline (surround text with ~tildes~)"
                  >
                    <Underline className="w-3 h-3" />
                  </button>
                  {/* <button
                    onClick={() => applyFormatting("underline")}
                    className={`p-1 rounded ${isUnderline ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    title="Underline (surround text with ~tildes~)"
                  >
                    <Underline className="w-3 h-3" />
                  </button> */}
                </div>
              </div>
              <textarea
                id="bodyTextArea"
                placeholder="Enter text in English"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                value={bodyText}
                onChange={(e) => handleBodyTextChange(e.target.value)}
                rows={5}
              />

              <button
                className={`${variableFormatError ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-3 py-1 rounded mt-2`}
                onClick={handleAddVariable}
                disabled={!!variableFormatError}
              >
                Add Variable
              </button>

              {/* Auto-generated inputs for variables */}
              {Object.keys(variableValues).length > 0 && (
                <div className="space-y-2 mt-2">
                  {Object.keys(variableValues).map((key) => (
                    <>
                      <div key={key} className="relative flex items-center space-x-2">
                        <button
                          onClick={() => handleRemoveVariable(key, "body")}
                          className="absolute right-2 text-gray-500 hover:text-gray-700 font-bold z-10"
                        >
                          ✕
                        </button>

                        <span className="font-medium whitespace-nowrap">{`{{${key}}}`}:</span>

                        <input
                          type="text"
                          className="border p-1 rounded w-full"
                          value={variableValues[key]}
                          onChange={(e) => handleVariableInputChange(key, e.target.value)}
                        />
                      </div>
                    </>
                  ))}
                </div>
              )}

              {/* ------------_Footer---------- */}

              <div className="flex flex-col items-start gap-4 mt-4">
                <label htmlFor="footerInput" className="text-gray-700 font-medium">
                  Footer
                </label>
                <input
                  id="footerInput"
                  type="text"
                  placeholder="Enter Text"
                  onChange={handleFooterChange} // Update state on input change
                  className="remove-x-button border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* ------Button (multiple)----- */}

            <div className="w-full">
              <h1 className="text-lg bg-gray-100 p-1 mt-4">Button - Optional</h1>
              <hr />
              <p className="text-sm mt-3 p-1 text-gray-500">
                Create buttons that let customers respond to your message or take action. You can add up to 10 buttons.
                If you add more than 3 buttons, they will appear in a list.
              </p>

              <div className="w-full md:w-1/4">
                <div className="w-full mt-4 relative">
                  <button
                    onClick={toggleFields}
                    className="bg-blue-500 rounded-lg p-2 flex justify-between items-center text-white w-full"
                  >
                    <Plus className="w-5 h-6 text-white mr-2" />
                    Add Button
                    <ChevronDown className="ml-3" />
                  </button>

                  {showOptions && (
                    <div className="absolute bg-white shadow-md rounded-md mt-2 w-full z-10 overflow-auto">
                      <h1 className="font-semibold p-2">Quick reply buttons</h1>
                      <button
                        onClick={() => handleOptionClick("marketing")}
                        className={`p-2 w-full text-left ${openCardCounts.marketing >= 1 ? " text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.marketing >= 1}
                      >
                        Marketing opt-out
                        <p className="text-sm text-gray-500">Recommended</p>
                      </button>
                      <button
                        onClick={() => handleOptionClick("custom")}
                        className={`p-2 w-full text-left ${openCardCounts.custom >= 15 ? " text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.custom >= 15}
                      >
                        Custom
                      </button>

                      <hr className="w-full" />
                      <h1 className="font-semibold p-2">Call-to-action buttons</h1>
                      <button
                        onClick={() => handleOptionClick("visit")}
                        className={`p-2 w-full text-left ${openCardCounts.visit >= 2 ? "text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.visit >= 2}
                      >
                        Visit website
                        <p className="text-sm text-gray-500">2 buttons maximum</p>
                      </button>
                      <button
                        onClick={() => handleOptionClick("call")}
                        className={`p-2 w-full text-left ${openCardCounts.call >= 1 ? " text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.call >= 1}
                      >
                        Call Phone Number
                        <p className="text-sm text-gray-500">1 button maximum</p>
                      </button>
                      <button
                        onClick={() => handleOptionClick("flow")}
                        className={`p-2 w-full text-left ${openCardCounts.flow >= 1 ? " text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.flow >= 1}
                      >
                        Complete Flow
                        <p className="text-sm text-gray-500">1 button maximum</p>
                      </button>

                      <button
                        onClick={() => handleOptionClick("copy")}
                        className={`p-2 w-full text-left ${openCardCounts.copy >= 1 ? " text-gray-500 cursor-not-allowed" : "hover:bg-gray-100"}`}
                        disabled={openCardCounts.copy >= 1}
                      >
                        Copy offer code
                        <p className="text-sm text-gray-500">1 button maximum</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Conditionally render input based on selected option */}
              <div className="flex flex-col gap-4 p-4">
                {/* Marketing option cards */}
                {cardInstances.marketing.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="mt-4 bg-white shadow-lg rounded-xl p-4 border border-gray-200 relative z-1"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("marketing", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="mt-4 flex justify-between">
                      <label className="block text-sm font-semibold">Type</label>
                      <label className="block text-sm font-semibold md:mr-16">Button text</label>
                      <label className="block text-sm font-semibold md:mr-32">Footer text</label>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-2/4"
                      >
                        <option value="market">Marketing</option>
                        <option value="call">Call Phone Number</option>
                      </select>
                      <div className="relative w-full mb-0">
                        <input
                          value={marketValue}
                          maxLength={maxPromotionLength}
                          onChange={(e) => setMarketValue(e.target.value)}
                          className="border rounded-lg p-2 pr-16 w-full"
                          placeholder="Stop promotions"
                          disabled
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {marketValue.length}/{maxPromotionLength}
                        </div>
                      </div>
                      <input
                        value={marketValues}
                        onChange={(e) => setMarketValues(e.target.value)}
                        className="border rounded-lg p-1 w-full"
                        placeholder="Not interested? Tap"
                        disabled
                      />
                    </div>
                  </div>
                ))}

                {/* Custom option cards */}
                {cardInstances.custom.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="bg-white shadow-lg rounded-xl p-4 mt-4 border border-gray-200 relative"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("custom", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="flex gap-4 items-center">
                      <div className="w-1/3">
                        <label className="block text-sm font-bold mb-1">Type</label>
                        <select value="custom" className="border rounded-lg p-2">
                          <option value="custom">Custom</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="w-2/3">
                        <label className="block text-sm font-bold mb-1">Quick Reply</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={customValues[instanceId] || ""}
                            maxLength={maxQuickLength}
                            onChange={(e) => {
                              setCustomValues((prev) => ({
                                ...prev,
                                [instanceId]: e.target.value,
                              }))
                              // Clear error when typing
                              if (errorMessage) setErrorMessage("")
                            }}
                            onBlur={handleInputBlur}
                            data-instance-id={instanceId}
                            className={`border rounded-lg p-2 pr-16 w-full ${errorMessage ? "border-red-500" : ""}`}
                            placeholder="Enter reply..."
                          />
                          <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                            {(customValues[instanceId] || "").length}/{maxQuickLength}
                          </div>
                        </div>
                        {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Visit website option cards */}
                {cardInstances.visit.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="mt-4 bg-white shadow-lg rounded-xl p-5 border border-gray-200 relative"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("visit", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="mt-4 flex gap-3 justify-between">
                      <label className="w-1/4 block text-sm font-semibold mb-1">Type of action</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Button text</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">URL type</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Website URL</label>
                    </div>
                    <div className="mt-4 flex gap-3 justify-between">
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-1/6"
                      >
                        <option value="visit">Visit</option>
                        <option value="call">Call Phone Number</option>
                      </select>
                      <div className="relative w-1/4">
                        <input
                          type="url"
                          value={visitValues[instanceId] || ""}
                          maxLength={maxVisitLength}
                          onBlur={handleInputBlur}
                          data-instance-id={instanceId}
                          data-type="visit"
                          onChange={(e) =>
                            setVisitValues((prev) => ({
                              ...prev,
                              [instanceId]: e.target.value,
                            }))
                          }
                          className={`border rounded-lg p-2 pr-16 w-full ${errorMessage && visitValues[instanceId] === "Visit Website" ? "border-red-500" : ""}`}
                          placeholder="Visit Website"
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {(visitValues[instanceId] || "").length}/{maxVisitLength}
                        </div>
                      </div>
                      <select
                        value={urlTypes[instanceId] || "static"}
                        onChange={(e) => {
                          setUrlTypes((prev) => ({
                            ...prev,
                            [instanceId]: e.target.value,
                          }))

                          // When "dynamic" is selected, update the website value to {{1}}
                          if (e.target.value === "dynamic") {
                            setWebsiteValues((prev) => ({
                              ...prev,
                              [instanceId]: "{{1}}",
                            }))
                          } else {
                            // Reset to empty for static
                            setWebsiteValues((prev) => ({
                              ...prev,
                              [instanceId]: "",
                            }))
                          }
                        }}
                        className="border rounded-lg p-2 w-1/4"
                      >
                        <option value="static">Static</option>
                        <option value="dynamic">Dynamic</option>
                      </select>

                      <div className="relative w-1/4">
                        <input
                          type="text"
                          value={websiteValues[instanceId] || ""}
                          maxLength={maxWebLength}
                          onChange={(e) =>
                            setWebsiteValues((prev) => ({
                              ...prev,
                              [instanceId]: e.target.value,
                            }))
                          }
                          className="border rounded-lg p-2 pr-16 w-full"
                          placeholder="http://localhost:5173"
                          disabled={urlTypes[instanceId] === "dynamic"}
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {(websiteValues[instanceId] || "").length}/{maxWebLength}
                        </div>
                      </div>
                    </div>
                    {/* Display error message specifically for this visit button if it has the default name */}
                    {errorMessage && visitValues[instanceId] === "Visit Website" && openCardCounts.visit > 1 && (
                      <p className="text-red-500 text-xs mt-1 ml-[calc(16.67%+0.75rem)]">{errorMessage}</p>
                    )}
                  </div>
                ))}

                {/* Call phone option cards */}
                {cardInstances.call.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="mt-4 bg-white shadow-lg rounded-xl p-4 border border-gray-200 relative"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("call", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="mt-4 flex gap-3 justify-between">
                      <label className="w-1/4 block text-sm font-semibold mb-1">Type of action</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Button text</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Country</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Phone Number</label>
                    </div>
                    <div className="mt-4 flex gap-3 justify-between">
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-1/4"
                      >
                        <option value="">Call Phone</option>
                        <option value="static">custom</option>
                        <option value="dynamic">visit</option>
                      </select>
                      <div className="relative w-1/4">
                        <input
                          type="text"
                          maxLength={maxButtonPhoneLength}
                          value={callValue}
                          onChange={(e) => setCallValue(e.target.value)}
                          className="border rounded-lg p-2 pr-16 w-full"
                          placeholder="Call Phone number"
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {callValue.length}/{maxButtonPhoneLength}
                        </div>
                      </div>
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-1/4"
                      >
                        <option value="">UK</option>
                        <option value="static">US</option>
                        <option value="dynamic">USA</option>
                      </select>
                      <div className="relative w-1/4">
                        <input
                          type="number"
                          value={callValues}
                          maxLength={maxPhoneNumberLength}
                          onChange={(e) => setCallValue(e.target.value)}
                          className="border rounded-lg p-2 pr-16 w-full"
                          placeholder=""
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {callValues.length}/{maxPhoneNumberLength}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Flow option cards */}
                {cardInstances.flow.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="mt-4 bg-white shadow-lg rounded-xl p-4 border border-gray-200 relative"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("flow", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="mt-4 flex gap-3 justify-between">
                      <label className="w-1/4 block text-sm font-semibold mb-1">Type of action</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Button icon</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Button text</label>
                    </div>
                    <div className="mt-4 flex gap-3 justify-between">
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-3/4"
                      >
                        <option value="">Flow</option>
                        <option value="static">custom</option>
                        <option value="dynamic">call</option>
                      </select>
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-3/4"
                      >
                        <option value="">Review</option>
                        <option value="static">Document</option>
                        <option value="dynamic">Promotion</option>
                        <option value="dynamic">Review</option>
                      </select>
                      <input
                        type="text"
                        value={viewValue}
                        onChange={(e) => setViewValue(e.target.value)}
                        className="border rounded-lg p-2 w-full"
                        placeholder="View flow"
                      />
                    </div>
                    <div className="mt-4 flex gap-3 justify-between">
                      <button className="p-3 hover:bg-white w-50 border flex justify-between ">
                        <Plus className="" /> Create new
                      </button>
                      <button className="p-3 hover:bg-white w-50 mr-80 border flex justify-between ">
                        <FileText className="mr-2" />
                        Use existing
                      </button>
                    </div>
                  </div>
                ))}

                {/* Copy code option cards */}
                {cardInstances.copy.map((instanceId) => (
                  <div
                    key={instanceId}
                    className="mt-4 bg-white shadow-lg rounded-xl p-4 border border-gray-200 relative"
                  >
                    <button
                      className="absolute right-2 top-1 text-gray-800 rounded-full w-3 h-3 shadow"
                      onClick={() => closeCard("copy", instanceId)}
                    >
                      ✕
                    </button>
                    <div className="mt-4 flex gap-3 justify-between">
                      <label className="w-1/4 block text-sm font-semibold mb-1">Type of action</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Button text</label>
                      <label className="w-1/4 block text-sm font-semibold mb-1">Offer code</label>
                    </div>
                    <div className="mt-4 flex gap-3 justify-between">
                      <select
                        value={selectedDropdown}
                        onChange={(e) => setSelectedDropdown(e.target.value)}
                        className="border rounded-lg p-2 w-78"
                      >
                        <option value="">Copy code</option>
                        <option value="static">custom</option>
                        <option value="dynamic">call phone</option>
                        <option value="dynamic">visit</option>
                      </select>
                      <input
                        value={copyCode}
                        onChange={(e) => setCopyCode(e.target.value)}
                        className="border rounded-lg p-1 w-80"
                        placeholder="Copy code"
                        disabled
                      />
                      <div className="relative w-1/4">
                        <input
                          type="text"
                          value={copyCodes}
                          maxLength={maxCopyCodeLength}
                          onChange={(e) => setCopyCodes(e.target.value)}
                          className="border rounded-lg p-2 pr-1 w-full"
                          placeholder="Enter sample"
                        />
                        <div className="absolute bottom-1.5 right-2 text-xs text-gray-400 pointer-events-none">
                          {copyCodes.length}/{maxCopyCodeLength}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case 3:
        return (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Submit for Review</h1>
            <p className="text-gray-600 mb-4 text-sm">
              Choose the category that best describes your message template. Then select the type of message you want to
              send.
            </p>

            <div className="flex justify-start text-sm mb-96"></div>
          </div>
        )
      default:
        return null
    }
  }

  // Function to render the phone preview content based on the template being created
  const renderPhonePreview = () => {
    if (activeStep !== 2) {
      return (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Start typing a message to see the preview...</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 bg-white shadow rounded-xl p-3 w-full mt-4">
          {/* Header content based on selection */}
          <div className="bg-white p-2 rounded-lg self-start max-w-[80%]">
            {headerOption === "text" && (
              <>
                {headerText ? (
                  <>
                    <div className="bg-gray-200 p-2 rounded-sm max-w-full">
                      <p className="text-sm md:text-lg">{getProcessedHeaderText(headerText)}</p>
                    </div>
                    <hr className="border-gray-400 w-full mt-1" />
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <PencilLine className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">Text header will appear here</span>
                  </div>
                )}
              </>
            )}

            {headerOption === "image" && (
              <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%]">
                {headerImage ? (
                  <img
                    src={headerImage || "/placeholder.svg"}
                    alt="Header"
                    className="rounded-md w-full h-auto max-h-32 object-cover"
                    onClick={() => showFullscreenPreview(headerImage)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-500 mt-2">Video will appear here</span>
                  </div>
                )}
              </div>
            )}

            {headerOption === "document" && (
              <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%] flex items-center gap-2">
                {headerDocument ? (
                  <>
                    <div className="bg-gray-200 p-1 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm truncate">{headerDocument}</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Document will appear here</span>
                  </div>
                )}
              </div>
            )}

            {headerOption === "location" && (
              <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%] flex items-center gap-2">
                {locationName ? (
                  <>
                    <div className="bg-gray-200 p-1 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{locationName}</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Location will appear here</span>
                  </div>
                )}
              </div>
            )}
            {/* <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%]"> */}
            {/* Body content */}
            {bodyText && (
              // <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%]">
              <p
                className="mt-1 p-1 text-xs md:text-sm"
                dangerouslySetInnerHTML={{ __html: getProcessedText(bodyText) }}
              ></p>
              // </div>
            )}
            {footer && (
              <>
                {/* <div className="bg-white p-2 rounded-lg shadow-sm self-start max-w-[80%]"> */}
                {/* <hr className="mt-9"/> */}
                <p className="text-xs text-end mt-3 p-1 text-gray-500">{footer}</p>
                {/* </div> */}
              </>
            )}
          </div>
          <hr />
          {/* <div className="flex items-center gap-2 bg-white shadow rounded-xl p-3 max-w-xs"> */}

          {/* Replace the existing button rendering code with this */}
          {visibleButtons.map((btn, index) => (
            <div key={index}>
              {btn.type === "visit" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <SquareArrowOutUpRight className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{visitValues[btn.id] || "Visit Website"}</span>
                </div>
              )}

              {btn.type === "custom" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <CornerUpLeft className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{customValues[btn.id] || "Quick Reply"}</span>
                </div>
              )}

              {btn.type === "marketing" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <CornerUpLeft className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{getMarketValue(marketValue)}</span>
                </div>
              )}

              {btn.type === "call" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <PhoneCall className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{getCallValue(callValue)}</span>
                </div>
              )}

              {btn.type === "flow" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <NotepadText className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{getViewValue(viewValue)}</span>
                </div>
              )}

              {btn.type === "copy" && (
                <div className="flex items-center gap-2 bg-white shadow rounded-xl p-2 md:p-3 w-full">
                  <Copy className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm text-gray-800">{getCopyCode(copyCode)}</span>
                </div>
              )}
            </div>
          ))}

          {hasMoreButtons && !showAll && (
            <button
              className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 shadow rounded-xl p-2 md:p-3 w-full"
              onClick={() => setShowAll(true)}
            >
              <span className="text-xs md:text-sm">See all options ({buttons.length - MAX_PREVIEW_BUTTON} more)</span>
            </button>
          )}

          {showAll && buttons.length > 2 && (
            <button
              className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 shadow rounded-xl p-2 md:p-3 w-full"
              onClick={() => setShowAll(false)}
            >
              <span className="text-xs md:text-sm">Show less</span>
            </button>
          )}

          {/* Template name */}
          {templateName && (
            <div className="text-center text-xs text-gray-500 my-1">
              <p>Template: {templateName}</p>
            </div>
          )}

          {/* If no content is added yet */}
          {!headerOption && !bodyText && !visitValues && (
            <div className="text-center text-xs md:text-sm text-gray-500">
              <p>Add content to your template to see the preview</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 mt-2 md:mt-6 h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start h-[calc(100%-80px)]">
        {/* Leftside */}
        <div className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto h-full pr-0 md:pr-4">
          <div className="bg-white rounded-2xl shadow p-6">
            {/* Horizontal Line & Steps */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="relative flex items-center justify-between">
                <div className="absolute top-5 left-0 right-0 h-0.5 z-0 flex">
                  <div className={`flex-1 h-0.5 ${activeStep >= 2 ? "bg-cyan-500" : "bg-gray-300"}`} />
                  <div className={`flex-1 h-0.5 ${activeStep >= 3 ? "bg-cyan-500" : "bg-gray-300"}`} />
                </div>
                <div className="relative z-10 flex flex-1 justify-between">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="group flex flex-col items-center hover:text-cyan-500"
                    >
                      <div
                        className={`bg-white rounded-full p-2 border ${activeStep === 1 ? "text-cyan-500 border-cyan-500" : "text-gray-400 group-hover:text-cyan-500 group-hover:border-cyan-500"}`}
                      >
                        <LandPlot className="w-5 h-5" />
                      </div>
                      <span
                        className={`mt-2 text-sm ${activeStep === 1 ? "text-cyan-500" : "text-gray-700 group-hover:text-cyan-500"}`}
                      >
                        Set up template
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="group flex flex-col items-center hover:text-cyan-500"
                    >
                      <div
                        className={`bg-white rounded-full p-2 border ${activeStep === 2 ? "text-cyan-500 border-cyan-500" : "text-gray-400 group-hover:text-cyan-500 group-hover:border-cyan-500"}`}
                      >
                        <PencilLine className="w-5 h-5" />
                      </div>
                      <span
                        className={`mt-2 text-sm ${activeStep === 2 ? "text-cyan-500" : "text-gray-700 group-hover:text-cyan-500"}`}
                      >
                        Template Details
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="group flex flex-col items-center hover:text-cyan-500"
                    >
                      <div
                        className={`bg-white rounded-full p-2 border ${activeStep === 3 ? "text-cyan-500 border-cyan-500" : "text-gray-400 group-hover:text-cyan-500 group-hover:border-cyan-500"}`}
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span
                        className={`mt-2 text-sm ${activeStep === 3 ? "text-cyan-500" : "text-gray-700 group-hover:text-cyan-500"}`}
                      >
                        Submit for Review
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            {renderStepContent()}
          </div>
        </div>

        {/* Right-side Phone Preview */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center items-start h-full overflow-y-auto aspect-auto">
          <div className="bg-white p-2 w-full rounded-2xl shadow-xl border overflow-hidden">
            <h1 className="text-center text-base font-semibold mb-2">Template Preview</h1>
            <div className="bg-black w-full max-w-[320px] mx-auto aspect-[9/19] rounded-3xl shadow-lg p-1 flex flex-col">
              {/* Header */}
              <div className="bg-green-800 rounded-t-2xl px-2 py-2 flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold text-xs sm:text-sm">Priya</div>
                  <div className="text-green-200 text-[8px] sm:text-[10px]">Online</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Video className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                  <Phone className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                  <EllipsisVertical className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Chat Content */}
              <div className="bg-[#f0f0f0] flex-1 w-full rounded-b-2xl p-2 text-xs text-gray-800 flex flex-col justify-between">
                <div className="flex flex-col gap-1 overflow-y-auto h-full pr-1">{renderPhonePreview()}</div>

                {/* Input */}
                <div className="mt-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md">
                  <button className="text-gray-600">
                    <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-transparent text-xs outline-none"
                  />
                  <button className="text-white bg-gray-500 rounded-full p-1">
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between mt-20 sticky bottom-0 bg-white p-4 w-full">
        {activeStep === 1 ? (
          <>
            <button className="bg-gray-200 p-2 px-4 rounded-lg text-gray-700 hover:bg-gray-300" onClick={handleDiscard}>
              Discard
            </button>
            <button className="bg-blue-500 p-2 px-4 rounded-lg text-white hover:bg-blue-600" onClick={handleNextClick}>
              Next
            </button>
          </>
        ) : activeStep === 2 ? (
          <>
            <div className="flex justify-between items-center gap-2 mt-4 ml-auto w-full">
              <button
                className="bg-gray-200 p-2 px-4 rounded-lg text-gray-700 hover:bg-gray-300"
                onClick={handlePreviousClick}
              >
                Previous
              </button>

              <button
                className={`${!bodyText.trim() ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} p-2 px-4 rounded-lg text-white`}
                onClick={() => setShowModals(true)}
                disabled={!bodyText.trim()}
              >
                Submitting
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className="bg-gray-200 p-2 px-4 rounded-lg text-gray-700 hover:bg-gray-300"
              onClick={handlePreviousClick}
            >
              Previous
            </button>
            <button className="bg-green-500 p-2 px-4 rounded-lg text-white hover:bg-green-600">Submit</button>
          </>
        )}
      </div>

      {showModal && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to go to the previous step? Any unsaved changes will be lost.</p>
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={closeModal}>
                Continue
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  closeModal()
                  setActiveStep(1)
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {showModals && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-md  max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Confirm which languages you're submitting</h2>
            <p className="mb-4 text-sm">
              If you choose not to submit a completed language now, it will not be saved and you'll lose the content.
            </p>
            <p>English Required fields complete</p>
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" onClick={closeModals}>
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  closeModals()
                  setActiveStep(3)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateTemp
