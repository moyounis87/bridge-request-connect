
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          BridgeWorks
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700">
          Bridge the gap between sales and product teams.
        </p>
        <p className="text-lg max-w-2xl mx-auto mb-10 text-gray-600">
          A structured platform for sales teams to submit feature requests with business context and for product teams to evaluate and provide transparent feedback.
        </p>
        
        <Button size="lg" onClick={() => navigate("/login")} className="gap-2">
          Get Started <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Index;
