
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarIcon, LogOut, BarChartBig, Home, FileText, ListTodo } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavLink({ to, icon, label }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "hover:bg-muted/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <>{children}</>;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-primary">BridgeWorks</h2>
        </div>
        
        <div className="flex flex-col justify-between flex-1 py-6">
          <nav className="space-y-1 px-3">
            <NavLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" />
            <NavLink to="/requests" icon={<ListTodo size={18} />} label="Requests" />
            <NavLink to="/roadmap" icon={<CalendarIcon size={18} />} label="Roadmap" />
            {user.role === "admin" && (
              <NavLink to="/reports" icon={<BarChartBig size={18} />} label="Reports" />
            )}
          </nav>
          
          <div className="px-3 mt-auto">
            <div className="flex items-center justify-between p-4 border-t border-border mt-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
