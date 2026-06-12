import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  IoPeople, IoSearch, IoAdd, IoClose,
  IoLocationSharp, IoWallet, IoCart, IoTime,
} from 'react-icons/io5';
import { useToast } from '../components/Toast';
import { Skeleton, SkeletonTableRow } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Customers Page
 * Browse, search, filter, and add customers.
 * Click a row to see customer details + order history.
 */
export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, [search, cityFilter, channelFilter]);

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (cityFilter) params.append('city', cityFilter);
      if (channelFilter) params.append('channel', channelFilter);

      const res = await axios.get(`${API_URL}/api/customers?${params.toString()}`);
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/customers/${id}`);
      setExpandedData(res.data);
    } catch (error) {
      console.error('Failed to fetch customer detail:', error);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
    } else {
      setExpandedId(id);
      setExpandedData(null);
      fetchCustomerDetail(id);
    }
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">{customers.length} customers found</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          id="add-customer-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white
                     hover:shadow-[0_4px_15px_rgba(255,107,107,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <IoAdd className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200
                       text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-400/50
                       transition-colors shadow-sm"
            id="customer-search-input"
          />
        </div>

        {/* City filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200
                     text-sm text-slate-700 focus:outline-none focus:border-brand-400/50
                     transition-colors appearance-none cursor-pointer shadow-sm"
          id="city-filter"
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Channel filter */}
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200
                     text-sm text-slate-700 focus:outline-none focus:border-brand-400/50
                     transition-colors appearance-none cursor-pointer shadow-sm"
          id="channel-filter"
        >
          <option value="">All Channels</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="premium-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-500/5 text-brand-800 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="text-left px-5 py-3.5 font-bold">Customer</th>
                <th className="text-left px-5 py-3.5 font-bold">City</th>
                <th className="text-left px-5 py-3.5 font-bold">Channel</th>
                <th className="text-right px-5 py-3.5 font-bold">Total Spend</th>
                <th className="text-right px-5 py-3.5 font-bold">Orders</th>
                <th className="text-left px-5 py-3.5 font-bold">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} columns={6} />)
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No customers match your filters
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <>
                    <tr
                      key={customer._id}
                      onClick={() => toggleExpand(customer._id)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100/50
                                  ${expandedId === customer._id ? 'bg-brand-500/5' : ''}`}
                    >
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-slate-800 font-semibold">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600 font-medium">{customer.city}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                          ${customer.channel === 'whatsapp' ? 'bg-green-500/15 text-green-400' :
                            customer.channel === 'sms' ? 'bg-blue-500/15 text-blue-400' :
                            'bg-brand-500/15 text-brand-400'}`}>
                          {customer.channel}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-emerald-600 font-bold">
                        ₹{customer.totalSpend?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-slate-700 font-medium">{customer.totalOrders}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs font-medium">
                        {customer.lastOrderDate
                          ? new Date(customer.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>

                    {/* Expanded Detail */}
                    {expandedId === customer._id && (
                      <tr key={`${customer._id}-detail`}>
                        <td colSpan={6} className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                          <div className="animate-slide-up">
                            {/* Customer Info Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              {[
                                { icon: IoWallet, label: 'Total Spend', value: `₹${customer.totalSpend?.toLocaleString()}`, color: 'text-emerald-600' },
                                { icon: IoCart, label: 'Total Orders', value: customer.totalOrders, color: 'text-blue-500' },
                                { icon: IoLocationSharp, label: 'City', value: customer.city, color: 'text-brand-500' },
                                { icon: IoTime, label: 'Customer Since', value: new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), color: 'text-[#FF6B6B]' },
                              ].map((info) => {
                                const Icon = info.icon;
                                return (
                                  <div key={info.label} className="premium-card rounded-xl p-3 border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className={`w-3.5 h-3.5 ${info.color}`} />
                                      <span className="text-xs text-slate-400 font-semibold">{info.label}</span>
                                    </div>
                                    <p className="text-sm text-slate-800 font-bold">{info.value}</p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Tags */}
                            {customer.tags && customer.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {customer.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Order History */}
                            {expandedData?.orders ? (
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                  Order History ({expandedData.orders.length})
                                </p>
                                <div className="space-y-2">
                                  {expandedData.orders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-100">
                                      <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold
                                          ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                            order.status === 'returned' ? 'bg-red-500/10 text-red-600' :
                                            'bg-amber-500/10 text-amber-600'}`}>
                                          {order.status}
                                        </span>
                                        <span className="text-xs text-slate-600 font-medium">
                                          {order.items.map((i) => i.name).join(', ')}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-800 font-bold">₹{order.amount.toLocaleString()}</span>
                                        <span className="text-xs text-slate-500 font-medium">
                                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <div className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCustomers();
            showToast('Customer added successfully!', 'success');
          }}
        />
      )}
    </div>
  );
}

/** Modal for adding a new customer */
function AddCustomerModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: 'Mumbai', channel: 'whatsapp',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/customers`, form);
      onSuccess();
    } catch (error) {
      console.error('Failed to create customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop"
         onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative premium-card rounded-2xl p-6 w-full max-w-md animate-modal-content border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">Add Customer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Aarav Sharma' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'aarav@gmail.com' },
            { key: 'phone', label: 'Phone', type: 'text', placeholder: '+919876543210' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs text-slate-500 font-semibold mb-1.5 block">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-400/50"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1.5 block">City</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-700 focus:outline-none appearance-none cursor-pointer"
              >
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1.5 block">Channel</label>
              <select
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-700 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-medium
                       bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white
                       hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Add Customer'}
          </button>
        </form>
      </div>
    </div>
  );
}
