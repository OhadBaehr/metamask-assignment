import { createContext, SetStateAction } from "react";

export const initialStore = {
    topNavColor: '#f8f9fa',
    buttonColor: '#228be6',
    sideNavColor: '#ffffff',
    canvasColor: '#ffffff',
    topnavHeight: 60,
    sideNavWidth: 300,
    buttonSize: 'md',
    isHeaderTop: true,
    isSideNavLeft: true,
    sideNavOpen: true,
    connectedAccount: ''
}

export const StoreContext = createContext<{
    store: typeof initialStore
    setStore: React.Dispatch<SetStateAction<typeof initialStore>>
}>({
    store: initialStore,
    setStore: () => { }
});
