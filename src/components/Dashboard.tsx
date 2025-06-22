import React, { useEffect, useState } from 'react';
import { Plus, Package, BarChart3, Settings, FileText, Users, Building, TrendingUp } from 'lucide-react';
import ProductOfferingForm from './ProductOfferingForm';
import ProductList from './ProductList';
import AgreementForm from './AgreementForm';
import AgreementList from './AgreementList';
import type { ProductOffering } from '../types/ProductOffering';
import type { Agreement } from '../types/Agreement';
import { agreementService } from '../services/agreementService';

type View = 'dashboard' | 'add-product' | 'products' | 'add-agreement' | 'agreements';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<ProductOffering[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await fetch('https://tm-forum-production.up.railway.app/tmf-api/productCatalogManagement/v5/productOffering');
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProducts(productData);
        }

        // Fetch agreements
        try {
          const agreementData = await agreementService.getAllAgreements();
          setAgreements(agreementData);
        } catch (agreementError) {
          console.warn('Agreement service not available:', agreementError);
          // Continue without agreements if service is not available
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = (product: ProductOffering) => {
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdate: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    setCurrentView('products');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const handleAddAgreement = (agreement: Agreement) => {
    setAgreements(prev => [...prev, agreement]);
    setCurrentView('agreements');
  };

  const handleDeleteAgreement = async (id: string) => {
    try {
      await agreementService.deleteAgreement(id);
      setAgreements(prev => prev.filter(agreement => agreement.id !== id));
    } catch (error) {
      console.error('Error deleting agreement:', error);
      alert('Failed to delete agreement. Please try again.');
    }
  };

  const getStats = () => {
    const activeProducts = products.filter(p => p.lifecycleStatus === 'Active').length;
    const sellableProducts = products.filter(p => p.isSellable).length;
    const bundleProducts = products.filter(p => p.isBundle).length;
    const activeAgreements = agreements.filter(a => a.status === 'active').length;
    const inProcessAgreements = agreements.filter(a => a.status === 'in process').length;
    
    return {
      totalProducts: products.length,
      activeProducts,
      sellableProducts,
      bundleProducts,
      totalAgreements: agreements.length,
      activeAgreements,
      inProcessAgreements
    };
  };

  const stats = getStats();

  const renderSidebar = () => (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-green-500 rounded-lg flex items-center justify-center">
            <img 
              src="/public/SLTMobitel_Logo.svg.png" 
              alt="SLT Mobitel" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Package className="w-6 h-6 text-white hidden" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SLT Mobitel</h1>
            <p className="text-sm text-gray-500">TMF Portal</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</h2>
        </div>
        
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentView === 'dashboard' 
              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5 mr-3" />
          Dashboard
        </button>

        <div className="px-6 mt-6 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</h2>
        </div>

        <button
          onClick={() => setCurrentView('products')}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentView === 'products' 
              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Package className="w-5 h-5 mr-3" />
          Products
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentView('add-product')}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentView === 'add-product' 
              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Plus className="w-5 h-5 mr-3" />
          Add Product
        </button>

        <div className="px-6 mt-6 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Agreements</h2>
        </div>

        <button
          onClick={() => setCurrentView('agreements')}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentView === 'agreements' 
              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-5 h-5 mr-3" />
          Agreements
          <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {agreements.length}
          </span>
        </button>

        <button
          onClick={() => setCurrentView('add-agreement')}
          className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
            currentView === 'add-agreement' 
              ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 border-r-2 border-blue-700' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Plus className="w-5 h-5 mr-3" />
          Add Agreement
        </button>

        <div className="px-6 mt-8 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</h2>
        </div>

        <button className="w-full flex items-center px-6 py-3 text-left text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Configuration
        </button>
      </nav>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your product offerings, agreements, and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">All product offerings</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Currently active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agreements</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalAgreements}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">All agreements</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Agreements</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeAgreements}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Currently active</span>
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
              <button
                onClick={() => setCurrentView('products')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">Version {product.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.lifecycleStatus === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.lifecycleStatus}
                  </span>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-4">No products available</p>
            )}
          </div>
        </div>

        {/* Recent Agreements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Agreements</h2>
              <button
                onClick={() => setCurrentView('agreements')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {agreements.slice(0, 3).map((agreement) => (
              <div key={agreement.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{agreement.name}</h3>
                    <p className="text-sm text-gray-500">{agreement.agreementType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agreement.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : agreement.status === 'in process'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agreement.status || 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
            {agreements.length === 0 && (
              <p className="text-gray-500 text-center py-4">No agreements available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'add-product':
        return <ProductOfferingForm onSubmit={handleAddProduct} />;
      case 'products':
        return <ProductList products={products} onDelete={handleDeleteProduct} />;
      case 'add-agreement':
        return <AgreementForm onSubmit={handleAddAgreement} onCancel={() => setCurrentView('dashboard')} />;
      case 'agreements':
        return <AgreementList agreements={agreements} onDelete={handleDeleteAgreement} />;
      default:
        return renderDashboardContent();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading TMF Portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      <div className="ml-64 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;