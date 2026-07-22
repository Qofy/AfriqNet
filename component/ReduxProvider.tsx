"use client";

import { useState, FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '../store';

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  // useState ensures a single QueryClient instance per component lifecycle
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
};

export default ReduxProvider;
