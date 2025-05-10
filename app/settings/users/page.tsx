"use client";

import type React from "react";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryApi } from "@/share/hook/useQuery";
import { useLanguage } from "@/contexts/language-context";
import {
  userActive,
  userDeactive,
  userDelete,
  userRegister,
} from "@/share/hook/useQuery/useQueryAction";
import Link from "next/link";

// Sample data for users

export default function UsersPage() {
  interface Users {
    email: string;
    fullName: string;
    id: string;
    lastLogin: string;
    role: string;
    status: string;
    username: string;
  }
  const { t } = useLanguage();
  const { data, isLoading } = useQueryApi({
    url: "/1/auth/users?page=1&limit=10",
    pathname: "users",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullname] = useState<string>("");

  const Userinformation = data || [];
  const filteredUsers = Userinformation.filter(
    (user: Users) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };
  const { mutate: UserDelete, isPending: pending } = userDelete();
  const Deleteuser = (id: string) => {
    UserDelete(id);
  };
  const { mutate, isPending } = userRegister();
  const { mutate: active, isPending: activePanding } = userActive();
  const { mutate: deactive, isPending: deactivePending } = userDeactive();
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        username: username,
        fullName: fullName,
        email: email,
        password: password,
      },
      {
        onSuccess: () => {
          setIsAddUserOpen(false);
          setUsername("");
          setFullname("");
          setEmail("");
          setPassword("");
        },
        onError: () => {
          setIsAddUserOpen(true);
        },
      }
    );
  };
  function Active(id: string) {
    active(id);
  }
  function Deactive(id: string) {
    deactive(id);
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t("tasks.activeTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">{t("common.loading")}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("settings.users.title")}</CardTitle>
            <CardDescription>{t("settings.users.description")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("settings.users.searchPlaceholder")}
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog
              open={isAddUserOpen}
              onOpenChange={(open) => {
                setIsAddUserOpen(open);
                if (!open) {
                  setUsername("");
                  setFullname("");
                  setEmail("");
                  setPassword("");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("settings.users.addUser")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("settings.users.addUserTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("settings.users.addUserDescription")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">
                        {t("settings.users.fullName")}
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">
                        {t("settings.users.username")}
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        placeholder="Username"
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t("settings.users.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">
                        {t("settings.users.password")}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {isPending ? "loading..." : "Add User"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead> {t("settings.users.fullName")}</TableHead>
                <TableHead>{t("settings.users.username")}</TableHead>
                <TableHead>{t("settings.users.email")}</TableHead>
                <TableHead>{t("settings.users.role")}</TableHead>
                <TableHead>{t("settings.users.lastLogin")}</TableHead>
                <TableHead>{t("settings.users.status")}</TableHead>
                <TableHead className="text-right">
                  {t("settings.users.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: Users, idx: number) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => Deactive(user.id)}
                          >
                            {activePanding ? "loading" : "Deactivate"}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => Active(user.id)}
                          >
                            {deactivePending ? "loading " : "Activate"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href={`/settings/${user.id}`}>
                            Reset Password
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => Deleteuser(user.id)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          {pending ? "loading" : "delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
