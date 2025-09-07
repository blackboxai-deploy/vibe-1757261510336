"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCustomers } from '@/lib/mock-data';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blacklisted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <ProtectedRoute requiredPermission={{ resource: 'customers', action: 'read' }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Customer Management" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    📊 Export
                  </Button>
                  <Button>
                    ➕ Add Customer
                  </Button>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {customers.length}
                    </div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {customers.filter(c => c.status === 'active').length}
                    </div>
                    <p className="text-sm text-gray-600">Active Customers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {customers.filter(c => c.riskRating === 'high').length}
                    </div>
                    <p className="text-sm text-gray-600">High Risk Customers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Customer List */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Customer Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {customer.firstName} {customer.lastName}
                                </h3>
                                <p className="text-gray-600">{customer.email}</p>
                                <p className="text-gray-600">{customer.phone}</p>
                              </div>
                              
                              <div className="flex gap-2">
                                <Badge className={getRiskBadgeColor(customer.riskRating)}>
                                  {customer.riskRating} risk
                                </Badge>
                                <Badge className={getStatusBadgeColor(customer.status)}>
                                  {customer.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <p>📍 {customer.address.city}, {customer.address.state}</p>
                              <p>🏢 {customer.employmentInfo.employer} • {customer.employmentInfo.position}</p>
                            </div>
                          </div>

                          {/* Financial Info */}
                          <div className="lg:w-80 bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2">Financial Profile</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-600">Credit Score</p>
                                <p className="font-semibold text-gray-900">
                                  {customer.financialInfo.creditScore}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Monthly Income</p>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(customer.employmentInfo.monthlyIncome)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Bank Balance</p>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(customer.financialInfo.bankBalance)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Existing Debts</p>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(customer.financialInfo.existingDebts)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:w-32 flex lg:flex-col gap-2">
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                              👁️ View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                              📝 Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                              💰 New Loan
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-gray-500">No customers found matching your search</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}