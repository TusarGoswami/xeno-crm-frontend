import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  IoPeople, IoSearch, IoAdd, IoClose,
  IoLocationSharp, IoWallet, IoCart, IoTime,
  IoSparkles, IoChevronDown, IoDownloadOutline,
  IoCloudUploadOutline, IoFlashOutline
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
  const [showAddOrderModal, setShowAddOrderModal] = useState(null);
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

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        if (lines.length < 2) {
          showToast('CSV file is empty', 'error');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const nameIdx = headers.indexOf('name');
        const emailIdx = headers.indexOf('email');
        const phoneIdx = headers.indexOf('phone');
        const cityIdx = headers.indexOf('city');
        const channelIdx = headers.indexOf('channel');

        if (nameIdx === -1 || emailIdx === -1 || phoneIdx === -1) {
          showToast('CSV must contain Name, Email, and Phone columns', 'error');
          return;
        }

        const parsedCustomers = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const columns = line.split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
          if (columns.length < 3) continue;

          parsedCustomers.push({
            name: columns[nameIdx],
            email: columns[emailIdx],
            phone: columns[phoneIdx],
            city: cityIdx !== -1 && columns[cityIdx] ? columns[cityIdx] : 'Mumbai',
            channel: channelIdx !== -1 && columns[channelIdx] ? columns[channelIdx].toLowerCase() : 'whatsapp',
            tags: ['imported'],
          });
        }

        if (parsedCustomers.length === 0) {
          showToast('No valid customers found in CSV', 'error');
          return;
        }

        const res = await axios.post(`${API_URL}/api/customers`, { customers: parsedCustomers });
        showToast(`Successfully imported ${res.data.count || 0} customers!`, 'success');
        fetchCustomers();
      } catch (err) {
        showToast('Failed to parse and upload CSV', 'error');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // clear input
  };

  const handleLoadDemoDataset = async () => {
    const demoCustomers = [
      { name: 'Aanya Sen', email: `aanya.sen${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919830012345', city: 'Kolkata', channel: 'whatsapp', tags: ['vip', 'loyal'] },
      { name: 'Kabir Kapoor', email: `kabir.k${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919910098765', city: 'Delhi', channel: 'sms', tags: ['new', 'deal-seeker'] },
      { name: 'Meera Nair', email: `meera.n${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919440054321', city: 'Chennai', channel: 'email', tags: ['vip', 'at-risk'] },
      { name: 'Rohan Deshmukh', email: `rohan.d${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919820067890', city: 'Pune', channel: 'whatsapp', tags: ['frequent-buyer'] },
      { name: 'Sneha Patel', email: `sneha.p${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919890011223', city: 'Mumbai', channel: 'email', tags: ['bargain-hunter'] },
      { name: 'Amit Sharma', email: `amit.s${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919810011224', city: 'Delhi', channel: 'whatsapp', tags: ['new'] },
      { name: 'Ananya Gupta', email: `ananya.g${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919820011225', city: 'Mumbai', channel: 'whatsapp', tags: ['vip', 'loyal'] },
      { name: 'Rahul Singh', email: `rahul.s${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919830011226', city: 'Kolkata', channel: 'sms', tags: ['frequent-buyer'] },
      { name: 'Priya Reddy', email: `priya.r${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919840011227', city: 'Hyderabad', channel: 'whatsapp', tags: ['deal-seeker'] },
      { name: 'Arjun Verma', email: `arjun.v${Math.floor(Math.random()*900)+100}@gmail.com`, phone: '+919850011228', city: 'Pune', channel: 'rcs', tags: ['seasonal'] }
    ];
    try {
      const res = await axios.post(`${API_URL}/api/customers`, { customers: demoCustomers });
      showToast(`Successfully imported ${res.data.count || 0} demo customers!`, 'success');
      fetchCustomers();
    } catch (err) {
      showToast('Failed to import demo dataset', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Phone,City,Channel\nAarav Sharma,aarav@gmail.com,+919876543210,Mumbai,whatsapp\nNeha Gupta,neha@gmail.com,+919988776655,Delhi,sms\nRahul Iyer,rahul@gmail.com,+919123456789,Chennai,email\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download started!', 'success');
  };

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">{customers.length} customers found</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#FF6B6B]/40 text-slate-600 hover:text-[#0F4C5C] bg-white transition-all shadow-sm active:scale-[0.96] active:bg-slate-50"
          >
            <IoDownloadOutline className="w-4 h-4 text-[#FF6B6B]" />
            Download Template
          </button>
          
          <label className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#FF6B6B]/40 text-slate-600 hover:text-[#0F4C5C] bg-white transition-all shadow-sm cursor-pointer active:scale-[0.96] active:bg-slate-50">
            <IoCloudUploadOutline className="w-4 h-4 text-[#FF6B6B]" />
            Import CSV
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
          </label>

          <button
            onClick={handleLoadDemoDataset}
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 hover:border-[#FF6B6B]/40 text-slate-600 hover:text-[#0F4C5C] bg-white transition-all shadow-sm active:scale-[0.96] active:bg-slate-50"
          >
            <IoFlashOutline className="w-4 h-4 text-[#FF6B6B]" />
            Load Demo
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            id="add-customer-btn"
            className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-bold
                       bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white shadow-sm
                       hover:shadow-[0_4px_12px_rgba(255,107,107,0.25)] hover:scale-[1.02] active:scale-[0.96] transition-all duration-200"
          >
            <IoAdd className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (Table + Filters) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
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
            <div className="relative min-w-[140px]">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-700 focus:outline-none focus:border-[#FF6B6B]/40
                           appearance-none cursor-pointer shadow-sm"
                id="city-filter"
              >
                <option value="">All Cities</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Channel filter */}
            <div className="relative min-w-[140px]">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-700 focus:outline-none focus:border-[#FF6B6B]/40
                           appearance-none cursor-pointer shadow-sm"
                id="channel-filter"
              >
                <option value="">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="rcs">RCS</option>
              </select>
              <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold capitalize
                              ${customer.channel === 'whatsapp' ? 'bg-green-500/15 text-green-500' :
                                customer.channel === 'sms' ? 'bg-blue-500/15 text-blue-500' :
                                customer.channel === 'email' ? 'bg-brand-500/15 text-brand-500' :
                                'bg-orange-500/15 text-orange-600'}`}>
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
                                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        Order History ({expandedData.orders.length})
                                      </p>
                                      <button
                                        onClick={() => setShowAddOrderModal({ id: customer._id, name: customer.name })}
                                        className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-bold
                                                   border border-slate-200 hover:border-[#FF6B6B]/40 text-slate-600 hover:text-[#0F4C5C]
                                                   bg-white transition-all shadow-sm active:scale-95 cursor-pointer"
                                      >
                                        <IoAdd className="w-3.5 h-3.5 text-[#FF6B6B]" />
                                        Record Order
                                      </button>
                                    </div>
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
        </div>

        {/* Right Column (AI Micro-Segments) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card rounded-2xl p-5 border border-slate-100 bg-white">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <IoSparkles className="w-4 h-4 text-[#FF6B6B]" />
              AI Micro-Segments
            </h3>
            <div className="space-y-3">
              {[
                { tag: 'VIP Customers', count: customers.filter(c => c.totalSpend > 5000).length, desc: 'Spent over ₹5,000', color: 'bg-amber-500/10 text-amber-600' },
                { tag: 'At-Risk (Inactive)', count: customers.filter(c => c.totalOrders >= 2 && (!c.lastOrderDate || new Date(c.lastOrderDate) < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000))).length, desc: 'No purchase in 60 days', color: 'bg-red-500/10 text-red-600' },
                { tag: 'WhatsApp Shoppers', count: customers.filter(c => c.channel === 'whatsapp').length, desc: 'Prefers mobile chat', color: 'bg-green-500/10 text-green-600' },
                { tag: 'New Shoppers', count: customers.filter(c => c.totalOrders <= 1).length, desc: 'Single order base', color: 'bg-emerald-500/10 text-emerald-600' },
              ].map((item) => (
                <div key={item.tag} className="p-3 rounded-xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-700 font-bold">{item.tag}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 border border-slate-100 bg-white">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">CRM Growth Tips</h3>
            <ul className="space-y-3.5 text-xs text-slate-500 font-medium">
              <li className="flex gap-2">
                <span className="text-[#FF6B6B]">✦</span>
                <span>Reach Chennai/Kolkata shoppers via Email—they show 18% higher conversion conversion rate.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF6B6B]">✦</span>
                <span>Send coupon triggers to Inactive VIPs to retrieve up to 25% of lapsed revenue.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF6B6B]">✦</span>
                <span>Automate WhatsApp greetings for new shoppers within 24h of purchase to build brand recall.</span>
              </li>
            </ul>
          </div>
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

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <AddOrderModal
          customer={showAddOrderModal}
          onClose={() => setShowAddOrderModal(null)}
          onSuccess={() => {
            setShowAddOrderModal(null);
            fetchCustomers();
            fetchCustomerDetail(expandedId);
            showToast('Order recorded and campaign attributed successfully! 💰', 'success');
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
              <div className="relative">
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200
                             text-sm text-slate-700 focus:outline-none focus:border-[#FF6B6B]/40 appearance-none cursor-pointer"
                >
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1.5 block">Channel</label>
              <div className="relative">
                <select
                  value={form.channel}
                  onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200
                             text-sm text-slate-700 focus:outline-none focus:border-[#FF6B6B]/40 appearance-none cursor-pointer"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="rcs">RCS</option>
                </select>
                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
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

/** Modal for recording a manual customer order with campaign attribution */
function AddOrderModal({ customer, onClose, onSuccess }) {
  const [form, setForm] = useState({
    amount: '',
    itemName: '',
    campaignId: '',
  });
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/campaigns`);
      setCampaigns(res.data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns for attribution:', error);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(form.amount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/customers/${customer.id}/orders`, {
        amount: amountVal,
        items: [{ name: form.itemName || 'Manual Item', price: amountVal }],
        campaignId: form.campaignId || null,
        status: 'completed'
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create manual order:', error);
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
          <div>
            <h3 className="text-lg font-bold text-slate-800">Record Order</h3>
            <p className="text-xs text-slate-500 font-medium font-semibold">For {customer.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1.5 block">Order Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 1500"
              required
              min="1"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200
                         text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B6B]/40"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1.5 block">Item Name</label>
            <input
              type="text"
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="e.g. Cotton Kurta"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200
                         text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B6B]/40"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1.5 block">Attribute to Campaign</label>
            <div className="relative">
              <select
                value={form.campaignId}
                onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
                disabled={campaignsLoading}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-200
                           text-sm text-slate-700 focus:outline-none focus:border-[#FF6B6B]/40 appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">None (Organic Conversion)</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.channel.toUpperCase()})
                  </option>
                ))}
              </select>
              <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">
              Attributing will automatically add this order value to the campaign's revenue and increase its conversion rate.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-bold mt-2
                       bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white shadow-sm
                       hover:shadow-[0_4px_12px_rgba(255,107,107,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Recording...' : 'Record Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

