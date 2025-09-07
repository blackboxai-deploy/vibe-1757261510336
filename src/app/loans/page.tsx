"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockLoans, mockCustomers } from '@/lib/mock-data';
import { Loan } from '@/lib/types';

export default function ActiveLoansPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loans] = useState<Loan[]>(mockLoans);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      case 'restructured': return 'bg-yellow-100 text-yellow-800';
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

  const calculateProgress = (loan: Loan) => {
    const totalAmount = loan.principalAmount;
    const remaining = loan.currentBalance;
    const paid = totalAmount - remaining;
    return (paid / totalAmount) * 100;
  };

  const getPaymentStatus = (loan: Loan) => {
    const today = new Date();
    const nextPaymentDate = new Date(loan.nextPaymentDate);
    const daysDiff = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { status: 'overdue', days: Math.abs(daysDiff), color: 'text-red-600' };
    if (daysDiff <= 7) return { status: 'due_soon', days: daysDiff, color: 'text-yellow-600' };
    return { status: 'current', days: daysDiff, color: 'text-green-600' };
  };

  const totalPortfolio = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const totalPaid = loans.reduce((sum, loan) => sum + loan.totalPaid, 0);
  const activeLoans = loans.filter(loan => loan.status === 'active').length;

  return (
    <ProtectedRoute requiredPermission={{ resource: 'loans', action: 'read' }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Active Loans" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Loan Portfolio Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {activeLoans}
                    </div>
                    <p className="text-sm text-gray-600">Active Loans</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalPortfolio)}
                    </div>
                    <p className="text-sm text-gray-600">Outstanding Balance</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(totalPaid)}
                    </div>
                    <p className="text-sm text-gray-600">Total Collected</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {loans.filter(loan => getPaymentStatus(loan).status === 'overdue').length}
                    </div>
                    <p className="text-sm text-gray-600">Overdue Loans</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Loans List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Loan Portfolio</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        📊 Export
                      </Button>
                      <Button variant="outline">
                        📧 Send Reminders
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {loans.map((loan) => {
                      const progress = calculateProgress(loan);
                      const paymentStatus = getPaymentStatus(loan);
                      
                      return (
                        <div
                          key={loan.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Loan Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {getCustomerName(loan.customerId)}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-2">
                                    Loan ID: {loan.id}
                                  </p>
                                  <div className="flex gap-2 mb-3">
                                    <Badge className={getLoanTypeColor(loan.loanType)}>
                                      {loan.loanType} loan
                                    </Badge>
                                    <Badge className={getStatusColor(loan.status)}>
                                      {loan.status}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(loan.currentBalance)}
                                  </p>
                                  <p className="text-sm text-gray-600">Outstanding</p>
                                </div>
                              </div>
                              
                              {/* Loan Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Repayment Progress</span>
                                  <span>{Math.round(progress)}% Complete</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Principal Amount</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(loan.principalAmount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Monthly Payment</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(loan.monthlyPayment)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Interest Rate</p>
                                  <p className="font-semibold text-gray-900">
                                    {loan.interestRate}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Loan Term</p>
                                  <p className="font-semibold text-gray-900">
                                    {loan.term} months
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Start Date</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatDate(loan.startDate)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">End Date</p>
                                  <p className="font-semibold text-gray-900">
                                    {formatDate(loan.endDate)}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Payment Status */}
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Next Payment Due: {formatDate(loan.nextPaymentDate)}
                                    </p>
                                    <p className={`text-sm ${paymentStatus.color}`}>
                                      {paymentStatus.status === 'overdue' && `${paymentStatus.days} days overdue`}
                                      {paymentStatus.status === 'due_soon' && `Due in ${paymentStatus.days} days`}
                                      {paymentStatus.status === 'current' && `${paymentStatus.days} days until due`}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Total Paid</p>
                                    <p className="font-semibold text-gray-900">
                                      {formatCurrency(loan.totalPaid)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="lg:w-40 flex lg:flex-col gap-2">
                              <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                                👁️ View Details
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                                💳 Record Payment
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                                📋 Schedule
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                                📞 Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {loans.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💰</div>
                      <p className="text-gray-500">No active loans found</p>
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