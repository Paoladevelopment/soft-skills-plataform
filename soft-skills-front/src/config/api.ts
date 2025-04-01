import { environment } from "./env";

const BASE_URL = environment.API_BASE_URL;

export const api = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
};
