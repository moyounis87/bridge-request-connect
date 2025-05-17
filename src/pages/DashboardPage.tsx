
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequest } from "@/context/RequestContext";
import { metrics } from "@/data/mockData";
import { AppShell } from "@/components/AppShell";
import { MetricsCard } from "@/components/MetricsCard";
import { FeatureSuggestionPanel } from "@/components/FeatureSuggestionPanel";
import { BarChartBig, CheckCircle, ClockIcon, Filter, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestCategory, RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuth();
  const { requests } = useRequest();

  // Filter states
  const [viewFilter, setViewFilter] = useState<"own" | "all" | "team" | "region">("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Apply filters
  const filteredRequests = requests.filter(request => {
    // View filter
    if (viewFilter === "own" && request.requestedById !== user?.id) return false;
    if (viewFilter === "team" && request.requestedBy.teamId !== user?.teamId) return false;
    if (viewFilter === "region" && request.requestedBy.region !== user?.region) return false;
    
    // Status filter
    if (statusFilter !== "all" && request.currentStatus !== statusFilter) return false;
    
    // Category filter
    if (categoryFilter !== "all" && request.category !== categoryFilter) return false;
    
    return true;
  });

  // Get recent requests (last 5 from filtered list)
  const recentRequests = [...filteredRequests]
    .sort((a, b) => new Date(b.lastUpdatedDate).getTime() - new Date(a.lastUpdatedDate).getTime())
    .slice(0, 5);

  const selectedRequestData = recentRequests.find(req => req.id === selectedRequest);

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

        {/* Filters */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <Select
                  value={viewFilter}
                  onValueChange={(value) => setViewFilter(value as "own" | "all" | "team" | "region")}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="own">My Requests</SelectItem>
                    <SelectItem value="team">My Team</SelectItem>
                    <SelectItem value="region">My Region</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-auto">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-development">In Development</SelectItem>
                    <SelectItem value="released">Released</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-auto">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value as RequestCategory | "all")}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="api-integration">API Integration</SelectItem>
                    <SelectItem value="user-interface">User Interface</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity with AI Feature Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 cursor-pointer ${selectedRequest === request.id ? 'bg-slate-50 -mx-4 px-4 rounded-md' : ''}`}
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Link to={`/requests/${request.id}`} className="font-medium hover:text-primary">
                            {request.title}
                          </Link>
                          <Badge variant="outline" className="capitalize">
                            {request.category.replace(/-/g, ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Requested by {request.requestedBy.name}</span>
                          <span>•</span>
                          <span>{format(new Date(request.lastUpdatedDate), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                      <StatusBadge status={request.currentStatus} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No requests match your current filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {selectedRequestData ? (
              <FeatureSuggestionPanel 
                category={selectedRequestData.category}
                title={selectedRequestData.title}
                description={selectedRequestData.description}
              />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6 text-muted-foreground">
                    Select a request to see AI-powered feature insights
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
