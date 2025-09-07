"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { mockDashboardStats, mockLoanPerformance, mockRecentActivities } from '@/lib/mock-data';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={mockDashboardStats} />
              
              {/* Performance Charts */}
              <PerformanceChart data={mockLoanPerformance} />
              
              {/* Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RecentActivity activities={mockRecentActivities} limit={8} />
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">👥</span>
                        <div>
                          <div className="font-medium">Add New Customer</div>
                          <div className="text-sm text-gray-500">Register a new customer</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📋</span>
                        <div>
                          <div className="font-medium">Process Application</div>
                          <div className="text-sm text-gray-500">Review pending applications</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💳</span>
                        <div>
                          <div className="font-medium">Process Payment</div>
                          <div className="text-sm text-gray-500">Record loan payments</div>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📈</span>
                        <div>
                          <div className="font-medium">Generate Report</div>
                          <div className="text-sm text-gray-500">Create financial reports</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}