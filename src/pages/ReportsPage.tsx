
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequest } from "@/context/RequestContext";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DownloadIcon } from "lucide-react";

export default function ReportsPage() {
  const { requests, statusUpdates } = useRequest();
  
  // Calculate metrics
  const totalRequests = requests.length;
  const requestsByStatus = requests.reduce(
    (acc, request) => {
      const status = request.currentStatus.replace(/-/g, " ");
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  
  // Format data for pie chart
  const pieData = Object.entries(requestsByStatus).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Format data for bar chart
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  
  // Group requests by week for the last 30 days
  const requestsByWeek = requests.reduce(
    (acc, request) => {
      const creationDate = new Date(request.creationDate);
      if (creationDate >= thirtyDaysAgo) {
        // Calculate week number from the 30-day period (0 to 4)
        const daysDiff = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekNum = Math.floor(daysDiff / 7);
        const weekLabel = `Week ${4 - weekNum}`;
        
        if (!acc[weekLabel]) {
          acc[weekLabel] = 0;
        }
        acc[weekLabel]++;
      }
      return acc;
    },
    {} as Record<string, number>
  );
  
  const barData = Object.entries(requestsByWeek)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .reverse();
  
  // Calculate average resolution time
  let totalResolutionDays = 0;
  let resolvedCount = 0;
  
  requests.forEach((request) => {
    if (
      request.currentStatus === "accepted" ||
      request.currentStatus === "declined" ||
      request.currentStatus === "released"
    ) {
      const creationDate = new Date(request.creationDate);
      const lastUpdatedDate = new Date(request.lastUpdatedDate);
      const resolutionDays = Math.floor((lastUpdatedDate.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
      totalResolutionDays += resolutionDays;
      resolvedCount++;
    }
  });
  
  const averageResolutionDays = resolvedCount > 0 ? (totalResolutionDays / resolvedCount).toFixed(1) : "N/A";
  const acceptanceRate = totalRequests > 0 ? ((requestsByStatus["accepted"] || 0) / totalRequests * 100).toFixed(1) : "0";
  
  // Colors for pie chart
  const COLORS = ["#2563eb", "#10b981", "#ef4444", "#f59e0b", "#4f46e5", "#64748b"];
  
  const handleExportCSV = () => {
    // In a real app, this would generate a CSV file with request data
    console.log("Exporting request data as CSV...");
    
    // Example implementation
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Description,Customer,Status,Created Date\n";
    
    requests.forEach((request) => {
      csvContent += `${request.id},${request.title},"${request.description}",${request.customerName},${request.currentStatus},${request.creationDate}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bridgeworks_requests_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-2">
              Analytics and metrics for feature requests
            </p>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <DownloadIcon size={16} />
            Export CSV
          </Button>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptanceRate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageResolutionDays} days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusUpdates.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart for request volume over time */}
          <Card>
            <CardHeader>
              <CardTitle>Request Volume (30 Days)</CardTitle>
              <CardDescription>
                Number of new requests submitted each week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Pie chart for status distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
              <CardDescription>
                Current status breakdown of all requests
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
