"use client";

import { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockLoans, mockCustomers } from '@/lib/mock-data';
import { Loan } from '@/lib/types';

export default function PaymentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loans] = useState<Loan[]>(mockLoans);
  const [selectedLoan, setSelectedLoan] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

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

  const getPaymentStatus = (loan: Loan) => {
    const today = new Date();
    const nextPaymentDate = new Date(loan.nextPaymentDate);
    const daysDiff = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { status: 'overdue', days: Math.abs(daysDiff), color: 'bg-red-100 text-red-800' };
    if (daysDiff <= 7) return { status: 'due_soon', days: daysDiff, color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'current', days: daysDiff, color: 'bg-green-100 text-green-800' };
  };

  const handleProcessPayment = () => {
    if (!selectedLoan || !paymentAmount || !paymentMethod) {
      alert('Please fill in all payment details');
      return;
    }

    // In real app, this would call an API
    alert(`Payment of ${formatCurrency(parseFloat(paymentAmount))} processed successfully!`);
    
    // Reset form
    setSelectedLoan('');
    setPaymentAmount('');
    setPaymentMethod('');
  };

  const overdueLoans = loans.filter(loan => getPaymentStatus(loan).status === 'overdue');
  const dueSoonLoans = loans.filter(loan => getPaymentStatus(loan).status === 'due_soon');
  const totalOverdue = overdueLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  return (
    <ProtectedRoute requiredPermission={{ resource: 'payments', action: 'read' }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Payment Processing" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Payment Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {overdueLoans.length}
                    </div>
                    <p className="text-sm text-gray-600">Overdue Loans</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {dueSoonLoans.length}
                    </div>
                    <p className="text-sm text-gray-600">Due This Week</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalOverdue)}
                    </div>
                    <p className="text-sm text-gray-600">Overdue Amount</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {loans.reduce((sum, loan) => sum + loan.totalPaid, 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Total Collected</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Payment Form */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Process Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Loan
                      </label>
                      <Select value={selectedLoan} onValueChange={setSelectedLoan}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose loan..." />
                        </SelectTrigger>
                        <SelectContent>
                          {loans.map(loan => (
                            <SelectItem key={loan.id} value={loan.id}>
                              {getCustomerName(loan.customerId)} - {loan.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Amount
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">💵 Cash</SelectItem>
                          <SelectItem value="check">📄 Check</SelectItem>
                          <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                          <SelectItem value="online">💻 Online Payment</SelectItem>
                          <SelectItem value="auto_debit">🔄 Auto Debit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedLoan && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        {(() => {
                          const loan = loans.find(l => l.id === selectedLoan);
                          if (!loan) return null;
                          return (
                            <div className="text-sm">
                              <p className="font-medium">Loan Details:</p>
                              <p>Monthly Payment: {formatCurrency(loan.monthlyPayment)}</p>
                              <p>Outstanding: {formatCurrency(loan.currentBalance)}</p>
                              <p>Next Due: {formatDate(loan.nextPaymentDate)}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <Button 
                      onClick={handleProcessPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!selectedLoan || !paymentAmount || !paymentMethod}
                    >
                      💳 Process Payment
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment Status List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Payment Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loans.map((loan) => {
                        const paymentStatus = getPaymentStatus(loan);
                        
                        return (
                          <div
                            key={loan.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {getCustomerName(loan.customerId)}
                                </h4>
                                <p className="text-sm text-gray-600">{loan.id}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={paymentStatus.color}>
                                    {paymentStatus.status === 'overdue' && `${paymentStatus.days} days overdue`}
                                    {paymentStatus.status === 'due_soon' && `Due in ${paymentStatus.days} days`}
                                    {paymentStatus.status === 'current' && `${paymentStatus.days} days until due`}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(loan.monthlyPayment)}
                                </p>
                                <p className="text-sm text-gray-600">Due amount</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Due: {formatDate(loan.nextPaymentDate)}
                                </p>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  💳 Pay
                                </Button>
                                <Button size="sm" variant="outline">
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
                        <div className="text-4xl mb-2">💳</div>
                        <p className="text-gray-500">No loans found for payment processing</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}