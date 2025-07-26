import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import YachtsPage from "./pages/YachtsPage";
import YachtDetailsPage from "./pages/YachtDetailsPage";
import LocationsPage from "./pages/LocationsPage";
import LocationDetailsPage from "./pages/LocationDetailsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminYachtsPage from "./pages/AdminYachtsPage";
import AdminLocationsPage from "./pages/AdminLocationsPage";
import AdminArticlesPage from "./pages/AdminArticlesPage";
import NotFound from "./pages/NotFound";
import { useAdminAuth } from "./hooks/useAdminAuth";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { adminSession } = useAdminAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/yachts" element={<YachtsPage />} />
      <Route path="/yacht/:id" element={<YachtDetailsPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="/location/:id" element={<LocationDetailsPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/article/:id" element={<ArticleDetailsPage />} />
      <Route path="/admin" element={adminSession ? <AdminDashboard /> : <AdminLoginPage />} />
      <Route path="/admin/yachts" element={adminSession ? <AdminYachtsPage /> : <AdminLoginPage />} />
      <Route path="/admin/locations" element={adminSession ? <AdminLocationsPage /> : <AdminLoginPage />} />
      <Route path="/admin/articles" element={adminSession ? <AdminArticlesPage /> : <AdminLoginPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
