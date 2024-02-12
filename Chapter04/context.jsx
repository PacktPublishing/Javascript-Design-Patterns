// @ts-check
import React, { createContext, useContext } from 'react';

const HttpClientContext = createContext(null);

export function HttpClientProvider({ httpClient, children }) {
  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
}
export const HttpClientConsumer = HttpClientContext.Consumer;

export function useHttpClient() {
  const httpClient = useContext(HttpClientContext);
  return httpClient;
}
