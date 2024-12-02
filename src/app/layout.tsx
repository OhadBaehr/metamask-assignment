'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { Template } from "@/components/Template";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { StoreContext, initialStore } from '@/store/storeContext';
import { useState, useEffect, SetStateAction, useCallback } from 'react';
import { Notifications, notifications } from '@mantine/notifications';
import { Point, PointsContext } from '@/store/pointsContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState(initialStore);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const initializeState = async () => {
      let connectedAccount = '';

      // Auto-connect wallet and retrieve the account
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            connectedAccount = accounts[0];
            notifications.show({
              title: 'Auto-connected',
              message: `Connected to ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}.`,
            });
          }
        } catch {
          notifications.show({
            color: 'red',
            title: 'Auto-connect Failed',
            message: 'Could not automatically connect. Please connect manually.',
          });
        }
      }

      // Load store and points from localStorage if connectedAccount exists
      if (connectedAccount) {
        const savedStore = localStorage.getItem(`${connectedAccount}_store`);
        if (savedStore) {
          setStore((prev) => ({
            ...prev,
            ...(savedStore ? JSON.parse(savedStore) : {}),
            connectedAccount,
          }));
        }
      }
    };
    initializeState();
  }, []);


  const _setStore = useCallback((newStore: SetStateAction<typeof initialStore>) => {
    setStore((prevStore) => {
      const updatedStore = typeof newStore === "function" ? newStore(prevStore) : newStore;
      if (updatedStore.connectedAccount) {
        localStorage.setItem(`${updatedStore.connectedAccount}_store`, JSON.stringify(updatedStore));
      }
      return updatedStore;
    });
  }, []);

  const _setPoints = useCallback((newPoints: SetStateAction<Point[]>) => {
    setPoints((prevPoints) => {
      const updatedPoints = typeof newPoints === "function" ? newPoints(prevPoints) : newPoints;
      if (store.connectedAccount) {
        localStorage.setItem(`${store.connectedAccount}_points`, JSON.stringify(updatedPoints));
      }
      return updatedPoints;
    });
  }, [store.connectedAccount]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <StoreContext.Provider value={{ store, setStore: _setStore }}>
          <PointsContext.Provider value={{ points, setPoints: _setPoints }}>
            <MantineProvider>
              <Notifications />
              <Template>
                {children}
              </Template>
            </MantineProvider>
          </PointsContext.Provider>
        </StoreContext.Provider>
      </body>
    </html>
  );
}
