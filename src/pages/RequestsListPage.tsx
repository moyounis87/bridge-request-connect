
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "@/context/RequestContext";
import { useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequestStatus, RequestCategory } from "@/types";
import { format } from "date-fns";
import { Filter, Link as LinkIcon, Plus, Search, Users, UsersRound } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestsListPage() {
  const { requests } = useRequest();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "all">("all");
  const [viewFilter, setViewFilter] = useState<"own" | "all" | "team" | "region">("all");

  // Filter requests based on all filters
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || request.currentStatus === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    
    // View filter (own, team, region)
    let matchesView = true;
    if (viewFilter === "own") {
      matchesView = request.requestedById === user?.id;
    } else if (viewFilter === "team" && user?.teamId) {
      matchesView = request.requestedBy.teamId === user.teamId;
    } else if (viewFilter === "region" && user?.region) {
      matchesView = request.requestedBy.region === user.region;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesView;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Feature Requests</h1>
          <Button asChild>
            <Link to="/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
        
        {/* Advanced Filters Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={viewFilter}
                onValueChange={(value) => setViewFilter(value as "own" | "all" | "team" | "region")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="own">My Requests</SelectItem>
                  <SelectItem value="team">My Team</SelectItem>
                  <SelectItem value="region">My Region</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
              >
                <SelectTrigger>
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
              
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as RequestCategory | "all")}
              >
                <SelectTrigger>
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
            
            {/* Active filters display */}
            {(searchQuery || statusFilter !== "all" || categoryFilter !== "all" || viewFilter !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {viewFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <UsersRound className="h-3 w-3" />
                    {viewFilter === "own" ? "My Requests" : viewFilter === "team" ? "My Team" : "My Region"}
                  </Badge>
                )}
                
                {statusFilter !== "all" && (
                  <StatusBadge status={statusFilter} />
                )}
                
                {categoryFilter !== "all" && (
                  <CategoryBadge category={categoryFilter} showIcon />
                )}
                
                {searchQuery && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Search: {searchQuery}
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setViewFilter("all");
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Requests Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Request</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/requests/${request.id}`} 
                        className="hover:text-primary hover:underline"
                      >
                        {request.title}
                      </Link>
                    </TableCell>
                    <TableCell>{request.customerName}</TableCell>
                    <TableCell>
                      <CategoryBadge category={request.category || 'other'} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                        {request.requestedBy.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.lastUpdatedDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.currentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {request.crmLink && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={request.crmLink} target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/requests/${request.id}`}>View</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No requests found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
