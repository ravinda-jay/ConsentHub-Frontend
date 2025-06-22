import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, FileText, Calendar, Users, Building } from 'lucide-react';
import { Agreement } from '../types/Agreement';

interface AgreementListProps {
  agreements: Agreement[];
  onDelete: (id: string) => void;
  onEdit?: (agreement: Agreement) => void;
}

const AgreementList: React.FC<AgreementListProps> = ({ agreements, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agreement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    const matchesType = typeFilter === 'all' || agreement.agreementType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'in process':
        return 'bg-blue-100 text-blue-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AgreementDetailModal = ({ agreement, onClose }: { agreement: Agreement; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-green-500 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{agreement.name}</h2>
                <p className="text-blue-100">{agreement.agreementType}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">ID:</span>
                  <p className="text-gray-900">{agreement.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agreement.status)}`}>
                    {agreement.status || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Document Number:</span>
                  <p className="text-gray-900">{agreement.documentNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-900">{agreement.description || 'No description provided'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Created:</span>
                  <p className="text-gray-900">{formatDate(agreement.createdDate)}</p>
                </div>
                {agreement.updatedDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated:</span>
                    <p className="text-gray-900">{formatDate(agreement.updatedDate)}</p>
                  </div>
                )}
                {agreement.agreementPeriod && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date:</span>
                      <p className="text-gray-900">{formatDate(agreement.agreementPeriod.startDateTime)}</p>
                    </div>
                    {agreement.agreementPeriod.endDateTime && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">End Date:</span>
                        <p className="text-gray-900">{formatDate(agreement.agreementPeriod.endDateTime)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {agreement.statementOfIntent && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Statement of Intent</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-900">{agreement.statementOfIntent}</p>
              </div>
            </div>
          )}

          {agreement.agreementSpecification && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Agreement Specification</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900">{agreement.agreementSpecification.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <p className="text-gray-900">{agreement.agreementSpecification.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {agreement.agreementItem.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Agreement Items</h3>
              <div className="space-y-3">
                {agreement.agreementItem.map((item, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Item {index + 1}</h4>
                    {item.productOffering.map((offering, offeringIndex) => (
                      <div key={offeringIndex} className="mb-2">
                        <span className="text-sm font-medium text-gray-500">Product Offering:</span>
                        <p className="text-gray-900">{offering.name} (ID: {offering.id})</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {agreement.engagedParty.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Engaged Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agreement.engagedParty.map((party, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">{party.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">Role: {party.role}</p>
                    <p className="text-sm text-gray-600">ID: {party.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agreement.relatedParty.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agreement.relatedParty.map((party, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{party.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">Role: {party.role}</p>
                    <p className="text-sm text-gray-600">ID: {party.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agreement Management</h1>
        <p className="text-gray-600 mt-2">Manage and view all your agreements</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="in process">In Process</option>
              <option value="terminated">Terminated</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Service Agreement">Service Agreement</option>
              <option value="Product Agreement">Product Agreement</option>
              <option value="Partnership Agreement">Partnership Agreement</option>
              <option value="SLA">Service Level Agreement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agreements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgreements.map((agreement) => (
          <div key={agreement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{agreement.name}</h3>
                    <p className="text-sm text-gray-500">{agreement.agreementType}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agreement.status)}`}>
                  {agreement.status || 'Unknown'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {agreement.description || 'No description provided'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created {formatDate(agreement.createdDate)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {agreement.engagedParty.length} engaged parties
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="w-4 h-4 mr-2" />
                  {agreement.agreementItem.length} agreement items
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  {agreement.documentNumber && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Doc #{agreement.documentNumber}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedAgreement(agreement)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(agreement)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Agreement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(agreement.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Agreement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAgreements.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agreements found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {selectedAgreement && (
        <AgreementDetailModal
          agreement={selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
        />
      )}
    </div>
  );
};

export default AgreementList;