// filepath: c:\Users\Ravinda Duljaya\OneDrive\Desktop\SLT Projects\ConsentHub-Frontend\src\components\CommunicationPreferencesManagement.tsx
import React, { useState } from 'react';

const initialConsents = [
  { id: 'marketing', label: 'Marketing Communications', enabled: true },
  { id: 'analytics', label: 'Usage Analytics', enabled: false },
  { id: 'thirdParty', label: 'Third-party Data Sharing', enabled: false },
];

const CommunicationPreferencesManagement: React.FC = () => {
  const [consents, setConsents] = useState(initialConsents);

  const handleToggle = (id: string) => {
    setConsents(prev =>
      prev.map(c =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Enhanced Consent Management</h1>
      <p className="mb-6">Manage your consents for different data processing activities.</p>
      <div className="space-y-4">
        {consents.map(consent => (
          <div key={consent.id} className="flex items-center">
            <input
              type="checkbox"
              checked={consent.enabled}
              onChange={() => handleToggle(consent.id)}
              id={consent.id}
              className="mr-3"
            />
            <label htmlFor={consent.id} className="text-lg">{consent.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationPreferencesManagement;