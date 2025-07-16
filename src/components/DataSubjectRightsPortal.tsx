// filepath: src/components/CommunicationPreferencesManagement.tsx
import React, { useState } from 'react';

const CommunicationPreferencesManagement: React.FC = () => {
  const [requestType, setRequestType] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Data Subject Rights (DSAR) Portal</h1>
      <p className="mb-6">Submit requests to access, rectify, or erase your personal data.</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 font-medium">Request Type</label>
          <select
            value={requestType}
            onChange={e => setRequestType(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select...</option>
            <option value="access">Access My Data</option>
            <option value="rectify">Rectify My Data</option>
            <option value="erase">Erase My Data</option>
            <option value="restrict">Restrict Processing</option>
            <option value="object">Object to Processing</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Details</label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Describe your request..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
        {submitted && (
          <div className="mt-4 text-green-600 font-semibold">
            Your request has been submitted!
          </div>
        )}
      </form>
    </div>
  );
};

export default CommunicationPreferencesManagement;