import React, { useState } from 'react';

function WelcomEmail() {
  const [activeGroup, setActiveGroup] = useState('other'); 

  const renderGroupContent = () => {
    switch (activeGroup) {
      case 'other':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Company Name<h1 className="text-gray-400 text-sm">{`{company_name}`}</h1></div>
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Company Email<h1 className="text-gray-400 text-sm">{`{company_email}`}</h1></div> 
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Dark Logo<h1 className="text-gray-400 text-sm">{`{dark_logo}`}</h1></div>
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Light Logo<h1 className="text-gray-400 text-sm">{`{light_logo}`}</h1></div>         
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Base Url<h1 className="text-gray-400 text-sm">{`{base_url}`}</h1></div>
          </div>
        );
      
      case 'user':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">First Name<h1 className="text-gray-400 text-sm">{`{first_name}`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Last Name<h1 className="text-gray-400 text-sm">{`{last_name}`}</h1></div>          
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">User Email<h1 className="text-gray-400 text-sm">{`{user_email}`}</h1></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white md:p-19 p-4 flex flex-col space-y-6 rounded-lg w-full md:w-5/7 h-auto border mt-20">
      
      <div>
        <h1 className="text-xl font-semibold">Email Template Editor</h1>
        <hr className="my-2 border-gray-300" />
        <div className="flex flex-wrap gap-4 md:gap-10">
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Template Name</label>
    <input 
      type="text"
      placeholder="Welcome Email"
      className="p-2 w-60 rounded-lg border bg-gray-100 cursor-not-allowed"
      disabled
    />
  </div>
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Subject</label>
    <input 
      type="text"
      placeholder={`Welcome to {site_name}!`}
      className="p-2 w-60 rounded-lg border"
    />
  </div>
</div>

      </div>

      <div className="border md:p-4 md:ml-1 p-4 flex flex-col space-y-4 rounded-lg w-full">
        <h2 className="text-base font-medium">Available Merge Fields</h2>
<div className="flex flex-wrap justify-between gap-1 bg-gray-200 p-1 rounded-lg">
  <button
    onClick={() => setActiveGroup('other')}
    className={`flex-1 min-w-[100px] px-2 py-2 rounded-lg text-sm font-medium ${
      activeGroup === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'
    }`}
  >
    Other Group
  </button>
  <button
    onClick={() => setActiveGroup('user')}
    className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-sm font-medium ${
      activeGroup === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'
    }`}
  >
    User Group
  </button>
</div>


        <div className="pt-4">{renderGroupContent()}</div>
      </div>

      <h1 className="text-lg font-semibold">Message</h1>
      
      <textarea
  className="text-gray-600 border border-gray-300 rounded px-3 py-2 w-full"
  rows="10"
  placeholder="Type your message here...">{`<p>Dear {first_name} {last_name},</p><p>Welcome to {site_name}! We're excited to have you on board. 🚀</p><p>Get ready to explore our amazing features and make your life easier.</p><p>If you have any questions, our support team at <a href="mailto:{company_email}">{company_email}</a> is always here to help.</p><p>Start your journey here: <a href="{base_url}">{base_url}</a></p><p>Looking forward to seeing you thrive!</p>`}</textarea>

    </div>
  );
}

export default WelcomEmail;
