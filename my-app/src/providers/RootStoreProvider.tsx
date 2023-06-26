import React, { createContext, ReactNode, useContext } from "react";
import RootStore from "../stores/RootStore";


let store: RootStore;
const StoreContext = createContext<RootStore | undefined>(undefined);
StoreContext.displayName = "StoreContext";

export function useRootStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useRootStore must be used within RootStoreProvider");
    }

    return context;
}

// création du hook pour AppStore.
export function useAppStore() {
    const { appStore } = useRootStore();
    return appStore;
}
// création du hook pour ReleaseStore.
export function useReleaseStore() {
    const { releaseStore } = useRootStore();
    return releaseStore;
}

export function useModalStore() {
    const { modalStore } = useRootStore();
    return modalStore;
}

export function useIssueStore() {
    const { issueStore } = useRootStore();
    return issueStore;
}

//
export function RootStoreProvider({ children }: { children: ReactNode }) {
    store = store ?? new RootStore()

    return <StoreContext.Provider value={store}>
        {children}
    </StoreContext.Provider>;
}
