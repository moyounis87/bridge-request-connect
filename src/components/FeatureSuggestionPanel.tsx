
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Package, Calendar, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestCategory } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface RelatedFeature {
  title: string;
  description: string;
  category: RequestCategory;
  impact: "high" | "medium" | "low";
}

interface FeatureBundle {
  name: string;
  features: string[];
  developmentEffort: number; // Days
  developmentSynergy: number; // 1-100
}

interface ReleaseTiming {
  recommendedDate: string;
  salesImpact: "high" | "medium" | "low";
  reasoning: string;
}

interface FeatureSuggestionPanelProps {
  category: RequestCategory;
  title: string;
  description: string;
}

export function FeatureSuggestionPanel({ category, title, description }: FeatureSuggestionPanelProps) {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("related");

  // This would come from a real API in a production app
  const getMockedRelatedFeatures = (): RelatedFeature[] => {
    // Different suggestions based on the category
    switch(category) {
      case "api-integration":
        return [
          {
            title: "Webhook Event Notifications",
            description: "Send real-time updates to third-party systems when events occur",
            category: "api-integration",
            impact: "high",
          },
          {
            title: "API Rate Limiting Controls",
            description: "Allow customers to configure their own API usage limits",
            category: "api-integration",
            impact: "medium",
          },
          {
            title: "OAuth 2.0 Integration",
            description: "Standardize authentication across all integrations",
            category: "api-integration",
            impact: "high",
          },
        ];
      case "user-interface":
        return [
          {
            title: "Customizable Dashboard Widgets",
            description: "Allow users to create their own dashboard layouts",
            category: "user-interface",
            impact: "high",
          },
          {
            title: "Bulk Action Controls",
            description: "Enable users to perform actions on multiple items at once",
            category: "user-interface",
            impact: "medium",
          },
          {
            title: "Dark Mode Support",
            description: "Provide a dark color theme for the application",
            category: "user-interface",
            impact: "low",
          },
        ];
      case "reporting":
        return [
          {
            title: "Custom Report Builder",
            description: "Allow users to create their own report templates",
            category: "reporting",
            impact: "high",
          },
          {
            title: "Scheduled Reports",
            description: "Automatically generate and email reports on a schedule",
            category: "reporting",
            impact: "medium",
          },
          {
            title: "Data Export Options",
            description: "Export reports to Excel, CSV, and PDF formats",
            category: "reporting",
            impact: "medium",
          },
        ];
      default:
        return [
          {
            title: "Enhanced Search Functionality",
            description: "Implement advanced search with filters and sorting",
            category: "other",
            impact: "medium",
          },
          {
            title: "Notification Preferences",
            description: "Let users customize which alerts they receive",
            category: "other",
            impact: "low",
          },
          {
            title: "Team Collaboration Tools",
            description: "Add commenting and sharing features to requests",
            category: "other",
            impact: "high",
          },
        ];
    }
  };

  // This would come from a real API in a production app
  const getMockedFeatureBundles = (): FeatureBundle[] => {
    // Different bundles based on the category
    switch(category) {
      case "api-integration":
        return [
          {
            name: "API Platform Expansion",
            features: [title, "Webhook Event Notifications", "API Documentation Portal"],
            developmentEffort: 21,
            developmentSynergy: 85,
          },
          {
            name: "Integration Security Bundle",
            features: ["OAuth 2.0 Integration", "API Rate Limiting", title],
            developmentEffort: 14,
            developmentSynergy: 72,
          },
        ];
      case "user-interface":
        return [
          {
            name: "UI Modernization Bundle",
            features: [title, "Dark Mode Support", "Responsive Mobile Views"],
            developmentEffort: 18,
            developmentSynergy: 78,
          },
          {
            name: "User Productivity Pack",
            features: ["Customizable Dashboard", title, "Keyboard Shortcuts"],
            developmentEffort: 15,
            developmentSynergy: 68,
          },
        ];
      case "reporting":
        return [
          {
            name: "Reporting Power User Bundle",
            features: [title, "Custom Report Builder", "Advanced Filtering"],
            developmentEffort: 25,
            developmentSynergy: 80,
          },
          {
            name: "Data Insights Package",
            features: ["Scheduled Reports", title, "Interactive Charts"],
            developmentEffort: 20,
            developmentSynergy: 75,
          },
        ];
      default:
        return [
          {
            name: "User Experience Enhancements",
            features: [title, "Enhanced Search", "Performance Optimizations"],
            developmentEffort: 16,
            developmentSynergy: 65,
          },
          {
            name: "Collaboration Toolkit",
            features: ["Team Sharing Features", title, "Activity Timeline"],
            developmentEffort: 22,
            developmentSynergy: 70,
          },
        ];
    }
  };

  // This would come from a real API in a production app
  const getMockedReleaseTiming = (): ReleaseTiming[] => {
    return [
      {
        recommendedDate: "Q3 2025",
        salesImpact: "high",
        reasoning: "Aligns with typical enterprise budget planning cycle for next fiscal year",
      },
      {
        recommendedDate: "Q2 2025",
        salesImpact: "medium",
        reasoning: "Could be bundled with summer product release ahead of industry conference",
      },
      {
        recommendedDate: "Q4 2025",
        salesImpact: "low",
        reasoning: "End of year software updates often receive less attention due to holiday seasons",
      },
    ];
  };

  const relatedFeatures = getMockedRelatedFeatures();
  const featureBundles = getMockedFeatureBundles();
  const releaseTimings = getMockedReleaseTiming();

  const handleFeatureClick = (feature: RelatedFeature) => {
    toast({
      title: `Added to planning board`,
      description: `"${feature.title}" has been added to your feature planning board.`,
    });
  };

  const handleBundleClick = (bundle: FeatureBundle) => {
    toast({
      title: `Bundle selected`,
      description: `The "${bundle.name}" bundle has been selected for roadmap planning.`,
    });
  };

  const handleTimingClick = (timing: ReleaseTiming) => {
    toast({
      title: `Release timeframe set`,
      description: `${timing.recommendedDate} has been set as the target release window.`,
    });
  };

  const getImpactColor = (impact: "high" | "medium" | "low") => {
    switch(impact) {
      case "high": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "low": return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Feature Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="related"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full gap-2 p-1 rounded-md mb-2">
            <TabsTrigger 
              value="related" 
              className="flex items-center gap-2 px-4 py-2 transition-all rounded-md border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Related Features</span>
            </TabsTrigger>
            <TabsTrigger 
              value="bundles" 
              className="flex items-center gap-2 px-4 py-2 transition-all rounded-md border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Feature Bundles</span>
            </TabsTrigger>
            <TabsTrigger 
              value="timing" 
              className="flex items-center gap-2 px-4 py-2 transition-all rounded-md border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Release Timing</span>
            </TabsTrigger>
          </TabsList>

          {/* Related Features Tab */}
          <TabsContent value="related" className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground mb-3">
              Features that might deliver similar outcomes to "{title}":
            </div>
            <div className="grid gap-3">
              {relatedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{feature.title}</h3>
                    <Badge variant="outline" className={getImpactColor(feature.impact)}>
                      {feature.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {feature.description}
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeatureClick(feature);
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Add to planning
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Feature Bundles Tab */}
          <TabsContent value="bundles" className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground mb-3">
              Potential feature bundles that include "{title}":
            </div>
            <div className="grid gap-4">
              {featureBundles.map((bundle, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleBundleClick(bundle)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{bundle.name}</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {bundle.developmentSynergy}% synergy
                    </Badge>
                  </div>
                  <div className="space-y-1 mb-3">
                    {bundle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <ArrowRight className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className={feature === title ? "font-medium" : ""}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Est. development: {bundle.developmentEffort} days</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBundleClick(bundle);
                      }}
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Select bundle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Release Timing Tab */}
          <TabsContent value="timing" className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground mb-3">
              Recommended release timing for "{title}" based on sales cycles:
            </div>
            <div className="grid gap-3">
              {releaseTimings.map((timing, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleTimingClick(timing)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{timing.recommendedDate}</h3>
                    <Badge variant="outline" className={getImpactColor(timing.salesImpact)}>
                      {timing.salesImpact} sales impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {timing.reasoning}
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTimingClick(timing);
                      }}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Set timeframe
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
