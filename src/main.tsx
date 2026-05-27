import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { RouterProvider } from "react-router/dom";
import { store } from '@/Redux/Store.tsx'
const basePath = import.meta.env.BASE_URL;
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Provider } from 'react-redux';
import { Toaster } from 'sonner'; 
import { loadAppConfig } from "@/core/config/appConfig";

// console.log('Base path:', basePath);
const queryClient = new QueryClient()
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* <Route index path='/' element={<SignIn />} /> */}
      <Route >
        <Route path="/" lazy={() => import("@/features/dashboard/pages/page")}  hydrateFallbackElement /> 
        <Route path="/markers" lazy={() => import("@/features/markers/pages/page")}  hydrateFallbackElement /> 
      </Route>
      {/* <Route path="*" element={<SignIn />} /> */}
    </>
  ), { basename: basePath }
)

loadAppConfig()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
          <Toaster position="bottom-left" />
        </Provider>
      </QueryClientProvider>
    );
  })
  .catch((error) => {
    console.error("Failed to load app config:", error);

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <div style={{ padding: 20, color: "red" }}>
        Failed to load application config.
      </div>
    );
  });