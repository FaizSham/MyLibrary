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
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Settings
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Manage your library system configuration and preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Library Information */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Library Information</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Basic information about your library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="libraryName" className="text-stone-700">Library Name</Label>
              <Input
                id="libraryName"
                value={settings.libraryName}
                onChange={(e) => handleInputChange("libraryName", e.target.value)}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryEmail" className="text-stone-700">Email</Label>
              <Input
                id="libraryEmail"
                type="email"
                value={settings.libraryEmail}
                onChange={(e) => handleInputChange("libraryEmail", e.target.value)}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryPhone" className="text-stone-700">Phone</Label>
              <Input
                id="libraryPhone"
                type="tel"
                value={settings.libraryPhone}
                onChange={(e) => handleInputChange("libraryPhone", e.target.value)}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="libraryWebsite" className="text-stone-700">Website</Label>
              <Input
                id="libraryWebsite"
                value={settings.libraryWebsite}
                onChange={(e) => handleInputChange("libraryWebsite", e.target.value)}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="libraryAddress" className="text-stone-700">Address</Label>
            <Input
              id="libraryAddress"
              value={settings.libraryAddress}
              onChange={(e) => handleInputChange("libraryAddress", e.target.value)}
              className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Settings */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Loan Settings</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Configure book loan policies and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="loanPeriodDays" className="text-stone-700">Loan Period (Days)</Label>
              <Input
                id="loanPeriodDays"
                type="number"
                min="1"
                value={settings.loanPeriodDays}
                onChange={(e) => handleInputChange("loanPeriodDays", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxLoansPerMember" className="text-stone-700">Max Loans Per Member</Label>
              <Input
                id="maxLoansPerMember"
                type="number"
                min="1"
                value={settings.maxLoansPerMember}
                onChange={(e) => handleInputChange("maxLoansPerMember", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="renewalPeriodDays" className="text-stone-700">Renewal Period (Days)</Label>
              <Input
                id="renewalPeriodDays"
                type="number"
                min="1"
                value={settings.renewalPeriodDays}
                onChange={(e) => handleInputChange("renewalPeriodDays", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxRenewals" className="text-stone-700">Max Renewals</Label>
              <Input
                id="maxRenewals"
                type="number"
                min="0"
                value={settings.maxRenewals}
                onChange={(e) => handleInputChange("maxRenewals", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowRenewals" className="text-stone-700">Allow Renewals</Label>
              <p className="text-sm text-stone-500">Enable members to renew their loans</p>
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
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Fine Settings</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Configure overdue fines and penalties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="finePerDay" className="text-stone-700">Fine Per Day</Label>
              <Input
                id="finePerDay"
                type="number"
                step="0.01"
                min="0"
                value={settings.finePerDay}
                onChange={(e) => handleInputChange("finePerDay", parseFloat(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fineCurrency" className="text-stone-700">Currency</Label>
              <Select
                value={settings.fineCurrency}
                onValueChange={(value) => handleInputChange("fineCurrency", value)}
              >
                <SelectTrigger className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200">
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
              <Label htmlFor="fineGracePeriod" className="text-stone-700">Grace Period (Days)</Label>
              <Input
                id="fineGracePeriod"
                type="number"
                min="0"
                value={settings.fineGracePeriod}
                onChange={(e) => handleInputChange("fineGracePeriod", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxFineAmount" className="text-stone-700">Max Fine Amount</Label>
              <Input
                id="maxFineAmount"
                type="number"
                step="0.01"
                min="0"
                value={settings.maxFineAmount}
                onChange={(e) => handleInputChange("maxFineAmount", parseFloat(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Notification Settings</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Configure email notifications and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-stone-700">Email Notifications</Label>
                <p className="text-sm text-stone-500">Enable email notifications</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdueReminders" className="text-stone-700">Overdue Reminders</Label>
                <p className="text-sm text-stone-500">Send reminders for overdue books</p>
              </div>
              <Switch
                id="overdueReminders"
                checked={settings.overdueReminders}
                onCheckedChange={(checked) => handleInputChange("overdueReminders", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="returnReminders" className="text-stone-700">Return Reminders</Label>
                <p className="text-sm text-stone-500">Send reminders before due date</p>
              </div>
              <Switch
                id="returnReminders"
                checked={settings.returnReminders}
                onCheckedChange={(checked) => handleInputChange("returnReminders", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newBookAlerts" className="text-stone-700">New Book Alerts</Label>
                <p className="text-sm text-stone-500">Notify members about new books</p>
              </div>
              <Switch
                id="newBookAlerts"
                checked={settings.newBookAlerts}
                onCheckedChange={(checked) => handleInputChange("newBookAlerts", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="grid gap-2">
              <Label htmlFor="reminderDaysBefore" className="text-stone-700">Reminder Days Before Due</Label>
              <Input
                id="reminderDaysBefore"
                type="number"
                min="0"
                value={settings.reminderDaysBefore}
                onChange={(e) => handleInputChange("reminderDaysBefore", parseInt(e.target.value))}
                className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Appearance</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Customize the look and feel of your library system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="theme" className="text-stone-700">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => handleInputChange("theme", value)}
              >
                <SelectTrigger className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200">
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
              <Label htmlFor="primaryColor" className="text-stone-700">Primary Color</Label>
              <Select
                value={settings.primaryColor}
                onValueChange={(value) => handleInputChange("primaryColor", value)}
              >
                <SelectTrigger className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200">
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
              <Label htmlFor="language" className="text-stone-700">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleInputChange("language", value)}
              >
                <SelectTrigger className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200">
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
      <Card className="border-stone-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-stone-900">Security</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            Manage security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requirePasswordChange" className="text-stone-700">Require Password Change</Label>
                <p className="text-sm text-stone-500">Force users to change passwords periodically</p>
              </div>
              <Switch
                id="requirePasswordChange"
                checked={settings.requirePasswordChange}
                onCheckedChange={(checked) => handleInputChange("requirePasswordChange", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorAuth" className="text-stone-700">Two-Factor Authentication</Label>
                <p className="text-sm text-stone-500">Enable 2FA for enhanced security</p>
              </div>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
              />
            </div>
            <Separator className="bg-stone-200" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="passwordExpiryDays" className="text-stone-700">Password Expiry (Days)</Label>
                <Input
                  id="passwordExpiryDays"
                  type="number"
                  min="0"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleInputChange("passwordExpiryDays", parseInt(e.target.value))}
                  className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout" className="text-stone-700">Session Timeout (Minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="1"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                  className="border-stone-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

