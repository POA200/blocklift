import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit2, Plus } from "lucide-react";

interface Metric {
  key: string;
  label: string;
  desc: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

interface AdminMetricsEditorProps {
  metrics: Metric[];
  onSave: (metric: Metric) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
  onUpdate: (key: string, metric: Metric) => Promise<void>;
}

export function AdminMetricsEditor({
  metrics,
  onSave,
  onDelete,
  onUpdate,
}: AdminMetricsEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Metric>({
    key: "",
    label: "",
    desc: "",
    value: 0,
    prefix: "",
    suffix: "",
  });

  const handleOpenDialog = (metric?: Metric) => {
    if (metric) {
      setEditingKey(metric.key);
      setFormData(metric);
    } else {
      setEditingKey(null);
      setFormData({
        key: "",
        label: "",
        desc: "",
        value: 0,
        prefix: "",
        suffix: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingKey(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingKey) {
        await onUpdate(editingKey, formData);
      } else {
        await onSave(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving metric:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (confirm("Are you sure you want to delete this metric?")) {
      setLoading(true);
      try {
        await onDelete(key);
      } catch (error) {
        console.error("Error deleting metric:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Metrics</h3>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Metric
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.key} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {metric.prefix}
                {metric.value.toLocaleString()}
                {metric.suffix}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {metric.desc}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(metric)}
                  disabled={loading}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(metric.key)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingKey ? "Edit Metric" : "Add New Metric"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key</label>
              <Input
                placeholder="e.g., children_equipped"
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                disabled={editingKey !== null}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Label</label>
              <Input
                placeholder="e.g., Children Equipped"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., learning kits delivered"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input
                type="number"
                placeholder="0"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prefix</label>
                <Input
                  placeholder="e.g., $"
                  value={formData.prefix || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, prefix: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Suffix</label>
                <Input
                  placeholder="e.g., +"
                  value={formData.suffix || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
