import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit2, Plus, MapPin, Users, Package } from "lucide-react";

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

interface AdminDistributionsEditorProps {
  distributions: Distribution[];
  onSave: (distribution: Omit<Distribution, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, distribution: Partial<Distribution>) => Promise<void>;
}

export function AdminDistributionsEditor({
  distributions,
  onSave,
  onDelete,
  onUpdate,
}: AdminDistributionsEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suppliesInput, setSuppliesInput] = useState("");
  const [formData, setFormData] = useState<Omit<Distribution, "id">>({
    schoolName: "",
    location: "",
    status: "pending",
    studentsImpacted: 0,
    timeAgo: "just now",
    txId: "",
    supplies: [],
    principal: "",
    establishedYear: new Date().getFullYear(),
    totalStudents: 0,
    totalSuppliesDistributed: 0,
    imageSrc: "",
    isActive: true,
  });

  const handleOpenDialog = (distribution?: Distribution) => {
    if (distribution) {
      setEditingId(distribution.id);
      const { id, ...rest } = distribution;
      setFormData(rest);
      setSuppliesInput(distribution.supplies.join(", "));
    } else {
      setEditingId(null);
      setFormData({
        schoolName: "",
        location: "",
        status: "pending",
        studentsImpacted: 0,
        timeAgo: "just now",
        txId: "",
        supplies: [],
        principal: "",
        establishedYear: new Date().getFullYear(),
        totalStudents: 0,
        totalSuppliesDistributed: 0,
        imageSrc: "",
        isActive: true,
      });
      setSuppliesInput("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supplies = suppliesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      const finalData = { ...formData, supplies };

      if (editingId) {
        await onUpdate(editingId, finalData);
      } else {
        await onSave(finalData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving distribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this distribution?")) {
      setLoading(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error deleting distribution:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Distributions</h3>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Distribution
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {distributions.map((dist) => (
          <Card
            key={dist.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            {dist.imageSrc && (
              <div className="w-full h-32 bg-muted overflow-hidden">
                <img
                  src={dist.imageSrc}
                  alt={dist.schoolName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-sm line-clamp-2">
                {dist.schoolName}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {dist.location}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Students:</span>
                  <span className="font-medium">{dist.totalStudents}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Supplies:</span>
                  <span className="font-medium">
                    {dist.totalSuppliesDistributed}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <Badge
                  variant={dist.status === "verified" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {dist.status}
                </Badge>
                {dist.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(dist)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(dist.id)}
                  disabled={loading}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {distributions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No distributions yet.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Distribution" : "Add New Distribution"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name *</label>
                <Input
                  placeholder="School name"
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  placeholder="City, Region"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Principal Name *</label>
                <Input
                  placeholder="Principal name"
                  value={formData.principal}
                  onChange={(e) =>
                    setFormData({ ...formData, principal: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total Students</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.totalStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalStudents: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Students Impacted</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.studentsImpacted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentsImpacted: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Supplies Distributed
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.totalSuppliesDistributed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalSuppliesDistributed: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <Input
                  type="number"
                  placeholder={new Date().getFullYear().toString()}
                  value={formData.establishedYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      establishedYear: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">TX ID</label>
                <Input
                  placeholder="0x..."
                  value={formData.txId}
                  onChange={(e) =>
                    setFormData({ ...formData, txId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Ago</label>
                <Input
                  placeholder="e.g., 2 hours ago"
                  value={formData.timeAgo}
                  onChange={(e) =>
                    setFormData({ ...formData, timeAgo: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Supplies (comma-separated)
              </label>
              <Input
                placeholder="e.g., 25 School Bags, 50 Books"
                value={suppliesInput}
                onChange={(e) => setSuppliesInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="https://..."
                value={formData.imageSrc}
                onChange={(e) =>
                  setFormData({ ...formData, imageSrc: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium cursor-pointer"
              >
                Active
              </label>
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
