"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityLog } from '@/lib/types';

interface RecentActivityProps {
  activities: ActivityLog[];
  limit?: number;
}

export function RecentActivity({ activities, limit = 10 }: RecentActivityProps) {
  const limitedActivities = activities.slice(0, limit);

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('approved')) return '✅';
    if (action.toLowerCase().includes('rejected')) return '❌';
    if (action.toLowerCase().includes('created')) return '➕';
    if (action.toLowerCase().includes('updated')) return '📝';
    if (action.toLowerCase().includes('processed')) return '💳';
    if (action.toLowerCase().includes('payment')) return '💰';
    return '📋';
  };

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'loan': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-orange-100 text-orange-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🕒 Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {limitedActivities.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <p>No recent activities</p>
            </div>
          ) : (
            limitedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <span className="text-lg">{getActionIcon(activity.action)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getEntityColor(activity.entity)}>
                      {activity.entity}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.details}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>👤 {activity.userName}</span>
                    {activity.ipAddress && (
                      <>
                        <span>•</span>
                        <span>🌐 {activity.ipAddress}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activities.length > limit && (
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all activities →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}