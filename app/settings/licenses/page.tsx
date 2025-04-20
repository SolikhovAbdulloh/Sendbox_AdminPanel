"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Key, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LicensesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>License Information</CardTitle>
            <CardDescription>Manage your Sector Sandbox license</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">License Type</Label>
                <p className="font-medium">Enterprise</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">Active</Badge>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">License Key</Label>
                <p className="font-mono text-sm">XXXX-XXXX-XXXX-XXXX-XXXX</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Expiration Date</Label>
                <p className="font-medium">December 31, 2023</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Licensed To</Label>
                <p className="font-medium">Sector Security Inc.</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Licensed Email</Label>
                <p className="font-medium">admin@sectorsecurity.com</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">VM Usage</Label>
                <span className="text-sm font-medium">24/50 VMs</span>
              </div>
              <Progress value={48} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">Storage Usage</Label>
                <span className="text-sm font-medium">1.2TB/5TB</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh License
            </Button>
            <Button>
              <Key className="mr-2 h-4 w-4" />
              Upgrade License
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activate New License</CardTitle>
            <CardDescription>Enter a new license key to activate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="license-key">License Key</Label>
                <Input id="license-key" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Activate License</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
