
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { metrics } from "@/data/mockData";
import { AppShell } from "@/components/AppShell";
import { MetricsCard } from "@/components/MetricsCard";
import { BarChartBig, CheckCircle, ClockIcon, ListTodo, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const { requests } = useRequest();

  // Get recent requests (last 5)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime())
    .slice(0, 5);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link to="/requests/new">New Request</Link>
          </Button>
        </div>
        
        <div className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of all requests.
        </div>
        
        {/* Metrics overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Requests"
            value={metrics.totalRequests}
            icon={<ListTodo size={20} />}
          />
          <MetricsCard
            title="Active Requests"
            value={metrics.activeRequests}
            icon={<ClockIcon size={20} />}
          />
          <MetricsCard
            title="Accepted Rate"
            value={`${Math.round((metrics.acceptedRequests / metrics.totalRequests) * 100)}%`}
            icon={<CheckCircle size={20} />}
          />
          <MetricsCard
            title="Avg. Resolution Time"
            value={`${metrics.averageResolutionDays} days`}
            icon={<BarChartBig size={20} />}
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <Link to={`/requests/${request.id}`} className="font-medium hover:text-primary">
                      {request.title}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Requested by {request.requestedBy.name}</span>
                      <span>•</span>
                      <span>{format(new Date(request.lastUpdatedDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <StatusBadge status={request.currentStatus} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
