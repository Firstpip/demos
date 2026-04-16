"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { consumers, influencers, vendors } from "@/lib/data";
import type { User, InfluencerProfile, Vendor } from "@/lib/data";
import { toast } from "sonner";
import { Eye } from "lucide-react";

type UserStatus = Record<string, boolean>;

export default function AdminUsersPage() {
  const [consumerStatus, setConsumerStatus] = useState<UserStatus>(
    Object.fromEntries(consumers.map((c) => [c.id, true]))
  );
  const [influencerStatus, setInfluencerStatus] = useState<UserStatus>(
    Object.fromEntries(influencers.map((i) => [i.id, true]))
  );
  const [vendorStatus, setVendorStatus] = useState<UserStatus>(
    Object.fromEntries(vendors.map((v) => [v.id, true]))
  );

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    type: "consumer" | "influencer" | "vendor";
    data: User | InfluencerProfile | Vendor | null;
  }>({ open: false, type: "consumer", data: null });

  function toggleConsumer(id: string) {
    setConsumerStatus((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast(next[id] ? "사용자가 활성화되었습니다" : "사용자가 비활성화되었습니다");
      return next;
    });
  }

  function toggleInfluencer(id: string) {
    setInfluencerStatus((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast(next[id] ? "인플루언서가 활성화되었습니다" : "인플루언서가 비활성화되었습니다");
      return next;
    });
  }

  function toggleVendor(id: string) {
    setVendorStatus((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast(next[id] ? "공급사가 활성화되었습니다" : "공급사가 비활성화되었습니다");
      return next;
    });
  }

  return (
    <div id="page-admin-users" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">사용자 관리</h2>
        <p className="text-gray-500 mt-1">
          소비자, 인플루언서, 공급사를 관리합니다
        </p>
      </div>

      <Tabs defaultValue="consumers" id="admin-users">
        <TabsList>
          <TabsTrigger value="consumers">소비자</TabsTrigger>
          <TabsTrigger value="influencers">인플루언서</TabsTrigger>
          <TabsTrigger value="vendors">공급사</TabsTrigger>
        </TabsList>

        {/* Consumers Tab */}
        <TabsContent value="consumers">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            consumerStatus[c.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {consumerStatus[c.id] ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleConsumer(c.id)}
                            id={`btn-toggle-consumer-${c.id}`}
                          >
                            {consumerStatus[c.id] ? "비활성화" : "활성화"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDetailDialog({
                                open: true,
                                type: "consumer",
                                data: c,
                              })
                            }
                            id={`btn-detail-consumer-${c.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencers Tab */}
        <TabsContent value="influencers">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>팔로워수</TableHead>
                    <TableHead>Payoneer</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((inf) => (
                    <TableRow key={inf.id}>
                      <TableCell className="font-medium">{inf.name}</TableCell>
                      <TableCell>{inf.email}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("ko-KR").format(inf.followers)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            inf.payoneerStatus === "connected"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : inf.payoneerStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {inf.payoneerStatus === "connected"
                            ? "연결됨"
                            : inf.payoneerStatus === "pending"
                            ? "대기중"
                            : "미연결"}
                        </Badge>
                      </TableCell>
                      <TableCell>{inf.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            influencerStatus[inf.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {influencerStatus[inf.id] ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleInfluencer(inf.id)}
                            id={`btn-toggle-inf-${inf.id}`}
                          >
                            {influencerStatus[inf.id] ? "비활성화" : "활성화"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDetailDialog({
                                open: true,
                                type: "influencer",
                                data: inf,
                              })
                            }
                            id={`btn-detail-inf-${inf.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회사명</TableHead>
                    <TableHead>대표자</TableHead>
                    <TableHead>사업자번호</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        {v.companyName}
                      </TableCell>
                      <TableCell>{v.representative}</TableCell>
                      <TableCell>{v.businessNumber}</TableCell>
                      <TableCell>{v.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            vendorStatus[v.id]
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {vendorStatus[v.id] ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleVendor(v.id)}
                            id={`btn-toggle-vendor-${v.id}`}
                          >
                            {vendorStatus[v.id] ? "비활성화" : "활성화"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDetailDialog({
                                open: true,
                                type: "vendor",
                                data: v,
                              })
                            }
                            id={`btn-detail-vendor-${v.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onOpenChange={(open) =>
          setDetailDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detailDialog.type === "consumer"
                ? "소비자 상세"
                : detailDialog.type === "influencer"
                ? "인플루언서 상세"
                : "공급사 상세"}
            </DialogTitle>
          </DialogHeader>
          {detailDialog.data && detailDialog.type === "consumer" && (
            <div className="space-y-3">
              {(() => {
                const c = detailDialog.data as User;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-500">이름</span>
                      <span>{c.name}</span>
                      <span className="text-gray-500">이메일</span>
                      <span>{c.email}</span>
                      <span className="text-gray-500">역할</span>
                      <span>{c.role}</span>
                      <span className="text-gray-500">가입일</span>
                      <span>{c.createdAt}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          {detailDialog.data && detailDialog.type === "influencer" && (
            <div className="space-y-3">
              {(() => {
                const inf = detailDialog.data as InfluencerProfile;
                return (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">이름</span>
                    <span>{inf.name}</span>
                    <span className="text-gray-500">이메일</span>
                    <span>{inf.email}</span>
                    <span className="text-gray-500">팔로워</span>
                    <span>
                      {new Intl.NumberFormat("ko-KR").format(inf.followers)}
                    </span>
                    <span className="text-gray-500">바이오</span>
                    <span>{inf.bio}</span>
                    <span className="text-gray-500">Payoneer</span>
                    <span>{inf.payoneerStatus}</span>
                    <span className="text-gray-500">SNS</span>
                    <span>
                      {Object.entries(inf.snsLinks)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}
                    </span>
                    <span className="text-gray-500">가입일</span>
                    <span>{inf.createdAt}</span>
                  </div>
                );
              })()}
            </div>
          )}
          {detailDialog.data && detailDialog.type === "vendor" && (
            <div className="space-y-3">
              {(() => {
                const v = detailDialog.data as Vendor;
                return (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">회사명</span>
                    <span>{v.companyName}</span>
                    <span className="text-gray-500">대표자</span>
                    <span>{v.representative}</span>
                    <span className="text-gray-500">사업자번호</span>
                    <span>{v.businessNumber}</span>
                    <span className="text-gray-500">계좌</span>
                    <span>{v.bankAccount}</span>
                    <span className="text-gray-500">가입일</span>
                    <span>{v.createdAt}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
