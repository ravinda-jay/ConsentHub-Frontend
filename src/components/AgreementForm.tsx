import React, { useState } from 'react';
import { Save, AlertCircle, Plus, Trash2, Loader, FileText } from 'lucide-react';
import { Agreement, AgreementItem, RelatedParty } from '../types/Agreement';
import { agreementService } from '../services/agreementService';

interface AgreementFormProps {
  onSubmit: (agreement: Agreement) => void;
  onCancel: () => void;
}

const AgreementForm: React.FC<AgreementFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    agreementType: '',
    description: '',
    statementOfIntent: '',
    documentNumber: 0,
    agreementPeriod: {
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
    agreementSpecification: {
      id: '',
      name: '',
      href: '',
      '@referredType': 'AgreementSpecification',
    },
    agreementItem: [] as AgreementItem[],
    engagedParty: [] as RelatedParty[],
    relatedParty: [] as RelatedParty[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Agreement name is required';
    if (!formData.agreementType.trim()) newErrors.agreementType = 'Agreement type is required';
    if (formData.agreementItem.length === 0) newErrors.agreementItem = 'At least one agreement item is required';
    if (formData.engagedParty.length === 0) newErrors.engagedParty = 'At least one engaged party is required';
    if (formData.relatedParty.length === 0) newErrors.relatedParty = 'At least one related party is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const agreementData = {
        ...formData,
        agreementPeriod: {
          startDateTime: new Date(formData.agreementPeriod.startDateTime),
          endDateTime: new Date(formData.agreementPeriod.endDateTime),
        },
        '@type': 'Agreement',
      };

      const result = await agreementService.createAgreement(agreementData);
      onSubmit(result);
    } catch (error) {
      console.error('Error creating agreement:', error);
      alert('Failed to create agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAgreementItem = () => {
    setFormData(prev => ({
      ...prev,
      agreementItem: [
        ...prev.agreementItem,
        {
          productOffering: [{
            id: '',
            name: '',
            href: '',
            '@referredType': 'ProductOffering',
          }],
          termOrCondition: [],
        },
      ],
    }));
  };

  const updateAgreementItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      agreementItem: prev.agreementItem.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeAgreementItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agreementItem: prev.agreementItem.filter((_, i) => i !== index),
    }));
  };

  const addEngagedParty = () => {
    setFormData(prev => ({
      ...prev,
      engagedParty: [
        ...prev.engagedParty,
        {
          id: '',
          name: '',
          role: '',
          href: '',
          '@referredType': 'Organization',
        },
      ],
    }));
  };

  const updateEngagedParty = (index: number, field: keyof RelatedParty, value: string) => {
    setFormData(prev => ({
      ...prev,
      engagedParty: prev.engagedParty.map((party, i) =>
        i === index ? { ...party, [field]: value } : party
      ),
    }));
  };

  const removeEngagedParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      engagedParty: prev.engagedParty.filter((_, i) => i !== index),
    }));
  };

  const addRelatedParty = () => {
    setFormData(prev => ({
      ...prev,
      relatedParty: [
        ...prev.relatedParty,
        {
          id: '',
          name: '',
          role: '',
          href: '',
          '@referredType': 'Organization',
        },
      ],
    }));
  };

  const updateRelatedParty = (index: number, field: keyof RelatedParty, value: string) => {
    setFormData(prev => ({
      ...prev,
      relatedParty: prev.relatedParty.map((party, i) =>
        i === index ? { ...party, [field]: value } : party
      ),
    }));
  };

  const removeRelatedParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      relatedParty: prev.relatedParty.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-500 text-white p-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Create New Agreement</h1>
              <p className="text-blue-100">TMF651 Agreement Management</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter agreement name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Type *</label>
                <select
                  value={formData.agreementType}
                  onChange={(e) => setFormData({ ...formData, agreementType: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.agreementType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select agreement type</option>
                  <option value="Service Agreement">Service Agreement</option>
                  <option value="Product Agreement">Product Agreement</option>
                  <option value="Partnership Agreement">Partnership Agreement</option>
                  <option value="SLA">Service Level Agreement</option>
                </select>
                {errors.agreementType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.agreementType}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the agreement..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Statement of Intent</label>
                <textarea
                  rows={2}
                  value={formData.statementOfIntent}
                  onChange={(e) => setFormData({ ...formData, statementOfIntent: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter statement of intent..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
                <input
                  type="number"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document number"
                />
              </div>
            </div>
          </section>

          {/* Agreement Period */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Agreement Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.agreementPeriod.startDateTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    agreementPeriod: { ...formData.agreementPeriod, startDateTime: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.agreementPeriod.endDateTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    agreementPeriod: { ...formData.agreementPeriod, endDateTime: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Agreement Specification */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Agreement Specification</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specification ID</label>
                <input
                  type="text"
                  value={formData.agreementSpecification.id}
                  onChange={(e) => setFormData({
                    ...formData,
                    agreementSpecification: { ...formData.agreementSpecification, id: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter specification ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specification Name</label>
                <input
                  type="text"
                  value={formData.agreementSpecification.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    agreementSpecification: { ...formData.agreementSpecification, name: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter specification name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specification HREF</label>
                <input
                  type="url"
                  value={formData.agreementSpecification.href}
                  onChange={(e) => setFormData({
                    ...formData,
                    agreementSpecification: { ...formData.agreementSpecification, href: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {/* Agreement Items */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Agreement Items</h2>
              <button
                type="button"
                onClick={addAgreementItem}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            {errors.agreementItem && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {errors.agreementItem}
              </p>
            )}

            {formData.agreementItem.map((item, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Agreement Item {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeAgreementItem(index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Offering ID</label>
                    <input
                      type="text"
                      value={item.productOffering[0]?.id || ''}
                      onChange={(e) => {
                        const newProductOffering = [{
                          ...item.productOffering[0],
                          id: e.target.value,
                        }];
                        updateAgreementItem(index, 'productOffering', newProductOffering);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Offering Name</label>
                    <input
                      type="text"
                      value={item.productOffering[0]?.name || ''}
                      onChange={(e) => {
                        const newProductOffering = [{
                          ...item.productOffering[0],
                          name: e.target.value,
                        }];
                        updateAgreementItem(index, 'productOffering', newProductOffering);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Offering HREF</label>
                    <input
                      type="url"
                      value={item.productOffering[0]?.href || ''}
                      onChange={(e) => {
                        const newProductOffering = [{
                          ...item.productOffering[0],
                          href: e.target.value,
                        }];
                        updateAgreementItem(index, 'productOffering', newProductOffering);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Engaged Parties */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Engaged Parties</h2>
              <button
                type="button"
                onClick={addEngagedParty}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Party
              </button>
            </div>
            {errors.engagedParty && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {errors.engagedParty}
              </p>
            )}

            {formData.engagedParty.map((party, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Engaged Party {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEngagedParty(index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party ID</label>
                    <input
                      type="text"
                      value={party.id}
                      onChange={(e) => updateEngagedParty(index, 'id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Name</label>
                    <input
                      type="text"
                      value={party.name}
                      onChange={(e) => updateEngagedParty(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={party.role}
                      onChange={(e) => updateEngagedParty(index, 'role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HREF</label>
                    <input
                      type="url"
                      value={party.href || ''}
                      onChange={(e) => updateEngagedParty(index, 'href', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Related Parties */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-blue-200 pb-2">Related Parties</h2>
              <button
                type="button"
                onClick={addRelatedParty}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Party
              </button>
            </div>
            {errors.relatedParty && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {errors.relatedParty}
              </p>
            )}

            {formData.relatedParty.map((party, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Related Party {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeRelatedParty(index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party ID</label>
                    <input
                      type="text"
                      value={party.id}
                      onChange={(e) => updateRelatedParty(index, 'id', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party Name</label>
                    <input
                      type="text"
                      value={party.name}
                      onChange={(e) => updateRelatedParty(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={party.role}
                      onChange={(e) => updateRelatedParty(index, 'role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HREF</label>
                    <input
                      type="url"
                      value={party.href || ''}
                      onChange={(e) => updateRelatedParty(index, 'href', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-green-500 hover:from-blue-700 hover:via-blue-800 hover:to-green-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin w-5 h-5" /> Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Create Agreement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgreementForm;