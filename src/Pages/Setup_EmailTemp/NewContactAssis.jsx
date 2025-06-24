import React, { useState } from 'react';

function NewContactAssis() {
  const [activeGroup, setActiveGroup] = useState('other'); 

  const renderGroupContent = () => {
    switch (activeGroup) {
      case 'other':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Company Name</div>
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Company Email</div>          
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Dark Logo</div>
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Light Logo</div>
            <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Base Url</div>
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Lead Status<h1 className="text-gray-400 text-sm">{`{lead_status}`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Lead Source<h1 className="text-gray-400 text-sm">{`{lead_source}`}</h1></div>          
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Lead Assigned<h1 className="text-gray-400 text-sm">{`{lead_assigned}`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact First Name<h1 className="text-gray-400 text-sm">{`{contact_first_name}`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact Last Name<h1 className="text-gray-400 text-sm">{`{contact_last_name}`}</h1></div>          
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact Company <h1 className="text-gray-400 text-sm">{`{contact_company}`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact Email<h1 className="text-gray-400 text-sm">{`{contact_email}`}</h1></div>
          <div className="p-1 border rounded bg-white hover:border-blue-600 text-sm">Contact Phone Number <h1 className="text-gray-400">{`{contact_phone_number}`}</h1></div>          
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact Websote<h1 className="text-gray-400 text-sm">{`{contact_websote}`}</h1> </div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Contact Type <h1 className="text-gray-400 text-sm">{`{contact_type }`}</h1></div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Assigned By<h1 className="text-gray-400 text-sm">{`{assigned_by}`}</h1></div>          


        </div>
        );
      case 'user':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">First Name</div>
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">Last Name</div>          
          <div className="p-4 border rounded bg-white hover:border-blue-600 text-sm">User Email</div>
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
        <div >
        <div className="flex flex-wrap gap-4 md:gap-10">
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Template Name</label>
    <input 
      type="text"
      placeholder="New Contact Assigned"
      className="p-2 w-60 rounded-lg border bg-gray-100 cursor-not-allowed"
      disabled
    />
  </div>
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Subject</label>
    <input 
      type="text"
      placeholder="📌 New Contact Assigned to You"
      className="p-2 w-60 rounded-lg border"
    />
  </div>
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
    onClick={() => setActiveGroup('contact')}
    className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg text-sm font-medium ${
      activeGroup === 'contact' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'
    }`}
  >
    Contact Group
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
  placeholder="Type your message here...">{`<p>Hi {first_name} {last_name},</p><p>A new contact has been assigned to you. Here are the details:</p><ul><li><strong>Contact Name:</strong> {contact_first_name} {contact_last_name}</li><li><strong>Email:</strong> {contact_email}</li><li><strong>Phone:</strong> {contact_phone_number}</li><li><strong>Assigned By:</strong> {assigned_by}</li></ul><p>Please reach out to them promptly and ensure a smooth follow-up.</p><p>If you have any questions, feel free to get in touch.</p><p><strong>Best regards,</strong><br>{site_name}</p>`}</textarea>

    </div>
  );
}

export default NewContactAssis;
