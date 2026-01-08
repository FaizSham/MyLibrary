"use client";

import { useState } from "react";
import {
  Settings,
  Building2,
  Mail,
  Bell,
  Shield,
  Palette,
  BookOpen,
  Clock,
  DollarSign,
  Save,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Library Information
    libraryName: "BukuGo Library",
    libraryAddress: "123 Main Street, City, State 12345",
    libraryPhone: "+1 (555) 123-4567",
    libraryEmail: "info@bukugolibrary.com",
    libraryWebsite: "www.bukugolibrary.com",

    // Loan Settings
    loanPeriodDays: 14,
    maxLoansPerMember: 5,
    renewalPeriodDays: 14,
    allowRenewals: true,
    maxRenewals: 2,

    // Fine Settings
    finePerDay: 0.50,
    fineCurrency: "USD",
    fineGracePeriod: 3,
    maxFineAmount: 25.00,

    // Notifications
    emailNotifications: true,
    overdueReminders: true,
    returnReminders: true,
    newBookAlerts: true,
    reminderDaysBefore: 3,

    // Appearance
    theme: "light",
    primaryColor: "indigo",
    language: "en",

    // Security
    requirePasswordChange: false,
    passwordExpiryDays: 90,
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your library system configuration and preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Library Information */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Library Information</CardTitle>
          </div>
          <CardDescription>
            Basic information about your library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="libraryName">Library Name</Label>
              <Input
                id="libraryName"
                value={settings.libraryName}
                onChange={(e) => handleInputChange("libraryName", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryEmail">Email</Label>
              <Input
                id="libraryEmail"
                type="email"
                value={settings.libraryEmail}
                onChange={(e) => handleInputChange("libraryEmail", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryPhone">Phone</Label>
              <Input
                id="libraryPhone"
                type="tel"
                value={settings.libraryPhone}
                onChange={(e) => handleInputChange("libraryPhone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryWebsite">Website</Label>
              <Input
                id="libraryWebsite"
                value={settings.libraryWebsite}
                onChange={(e) => handleInputChange("libraryWebsite", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="libraryAddress">Address</Label>
            <Input
              id="libraryAddress"
              value={settings.libraryAddress}
              onChange={(e) => handleInputChange("libraryAddress", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Settings */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Loan Settings</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Configure book loan policies and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="loanPeriodDays" className="text-foreground">Loan Period (Days)</Label>
              <Input
                id="loanPeriodDays"
                type="number"
                min="1"
                value={settings.loanPeriodDays}
                onChange={(e) => handleInputChange("loanPeriodDays", parseInt(e.target.value))}
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxLoansPerMember" className="text-foreground">Max Loans Per Member</Label>
              <Input
                id="maxLoansPerMember"
                type="number"
                min="1"
                value={settings.maxLoansPerMember}
                onChange={(e) => handleInputChange("maxLoansPerMember", parseInt(e.target.value))}
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="renewalPeriodDays" className="text-foreground">Renewal Period (Days)</Label>
              <Input
                id="renewalPeriodDays"
                type="number"
                min="1"
                value={settings.renewalPeriodDays}
                onChange={(e) => handleInputChange("renewalPeriodDays", parseInt(e.target.value))}
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxRenewals" className="text-foreground">Max Renewals</Label>
              <Input
                id="maxRenewals"
                type="number"
                min="0"
                value={settings.maxRenewals}
                onChange={(e) => handleInputChange("maxRenewals", parseInt(e.target.value))}
                className=""
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowRenewals" className="text-foreground">Allow Renewals</Label>
              <p className="text-sm text-muted-foreground">Enable members to renew their loans</p>
            </div>
            <Switch
              id="allowRenewals"
              checked={settings.allowRenewals}
              onCheckedChange={(checked) => handleInputChange("allowRenewals", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fine Settings */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Fine Settings</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Configure overdue fines and penalties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="finePerDay" className="text-foreground">Fine Per Day</Label>
              <Input
                id="finePerDay"
                type="number"
                step="0.01"
                min="0"
                value={settings.finePerDay}
                onChange={(e) => handleInputChange("finePerDay", parseFloat(e.target.value))}
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fineCurrency" className="text-foreground">Currency</Label>
              <Select
                value={settings.fineCurrency}
                onValueChange={(value) => handleInputChange("fineCurrency", value)}
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fineGracePeriod" className="text-foreground">Grace Period (Days)</Label>
              <Input
                id="fineGracePeriod"
                type="number"
                min="0"
                value={settings.fineGracePeriod}
                onChange={(e) => handleInputChange("fineGracePeriod", parseInt(e.target.value))}
                className=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxFineAmount" className="text-foreground">Max Fine Amount</Label>
              <Input
                id="maxFineAmount"
                type="number"
                step="0.01"
                min="0"
                value={settings.maxFineAmount}
                onChange={(e) => handleInputChange("maxFineAmount", parseFloat(e.target.value))}
                className=""
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Notification Settings</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Configure email notifications and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable email notifications</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdueReminders" className="text-foreground">Overdue Reminders</Label>
                <p className="text-sm text-muted-foreground">Send reminders for overdue books</p>
              </div>
              <Switch
                id="overdueReminders"
                checked={settings.overdueReminders}
                onCheckedChange={(checked) => handleInputChange("overdueReminders", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="returnReminders" className="text-foreground">Return Reminders</Label>
                <p className="text-sm text-muted-foreground">Send reminders before due date</p>
              </div>
              <Switch
                id="returnReminders"
                checked={settings.returnReminders}
                onCheckedChange={(checked) => handleInputChange("returnReminders", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newBookAlerts" className="text-foreground">New Book Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify members about new books</p>
              </div>
              <Switch
                id="newBookAlerts"
                checked={settings.newBookAlerts}
                onCheckedChange={(checked) => handleInputChange("newBookAlerts", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="grid gap-2">
              <Label htmlFor="reminderDaysBefore" className="text-foreground">Reminder Days Before Due</Label>
              <Input
                id="reminderDaysBefore"
                type="number"
                min="0"
                value={settings.reminderDaysBefore}
                onChange={(e) => handleInputChange("reminderDaysBefore", parseInt(e.target.value))}
                className=""
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Appearance</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Customize the look and feel of your library system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="theme" className="text-foreground">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleInputChange("theme", value)}
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primaryColor" className="text-foreground">Primary Color</Label>
              <Select
                value={settings.primaryColor}
                onValueChange={(value) => handleInputChange("primaryColor", value)}
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indigo">Indigo</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language" className="text-foreground">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger className="">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Security</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Manage security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requirePasswordChange" className="text-foreground">Require Password Change</Label>
                <p className="text-sm text-muted-foreground">Force users to change passwords periodically</p>
              </div>
              <Switch
                id="requirePasswordChange"
                checked={settings.requirePasswordChange}
                onCheckedChange={(checked) => handleInputChange("requirePasswordChange", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorAuth" className="text-foreground">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
              />
            </div>
            <Separator className="bg-border" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="passwordExpiryDays" className="text-foreground">Password Expiry (Days)</Label>
                <Input
                  id="passwordExpiryDays"
                  type="number"
                  min="0"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleInputChange("passwordExpiryDays", parseInt(e.target.value))}
                  className=""
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout" className="text-foreground">Session Timeout (Minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                  className=""
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

