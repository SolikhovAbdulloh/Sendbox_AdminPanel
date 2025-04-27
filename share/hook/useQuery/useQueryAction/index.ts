import { useRouter } from "next/navigation";
import { useAxios } from "../../useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Router } from "next/router";

const useLogin = () => {
  const axios = useAxios();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: any) =>
      await axios({ url: "/1/auth/login", body: data, method: "POST" }),

    onSuccess: async (response) => {
      if (response.status === "success") {
        localStorage.setItem("token", response.token);
        router.push("/dashboard");
      }
    },

    onError: (err) => {
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
        url: "/1/cape/tasks/create/file",
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: data,
      });
    },
    onSuccess: (response) => {
      console.log(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "tasks",
          "/1/cape/tasks/list/active?page=1&limit=10&status=all&category=all&incidentType=all",
        ],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

const useUploadSignature = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (data: object) => {
      await axios({
        url: "/1/cape/tasks/upload/signature",
        method: "POST",
        body: data,
      });
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err.message);
    },
  });
};

export { useLogin, useCreateFile, useUploadSignature };
