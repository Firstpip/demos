"use client";

import { useState, useMemo } from "react";
import { Copy, Plus, LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  deepLinks,
  products,
  getProduct,
  formatKRW,
  type DeepLink,
} from "@/lib/data";

const INFLUENCER_ID = "inf-1";

export default function InfluencerLinksPage() {
  const [links, setLinks] = useState<DeepLink[]>(() =>
    deepLinks.filter((dl) => dl.influencerId === INFLUENCER_ID)
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeProducts = useMemo(
    () => products.filter((p) => p.status === "active"),
    []
  );

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard?.writeText(`https://${shortUrl}`).catch(() => {});
    toast("Link copied!");
  };

  const handleCreate = () => {
    if (!selectedProductId) {
      toast.error("Please select a product.");
      return;
    }

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const slug = prod.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20);
    const newLink: DeepLink = {
      id: `dl-new-${Date.now()}`,
      influencerId: INFLUENCER_ID,
      productId: prod.id,
      url: `https://shop.example.com/r/sarah-${slug}`,
      shortUrl: `s.kr/${Math.random().toString(36).slice(2, 6)}`,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLinks((prev) => [newLink, ...prev]);
    setSelectedProductId("");
    setDialogOpen(false);
    toast.success("Link created successfully!");
  };

  return (
    <div id="page-inf-links" className="space-y-6">
      <div className="flex items-center justify-between" id="inf-links">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Links</h2>
          <p className="text-gray-500 mt-1">
            Manage your deep links and track performance.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            id="inf-link-create"
            render={
              <Button style={{ backgroundColor: "#6366F1", color: "white" }} />
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Link
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Deep Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Product
                </label>
                <Select
                  value={selectedProductId}
                  onValueChange={(v) => setSelectedProductId(v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                onClick={handleCreate}
                style={{ backgroundColor: "#6366F1", color: "white" }}
              >
                Generate Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((dl) => {
                  const prod = getProduct(dl.productId);
                  const convRate =
                    dl.clicks > 0
                      ? ((dl.conversions / dl.clicks) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <TableRow key={dl.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-medium">
                            {prod?.nameEn ?? "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {dl.shortUrl}
                        </code>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {dl.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {dl.conversions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {convRate}%
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatKRW(dl.revenue)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {dl.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(dl.shortUrl)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
