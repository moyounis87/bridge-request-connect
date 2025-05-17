
// Mock historical data based on request categories and their revenue impact
const historicalData = {
  'api-integration': {
    averageRevenue: 175000,
    stdDeviation: 65000,
    successProbability: 0.82,
  },
  'user-interface': {
    averageRevenue: 120000,
    stdDeviation: 45000,
    successProbability: 0.75,
  },
  'reporting': {
    averageRevenue: 95000,
    stdDeviation: 30000,
    successProbability: 0.88,
  },
  'security': {
    averageRevenue: 210000,
    stdDeviation: 80000,
    successProbability: 0.65,
  },
  'performance': {
    averageRevenue: 145000,
    stdDeviation: 55000,
    successProbability: 0.7,
  },
  'compliance': {
    averageRevenue: 185000,
    stdDeviation: 60000,
    successProbability: 0.9,
  },
  'other': {
    averageRevenue: 85000,
    stdDeviation: 40000,
    successProbability: 0.6,
  },
};

// Factors that influence prediction
const factorWeights = {
  customerSize: {
    enterprise: 1.5,
    midMarket: 1.0,
    smb: 0.6,
  },
  urgency: {
    high: 1.3,
    medium: 1.0,
    low: 0.8,
  },
  implementationComplexity: {
    high: 0.7,
    medium: 1.0,
    low: 1.2,
  },
};

// Gaussian random function for realistic variation
function gaussianRandom(mean: number, stdDev: number): number {
  const u1 = 1 - Math.random();
  const u2 = 1 - Math.random();
  const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
  return mean + stdDev * randStdNormal;
}

// Determine customer size from business impact description
function detectCustomerSize(businessImpact: string): keyof typeof factorWeights.customerSize {
  const businessImpactLower = businessImpact.toLowerCase();
  
  if (businessImpactLower.includes('enterprise') || 
      businessImpactLower.includes('$100k') || 
      businessImpactLower.includes('million')) {
    return 'enterprise';
  } else if (businessImpactLower.includes('mid-market') || 
             businessImpactLower.includes('medium') || 
             businessImpactLower.includes('$50k')) {
    return 'midMarket';
  } else {
    return 'smb';
  }
}

// Determine urgency from requested timeline
function detectUrgency(timeline: string | undefined): keyof typeof factorWeights.urgency {
  if (!timeline) return 'medium';
  
  const timelineLower = timeline.toLowerCase();
  
  if (timelineLower.includes('asap') || 
      timelineLower.includes('urgent') || 
      timelineLower.includes('immediately')) {
    return 'high';
  } else if (timelineLower.includes('q3') || 
             timelineLower.includes('q4') || 
             timelineLower.includes('next year')) {
    return 'low';
  } else {
    return 'medium';
  }
}

// Determine implementation complexity based on category
function estimateComplexity(category: string): keyof typeof factorWeights.implementationComplexity {
  switch (category) {
    case 'api-integration':
    case 'security':
      return 'high';
    case 'reporting':
    case 'compliance':
      return 'medium';
    default:
      return 'low';
  }
}

interface PredictionInput {
  category: string;
  businessImpact: string;
  requestedTimeline?: string;
  customerName: string;
}

export interface RevenuePrediction {
  predictedRevenue: number;
  probabilityOfSuccess: number;
  confidenceScore: number; // 0-100
  factors: {
    categoryBaseline: number;
    customerSizeImpact: string;
    urgencyImpact: string;
    complexityImpact: string;
  };
}

export function predictRevenueImpact(input: PredictionInput): RevenuePrediction {
  const { category, businessImpact, requestedTimeline, customerName } = input;
  const safeCategory = category in historicalData ? category : 'other';
  
  // Base data from historical performance
  const baseData = historicalData[safeCategory as keyof typeof historicalData];
  
  // Determine factors
  const customerSize = detectCustomerSize(businessImpact);
  const urgency = detectUrgency(requestedTimeline);
  const complexity = estimateComplexity(safeCategory);
  
  // Calculate weighted prediction
  const customerSizeFactor = factorWeights.customerSize[customerSize];
  const urgencyFactor = factorWeights.urgency[urgency];
  const complexityFactor = factorWeights.implementationComplexity[complexity];
  
  // Combined factor effect
  const combinedFactor = customerSizeFactor * urgencyFactor * complexityFactor;
  
  // Add some randomness to make it look like ML with gaussian distribution
  const baselineRevenue = baseData.averageRevenue;
  const adjustedMean = baselineRevenue * combinedFactor;
  const adjustedStdDev = baseData.stdDeviation * (combinedFactor * 0.8); // Reduce variation somewhat as factors explain some of it
  
  // Predicted revenue with realistic variation
  const predictedRevenue = Math.max(10000, Math.round(gaussianRandom(adjustedMean, adjustedStdDev)));
  
  // Probability of success considers all factors
  let probabilityOfSuccess = baseData.successProbability;
  probabilityOfSuccess *= (urgencyFactor > 1 ? 0.95 : 1.05); // Urgent requests slightly less successful
  probabilityOfSuccess *= (complexityFactor < 1 ? 0.9 : 1.02); // Complex projects less successful
  probabilityOfSuccess = Math.min(0.95, Math.max(0.3, probabilityOfSuccess)); // Clamp between 30-95%
  
  // Confidence is higher for known customer types and well-defined categories
  let confidenceScore = 70; // Base confidence
  if (customerName.includes("Multiple") || customerName.includes("Various")) {
    confidenceScore -= 15; // Less confidence for generic customer groups
  }
  if (safeCategory === 'other') {
    confidenceScore -= 10; // Less confidence for miscategorized requests
  }
  
  // Final adjusted confidence
  confidenceScore = Math.min(95, Math.max(40, confidenceScore));
  
  return {
    predictedRevenue,
    probabilityOfSuccess: Number(probabilityOfSuccess.toFixed(2)),
    confidenceScore: Math.round(confidenceScore),
    factors: {
      categoryBaseline: baselineRevenue,
      customerSizeImpact: customerSize,
      urgencyImpact: urgency,
      complexityImpact: complexity,
    }
  };
}
