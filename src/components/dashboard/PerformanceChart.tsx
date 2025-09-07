"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LoanPerformance } from '@/lib/types';

interface PerformanceChartProps {
  data: LoanPerformance[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Loan Performance Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Loan Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelStyle={{ color: '#666' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="disbursed" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Disbursed"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="collected" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Collected"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="overdue" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Overdue"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* New Applications Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 New Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [value, 'Applications']}
                labelStyle={{ color: '#666' }}
              />
              <Bar 
                dataKey="newApplications" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="New Applications"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💼 Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.disbursed, 0))}
              </div>
              <div className="text-sm text-blue-700 mt-1">Total Disbursed</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.collected, 0))}
              </div>
              <div className="text-sm text-green-700 mt-1">Total Collected</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.overdue, 0))}
              </div>
              <div className="text-sm text-red-700 mt-1">Total Overdue</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.reduce((sum, item) => sum + item.newApplications, 0)}
              </div>
              <div className="text-sm text-purple-700 mt-1">Applications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}