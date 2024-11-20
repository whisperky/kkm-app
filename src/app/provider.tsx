"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeneralContextProvider } from "./general-context";
import { Toaster } from "react-hot-toast";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0,
        retry: false,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GeneralContextProvider>
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          <>{children}</>
        </GeneralContextProvider>
      </QueryClientProvider>
    </>
  );
}
