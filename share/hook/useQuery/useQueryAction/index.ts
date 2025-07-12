import { setToken } from '@/share/utils/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAxios } from '../../useAxios';
const useLogin = () => {
  const axios = useAxios();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: any) =>
      await axios({ url: '/1/auth/login', body: data, method: 'POST' }),

    onSuccess: async response => {
      if (response.status === 'success') {
        setToken(response.token);
        router.push('/dashboard');
      }
      const { token } = response;
      Cookies.set('token', token, {
        expires: 1,
        path: '/',
        secure: true,
        sameSite: 'strict',
      });
    },

    onError: err => {
      console.log(err.message);
    },
  });
};

const userRegister = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) =>
      await axios({ url: '/1/auth/register', method: 'POST', body: data }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};
const userDelete = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | any) =>
      await axios({ url: `/1/auth/delete-user/{id}?id=${id}`, method: 'DELETE', body: { id: id } }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};

const userDeactive = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | any) =>
      await axios({ url: `/1/auth/deactivate?id=${id}`, method: 'PUT', body: { id: id } }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};
const userActive = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | any) =>
      await axios({ url: `/1/auth/activate?id=${id}`, method: 'PUT', body: { id: id } }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};

const userDeactiveSignature = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | any) =>
      await axios({ url: `/1/signature/deactivate?id=${id}`, method: 'PUT', body: { id: id } }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['signatures'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};
const useractiveSignature = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | any) =>
      await axios({ url: `/1/signature/activate?id=${id}`, method: 'PUT', body: { id: id } }),
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['signatures'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};

const useResetPassword = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) => {
      await axios({
        url: '/1/auth/reset-password',
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: () => {
      console.log('success');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};

const useCreateFile = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      await axios({
        url: '/1/cape/tasks/create/file',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });
    },
    onSuccess: response => {
      console.log(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'tasks',
          '/1/cape/tasks/list/active?page=1&limit=10&status=all&category=all&incidentType=all',
        ],
      });
    },
    onError: error => {
      console.log(error);
    },
  });
};

const useUploadSignature = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (data: any) => {
      await axios({
        url: '/1/signature/upload/file',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: res => {
      console.log(res);
    },
    onError: err => {
      console.log(err.message);
    },
  });
};
const useEditSignature = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ data, id }: { data: object; id: string }) => {
      await axios({
        url: `/1/signature/update/${id}`,
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: res => {
      console.log(res);
    },
    onError: err => {
      console.log(err.message);
    },
  });
};

const useUptadeProfile = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) => {
      await axios({
        url: '/1/auth/update-profile',
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: res => {
      console.log(res);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['userInformation'],
      });
    },
    onError: err => {
      console.log(err.message);
    },
  });
};
export {
  useCreateFile,
  useEditSignature,
  useLogin,
  userActive,
  useractiveSignature,
  userDeactive,
  userDeactiveSignature,
  userDelete,
  useResetPassword,
  userRegister,
  useUploadSignature,
  useUptadeProfile,
};
