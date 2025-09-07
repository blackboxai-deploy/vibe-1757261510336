"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, icon, trend = 'neutral' }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(0)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        {change && (
          <p className={`text-xs ${getTrendColor()} mt-1`}>
            {trend === 'up' && '↗'} {trend === 'down' && '↘'} {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon="👥"
        change="+12 this month"
        trend="up"
      />
      
      <StatCard
        title="Active Loans"
        value={stats.activeLoans}
        icon="💰"
        change={`${stats.totalLoans - stats.activeLoans} completed`}
        trend="neutral"
      />
      
      <StatCard
        title="Total Portfolio"
        value={stats.totalLoanAmount}
        icon="📊"
        change="+8.2% from last month"
        trend="up"
      />
      
      <StatCard
        title="Monthly Collections"
        value={stats.totalCollected}
        icon="💳"
        change="+15.3% from last month"
        trend="up"
      />
      
      <StatCard
        title="Pending Applications"
        value={stats.pendingApplications}
        icon="📋"
        change={stats.pendingApplications > 10 ? "High volume" : "Normal volume"}
        trend={stats.pendingApplications > 10 ? 'up' : 'neutral'}
      />
      
      <StatCard
        title="Overdue Loans"
        value={stats.overdueLoans}
        icon="⚠️"
        change={`${stats.defaultRate}% default rate`}
        trend={stats.defaultRate > 3 ? 'up' : 'down'}
      />
      
      <StatCard
        title="Average Loan"
        value={stats.averageLoanAmount}
        icon="📈"
        change="Industry standard"
        trend="neutral"
      />
      
      <StatCard
        title="Monthly Disbursements"
        value={stats.monthlyDisbursements}
        icon="💸"
        change="+5.7% from last month"
        trend="up"
      />
    </div>
  );
}