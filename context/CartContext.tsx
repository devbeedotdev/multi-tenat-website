"use client";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_PREFIX = "cart_";
const IDENTITY_PREFIX = "identity_";
const AUTH_PREFIX = "cart_auth_";

type CartContextValue = {
  items: CartItem[];
  cartId: string | null;
  cartName: string | null;
  isAuthenticated: boolean;
  isSyncing: boolean;
  /** True until localStorage has hydrated and (if applicable) getCartById sync is complete. */
  isLoading: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIdentity: (cartId: string, cartName: string) => void;
  setAuthenticated: (value: boolean) => void;
  replaceCart: (items: CartItem[]) => void;
  syncCartToCloud: ((cartId: string, items: CartItem[]) => Promise<void>) | undefined;
  setCartPageMounted: (mounted: boolean) => void;
  setPullCompleted: (completed: boolean) => void;
  domain: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function getStorageKey(domain: string) {
  return `${STORAGE_PREFIX}${domain}`;
}

function getIdentityKey(domain: string) {
  return `${IDENTITY_PREFIX}${domain}`;
}

function getAuthKey(domain: string) {
  return `${AUTH_PREFIX}${domain}`;
}

function loadAuthenticated(domain: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(getAuthKey(domain)) === "1";
  } catch {
    return false;
  }
}

function saveAuthenticated(domain: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) sessionStorage.setItem(getAuthKey(domain), "1");
    else sessionStorage.removeItem(getAuthKey(domain));
  } catch {
    // ignore
  }
}

function loadCart(domain: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(domain));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(domain: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(domain), JSON.stringify(items));
  } catch {
    // ignore
  }
}

function loadIdentity(domain: string): { cartId: string; cartName: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getIdentityKey(domain));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "cartId" in parsed && "cartName" in parsed) {
      return { cartId: String(parsed.cartId), cartName: String(parsed.cartName) };
    }
    return null;
  } catch {
    return null;
  }
}

function saveIdentity(domain: string, cartId: string, cartName: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getIdentityKey(domain), JSON.stringify({ cartId, cartName }));
  } catch {
    // ignore
  }
}

function clearIdentityStored(domain: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getIdentityKey(domain));
    sessionStorage.removeItem(getAuthKey(domain));
  } catch {
    // ignore
  }
}

type CartProviderProps = {
  children: ReactNode;
  domain: string;
  syncCartToCloud?: (cartId: string, items: CartItem[]) => Promise<void>;
};

export function CartProvider({ children, domain, syncCartToCloud }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartIdState] = useState<string | null>(null);
  const [cartName, setCartNameState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cartPageMounted, setCartPageMountedState] = useState(false);
  const [pullCompleted, setPullCompletedState] = useState(false);
  const syncRef = useRef(syncCartToCloud);
  syncRef.current = syncCartToCloud;

  const setCartPageMounted = useCallback((mounted: boolean) => {
    setCartPageMountedState(mounted);
    if (!mounted) setPullCompletedState(false);
  }, []);
  const setPullCompleted = useCallback((completed: boolean) => {
    setPullCompletedState(completed);
  }, []);

  useEffect(() => {
    setItems(loadCart(domain));
    const identity = loadIdentity(domain);
    if (identity) {
      setCartIdState(identity.cartId);
      setCartNameState(identity.cartName);
    } else {
      setCartIdState(null);
      setCartNameState(null);
    }
    setIsAuthenticatedState(loadAuthenticated(domain));
    setHydrated(true);
  }, [domain]);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(domain, items);
  }, [domain, items, hydrated]);

  useEffect(() => {
    if (!hydrated || !cartId || !isAuthenticated) return;
    if (cartPageMounted && !pullCompleted) return;
    const sync = syncRef.current;
    if (!sync) return;
    setIsSyncing(true);
    sync(cartId, items)
      .catch(() => {})
      .finally(() => setIsSyncing(false));
  }, [hydrated, cartId, isAuthenticated, items, cartPageMounted, pullCompleted]);

  const setIdentity = useCallback((id: string, name: string) => {
    setCartIdState(id);
    setCartNameState(name);
    saveIdentity(domain, id, name);
  }, [domain]);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticatedState(value);
    saveAuthenticated(domain, value);
  }, [domain]);

  const addToCart = useCallback(
    (product: Product, quantity: number) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === product.productId,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === product.productId
              ? {
                  ...i,
                  selectedQuantity: Math.min(
                    i.selectedQuantity + quantity,
                    product.quantityAvailable,
                  ),
                }
              : i,
          );
        }
        return [
          ...prev,
          { ...product, selectedQuantity: Math.min(quantity, product.quantityAvailable) },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        const qty = Math.max(1, Math.min(quantity, i.quantityAvailable));
        return { ...i, selectedQuantity: qty };
      }),
    );
  }, []);

  const replaceCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCartIdState(null);
    setCartNameState(null);
    setIsAuthenticatedState(false);
    clearIdentityStored(domain);
  }, [domain]);

  const isLoading =
    !hydrated || (!!cartId && isAuthenticated && !pullCompleted);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      cartId,
      cartName,
      isAuthenticated,
      isSyncing,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setIdentity,
      setAuthenticated,
      replaceCart,
      syncCartToCloud: syncRef.current,
      setCartPageMounted,
      setPullCompleted,
      domain,
    }),
    [
      items,
      cartId,
      cartName,
      isAuthenticated,
      isSyncing,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setIdentity,
      setAuthenticated,
      replaceCart,
      setCartPageMounted,
      setPullCompleted,
      domain,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
