// import React from "react";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// import Dashboard from "./Pages/Dashboard";
// import ConnectWABA from "./Pages/ConnectWABA";
// import Contact from "./Pages/Contact";
// import Campaign from "./Pages/Marketing/Campaign";
// import MessageBot from "./Pages/Marketing/MessageBot";
// import TemplateBot from "./Pages/Marketing/TemplateBot";
// import Signup from "./Pages/Auth/Signup";
// import Login from "./Pages/Auth/Login";
// import Chat from "./Pages/Support/Chat";
// import Sidebar from "./Components/Sidebar";
// import Setup from "./Pages/Support/Setup";
// import Status from "./Pages/Setup/Status";
// import Source from "./Pages/Setup/Source";
// import AiPrompts from "./Pages/Setup/AiPrompts";
// import CannedReply from "./Pages/Setup/CannedReply";
// import EmailTemplate from "./Pages/Setup/EmailTemplate";
// import Email_confo from "./Pages/Setup_EmailTemp/Email_confo";
// import WelcomEmail from "./Pages/Setup_EmailTemp/WelcomEmail";
// import PasswordReset from "./Pages/Setup_EmailTemp/PasswordReset";
// import NewContactAssis from "./Pages/Setup_EmailTemp/NewContactAssis";
// import Container from "./Components/Container";
// import CreateTemp from "./Pages/Templatesss/CreateTemp";
// import Template from "./Pages/Template";
// import Segment from "./Pages/Contact/Segment";
// import Group from "./Pages/Contact/Group";
// import CampaignCreate from "./Pages/CampaignCreate/CampaignCreate";
// import ForgetPassword from "./Pages/Auth/ForgetPassword";
// import OTPValidation from "./Pages/Auth/OTPValidation";
// import ResetPassword from "./Pages/Auth/ResetPassword";
// import ProfilePage from "./Components/Profile";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//       <Route path="/" element={<Navigate  to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route
//           path="/*"
//           element={
//             <div className="flex h-screen bg-gray-100">
//               <Container />
//               <div className="p-4 flex-1 overflow-auto">
//                 <Routes>
                  
//                 <Route path="/forgot-password" element={<ForgetPassword />} />
//                 <Route path="/otp-validate" element={<OTPValidation />} />
//                 <Route path="/reset" element={<ResetPassword />} />
//                   <Route path="/dashboard" element={<Dashboard />} />
//                   <Route path="/connect" element={<ConnectWABA />} />
//                   <Route path="/contact" element={<Contact />} />
//                   <Route path="/temp" element={<Template />} />
//                   <Route path="/campaign" element={<Campaign />} />
//                   <Route path="/messBot" element={<MessageBot />} />
//                   <Route path="/tempBot" element={<TemplateBot />} />
//                   <Route path="/chat" element={<Chat />} />
                
//         <Route path="/setup" element={<Setup />}>
//           <Route path="status" element={<Status />} />
//           <Route path="source" element={<Source />} />
//           <Route path="AI" element={<AiPrompts/>} />
//           <Route path="canned" element={<CannedReply />} />
//           <Route path="emailtemp" element={<EmailTemplate />} />

//         </Route>
//         <Route path="em" element={<Email_confo />} />
//         <Route path="welcome-email" element={<WelcomEmail />} />
//         <Route path="password-reset" element={<PasswordReset />} />
//         <Route path="new-contact" element={<NewContactAssis />} />
//         <Route path="/temp/create" element={<CreateTemp />} />
//         <Route path="/campaign/create" element={<CampaignCreate />} />
//         <Route path="/contact/segment" element={<Segment />} /> 
        
//         <Route path="/contact/group" element={<Group />} /> 
//         <Route path="/profile" element={<ProfilePage />} /> 
//                 </Routes>
//               </div>
//             </div>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import ConnectWABA from "./Pages/ConnectWABA";
import Contact from "./Pages/Contact";
import Campaign from "./Pages/Marketing/Campaign";
import MessageBot from "./Pages/Marketing/MessageBot";
import TemplateBot from "./Pages/Marketing/TemplateBot";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import Chat from "./Pages/Support/Chat";
import Setup from "./Pages/Support/Setup";
import Status from "./Pages/Setup/Status";
import Source from "./Pages/Setup/Source";
import AiPrompts from "./Pages/Setup/AiPrompts";
import CannedReply from "./Pages/Setup/CannedReply";
import EmailTemplate from "./Pages/Setup/EmailTemplate";
import Email_confo from "./Pages/Setup_EmailTemp/Email_confo";
import WelcomEmail from "./Pages/Setup_EmailTemp/WelcomEmail";
import PasswordReset from "./Pages/Setup_EmailTemp/PasswordReset";
import NewContactAssis from "./Pages/Setup_EmailTemp/NewContactAssis";
import CreateTemp from "./Pages/Templatesss/CreateTemp";
import Template from "./Pages/Template";
import Segment from "./Pages/Contact/Segment";
import Group from "./Pages/Contact/Group";
import CampaignCreate from "./Pages/CampaignCreate/CampaignCreate";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import OTPValidation from "./Pages/Auth/OTPValidation";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ProfilePage from "./Components/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import Container from "./Components/Container";
import CampaignReport from "./Components/CampaignReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/otp-validate" element={<OTPValidation />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Container />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/connect" element={<ConnectWABA />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/temp" element={<Template />} />
            <Route path="/campaign" element={<Campaign />} />
            <Route path="/messBot" element={<MessageBot />} />
            <Route path="/tempBot" element={<TemplateBot />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/temp/create" element={<CreateTemp />} />
            <Route path="/campaign/create" element={<CampaignCreate />} />
            <Route path="/contact/segment" element={<Segment />} />
            <Route path="/contact/group" element={<Group />} />
            <Route path="/em" element={<Email_confo />} />
            <Route path="/welcome-email" element={<WelcomEmail />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/new-contact" element={<NewContactAssis />} />
            <Route path="/campaign/edit/:id" element={<CampaignReport />} />

            {/* Nested Setup Routes */}
            <Route path="/setup" element={<Setup />}>
              <Route path="status" element={<Status />} />
              <Route path="source" element={<Source />} />
              <Route path="AI" element={<AiPrompts />} />
              <Route path="canned" element={<CannedReply />} />
              <Route path="emailtemp" element={<EmailTemplate />} />
            </Route>
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
