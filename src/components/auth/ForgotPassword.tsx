import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0072CE] to-[#4CAF50] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <img 
              src="/SLTMobitel_Logo.svg.png" 
              alt="SLT-Mobitel" 
              className="mx-auto h-16 w-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.forgotPassword')}
            </h2>
            <p className="text-gray-600">Consent Management System</p>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Password Reset Coming Soon</h3>
            <p className="text-blue-700 text-sm mb-4">
              Password reset functionality will be available in a future release.
            </p>
            <p className="text-blue-700 text-sm">
              For now, please use the demo credentials provided on the login page.
            </p>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Remember your password? </span>
            <Link
              to="/login"
              className="font-medium text-[#0072CE] hover:text-[#005bb5] transition-colors"
            >
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
