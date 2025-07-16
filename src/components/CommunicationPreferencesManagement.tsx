// filepath: src/components/CommunicationPreferencesManagement.tsx
import React, { useState } from 'react';

const preferencesList = [
  { id: 'email', label: 'Email Notifications' },
  { id: 'sms', label: 'SMS Alerts' },
  { id: 'newsletter', label: 'Monthly Newsletter' },
  { id: 'offers', label: 'Promotional Offers' },
];

const CommunicationPreferencesManagement: React.FC = () => {
  const [preferences, setPreferences] = useState<{ [key: string]: boolean }>({
    email: true,
    sms: false,
    newsletter: true,
    offers: false,
  });

  const handleToggle = (id: string) => {
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Communication Preferences Management</h1>
      <p className="mb-6">Choose how you want to receive communications from us.</p>
      <div className="space-y-4">
        {preferencesList.map(pref => (
          <div key={pref.id} className="flex items-center">
            <input
              type="checkbox"
              checked={preferences[pref.id]}
              onChange={() => handleToggle(pref.id)}
              id={pref.id}
              className="mr-3"
            />
            <label htmlFor={pref.id} className="text-lg">{pref.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunicationPreferencesManagement;