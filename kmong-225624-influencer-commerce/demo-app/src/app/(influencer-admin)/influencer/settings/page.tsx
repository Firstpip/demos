"use client";

import { useState } from "react";
import {
  User,
  CreditCard,
  BellRing,
  CheckCircle2,
  Unlink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { influencers } from "@/lib/data";

const influencer = influencers[0]; // inf-1

export default function InfluencerSettingsPage() {
  // Profile state
  const [name, setName] = useState(influencer.name);
  const [email, setEmail] = useState(influencer.email);
  const [bio, setBio] = useState(influencer.bio);
  const [instagram, setInstagram] = useState(influencer.snsLinks.instagram ?? "");
  const [youtube, setYoutube] = useState(influencer.snsLinks.youtube ?? "");
  const [tiktok, setTiktok] = useState(influencer.snsLinks.tiktok ?? "");

  // Payoneer state
  const [payoneerConnected, setPayoneerConnected] = useState(
    influencer.payoneerStatus === "connected"
  );

  // Notification state
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile updated", {
      description: "Your profile information has been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const handleConnectPayoneer = () => {
    setPayoneerConnected(true);
    toast.success("Payoneer connected successfully!");
  };

  const handleDisconnectPayoneer = () => {
    setPayoneerConnected(false);
    toast("Payoneer disconnected", {
      description: "You can reconnect at any time.",
    });
  };

  return (
    <div id="page-inf-settings" className="space-y-6 max-w-3xl">
      <div id="inf-settings">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">
          Manage your profile, payout, and notification preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="settings-name">Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="settings-bio">Bio</Label>
            <Textarea
              id="settings-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <Separator />

          <h4 className="text-sm font-semibold text-gray-700">SNS Links</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="settings-instagram">Instagram</Label>
              <Input
                id="settings-instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="settings-youtube">YouTube</Label>
              <Input
                id="settings-youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="Channel name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="settings-tiktok">TikTok</Label>
              <Input
                id="settings-tiktok"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="@username"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveProfile}
              style={{ backgroundColor: "#6366F1", color: "white" }}
            >
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payout Section */}
      <Card id="inf-payoneer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Payout - Payoneer
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {payoneerConnected ? (
            <>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-800">
                      Payoneer Connected
                    </span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Payouts will be sent to your Payoneer account.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Account Holder</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Account Number</span>
                  <span className="font-mono">**** **** **** 4821</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Currency</span>
                  <span className="font-medium">USD</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDisconnectPayoneer}
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Connect your Payoneer account to receive payouts.
              </p>
              <Button
                onClick={handleConnectPayoneer}
                style={{ backgroundColor: "#6366F1", color: "white" }}
              >
                Connect Payoneer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <BellRing className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer py-2">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-gray-500">
                Receive updates about your earnings and orders via email.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <Separator />
          <label className="flex items-center justify-between cursor-pointer py-2">
            <div>
              <p className="text-sm font-medium">SMS Notifications</p>
              <p className="text-xs text-gray-500">
                Get text messages for important alerts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={(e) => setSmsNotif(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
          <Separator />
          <label className="flex items-center justify-between cursor-pointer py-2">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">
                Receive push notifications on your device.
              </p>
            </div>
            <input
              type="checkbox"
              checked={pushNotif}
              onChange={(e) => setPushNotif(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveNotifications}
              style={{ backgroundColor: "#6366F1", color: "white" }}
            >
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
