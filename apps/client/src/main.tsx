import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Import the generated route tree
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/toaster';
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const el = document.getElementById('root');

if (el) {
  const root = createRoot(el);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}/>
      <Toaster />
    </React.StrictMode>
  );
} else {
  throw new Error('Could not find root element');
}
