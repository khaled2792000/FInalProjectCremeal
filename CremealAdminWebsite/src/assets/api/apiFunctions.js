import { useMutation, useQuery } from "@tanstack/react-query";
import api from "/src/assets/api/AxiosManager.js";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      try {
        const { data } = await api.post('/Admin/AdminSignIn', {
          password: credentials.password,
        });
        return data;
      } catch (error) {
        throw error;
      }
    }
  })
};


export const useUsers = (token) => {
  return useQuery({
    queryKey: ['users', token],
    queryFn: async () => {
      try {
        const { data } = await api.get('/Admin/GetAllUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: '*/*',
          },
        });
        console.log(token)
        return data.data;
      } catch (error) {
        console.log(token)
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    enabled: !!token,
  });
};
