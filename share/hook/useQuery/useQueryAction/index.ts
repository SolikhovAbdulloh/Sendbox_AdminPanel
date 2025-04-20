import { useRouter } from "next/navigation";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

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

export { useLogin };
