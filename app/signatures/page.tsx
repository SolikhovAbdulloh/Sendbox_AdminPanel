'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { DataTablePagination } from '@/components/data-table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Label komponentini import qilish
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/language-context';
import { useQueryApi } from '@/share/hook/useQuery';
import {
  useEditSignature,
  useractiveSignature,
  userDeactiveSignature,
} from '@/share/hook/useQuery/useQueryAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Interfeyslar
interface Signature {
  id: string;
  rule: string;
  name: string;
  type: string;
  uploadedBy: { username: string };
  createdAt: string;
  lastModifiedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

interface FormData {
  name: string;
  rule: string;
  type: string;
}
const schema = z.object({
  name: z.string().min(3, { message: 'Name is too short' }),
  rule: z.string().min(3, { message: 'Rule is required' }),
  type: z.string().min(3, { message: 'Type is required' }),
});

export default function SignaturesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSignature, setEditSignature] = useState<{ id: string } | null>(null);
  const queryClient = useQueryClient();

  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = typeof window !== 'undefined' ? useSearchParams() : new URLSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, isFetching } = useQueryApi<Signature[]>({
    url: `/1/signature/all?page=${page}&limit=100`,
    pathname: 'signatures',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const tasks = data || [];

  const filteredUsers = tasks.filter((user: any) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  const { mutate, isPending } = useEditSignature();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-green-500';
    }
  };
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get('page') || '1');
    params.set('page', String(currentPage >= 7 ? 1 : currentPage + 1));
    router.push(`?${params.toString()}`);
  };
  const handleBackPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get('page') || '1');
    params.set('page', String(currentPage == 1 ? 1 : currentPage - 1));
    router.push(`?${params.toString()}`);
  };

  const onSubmit = (data: FormData) => {
    if (editSignature?.id) {
      mutate(
        {
          id: editSignature.id,
          data: {
            name: data.name,
            rule: data.rule,
            type: data.type,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            reset();
            queryClient.invalidateQueries({ queryKey: ['signatures'] });
          },
          onError: error => {
            console.error('Error updating signature:', error);
          },
        },
      );
    }
  };

  const { mutate: deactivate, isPending: deactivatePending } = userDeactiveSignature();
  const { mutate: activate, isPending: activatePending } = useractiveSignature();

  const { data: role } = useQueryApi<{ roleId: number }>({
    url: `/1/auth/user`,
    pathname: 'role',
  });

  if (isLoading || isFetching) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t('signatures.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">{t('common.loading')}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('signatures.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('signatures.searchPlaceholder')}
                className="w-64 pl-8"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  const params = new URLSearchParams(searchParams);
                  params.set('page', '1');
                  router.push(`?${params.toString()}`);
                }}
              />
            </div>
            <Button asChild>
              <Link href="/signatures/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('signatures.newTitle')}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>{t('signatures.name')}</TableHead>
                <TableHead>{t('signatures.type')}</TableHead>
                <TableHead>{t('signatures.createdBy')}</TableHead>
                <TableHead>{t('signatures.createdDate')}</TableHead>
                <TableHead>{t('signatures.lastModified')}</TableHead>
                <TableHead>{t('signatures.status')}</TableHead>
                <TableHead className="text-right">{t('signatures.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((sig: any, index: string) => (
                  <TableRow key={sig.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{sig.name}</TableCell>
                    <TableCell>{sig.type}</TableCell>
                    <TableCell>{sig.uploadedBy.username}</TableCell>
                    <TableCell>{format(sig.createdAt, 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{format(sig.lastModifiedAt, 'MM/dd/yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sig.status)}>{sig.status}</Badge>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/signatures/${sig.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onClick={() => handleEditClick(sig)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            disabled={role?.roleId !== 1}
                            onClick={() =>
                              sig.status === 'active' ? deactivate(sig.id) : activate(sig.id)
                            }
                          >
                            {sig.status === 'active'
                              ? deactivatePending
                                ? 'Deactivating...'
                                : 'Deactivate'
                              : activatePending
                              ? 'Activating...'
                              : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No signatures found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Tuzatilgan Modal */}
          <Dialog
            open={isModalOpen}
            onOpenChange={open => {
              setIsModalOpen(open);
              if (!open) reset(); // Modal yopilganda formani tozalash
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Signature</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rule">Rule</Label>
                  <Input id="rule" {...register('rule')} />
                  {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" {...register('type')} />
                  {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{isPending ? 'loading...' : 'Save Changes'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <DataTablePagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            nextpage={handleNextPage}
            backpage={handleBackPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
