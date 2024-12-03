import {
  AppShell,
  Button,
  Burger,
  Accordion,
  Popover,
  Text,
  Flex,
} from '@mantine/core';
import { useContext, useState } from 'react';
import { initialStore, StoreContext } from '@/store/storeContext';
import { notifications } from '@mantine/notifications';
import { ColorsAccordion, SizesAccordion, PositioningAccordion } from './controls';
import { PointsContext } from '@/store/pointsContext';

export function Template({ children }: { children: React.ReactNode }) {
  const { setPoints } = useContext(PointsContext);
  const { store, setStore } = useContext(StoreContext);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setStore((prev) => ({ ...prev, connectedAccount: accounts[0] }));
          notifications.show({
            title: 'Connected',
            message: 'Changes you make will be saved by your wallet address.',
          });
        } else {
          notifications.show({
            color: 'red',
            title: 'No Accounts Found',
            message: 'Please connect to a wallet to continue.',
          });
        }
      } catch {
        notifications.show({
          color: 'red',
          title: 'Failed to Connect',
          message: 'Please try again.',
        });
      }
    } else {
      notifications.show({
        color: 'red',
        title: 'MetaMask Not Installed',
        message: 'Please install MetaMask to continue.',
      });
    }
  };

  const handleDisconnect = () => {
    setStore(initialStore);
    setPoints([]);
    notifications.show({
      title: 'Disconnected',
      message: 'You have disconnected your wallet.',
    });
  };

  const formatAddress = (address: string): string =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const renderHeaderFooterContent = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        padding: '0 16px',
        backgroundColor: store.topNavColor,
      }}
    >
      <Burger opened={store.sideNavOpen} onClick={() => setStore({ ...store, sideNavOpen: !store.sideNavOpen })} size="sm" />
      <Text size="xl" fw={600}>
        THE IDLE FOX
      </Text>
      {store.connectedAccount ? (
        <Popover
          width={200}
          position="bottom"
          withArrow
          shadow="md"
          opened={popoverOpened}
          onChange={setPopoverOpened}
        >
          <Popover.Target>
            <Button
              variant="outline"
              color={store.buttonColor}
              size={store.buttonSize}
              style={{
                borderColor: store.buttonColor,
              }}
              onClick={() => setPopoverOpened((prev) => !prev)}
            >
              {formatAddress(store.connectedAccount)}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" gap="xs">
              <Text size="sm" fw={500}>
                Your wallet is connected.
              </Text>
              <Button
                size="xs"
                fullWidth
                variant="light"
                color="red"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </Flex>
          </Popover.Dropdown>
        </Popover>
      ) : (
        <Button color={store.buttonColor} size={store.buttonSize} onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );

  const renderNavbarAsideContent = () => (
    <Accordion defaultValue="Colors" style={{ backgroundColor: store.sideNavColor, height: '100%' }}>
      <ColorsAccordion />
      <SizesAccordion />
      <PositioningAccordion />
    </Accordion>
  );

  return (
    <AppShell
      padding="md"
      // Conditionally set header or footer
      {...(store.isHeaderTop
        ? { header: { height: store.topnavHeight } }
        : { footer: { height: store.topnavHeight } })}
      // Conditionally set navbar or aside
      {...(store.sideNavOpen
        ? store.isSideNavLeft
          ? { navbar: { width: store.sideNavWidth, breakpoint: 'sm' } }
          : { aside: { width: store.sideNavWidth, breakpoint: 'sm' } }
        : {})}
    >
      {/* Render Header or Footer */}
      {store.isHeaderTop ? (
        <AppShell.Header>{renderHeaderFooterContent()}</AppShell.Header>
      ) : (
        <AppShell.Footer>{renderHeaderFooterContent()}</AppShell.Footer>
      )}

      {/* Render Navbar or Aside if opened */}
      {store.sideNavOpen &&
        (store.isSideNavLeft ? (
          <AppShell.Navbar>{renderNavbarAsideContent()}</AppShell.Navbar>
        ) : (
          <AppShell.Aside>{renderNavbarAsideContent()}</AppShell.Aside>
        ))}

      {/* Main Content */}
      <AppShell.Main
        style={{
          backgroundColor: store.canvasColor,
          height: `calc(100vh - ${store.topnavHeight}px)`,
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
