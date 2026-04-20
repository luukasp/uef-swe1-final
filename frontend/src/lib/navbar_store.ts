import { Store, useStore } from "@tanstack/react-store";

export interface NavbarState {
  isVisible: boolean;
}

// Define the shape of your state
export const navbarStore = new Store<NavbarState>({
  isVisible: true,
});

// Helper functions (Actions)
export const hideNavbar = () => {
  navbarStore.setState((state) => ({
    ...state,
    isVisible: false,
  }));
};

export const showNavbar = () => {
  navbarStore.setState((state) => ({
    ...state,
    isVisible: true,
  }));
};

// Custom hook to use the navbar store reactively in React components
export const useNavbarVisibility = () => {
  return useStore(navbarStore, (state) => state.isVisible);
};
