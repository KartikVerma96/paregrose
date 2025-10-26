'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    userGrowth: [],
    ordersByStatus: [],
    recentRevenue: 0,
    lowStockProducts: [],
    salesChartData: [],
    conversionRate: 0,
    averageOrderValue: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // days

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard statistics
      const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
        fetch(`/api/admin/dashboard/orders?days=${timeRange}`),
        fetch(`/api/admin/dashboard/products?days=${timeRange}`),
        fetch(`/api/admin/dashboard/users?days=${timeRange}`),
        fetch('/api/admin/categories')
      ])

      const [ordersData, productsData, usersData, categoriesData] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        usersRes.json(),
        categoriesRes.json()
      ])

      // Prepare sales chart data (last 7 days)
      const salesData = ordersData.data?.salesChartData || []
      const defaultSalesData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          sales: 0,
          orders: 0
        }
      })
      
      // Prepare revenue trend data
      const revenueTrendData = ordersData.data?.revenueTrend || defaultSalesData

      setStats({
        totalOrders: ordersData.data?.totalOrders || 0,
        totalProducts: productsData.data?.totalProducts || 0,
        totalUsers: usersData.data?.totalUsers || 0,
        totalCategories: categoriesData.success ? categoriesData.data.length : 0,
        totalRevenue: ordersData.data?.totalRevenue || 0,
        recentOrders: ordersData.data?.recentOrders || [],
        topProducts: productsData.data?.topProducts || [],
        userGrowth: usersData.data?.userGrowth || [],
        ordersByStatus: ordersData.data?.ordersByStatus || [],
        recentRevenue: ordersData.data?.recentRevenue || 0,
        lowStockProducts: productsData.data?.lowStockProducts || [],
        salesChartData: salesData.length > 0 ? salesData : defaultSalesData,
        revenueTrendData: revenueTrendData,
        conversionRate: ordersData.data?.conversionRate || 0,
        averageOrderValue: ordersData.data?.averageOrderValue || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header - Indian Inspired */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="indianPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" opacity="0.3"/>
                  <circle cx="0" cy="0" r="2" fill="white" opacity="0.3"/>
                  <circle cx="40" cy="0" r="2" fill="white" opacity="0.3"/>
                  <circle cx="0" cy="40" r="2" fill="white" opacity="0.3"/>
                  <circle cx="40" cy="40" r="2" fill="white" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#indianPattern)"/>
            </svg>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">नमस्ते! Welcome Back 🙏</h1>
              <p className="text-orange-100 text-lg font-medium">Here's what's happening with your store today.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-semibold cursor-pointer"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer flex items-center gap-2 border-2 border-white/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid - Indian Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders Card - Saffron/Orange */}
          <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full -ml-12 -mb-12"></div>
            </div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                  <svg className="h-8 w-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">Total Orders</p>
                <p className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{stats.totalOrders}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-sm font-medium">{stats.recentOrders.length} recent orders</span>
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-6 py-3 border-t border-white/20">
              <a href="/admin/orders" className="text-white hover:text-orange-100 text-sm font-bold flex items-center justify-between group">
                <span>View all orders</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Total Revenue Card - Green */}
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 border-4 border-white rounded-full -ml-16 -mt-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-4 border-white rounded-full -mr-12 -mb-12"></div>
            </div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                  <svg className="h-8 w-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-green-100 text-sm font-semibold mb-1">Total Revenue</p>
                <p className="text-5xl font-bold text-white mb-2 drop-shadow-lg">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-sm font-medium">Avg: ₹{stats.averageOrderValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-6 py-3 border-t border-white/20">
              <a href="/admin/analytics" className="text-white hover:text-emerald-100 text-sm font-bold flex items-center justify-between group">
                <span>View analytics</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Total Products Card - Royal Blue */}
          <div className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
            {/* Decorative mandala pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                  <svg className="h-8 w-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">Total Products</p>
                <p className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{stats.totalProducts}</p>
                <div className="flex items-center gap-2">
                  {stats.lowStockProducts.length > 0 ? (
                    <span className="text-yellow-300 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {stats.lowStockProducts.length} low stock
                    </span>
                  ) : (
                    <span className="text-white/90 text-sm font-medium">All stocked</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-6 py-3 border-t border-white/20">
              <a href="/admin/products" className="text-white hover:text-blue-100 text-sm font-bold flex items-center justify-between group">
                <span>Manage products</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Total Users Card - Magenta/Pink */}
          <div className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
            {/* Decorative paisley-inspired pattern */}
            <div className="absolute inset-0 opacity-15">
              <svg className="absolute bottom-0 left-0 w-40 h-40 -ml-20 -mb-20" viewBox="0 0 100 100">
                <path d="M50 10 Q70 30 60 50 Q50 70 30 60 Q10 50 20 30 Q30 10 50 10" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                  <svg className="h-8 w-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-pink-100 text-sm font-semibold mb-1">Total Users</p>
                <p className="text-5xl font-bold text-white mb-2 drop-shadow-lg">{stats.totalUsers}</p>
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-sm font-medium">{stats.conversionRate}% conversion</span>
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-6 py-3 border-t border-white/20">
              <a href="/admin/users" className="text-white hover:text-pink-100 text-sm font-bold flex items-center justify-between group">
                <span>Manage users</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Revenue & Sales Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 border-t-4 border-emerald-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-bl-full opacity-40"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Revenue Trend</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.salesChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px', fontWeight: '600' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px', fontWeight: '600' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#059669' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Orders Distribution Pie Chart */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 border-t-4 border-orange-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-br-full opacity-40"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Orders Distribution</h3>
              </div>
              <div className="h-80 flex items-center justify-center">
                {stats.ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.ordersByStatus.map(status => ({
                          name: status.status.charAt(0).toUpperCase() + status.status.slice(1),
                          value: status._count.id
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.ordersByStatus.map((entry, index) => {
                          const COLORS = {
                            'completed': '#10b981',
                            'confirmed': '#3b82f6',
                            'pending': '#f59e0b',
                            'cancelled': '#ef4444'
                          }
                          return <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#6b7280'} />
                        })}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '2px solid #f97316',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          padding: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 font-medium">No order data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Orders Bar Chart */}
        <div className="relative bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-bl-full opacity-30"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Daily Orders Overview</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.salesChartData}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #3b82f6',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#2563eb' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="url(#colorBar)" 
                    radius={[8, 8, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Status Chart */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 border-t-4 border-orange-500 overflow-hidden">
            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-bl-full opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Orders by Status</h3>
                </div>
              </div>
            {stats.ordersByStatus.length > 0 ? (
              <div className="space-y-4">
                {stats.ordersByStatus.map((status) => (
                  <div key={status.status} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        status.status === 'completed' ? 'bg-green-100' :
                        status.status === 'confirmed' ? 'bg-blue-100' :
                        status.status === 'pending' ? 'bg-yellow-100' :
                        status.status === 'cancelled' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          status.status === 'completed' ? 'bg-green-500' :
                          status.status === 'confirmed' ? 'bg-blue-500' :
                          status.status === 'pending' ? 'bg-yellow-500' :
                          status.status === 'cancelled' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                      <span className="text-base font-semibold text-gray-800 capitalize">
                        {status.status}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {status._count.id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 font-medium">No orders yet</p>
              </div>
            )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 border-t-4 border-red-500 overflow-hidden">
            {/* Decorative corner element */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-br-full opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Low Stock Alert</h3>
                </div>
              </div>
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl hover:shadow-md transition-shadow duration-200">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">{product.stock_quantity || product.stockQuantity}</p>
                      <p className="text-xs text-gray-500">units left</p>
                    </div>
                  </div>
                ))}
                {stats.lowStockProducts.length > 5 && (
                  <div className="text-center pt-3 border-t border-gray-200">
                    <a href="/admin/products" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      +{stats.lowStockProducts.length - 5} more products with low stock
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold mb-1">All Products Well Stocked!</p>
                <p className="text-gray-500 text-sm">No low stock alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Decorative header with Indian pattern */}
            <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-6 py-5 border-b border-orange-600/20">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="headerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1.5" fill="white"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#headerPattern)"/>
                </svg>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white drop-shadow">Recent Orders</h3>
                </div>
                <a href="/admin/orders" className="text-white hover:text-orange-100 text-sm font-bold flex items-center gap-1 group bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  View All
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="p-6">
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900">
                            {order.customerName}
                          </p>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Order #{order.orderId} • {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 font-medium">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Decorative header with Indian pattern */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-6 py-5 border-b border-purple-600/20">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="headerPattern2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1.5" fill="white"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#headerPattern2)"/>
                </svg>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white drop-shadow">Top Products</h3>
                </div>
                <a href="/admin/products" className="text-white hover:text-purple-100 text-sm font-bold flex items-center gap-1 group bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  View All
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="p-6">
              {stats.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.totalOrders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">
                          ₹{parseFloat(product.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 font-medium">No products yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Top Products */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Decorative header with Indian pattern */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-6 py-5 border-b border-purple-600/20">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="headerPattern2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1.5" fill="white"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#headerPattern2)"/>
                </svg>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white drop-shadow">Top Products</h3>
                </div>
                <a href="/admin/products" className="text-white hover:text-purple-100 text-sm font-bold flex items-center gap-1 group bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  View All
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="p-6">
              {stats.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.totalOrders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900">
                          ₹{parseFloat(product.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 font-medium">No products yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Festive Style */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 border-t-4 border-gradient-to-r from-orange-500 via-green-500 to-blue-500 overflow-hidden">
          {/* Decorative Indian pattern background */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="rangoli" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <circle cx="40" cy="40" r="3" fill="currentColor" className="text-orange-500"/>
                  <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="1" className="text-orange-500"/>
                  <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1" className="text-green-500"/>
                  <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#rangoli)"/>
            </svg>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 via-green-500 to-blue-500 rounded-xl shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-green-600 to-blue-600 bg-clip-text text-transparent">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <a
                href="/admin/products/new"
                className="group relative overflow-hidden flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-200 rounded-2xl hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-transparent rounded-bl-full opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">Add Product</p>
                <p className="text-sm text-gray-600 text-center">Create new product</p>
              </a>

              <a
                href="/admin/orders"
                className="group relative overflow-hidden flex flex-col items-center p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-transparent rounded-bl-full opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">View Orders</p>
                <p className="text-sm text-gray-600 text-center">Manage orders</p>
              </a>

              <a
                href="/admin/categories"
                className="group relative overflow-hidden flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-transparent rounded-bl-full opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">Categories</p>
                <p className="text-sm text-gray-600 text-center">Organize products</p>
              </a>

              <a
                href="/admin/analytics"
                className="group relative overflow-hidden flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-transparent rounded-bl-full opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">Analytics</p>
                <p className="text-sm text-gray-600 text-center">View insights</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
