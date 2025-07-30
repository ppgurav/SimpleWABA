// import { useState, useRef } from "react"
// import { z } from "zod"
// import { Calendar, EllipsisVertical, Mic, Phone, Smile, Upload, Video } from "lucide-react"
// const campaignSchema = z
//   .object({
//     campaignName: z.string().min(1, "Campaign name is required"),
//     template: z.string().min(1, "Template selection is required"),
//     templateVariables: z.record(z.string()).optional(),
//     sendingMethod: z.string().min(1, "Sending method is required"),
//     dataType: z.string().min(1, "Data type is required"),
//     rawData: z.string().optional(),
//     numberGroup: z.string().optional(),
//     segment: z.string().optional(),
//     excelFile: z.instanceof(File).optional(),
//     schedulingOption: z.enum(["immediately", "later"]),
//     scheduledDate: z.date().optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.dataType === "rawData") return !!data.rawData
//       if (data.dataType === "groupContact") return !!data.numberGroup
//       if (data.dataType === "tagSegment") return !!data.segment
//       if (data.dataType === "excel") return !!data.excelFile
//       return true
//     },
//     {
//       message: "Please provide the required data for the selected data type",
//       path: ["dataType"],
//     },
//   )

// export default function CampaignCreate() {
//   const [formData, setFormData] = useState({
//     campaignName: "",
//     template: "",
//     templateVariables: {},
//     sendingMethod: "raw",
//     rawData: "",
//     numberGroup: "",
//     segment: "static",
//     excelFile: null,
//     schedulingOption: "immediately",
//     scheduledDate: null,
//     dataType: "rawData", // Add this new property
//   })

//   const [errors, setErrors] = useState({})
//   const [selectedTemplate, setSelectedTemplate] = useState(null)
//   const fileInputRef = useRef(null)

//   // Mock templates data
//   const templates = [
//     {
//       id: "1",
//       name: "Welcome Message",
//       type: "text",
//       content: `Hello {{1}},\n\nWelcome to our platform.\n\nThanks & Regards,\nThe Team`,
//       variables: ["name"],
//     },
//     {
//       id: "2",
//       name: "Promotion",
//       type: "image",
//       content: "Check out our latest offer {{1}}!",
//       variables: ["offer"],
//       mediaUrl: "/waba logo 18-04-2025 (1).svg?height=200&width=300",
//     },
//     {
//       id: "3",
//       name: "Newsletter",
//       type: "document",
//       content: "Here's your {{1}} newsletter",
//       variables: ["month"],
//       mediaUrl: "/placeholder.svg?height=200&width=300",
//     },
//     { id: "4", name: "Welcome Message", type: "text", content: "Welcome {{1}} to our service!", variables: ["name"] },
//     { id: "5", name: "Welcome Message", type: "text", content: "Welcome {{1}} to our service!", variables: ["name"] },
//   ]

//   // Mock number groups
//   const numberGroups = [
//     { id: "1", name: "Customers" },
//     { id: "2", name: "Subscribers" },
//     { id: "3", name: "Leads" },
//   ]

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })

//     // Clear error for this field if it exists
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null,
//       })
//     }
//   }

//   const handleTemplateChange = (e) => {
//     const templateId = e.target.value
//     setFormData({
//       ...formData,
//       template: templateId,
//       templateVariables: {},
//     })

//     const template = templates.find((t) => t.id === templateId)
//     setSelectedTemplate(template)
//     if (template && template.variables) {
//       const initialVariables = {}
//       template.variables.forEach((variable) => {
//         initialVariables[variable] = ""
//       })
//       setFormData((prev) => ({
//         ...prev,
//         templateVariables: initialVariables,
//       }))
//     }
//   }
//   const handleVariableChange = (variable, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       templateVariables: {
//         ...prev.templateVariables,
//         [variable]: value,
//       },
//     }))
//   }
//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({
//         ...formData,
//         excelFile: e.target.files[0],
//       })
//     }
//   }
//   const handleSchedulingChange = (option) => {
//     setFormData({
//       ...formData,
//       schedulingOption: option,
//       scheduledDate: option === "immediately" ? null : formData.scheduledDate,
//     })
//   }
//   const handleDateChange = (e) => {
//     setFormData({
//       ...formData,
//       scheduledDate: new Date(e.target.value),
//     })
//   }
//   const handleDataTypeChange = (type) => {
//     setFormData({
//       ...formData,
//       dataType: type,
//     })
//   }
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     try {
//       const dataToValidate = {
//         ...formData,
//         rawData: formData.dataType === "rawData" ? formData.rawData : undefined,
//         numberGroup: formData.dataType === "groupContact" ? formData.numberGroup : undefined,
//         segment: formData.dataType === "tagSegment" ? formData.segment : undefined,
//         excelFile: formData.dataType === "excel" ? formData.excelFile : undefined,
//         scheduledDate: formData.schedulingOption === "later" ? formData.scheduledDate || new Date() : undefined,
//       }
//       campaignSchema.parse(dataToValidate)
//       console.log("Form submitted:", formData)
//       alert("Campaign created successfully!")
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const formattedErrors = {}
//         error.errors.forEach((err) => {
//           formattedErrors[err.path[0]] = err.message
//         })
//         setErrors(formattedErrors)
//         console.error("Validation errors:", formattedErrors)
//       } else {
//         console.error("Form submission error:", error)
//       }
//     }
//   }
//   const getPreviewContent = () => {
//     if (!selectedTemplate) return ""
//     let content = selectedTemplate.content
//     if (selectedTemplate.variables) {
//       selectedTemplate.variables.forEach((variable, index) => {
//         const value = formData.templateVariables[variable] || `{{${index + 1}}}`
//         content = content.replace(`{{${index + 1}}}`, value)
//       })
//     }
//     return content
//   }
//   return (
//     <form onSubmit={handleSubmit} className=" bg-white rounded-lg shadow-md p-6 mt-12 min-h-screen md:min-h-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
//         <div className="space-y-6 ">
//           <div>
//             <h2 className="text-lg font-semibold mb-4 mt-2">Campaign Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1 ">
//                   Template
//                 </label>
//                 <select
//                   id="template"
//                   name="template"
//                   value={formData.template}
//                   onChange={handleTemplateChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
//                 >
//                   <option value="">Select a template</option>
//                   {templates.map((template) => (
//                     <option key={template.id} value={template.id}>
//                       {template.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.template && <p className="mt-1 text-sm text-red-600">{errors.template}</p>}
//               </div>

//               {/* Template Variables */}
//               {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
//                 <div className="space-y-3">
//                   {selectedTemplate.variables.map((variable, index) => (
//                     <div key={variable}>
//                       <label htmlFor={`var-${variable}`} className="block text-sm text-gray-600 mb-1 ">
//                         {`Value for {{${index + 1}}}`}
//                       </label>
//                       <input
//                         type="text"
//                         id={`var-${variable}`}
//                         value={formData.templateVariables[variable] || ""}
//                         onChange={(e) => handleVariableChange(variable, e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder={`Enter value for ${variable}`}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div>
//               <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1 mt-6">
//                 Campaign Name
//               </label>
//               <input
//                 type="text"
//                 id="campaignName"
//                 name="campaignName"
//                 value={formData.campaignName}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
//                 // placeholder="Enter campaign name"
//               />
//               {errors.campaignName && <p className="mt-1 text-sm text-red-600">{errors.campaignName}</p>}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Data Type</h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex space-x-4">
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       id="dataTypeRaw"
//                       name="dataType"
//                       checked={formData.dataType === "rawData"}
//                       onChange={() => handleDataTypeChange("rawData")}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <label htmlFor="dataTypeRaw" className="ml-2 block text-sm text-gray-700">
//                       Raw Data
//                     </label>
//                   </div>
//                   <div className="flex items-center mt-2">
//                     <input
//                       type="radio"
//                       id="dataTypeGroup"
//                       name="dataType"
//                       checked={formData.dataType === "groupContact"}
//                       onChange={() => handleDataTypeChange("groupContact")}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <label htmlFor="dataTypeGroup" className="ml-2 block text-sm text-gray-700 ">
//                       Group Contact
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       id="dataTypeSegment"
//                       name="dataType"
//                       checked={formData.dataType === "tagSegment"}
//                       onChange={() => handleDataTypeChange("tagSegment")}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <label htmlFor="dataTypeSegment" className="ml-2 block text-sm text-gray-700">
//                       Tag/Segment
//                     </label>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       type="radio"
//                       id="dataTypeExcel"
//                       name="dataType"
//                       checked={formData.dataType === "excel"}
//                       onChange={() => handleDataTypeChange("excel")}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <label htmlFor="dataTypeExcel" className="ml-2 block text-sm text-gray-700">
//                       Excel
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Conditional content based on data type selection */}
//           <div className="mt-4">
//             {formData.dataType === "rawData" && (
//               <div>
//                 <label htmlFor="rawData" className="block text-lg font-medium text-gray-700 mb-1 mt-5">
//                   Enter Data (format: name,mobileNumber)
//                 </label>
//                 <textarea
//                   id="rawData"
//                   name="rawData"
//                   value={formData.rawData}
//                   onChange={handleInputChange}
//                   rows={4}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder=" Name,1234567890"
//                 ></textarea>
//                 {errors.rawData && <p className="mt-1 text-sm text-red-600">{errors.rawData}</p>}
//               </div>
//             )}

//             {formData.dataType === "groupContact" && (
//               <div>
//                 <label htmlFor="numberGroup" className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Group
//                 </label>
//                 <select
//                   id="numberGroup"
//                   name="numberGroup"
//                   value={formData.numberGroup}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select a group</option>
//                   {numberGroups.map((group) => (
//                     <option key={group.id} value={group.id}>
//                       {group.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.numberGroup && <p className="mt-1 text-sm text-red-600">{errors.numberGroup}</p>}
//               </div>
//             )}

//             {formData.dataType === "tagSegment" && (
//               <div>
//                 <label htmlFor="segment" className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Segment
//                 </label>
//                 <select
//                   id="segment"
//                   name="segment"
//                   value={formData.segment}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select a segment</option>
//                   <option value="new">New Customers</option>
//                   <option value="active">Active Users</option>
//                   <option value="inactive">Inactive Users</option>
//                 </select>
//                 {errors.segment && <p className="mt-1 text-sm text-red-600">{errors.segment}</p>}
//               </div>
//             )}

//             {formData.dataType === "excel" && (
//               <div>
//                 <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-1">
//                   Upload Excel File
//                 </label>
//                 <div
//                   className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
//                   onClick={() => fileInputRef.current.click()}
//                   onDrop={(e) => {
//                     e.preventDefault()
//                     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//                       setFormData({
//                         ...formData,
//                         excelFile: e.dataTransfer.files[0],
//                       })
//                     }
//                   }}
//                   onDragOver={(e) => e.preventDefault()}
//                 >
//                   <Upload className="h-6 w-6 mx-auto text-gray-400" />
//                   <p className="mt-1 text-sm text-gray-500">
//                     {formData.excelFile ? formData.excelFile.name : "Click to upload or drag and drop"}
//                   </p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     id="excelFile"
//                     name="excelFile"
//                     accept=".xlsx,.xls,.csv"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </div>
//                 {errors.excelFile && <p className="mt-1 text-sm text-red-600">{errors.excelFile}</p>}
//               </div>
//             )}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold mb-4 mt-2">Scheduling Campaigns</h2>
//             <div className="space-y-4">
//               <div className="flex space-x-4">
//                 <div className="flex items-center">
//                   <input
//                     type="radio"
//                     id="sendImmediately"
//                     name="schedulingOption"
//                     checked={formData.schedulingOption === "immediately"}
//                     onChange={() => handleSchedulingChange("immediately")}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="sendImmediately" className="ml-2 block text-sm text-gray-700">
//                     Send immediatrly
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="radio"
//                     id="scheduleLater"
//                     name="schedulingOption"
//                     checked={formData.schedulingOption === "later"}
//                     onChange={() => handleSchedulingChange("later")}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="scheduleLater" className="ml-2 block text-sm text-gray-700">
//                     Schedule for Later
//                   </label>
//                 </div>
//               </div>
//               {formData.schedulingOption === "later" && (
//                 <div>
//                   <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Date and Time
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                       <Calendar className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="datetime-local"
//                       id="scheduledDate"
//                       name="scheduledDate"
//                       onChange={handleDateChange}
//                       className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         {/* Right-side Phone Preview */}
//         <div className="w-full flex justify-center items-start h-full">
//           <div className="bg-white p-4 rounded-2xl shadow-xl border">
//             <h1 className="text-center text-base font-semibold mb-2">Template Preview</h1>
//             <div className="bg-black w-[250px] h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl shadow-lg p-2 flex flex-col">
//               <div className="bg-green-800 rounded-t-2xl px-2 py-2 flex justify-between items-center">
//                 <div>
//                   <div className="text-white font-semibold text-sm">Priya</div>
//                   <div className="text-green-200 text-[10px]">Online</div>
//                 </div>
//                 <div className="flex items-center gap-1 ml-2">
//                   <Video className="text-white w-4 h-4" />
//                   <Phone className="text-white w-4 h-4" />
//                   <EllipsisVertical className="text-white w-4 h-4" />
//                 </div>
//               </div>
//               <div className="bg-[#f0f0f0] flex-1 w-full rounded-b-2xl p-2 text-xs text-gray-800 flex flex-col justify-between">
//                 {selectedTemplate ? (
//                   <div className="space-y-4">
//                     <div className="bg-white p-4 rounded-md border border-gray-200 min-h-[200px]">
//                       {selectedTemplate.type === "text" && (
//                         <div className="flex items-center p-3 bg-white rounded-md">
//                           <p
//                             className="text-gray-600 mb-4"
//                             dangerouslySetInnerHTML={{ __html: getPreviewContent().replace(/\n/g, "<br/>") }}
//                           />
//                         </div>
//                       )}
//                       {selectedTemplate.type !== "text" && selectedTemplate.mediaUrl && (
//                         <>
//                           <div className="mt-4">
//                             {selectedTemplate.type === "image" && (
//                               <img
//                                 src={
//                                   selectedTemplate.mediaUrl ||
//                                   "/Users/pravingurav/WebMarksss/my-project/public/waba logo 18-04-2025 (1).svg" ||
//                                   "/placeholder.svg" ||
//                                   "/placeholder.svg"
//                                 }
//                                 alt="Template media"
//                                 className="max-w-full h-auto rounded-md border border-gray-200"
//                               />
//                             )}
//                             <p className="text-gray-600 mb-4">{getPreviewContent()}</p>
//                             {selectedTemplate.type === "document" && (
//                               <div className="flex items-center p-3 bg-gray-100 rounded-md">
//                                 <div className="bg-white p-2 rounded mr-3">
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6 text-gray-500"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                     />
//                                   </svg>
//                                 </div>
//                                 <span className="text-sm text-gray-600">Document Preview</span>
//                               </div>
//                             )}
//                             {selectedTemplate.type === "video" && (
//                               <div className="relative pt-[56.25%] bg-gray-100 rounded-md">
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                   <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-12 w-12 text-gray-400"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                                     />
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                     />
//                                   </svg>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-white p-6 rounded-md border border-gray-200 flex flex-col items-center justify-center min-h-[300px] text-center">
//                     <div className="text-gray-400 mb-4"></div>
//                     <p className="text-gray-500 max-w-xs">Select a template from the dropdown to see a preview here.</p>
//                   </div>
//                 )}

//                 <div className="mt-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md">
//                   <button className="text-gray-600">
//                     <Smile className="w-4 h-4" />
//                   </button>
//                   <input
//                     type="text"
//                     // value={message}
//                     // onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message"
//                     className="flex-1 bg-transparent text-xs outline-none"
//                   />
//                   <button className="text-white bg-gray-500 rounded-full p-1">
//                     <Mic className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-start mt-6">
//         <button
//           type="submit"
//           className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Send Campaign
//         </button>
//       </div>
//     </form>
//   )
// }





import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import {
  Calendar,
  EllipsisVertical,
  Mic,
  Phone,
  Smile,
  Upload,
  Video,
} from "lucide-react"

const campaignSchema = z
  .object({
    campaignName: z.string().min(1, "Campaign name is required"),
    template: z.string().min(1, "Template selection is required"),
    templateVariables: z.record(z.string()).optional(),
    sendingMethod: z.string().min(1, "Sending method is required"),
    dataType: z.string().min(1, "Data type is required"),
    rawData: z.string().optional(),
    numberGroup: z.string().optional(),
    segment: z.string().optional(),
    excelFile: z.instanceof(File).optional(),
    schedulingOption: z.enum(["immediately", "later"]),
    scheduledDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.dataType === "rawData") return !!data.rawData
      if (data.dataType === "groupContact") return !!data.numberGroup
      if (data.dataType === "tagSegment") return !!data.segment
      if (data.dataType === "excel") return !!data.excelFile
      return true
    },
    {
      message: "Please provide the required data for the selected data type",
      path: ["dataType"],
    },
  )

export default function CampaignCreate() {
  const [formData, setFormData] = useState({
    campaignName: "",
    template: "",
    templateVariables: {},
    sendingMethod: "raw",
    rawData: "",
    numberGroup: "",
    segment: "static",
    excelFile: null,
    schedulingOption: "immediately",
    scheduledDate: null,
    dataType: "rawData",
  })

  const [errors, setErrors] = useState({})
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templates, setTemplates] = useState([])
  const fileInputRef = useRef(null)

  const numberGroups = [
    { id: "1", name: "Customers" },
    { id: "2", name: "Subscribers" },
    { id: "3", name: "Leads" },
  ]
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          "https://waba.mpocket.in/api/phone/get/message_templates/361462453714220?accessToken=Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7"
        )
        const result = await response.json()
        const formattedTemplates = (result.data || []).map((template) => {
          let type = "text"
          let mediaUrl = ""
          let content = ""
          let variables = []
        
          try {
            const components = JSON.parse(template.components || "[]")
            const bodyComponent = components.find((c) => c.type === "BODY")
            content = bodyComponent?.text || ""
        
            // Extract sample values from "example.body_text"
            const exampleValues = bodyComponent?.example?.body_text?.[0] || []
        
            // Match {{1}}, {{2}}, etc.
            const variableMatches = [...content.matchAll(/{{(\d+)}}/g)]
        
            variables = variableMatches.map((match, index) => ({
              key: `var${match[1]}`,
              label: exampleValues[index] || `Value for {{${match[1]}}}`
            }))
        
            // Handle header media
            const headerComponent = components.find((c) => c.type === "HEADER")
            if (headerComponent) {
              const format = (headerComponent.format || "").toUpperCase()
              const exampleUrl = headerComponent.example?.header_handle?.[0] || ""
        
              if (format === "IMAGE") {
                type = "image"
                mediaUrl = exampleUrl
              } else if (format === "VIDEO") {
                type = "video"
                mediaUrl = exampleUrl
              } else if (format === "DOCUMENT") {
                type = "document"
                mediaUrl = exampleUrl
              }
            }
          } catch (e) {
            console.error("Error parsing components:", e)
          }
        
          return {
            id: template.id,
            name: template.name,
            type,
            content,
            mediaUrl,
            variables // now array of objects: [{ key: 'var1', label: 'Sagar' }, ...]
          }
        })
        
        
        
  
        setTemplates(formattedTemplates)
      } catch (error) {
        console.error("Error fetching templates:", error)
      }
    }
  
    fetchTemplates()
  }, [])
  
 
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const handleTemplateChange = (e) => {
    const templateId = e.target.value
    const template = templates.find((t) => t.id === templateId)

    setFormData({
      ...formData,
      template: templateId,
      templateVariables: template?.variables.reduce((acc, key) => {
        acc[key] = ""
        return acc
      }, {}) || {},
    })

    setSelectedTemplate(template)
  }


  const handleVariableChange = (variable, value) => {
    setFormData((prev) => ({
      ...prev,
      templateVariables: {
        ...prev.templateVariables,
        [variable]: value,
      },
    }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, excelFile: e.target.files[0] })
    }
  }

  const handleSchedulingChange = (option) => {
    setFormData({
      ...formData,
      schedulingOption: option,
      scheduledDate: option === "immediately" ? null : formData.scheduledDate,
    })
  }

  const handleDateChange = (e) => {
    setFormData({ ...formData, scheduledDate: new Date(e.target.value) })
  }

  const handleDataTypeChange = (type) => {
    setFormData({ ...formData, dataType: type })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToValidate = {
        ...formData,
        rawData: formData.dataType === "rawData" ? formData.rawData : undefined,
        numberGroup: formData.dataType === "groupContact" ? formData.numberGroup : undefined,
        segment: formData.dataType === "tagSegment" ? formData.segment : undefined,
        excelFile: formData.dataType === "excel" ? formData.excelFile : undefined,
        scheduledDate:
          formData.schedulingOption === "later"
            ? formData.scheduledDate || new Date()
            : undefined,
      }
  
      campaignSchema.parse(dataToValidate)
  
      const sendData = new FormData()
      sendData.append("campaignName", formData.campaignName)
      sendData.append("template", formData.template)
      sendData.append("sendingMethod", formData.sendingMethod)
      sendData.append("dataType", formData.dataType)
      sendData.append("schedulingOption", formData.schedulingOption)
  
      if (formData.schedulingOption === "later" && formData.scheduledDate) {
        sendData.append("scheduledDate", formData.scheduledDate.toISOString())
      }
  
      sendData.append("templateVariables", JSON.stringify(formData.templateVariables))
  
      if (formData.dataType === "rawData") {
        sendData.append("rawData", formData.rawData)
      } else if (formData.dataType === "groupContact") {
        sendData.append("numberGroup", formData.numberGroup)
      } else if (formData.dataType === "tagSegment") {
        sendData.append("segment", formData.segment)
      } else if (formData.dataType === "excel" && formData.excelFile) {
        sendData.append("excelFile", formData.excelFile)
      }
  
      const accessToken =
        sessionStorage.getItem("auth_token") ||
        "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7";
  
      // 🚀 POST request with enhanced error handling
      const response = await fetch("https://waba.mpocket.in/api/store-campaign", {
        method: "POST",
        body: sendData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
  
      let resultText = await response.text()
      let result = {}
  
      try {
        result = JSON.parse(resultText)
      } catch (e) {
        console.error("Response is not valid JSON:", resultText)
      }
  
      if (!response.ok) {
        throw new Error(result.message || resultText || "Failed to create campaign")
      }
  
      console.log("Campaign created:", result)
      alert("Campaign created successfully!")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = {}
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message
        })
        setErrors(formattedErrors)
        console.error("Validation errors:", formattedErrors)
      } else {
        console.error("Form submission error:", error)
        alert(error.message || "An unexpected error occurred")
      }
    }
  }
  
  
const getPreviewContent = () => {
  if (!selectedTemplate) return ""
  let content = selectedTemplate.content
  if (selectedTemplate.variables) {
    selectedTemplate.variables.forEach((variable, index) => {
      const value = formData.templateVariables[variable] || `{{${index + 1}}}`
      content = content.replace(`{{${index + 1}}}`, value)
    })
  }
  return content
}
useEffect(() => {
  if (selectedTemplate) {
    console.log("Updated preview:", getPreviewContent())
  }
}, [formData.templateVariables, selectedTemplate])


console.log("selectedTemplate:", selectedTemplate);
console.log("Preview content:", getPreviewContent());


  return (
    <form onSubmit={handleSubmit} className=" bg-white rounded-lg shadow-md p-6 mt-12 min-h-screen md:min-h-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        <div className="space-y-6 ">
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-2">Campaign Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1 ">
                  Template
                </label>
                <select
                  id="template"
                  name="template"
                  value={formData.template}
                  onChange={handleTemplateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {errors.template && <p className="mt-1 text-sm text-red-600">{errors.template}</p>}
              </div>

              {/* Template Variables */}
              {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  {selectedTemplate?.mediaUrl && (
  <div className="mt-4">
    <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-1">
      Header Image URL:
    </label>
    <input
      type="text"
      id="mediaUrl"
      name="mediaUrl"
      value={selectedTemplate.mediaUrl}
      onChange={(e) => {
        const updatedTemplate = { ...selectedTemplate, mediaUrl: e.target.value }
        setSelectedTemplate(updatedTemplate)
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}

                  {selectedTemplate.variables.map((variable, index) => (
                    <div key={variable}>
                      <label htmlFor={`var-${variable}`} className="block text-sm text-gray-600 mb-1 ">
                        {`Value for {{${index + 1}}}`}
                      </label>
                      <input
                        type="text"
                        id={`var-${variable}`}
                        value={formData.templateVariables[variable] || ""}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`${variable}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1 mt-6">
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                // placeholder="Enter campaign name"
              />
              {errors.campaignName && <p className="mt-1 text-sm text-red-600">{errors.campaignName}</p>}
            </div>
          </div>
          <div>
            
            <h2 className="text-lg font-semibold mb-4">Data Type</h2>
            <div className="space-y-4">
              <div>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dataTypeRaw"
                      name="dataType"
                      checked={formData.dataType === "rawData"}
                      onChange={() => handleDataTypeChange("rawData")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dataTypeRaw" className="ml-2 block text-sm text-gray-700">
                      Raw Data
                    </label>
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="radio"
                      id="dataTypeGroup"
                      name="dataType"
                      checked={formData.dataType === "groupContact"}
                      onChange={() => handleDataTypeChange("groupContact")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dataTypeGroup" className="ml-2 block text-sm text-gray-700 ">
                      Group Contact
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dataTypeSegment"
                      name="dataType"
                      checked={formData.dataType === "tagSegment"}
                      onChange={() => handleDataTypeChange("tagSegment")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dataTypeSegment" className="ml-2 block text-sm text-gray-700">
                      Tag/Segment
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dataTypeExcel"
                      name="dataType"
                      checked={formData.dataType === "excel"}
                      onChange={() => handleDataTypeChange("excel")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dataTypeExcel" className="ml-2 block text-sm text-gray-700">
                      Excel
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional content based on data type selection */}
          <div className="mt-4">
            {formData.dataType === "rawData" && (
              <div>
                <label htmlFor="rawData" className="block text-lg font-medium text-gray-700 mb-1 mt-5">
                  Enter Data (format: name,mobileNumber)
                </label>
                <textarea
                  id="rawData"
                  name="rawData"
                  value={formData.rawData}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" Name,1234567890"
                ></textarea>
                {errors.rawData && <p className="mt-1 text-sm text-red-600">{errors.rawData}</p>}
              </div>
            )}

            {formData.dataType === "groupContact" && (
              <div>
                <label htmlFor="numberGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Group
                </label>
                <select
                  id="numberGroup"
                  name="numberGroup"
                  value={formData.numberGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a group</option>
                  {numberGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {errors.numberGroup && <p className="mt-1 text-sm text-red-600">{errors.numberGroup}</p>}
              </div>
            )}

            {formData.dataType === "tagSegment" && (
              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Segment
                </label>
                <select
                  id="segment"
                  name="segment"
                  value={formData.segment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a segment</option>
                  <option value="new">New Customers</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>
                {errors.segment && <p className="mt-1 text-sm text-red-600">{errors.segment}</p>}
              </div>
            )}

            {formData.dataType === "excel" && (
              <div>
                <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Excel File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => fileInputRef.current.click()}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setFormData({
                        ...formData,
                        excelFile: e.dataTransfer.files[0],
                      })
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.excelFile ? formData.excelFile.name : "Click to upload or drag and drop"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="excelFile"
                    name="excelFile"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {errors.excelFile && <p className="mt-1 text-sm text-red-600">{errors.excelFile}</p>}
              </div>
            )}
          </div>
          {/* Segment Options */}
<div>
  <h2 className="text-lg font-semibold mb-4 mt-2">Segment Options</h2>
  <div className="space-y-4">
    <div className="flex flex-col space-y-2">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="segmentOption"
          value="create"
          checked={formData.segmentOption === "create"}
          onChange={() => setFormData({ ...formData, segmentOption: "create" })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Create New Segment</span>
      </label>

      <label className="inline-flex items-center">
        <input
          type="radio"
          name="segmentOption"
          value="existing"
          checked={formData.segmentOption === "existing"}
          onChange={() => setFormData({ ...formData, segmentOption: "existing" })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Select Existing Segment</span>
      </label>
    </div>

    {formData.segmentOption === "create" && (
      <div className="mt-2">
        <label htmlFor="segmentName" className="block text-sm font-medium text-gray-700 mb-1">
          Segment Name:
        </label>
        <input
          type="text"
          id="segmentName"
          name="segmentName"
          value={formData.segmentName || ""}
          onChange={(e) =>
            setFormData({ ...formData, segmentName: e.target.value })
          }
          placeholder="Enter new segment name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )}
  </div>
</div>

          <div>
            <h2 className="text-lg font-semibold mb-4 mt-2">Scheduling Campaigns</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sendImmediately"
                    name="schedulingOption"
                    checked={formData.schedulingOption === "immediately"}
                    onChange={() => handleSchedulingChange("immediately")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sendImmediately" className="ml-2 block text-sm text-gray-700">
                    Send immediatrly
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="scheduleLater"
                    name="schedulingOption"
                    checked={formData.schedulingOption === "later"}
                    onChange={() => handleSchedulingChange("later")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="scheduleLater" className="ml-2 block text-sm text-gray-700">
                    Schedule for Later
                  </label>
                </div>
              </div>
              {formData.schedulingOption === "later" && (
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date and Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="scheduledDate"
                      name="scheduledDate"
                      onChange={handleDateChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Right-side Phone Preview */}
        <div className="w-full flex justify-center items-start h-full">
          <div className="bg-white p-4 rounded-2xl shadow-xl border">
            <h1 className="text-center text-base font-semibold mb-2">Template Preview</h1>
            <div className="bg-black w-[250px] h-[500px] md:h-[550px] lg:h-[600px] rounded-3xl shadow-lg p-2 flex flex-col">
              <div className="bg-green-800 rounded-t-2xl px-2 py-2 flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold text-sm">Priya</div>
                  <div className="text-green-200 text-[10px]">Online</div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Video className="text-white w-4 h-4" />
                  <Phone className="text-white w-4 h-4" />
                  <EllipsisVertical className="text-white w-4 h-4" />
                </div>
              </div>
              <div className="bg-[#f0f0f0] flex-1 w-full rounded-b-2xl p-2 text-xs text-gray-800 flex flex-col justify-between">
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-md border border-gray-200 min-h-[200px]">
                      {selectedTemplate.type === "text" && (
                        <div className="flex items-center p-3 bg-white rounded-md">
                          <p
                            className="text-gray-600 mb-4"
                            dangerouslySetInnerHTML={{ __html: getPreviewContent().replace(/\n/g, "<br/>") }}
                          />
                        </div>
                      )}
                      {selectedTemplate.type !== "text" && selectedTemplate.mediaUrl && (
                        
                        <>
                          <div className="mt-4">
                            {selectedTemplate?.type === "image" && selectedTemplate?.mediaUrl && (
                                <img
                                  src={selectedTemplate.mediaUrl}
                                  alt="Image Preview"
                                  className="w-full rounded-md mb-3 border"
                                />
                              )}
                            <p className="text-gray-600 mb-4">{getPreviewContent()}</p>
                            {selectedTemplate?.type === "document" && selectedTemplate?.mediaUrl && (
                                <a
                                  href={selectedTemplate.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline text-sm block mb-3"
                                >
                                  📄 View Document
                                </a>
                              )}
                            {selectedTemplate?.type === "video" && selectedTemplate?.mediaUrl && (
                              <video
                                controls
                                className="w-full rounded-md mb-3 border"
                                src={selectedTemplate.mediaUrl}
                              />
                              )}
                              

                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) 
                : (
                  <div className="bg-white p-6 rounded-md border border-gray-200 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <div className="text-gray-400 mb-4"></div>
                    <p className="text-gray-500 max-w-xs">Select a template from the dropdown to see a preview here.</p>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md">
                  <button className="text-gray-600">
                    <Smile className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    // value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 bg-transparent text-xs outline-none"
                  />
                  <button className="text-white bg-gray-500 rounded-full p-1">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send Campaign
        </button>
      </div>
    </form>
  )
}
