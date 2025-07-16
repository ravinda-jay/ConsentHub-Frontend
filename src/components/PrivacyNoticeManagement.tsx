import React, { useState } from 'react';

const PrivacyNoticeManagement: React.FC = () => {
  const [notice, setNotice] = useState(
    'We value your privacy. Your data is processed in accordance with applicable laws and regulations. You can review, update, or withdraw your consent at any time.'
  );
  const [editing, setEditing] = useState(false);

  const handleSave = () => setEditing(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Notice Management</h1>
      <p className="mb-6">View and update your privacy notice.</p>
      {editing ? (
        <div>
          <textarea
            value={notice}
            onChange={e => setNotice(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            rows={6}
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Notice
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 rounded shadow mb-4">{notice}</div>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Notice
          </button>
        </div>
      )}
    </div>
  );
};

export default PrivacyNoticeManagement;