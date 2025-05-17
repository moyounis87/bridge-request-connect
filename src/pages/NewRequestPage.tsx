
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from "@/context/RequestContext";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestCategory } from "@/types";

export default function NewRequestPage() {
  const { createRequest } = useRequest();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessImpact: "",
    customerName: "",
    requestedTimeline: "",
    useCase: "",
    crmLink: "",
    category: "other" as RequestCategory,
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      // Validate current step
      if (currentStep === 1) {
        if (!formData.title || !formData.description || !formData.businessImpact || !formData.category) {
          toast({
            title: "Please fill all required fields",
            variant: "destructive",
          });
          return;
        }
      }
      
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // On final step submission
    if (!formData.customerName) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    createRequest({
      ...formData,
      requestedById: "",  // This will be populated in the context
    });
    
    navigate("/requests");
  };
  
  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/requests");
    }
  };
  
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <button onClick={goBack} className="flex items-center text-muted-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {currentStep > 1 ? "Previous Step" : "Back to requests"}
        </button>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>New Feature Request</CardTitle>
              <CardDescription>
                Step {currentStep} of {totalSteps} - 
                {currentStep === 1 ? " Basic Information" : " Additional Details"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentStep === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Request Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="E.g., API Integration with Salesforce"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of the feature"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessImpact">
                      Business Impact <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="businessImpact"
                      name="businessImpact"
                      value={formData.businessImpact}
                      onChange={handleChange}
                      placeholder="Describe the business value, potential revenue impact, etc."
                      rows={3}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      Customer Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="E.g., Acme Corp or 'Multiple Customers'"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crmLink">
                      CRM Opportunity Link
                    </Label>
                    <Input
                      id="crmLink"
                      name="crmLink"
                      value={formData.crmLink}
                      onChange={handleChange}
                      placeholder="E.g., https://crm.company.com/opportunities/123"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requestedTimeline">
                      Requested Timeline
                    </Label>
                    <Input
                      id="requestedTimeline"
                      name="requestedTimeline"
                      value={formData.requestedTimeline}
                      onChange={handleChange}
                      placeholder="E.g., Q2 2025 or ASAP"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="useCase">Use Case</Label>
                    <Textarea
                      id="useCase"
                      name="useCase"
                      value={formData.useCase}
                      onChange={handleChange}
                      placeholder="Describe how customers will use this feature"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
              >
                {currentStep > 1 ? "Back" : "Cancel"}
              </Button>
              <Button type="submit">
                {currentStep < totalSteps ? "Next Step" : "Create Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
