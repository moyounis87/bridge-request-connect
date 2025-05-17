
import { AppShell } from "@/components/AppShell";
import { useRequest } from "@/context/RequestContext";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export default function RoadmapPage() {
  const { requests } = useRequest();
  
  // Filter requests that are scheduled (accepted, planned, in-development)
  const roadmapItems = requests.filter(
    (request) =>
      request.currentStatus === "accepted" ||
      request.currentStatus === "planned" ||
      request.currentStatus === "in-development"
  );
  
  // Group requests by quarter
  const currentYear = new Date().getFullYear();
  const quarters = [
    { id: "q2-2025", label: `Q2 ${currentYear}`, items: [] as any[] },
    { id: "q3-2025", label: `Q3 ${currentYear}`, items: [] as any[] },
    { id: "q4-2025", label: `Q4 ${currentYear}`, items: [] as any[] },
    { id: "future", label: "Future", items: [] as any[] },
  ];
  
  // Simple assignment based on timeline field
  roadmapItems.forEach((item) => {
    if (item.requestedTimeline?.toLowerCase().includes("q2")) {
      quarters[0].items.push(item);
    } else if (item.requestedTimeline?.toLowerCase().includes("q3")) {
      quarters[1].items.push(item);
    } else if (item.requestedTimeline?.toLowerCase().includes("q4")) {
      quarters[2].items.push(item);
    } else {
      quarters[3].items.push(item);
    }
  });
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
          <p className="text-muted-foreground mt-2">
            View upcoming feature releases based on accepted requests.
          </p>
        </div>
        
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>
          
          {/* Timeline view */}
          <TabsContent value="timeline" className="space-y-8">
            {quarters.map((quarter) => (
              <div key={quarter.id}>
                <h2 className="text-xl font-semibold mb-4">{quarter.label}</h2>
                {quarter.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quarter.items.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Link
                              to={`/requests/${item.id}`}
                              className="font-medium hover:text-primary hover:underline"
                            >
                              {item.title}
                            </Link>
                            <StatusBadge status={item.currentStatus} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {item.customerName}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No features scheduled for this period.</p>
                )}
              </div>
            ))}
          </TabsContent>
          
          {/* Kanban view */}
          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Accepted column */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <StatusBadge status="accepted" />
                  <span>Accepted</span>
                </h2>
                
                {roadmapItems
                  .filter((item) => item.currentStatus === "accepted")
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          to={`/requests/${item.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.customerName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                
                {roadmapItems.filter((item) => item.currentStatus === "accepted").length === 0 && (
                  <p className="text-sm text-muted-foreground">No accepted requests.</p>
                )}
              </div>
              
              {/* Planned column */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <StatusBadge status="planned" />
                  <span>Planned</span>
                </h2>
                
                {roadmapItems
                  .filter((item) => item.currentStatus === "planned")
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          to={`/requests/${item.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.customerName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                
                {roadmapItems.filter((item) => item.currentStatus === "planned").length === 0 && (
                  <p className="text-sm text-muted-foreground">No planned requests.</p>
                )}
              </div>
              
              {/* In Development column */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <StatusBadge status="in-development" />
                  <span>In Development</span>
                </h2>
                
                {roadmapItems
                  .filter((item) => item.currentStatus === "in-development")
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link
                          to={`/requests/${item.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.customerName}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                
                {roadmapItems.filter((item) => item.currentStatus === "in-development").length === 0 && (
                  <p className="text-sm text-muted-foreground">No requests in development.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
