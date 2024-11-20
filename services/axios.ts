import axios, { AxiosError, AxiosResponse } from "axios";

const baseInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

function baseRequestSuccessResponseInterceptor(response: AxiosResponse) {
  return response;
}

function baseRequestErrorResponseInterceptor(error: AxiosError) {
  const status = error?.response?.status;
  const url = error?.request?.responseURL;

  if (status === 401) {
    console.log("401", url);

    // window.location.href = "/";
  }
  return Promise.reject(error);
}

baseInstance.interceptors.response.use(
  baseRequestSuccessResponseInterceptor,
  baseRequestErrorResponseInterceptor,
);

export { baseInstance };
