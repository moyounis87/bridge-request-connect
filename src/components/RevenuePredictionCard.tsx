
import { RevenuePrediction } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BarChart, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenuePredictionCardProps {
  prediction: RevenuePrediction;
}

export function RevenuePredictionCard({ prediction }: RevenuePredictionCardProps) {
  const { 
    predictedRevenue, 
    probabilityOfSuccess, 
    confidenceScore,
    factors
  } = prediction;
  
  // Format the revenue as currency
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(predictedRevenue);
  
  // Determine color based on confidence score
  const getConfidenceColor = () => {
    if (confidenceScore >= 75) return "text-green-500";
    if (confidenceScore >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  // Determine style based on probability
  const getProbabilityClass = () => {
    if (probabilityOfSuccess >= 0.8) return "text-green-600 bg-green-100";
    if (probabilityOfSuccess >= 0.6) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Revenue Prediction
            </CardTitle>
            <CardDescription>
              AI-powered impact estimation
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn("text-xs", getConfidenceColor())}>
            {confidenceScore}% Confidence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Predicted Revenue Impact</span>
          <span className="text-2xl font-semibold flex items-center">
            <DollarSign className="h-6 w-6 text-green-500 mr-1" />
            {formattedRevenue}
          </span>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Probability of Success</span>
            <span className="font-medium">{Math.round(probabilityOfSuccess * 100)}%</span>
          </div>
          <Progress value={probabilityOfSuccess * 100} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground block mb-1">Customer Size</span>
            <span className="font-medium capitalize">{factors.customerSizeImpact}</span>
          </div>
          
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground block mb-1">Urgency</span>
            <span className="font-medium capitalize">{factors.urgencyImpact}</span>
          </div>
          
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground block mb-1">Complexity</span>
            <span className="font-medium capitalize">{factors.complexityImpact}</span>
          </div>
          
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
            <span className="text-xs text-muted-foreground block mb-1">Category Baseline</span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD',
                maximumFractionDigits: 0 
              }).format(factors.categoryBaseline)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 dark:bg-slate-800 py-3 flex gap-2 text-sm">
        {probabilityOfSuccess >= 0.7 ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        <p className="text-muted-foreground">
          {probabilityOfSuccess >= 0.7 
            ? "Recommendation: Strong revenue potential relative to effort required."
            : "Recommendation: Consider exploring alternatives with higher success probability."}
        </p>
      </CardFooter>
    </Card>
  );
}
