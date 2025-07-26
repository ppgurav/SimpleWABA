// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Activity, Send, CheckCircle, Eye, XCircle } from "lucide-react";

// function CampaignReport() {
//   const { id } = useParams();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["campaign", id],
//     queryFn: async () => {
//       const accessToken =
//         sessionStorage.getItem("auth_token") ||
//         "Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7";

//       const response = await axios.get(
//         `https://waba.mpocket.in/api/campaign/report/${id}?accessToken=${accessToken}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       return response.data;
//     },
//   });

//   if (isLoading) return <div className="p-6">Loading report...</div>;
//   if (error) return <div className="p-6 text-red-500">Failed to load campaign report.</div>;

//   const campaign = data?.report?.static_data || {};
//   const statusCounts = data?.report?.status_counts || {};
//   const dynamicData = data?.report?.dynamic_data || [];

//   const {
//     campaign_name,
//     campaign_description,
//     campaign_status,
//     campaign_created_at,
//     campaign_updated_at,
//     campaign_template,
//     campaign_parameters,
//   } = campaign;

//   const sent_messages = statusCounts.sent || 0;
//   const delivered_messages = statusCounts.delivered || 0;
//   const read_messages = statusCounts.read || 0;
//   const failed_messages = statusCounts.failed || 0;

//   const total_messages = sent_messages + delivered_messages + read_messages + failed_messages;
//   const totalActive = sent_messages + delivered_messages + read_messages;

//   return (
//     <div className="w-full h-screen overflow-y-auto bg-gray-50 p-10 mt-5">
//       <div className="w-full bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-semibold mb-6">
//           Campaign Report for ID: <span className="text-gray-700">{id}</span>
//         </h2>

//         <div className="grid grid-cols-2 gap-4 mb-8 border p-10 rounded-lg">
//           <div><strong>Campaign Name:</strong> {campaign_name || "—"}</div>
//           <div><strong>Created At:</strong> {campaign_created_at || "—"}</div>
//           <div><strong>Description:</strong> {campaign_description || "—"}</div>
//           <div><strong>Updated At:</strong> {campaign_updated_at || "—"}</div>
//           <div><strong>Total Messages:</strong> {total_messages || 0}</div>
//           <div><strong>Template:</strong> {campaign_template || "—"}</div>
//           <div><strong>Status:</strong> {campaign_status || "—"}</div>
//           <div><strong>Parameters:</strong> {campaign_parameters || "—"}</div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-9">
//           <div className="relative bg-gradient-to-br from-blue-500 to-blue-300 text-white p-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
//             <div className="text-xl font-bold text-center">{totalActive}</div>
//             <div className="text-sm text-center">Total Active Messages<br />(Sent + Delivered + Read)</div>
//             <Activity className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
//           </div>

//           <div className="relative bg-gradient-to-br from-teal-200 to-teal-600 text-white p-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
//             <div className="text-xl font-bold text-center">
//               {sent_messages} ({((sent_messages / (total_messages || 1)) * 100).toFixed(2)}%)
//             </div>
//             <div className="text-sm text-center">Sent Messages</div>
//             <Send className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
//           </div>

//           <div className="relative bg-gradient-to-br from-green-200 to-green-300 text-white p-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
//             <div className="text-xl font-bold text-center">
//               {delivered_messages} ({((delivered_messages / (total_messages || 1)) * 100).toFixed(2)}%)
//             </div>
//             <div className="text-sm text-center">Delivered Messages</div>
//             <CheckCircle className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
//           </div>

//           <div className="relative bg-gradient-to-br from-yellow-200 to-yellow-300 text-white p-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
//             <div className="text-xl font-bold text-center">
//               {read_messages} ({((read_messages / (total_messages || 1)) * 100).toFixed(2)}%)
//             </div>
//             <div className="text-sm text-center">Read Messages</div>
//             <Eye className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
//           </div>

//           <div className="relative bg-gradient-to-br from-red-200 to-red-500 text-white p-10 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
//             <div className="text-xl font-bold text-center">
//               {failed_messages} ({((failed_messages / (total_messages || 1)) * 100).toFixed(2)}%)
//             </div>
//             <div className="text-sm text-center">Failed Messages</div>
//             <XCircle className="absolute bottom-4 right-4 w-8 h-8 opacity-50" />
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4">Message Details</h3>
//           <div className="flex flex-wrap gap-4 mb-10">
//             <button className="bg-gradient-to-br from-red-200 to-red-500  text-white px-10 py-4 rounded-lg transform hover:scale-105 transition duration-300">Export Failed Messages</button>
//             <button className="bg-gradient-to-br from-teal-200 to-teal-500 text-white px-10 py-4 rounded-lg transform hover:scale-105 transition duration-300">Export Sent Messages</button>
//             <button className="bg-gradient-to-br from-green-200 to-green-600 text-white px-10 py-4 rounded-lg">Export Delivered Messages</button>
//             <button className="bg-gradient-to-br from-yellow-200 to-yellow-500 text-white px-10 py-4 rounded-lg">Export Read Messages</button>
//             <button className="bg-gradient-to-br from-gray-200 to-gray-800 text-white px-10 py-4 rounded-lg">Download Complete Report</button>
//             <button className="bg-gradient-to-br from-blue-200 to-blue-600 text-white px-10 py-4 rounded-lg">📩 Share Campaign Summary</button>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
//               <div className="mb-2 sm:mb-0">
//                 <label className="text-sm text-gray-600 mr-2">Show</label>
//                 <select className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//                 <span className="ml-2 text-sm text-gray-600">entries</span>
//               </div>

//               <div className="relative w-full sm:w-1/3">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
//                 />
//                 <svg
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </div>

//             <table className="min-w-full text-sm border rounded overflow-hidden">
//               <thead>
//                 <tr className="bg-gray-100 text-left text-gray-700">
//                   <th className="px-4 py-2 border">Phone Number</th>
//                   <th className="px-4 py-2 border">Status</th>
//                   <th className="px-4 py-2 border">Send At</th>
//                   <th className="px-4 py-2 border">Sent Time</th>
//                   <th className="px-4 py-2 border">Delivered Time</th>
//                   <th className="px-4 py-2 border">Read Time</th>
//                   <th className="px-4 py-2 border">Error Info</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dynamicData.length === 0 ? (
//                   <tr className="text-gray-700">
//                     <td className="px-4 py-2 border text-center" colSpan="7">No data available</td>
//                   </tr>
//                 ) : (
//                   dynamicData.map((item, index) => (
//                     <tr key={index} className="text-gray-700">
//                       <td className="px-4 py-2 border">{item.recipient_id || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.status || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.timestamp || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.sent_ts || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.delivered_ts || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.read_ts || "N/A"}</td>
//                       <td className="px-4 py-2 border">{item.error_info || "N/A"}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             <div className="flex justify-between items-center mt-4 px-2">
//               <div className="text-sm text-gray-600">Showing 1 to {dynamicData.length} of {dynamicData.length} entries</div>
//               <div className="flex space-x-1">
//                 <button className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">Previous</button>
//                 <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">1</button>
//                 <button className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300">Next</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CampaignReport;
