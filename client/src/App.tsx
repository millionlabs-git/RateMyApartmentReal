import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
import { AdminRoute } from "@/components/admin/admin-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import ResetPassword from "@/pages/reset-password";
import Settings from "@/pages/settings";
import VerifyEmail from "@/pages/verify-email";
import Search from "@/pages/search";
import AddBuilding from "@/pages/add-building";
import Building from "@/pages/building";
import AddReview from "@/pages/add-review";
import Forbidden from "@/pages/forbidden";
import About from "@/pages/about";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminReviews from "@/pages/admin/reviews";
import AdminBuildings from "@/pages/admin/buildings";
import AdminDuplicates from "@/pages/admin/duplicates";
import DuplicateCompare from "@/pages/admin/duplicate-compare";

function GuestRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <>
    <ScrollToTop />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/add-building" component={AddBuilding} />
      <Route path="/building/:id" component={Building} />
      <Route path="/building/:id/review">
        {() => <ProtectedRoute component={AddReview} />}
      </Route>
      <Route path="/signup">
        {() => <GuestRoute component={Signup} />}
      </Route>
      <Route path="/login">
        {() => <GuestRoute component={Login} />}
      </Route>
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route path="/verify-email/:token" component={VerifyEmail} />
      <Route path="/forbidden" component={Forbidden} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin">
        {() => (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/reviews">
        {() => (
          <AdminRoute>
            <AdminReviews />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/buildings">
        {() => (
          <AdminRoute>
            <AdminBuildings />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/duplicates">
        {() => (
          <AdminRoute>
            <AdminDuplicates />
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/duplicates/:id">
        {() => (
          <AdminRoute>
            <DuplicateCompare />
          </AdminRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
