"use client";

import React from "react";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useUserStore } from "@/app/store";
import { useQueryApi } from "@/share/hook/useQuery";
import {
  useResetPassword,
  useUptadeProfile,
} from "@/share/hook/useQuery/useQueryAction";

export default function ProfileSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const { setAvatar, avatar } = useUserStore();
  const { mutate: uptade } = useUptadeProfile();
  const { id } = React.use(params);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // Call mutate to send currentPassword and newPassword
    mutate(
      {
        userId: id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
      {
        onSuccess: () => {
          alert("Password updated successfully!");
          // Clear password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error) => {
          alert("Failed to update password: " + error.message);
        },
      }
    );
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setProfilePhoto(file);
    }
  };
  const { data } = useQueryApi({
    url: `/1/auth/user?id=${id}`,
    pathname: "userInformation",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uptade(
      {
        userId: id,
        username: data?.username || "",
        fullName,
        email,
        profilePhoto: profilePhoto || undefined,
      },
      {
        onSuccess: () => {
          alert("Profile updated successfully!");
        },
      }
    );
  };
  const { mutate } = useResetPassword();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile.title")}</CardTitle>
            <CardDescription>
              {t("settings.profile.description")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`http://127.0.0.1:4000/${data?.profilePicture}`}
                    alt="Avatar"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" type="button" asChild>
                      <span>{t("settings.profile.changeAvatar")}</span>
                    </Button>
                  </label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="full-name">
                  {t("settings.profile.fullName")}
                </Label>
                <Input
                  id="full-name"
                  placeholder={data?.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">{t("settings.profile.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={data?.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t("settings.profile.saveChanges")}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile.passwordTitle")}</CardTitle>
            <CardDescription>
              {t("settings.profile.passwordDescription")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="current-password">
                  {t("settings.profile.currentPassword")}
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword ?? ""}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="new-password">
                  {t("settings.profile.newPassword")}
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword ?? ""}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm-password">
                  {t("settings.profile.confirmPassword")}
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t("settings.profile.updatePassword")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
