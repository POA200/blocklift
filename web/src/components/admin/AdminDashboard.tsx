import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminMetricsEditor } from "./AdminMetricsEditor";
import { AdminDistributionsEditor } from "./AdminDistributionsEditor";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Metric {
  key: string;
  label: string;
  desc: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface Distribution {
  id: string;
  schoolName: string;
  location: string;
  status: "verified" | "pending";
  studentsImpacted: number;
  timeAgo: string;
  txId: string;
  supplies: string[];
  principal: string;
  establishedYear: number;
  totalStudents: number;
  totalSuppliesDistributed: number;
  imageSrc: string;
  isActive: boolean;
}

interface AdminDashboardProps {
  apiUrl?: string;
}

export function AdminDashboard({
  apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000",
}: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching admin data from:", apiUrl);

        const [metricsRes, distributionsRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/metrics`),
          fetch(`${apiUrl}/api/admin/distributions`),
        ]);

        console.log("Metrics response:", metricsRes.status, metricsRes.ok);
        console.log(
          "Distributions response:",
          distributionsRes.status,
          distributionsRes.ok
        );

        if (!metricsRes.ok) {
          throw new Error(
            `Failed to fetch metrics: ${metricsRes.status} ${metricsRes.statusText}`
          );
        }

        if (!distributionsRes.ok) {
          throw new Error(
            `Failed to fetch distributions: ${distributionsRes.status} ${distributionsRes.statusText}`
          );
        }

        const metricsData = await metricsRes.json();
        const distributionsData = await distributionsRes.json();

        console.log("Fetched metrics:", metricsData.length);
        console.log("Fetched distributions:", distributionsData.length);

        setMetrics(metricsData);
        setDistributions(distributionsData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Failed to fetch admin data:", errorMessage, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Metric handlers
  const handleSaveMetric = async (metric: Metric) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
      });

      if (!response.ok) throw new Error("Failed to save metric");

      const newMetric = await response.json();
      setMetrics([...metrics, newMetric]);
      showSuccess("Metric added successfully");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save metric");
    }
  };

  const handleUpdateMetric = async (key: string, metric: Metric) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/metrics/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
      });

      if (!response.ok) throw new Error("Failed to update metric");

      const updatedMetric = await response.json();
      setMetrics(metrics.map((m) => (m.key === key ? updatedMetric : m)));
      showSuccess("Metric updated successfully");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update metric");
    }
  };

  const handleDeleteMetric = async (key: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/metrics/${key}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete metric");

      setMetrics(metrics.filter((m) => m.key !== key));
      showSuccess("Metric deleted successfully");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete metric");
    }
  };

  // Distribution handlers
  const handleSaveDistribution = async (
    distribution: Omit<Distribution, "id">
  ) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/distributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(distribution),
      });

      if (!response.ok) throw new Error("Failed to save distribution");

      const newDistribution = await response.json();
      setDistributions([...distributions, newDistribution]);
      showSuccess("Distribution added successfully");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to save distribution"
      );
    }
  };

  const handleUpdateDistribution = async (
    id: string,
    distribution: Partial<Distribution>
  ) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/distributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(distribution),
      });

      if (!response.ok) throw new Error("Failed to update distribution");

      const updatedDistribution = await response.json();
      setDistributions(
        distributions.map((d) => (d.id === id ? updatedDistribution : d))
      );
      showSuccess("Distribution updated successfully");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to update distribution"
      );
    }
  };

  const handleDeleteDistribution = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/distributions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete distribution");

      setDistributions(distributions.filter((d) => d.id !== id));
      showSuccess("Distribution deleted successfully");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to delete distribution"
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminMetricsEditor
                metrics={metrics}
                onSave={handleSaveMetric}
                onDelete={handleDeleteMetric}
                onUpdate={handleUpdateMetric}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Distributions</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminDistributionsEditor
                distributions={distributions}
                onSave={handleSaveDistribution}
                onDelete={handleDeleteDistribution}
                onUpdate={handleUpdateDistribution}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
