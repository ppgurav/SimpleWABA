import React from 'react';
import dayjs from 'dayjs';

const ViewTemplateModal = ({ template, onClose }) => {
  if (!template) return null;

  // Parse the component_data JSON string
  const components = typeof template.component_data === 'string'
    ? JSON.parse(template.component_data)
    : template.component_data;

  const body = components.find(c => c.type === 'BODY');
  const bodyText = body?.text || '';
  const exampleValues = body?.example?.body_text?.[0] || [];

  // Replace {{1}}, {{2}}, etc., with corresponding example values
  const renderedText = bodyText.replace(/{{(\d+)}}/g, (match, index) => {
    const valueIndex = parseInt(index, 10) - 1;
    return exampleValues[valueIndex] || match;
  });

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">View Template</h2>

        {/* Message Box */}
        <div className="bg-green-50 border border-green-200 rounded-md p-5 text-gray-800 text-sm mb-6 whitespace-pre-wrap">
          {renderedText}
        </div>

        {/* Template Metadata */}
        <div className="space-y-1 text-sm text-gray-700 mb-6">
          <div><strong>Name:</strong> {template.name}</div>
          <div><strong>Language:</strong> {template.language}</div>
          <div><strong>Created:</strong> {dayjs(template.created_at).format('YYYY-MM-DD')}</div>
          <div><strong>Updated:</strong> {template.updated_at ? dayjs(template.updated_at).format('YYYY-MM-DD') : '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewTemplateModal;
