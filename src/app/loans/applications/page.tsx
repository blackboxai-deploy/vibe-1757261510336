"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockLoanApplications, mockCustomers } from '@/lib/mock-data';
import { LoanApplication } from '@/lib/types';

export default function LoanApplicationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [applications] = useState<LoanApplication[]>(mockLoanApplications);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disbursed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'home': return 'bg-green-100 text-green-800';
      case 'auto': return 'bg-orange-100 text-orange-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCustomerName = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const reviewCount = applications.filter(app => app.status === 'under_review').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;

  return (
    <ProtectedRoute requiredPermission={{ resource: 'loans', action: 'read' }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Loan Applications" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Application Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {pendingCount}
                    </div>
                    <p className="text-sm text-gray-600">Pending Review</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {reviewCount}
                    </div>
                    <p className="text-sm text-gray-600">Under Review</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {approvedCount}
                    </div>
                    <p className="text-sm text-gray-600">Approved</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {applications.length}
                    </div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </CardContent>
                </Card>
              </div>

              {/* Applications List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Loan Applications</CardTitle>
                    <Button>
                      ➕ New Application
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Application Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {getCustomerName(application.customerId)}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  Application ID: {application.id}
                                </p>
                                <div className="flex gap-2 mb-2">
                                  <Badge className={getLoanTypeColor(application.loanType)}>
                                    {application.loanType} loan
                                  </Badge>
                                  <Badge className={getStatusColor(application.status)}>
                                    {application.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Requested Amount</p>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(application.requestedAmount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Loan Term</p>
                                <p className="font-semibold text-gray-900">
                                  {application.term} months
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Purpose</p>
                                <p className="font-semibold text-gray-900">
                                  {application.purpose}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Application Date</p>
                                <p className="font-semibold text-gray-900">
                                  {formatDate(application.applicationDate)}
                                </p>
                              </div>
                              {application.interestRate && (
                                <div>
                                  <p className="text-gray-600">Interest Rate</p>
                                  <p className="font-semibold text-gray-900">
                                    {application.interestRate}%
                                  </p>
                                </div>
                              )}
                              {application.collateral && (
                                <div>
                                  <p className="text-gray-600">Collateral</p>
                                  <p className="font-semibold text-gray-900">
                                    {application.collateral.type} - {formatCurrency(application.collateral.value)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {application.reviewedBy && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  <strong>Reviewed by:</strong> {application.reviewedBy}
                                  {application.reviewDate && (
                                    <span> on {formatDate(application.reviewDate)}</span>
                                  )}
                                </p>
                                {application.rejectionReason && (
                                  <p className="text-sm text-red-600 mt-1">
                                    <strong>Rejection Reason:</strong> {application.rejectionReason}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="lg:w-40 flex lg:flex-col gap-2">
                            <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                              👁️ View Details
                            </Button>
                            
                            {application.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline" className="flex-1 lg:flex-none text-green-600">
                                  ✅ Approve
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 lg:flex-none text-red-600">
                                  ❌ Reject
                                </Button>
                              </>
                            )}
                            
                            {application.status === 'under_review' && (
                              <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                                📋 Continue Review
                              </Button>
                            )}
                            
                            {application.status === 'approved' && (
                              <Button size="sm" className="flex-1 lg:flex-none bg-blue-600">
                                💰 Disburse
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {applications.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-gray-500">No loan applications found</p>
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