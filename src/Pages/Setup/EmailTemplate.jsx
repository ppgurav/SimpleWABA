import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function EmailTemplate() {
  const [temp, setTemp] = useState([
    { id: 1, name: 'Email Confirmation', p: 'Email Confirmation', active: true, link: '/em' },
    { id: 2, name: 'Welcome Email', p: 'Welcome Email to', active: true, link: '/welcome-email' },
    { id: 3, name: 'Password Reset', p: 'Password Reset Request', active: true, link: '/password-reset' },
    { id: 4, name: 'New Contact Assigned', p: 'New Contact Assigned to you', active: true, link: '/new-contact' },
  ]);

  const toggleActive = (id) => {
    const updated = temp.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setTemp(updated);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-1  py-10">
      <div className="w-full max-w-8xl max-h-full mx-auto bg-white rounded-xl shadow border p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Template</h1>
        <div className="border-b border-gray-300" />

        <div className="space-y-4">
          {temp.map((item) => (
            <div
              key={item.id}
              className="w-full p-5 bg-white rounded-xl border shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link to={item.link} className="text-sm font-medium text-gray-800 hover:text-blue-500">
                  {item.name}
                </Link>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={() => toggleActive(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-400">{item.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
