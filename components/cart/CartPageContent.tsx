"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  getCartById,
  setCartPassword,
  verifyCartPassword,
} from "@/lib/actions";
import { mergeCartItems } from "@/lib/cart-utils";
import type { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import { useEffect, useRef, useState } from "react";
import CartAboutCard from "./CartAbout";
import CartEmptyState from "./CartEmptyState";
import CardRelatedProductsSection from "./CartRelatedProductSection";
import CartSummarySection from "./CartSummarySection";
import CartTotalCard from "./CartTotalCard";
import ConflictDialog from "./ConflictDialog";
import ContactVendorCard from "./ContactVendorCard";
import IdentityModal from "./IdentityModal";
import PasswordPromptModal from "./PasswordPromptModal";

type CartPageContentProps = {
  tenant: Tenant;
  domain: string;
  suggestedProducts: Product[];
};

export default function CartPageContent({
  tenant,
  domain,
  suggestedProducts,
}: CartPageContentProps) {
  const {
    items,
    cartId,
    cartName,
    isAuthenticated,
    setAuthenticated,
    setIdentity,
    replaceCart,
    syncCartToCloud,
    setCartPageMounted,
    setPullCompleted,
  } = useCart();
  const { showToast } = useToast();
  const [showSyncConflict, setShowSyncConflict] = useState(false);
  const [syncConflictCloudItems, setSyncConflictCloudItems] = useState<
    CartItem[]
  >([]);
  const [syncChecked, setSyncChecked] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showSyncIdentityModal, setShowSyncIdentityModal] = useState(false);
  const [syncIdentityError, setSyncIdentityError] = useState("");
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;
    setCartPageMounted(true);
    // #region agent log
    if (typeof window !== "undefined") {
      fetch(
        "http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "6f50f1",
          },
          body: JSON.stringify({
            sessionId: "6f50f1",
            location: "CartPageContent.tsx:mount",
            message: "CartPageContent mounted",
            data: {},
            hypothesisId: "H2_H4",
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    return () => {
      mountRef.current = false;
      setCartPageMounted(false);
      setPullCompleted(false);
      setSyncChecked(false);
      // #region agent log
      if (typeof window !== "undefined") {
        fetch(
          "http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "6f50f1",
            },
            body: JSON.stringify({
              sessionId: "6f50f1",
              location: "CartPageContent.tsx:unmount",
              message: "CartPageContent unmounted",
              data: {},
              hypothesisId: "H4",
              timestamp: Date.now(),
            }),
          },
        ).catch(() => {});
      }
      // #endregion
    };
  }, [setCartPageMounted, setPullCompleted]);

  useEffect(() => {
    if (cartId && !isAuthenticated) {
      setShowPasswordPrompt(true);
    }
  }, [cartId, isAuthenticated]);

  const handlePasswordSubmit = async (password: string) => {
    setPasswordError("");
    if (!cartId) return;
    const ok = await verifyCartPassword(cartId, password);
    if (!ok) {
      setPasswordError("Incorrect Password");
      return;
    }
    setAuthenticated(true);
    setShowPasswordPrompt(false);
    showToast("Securely synced with your cloud cart");
  };

  useEffect(() => {
    // #region agent log
    if (typeof window !== "undefined") {
      fetch(
        "http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "6f50f1",
          },
          body: JSON.stringify({
            sessionId: "6f50f1",
            location: "CartPageContent.tsx:silent-pull-effect",
            message: "Silent pull effect ran",
            data: {
              cartId: !!cartId,
              isAuthenticated,
              syncChecked,
              willRun: !!(cartId && isAuthenticated && !syncChecked),
            },
            hypothesisId: "H2_H4_H5",
            timestamp: Date.now(),
          }),
        },
      ).catch(() => {});
    }
    // #endregion
    if (!cartId || !isAuthenticated || syncChecked) return;
    let cancelled = false;
    (async () => {
      // #region agent log
      if (typeof window !== "undefined") {
        fetch(
          "http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "6f50f1",
            },
            body: JSON.stringify({
              sessionId: "6f50f1",
              location: "CartPageContent.tsx:getCartById-call",
              message: "getCartById started",
              data: {},
              hypothesisId: "H2_H5",
              timestamp: Date.now(),
            }),
          },
        ).catch(() => {});
      }
      // #endregion
      const cloudCart = await getCartById(cartId);
      if (cancelled) return;
      // #region agent log
      if (typeof window !== "undefined") {
        fetch(
          "http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "6f50f1",
            },
            body: JSON.stringify({
              sessionId: "6f50f1",
              location: "CartPageContent.tsx:replaceCart-call",
              message: "replaceCart(cloud) called",
              data: { cloudLength: cloudCart?.length ?? 0 },
              hypothesisId: "H5",
              timestamp: Date.now(),
            }),
          },
        ).catch(() => {});
      }
      // #endregion
      setSyncChecked(true);
      setPullCompleted(true);
      replaceCart(cloudCart ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [cartId, replaceCart, syncChecked, isAuthenticated, setPullCompleted]);

  const handleSyncMerge = () => {
    const merged = mergeCartItems(items, syncConflictCloudItems);
    replaceCart(merged);
    setSyncConflictCloudItems([]);
  };

  const handleSyncOverwrite = async () => {
    if (syncCartToCloud && cartId) {
      await syncCartToCloud(cartId, items);
    }
    setSyncConflictCloudItems([]);
  };

  const handleSyncWithCloudClick = async () => {
    if (isAuthenticated && cartId) {
      const cloudCart = await getCartById(cartId);
      replaceCart(cloudCart ?? []);
      showToast("Cart synced from cloud");
      return;
    }
    setSyncIdentityError("");
    setShowSyncIdentityModal(true);
  };

  const handleSyncIdentitySubmit = async (
    phone: string,
    name: string,
    password: string,
  ) => {
    setSyncIdentityError("");
    const cloudCart = await getCartById(phone);
    const cloudHasCart = cloudCart != null && cloudCart.length > 0;
    if (!cloudHasCart) {
      await setCartPassword(phone, password);
      setIdentity(phone, name);
      setAuthenticated(true);
      setShowSyncIdentityModal(false);
      showToast("Securely synced with your cloud cart");
      return;
    }
    const ok = await verifyCartPassword(phone, password);
    if (!ok) {
      setSyncIdentityError(
        "Password mismatch for this phone number. Please try again to sync your cloud items.",
      );
      return;
    }
    setIdentity(phone, name);
    setAuthenticated(true);
    setShowSyncIdentityModal(false);
    if (items.length === 0) {
      replaceCart(cloudCart);
      showToast("Securely synced with your cloud cart");
    } else {
      setShowSyncConflict(true);
      setSyncConflictCloudItems(cloudCart);
    }
  };

  if (items.length === 0 && !showSyncConflict) {
    return (
      <div className="mx-auto w-full max-w-7xl px-3 py-6 md:px-6">
        <PasswordPromptModal
          open={showPasswordPrompt}
          onClose={() => setShowPasswordPrompt(false)}
          onSubmit={handlePasswordSubmit}
          errorMessage={passwordError}
        />
        {cartId && cartName && isAuthenticated && (
          <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Your cart</p>
            <p className="mt-1 text-sm text-slate-600">
              {cartName} • {cartId}
            </p>
          </div>
        )}
        <IdentityModal
          open={showSyncIdentityModal}
          onClose={() => {
            setShowSyncIdentityModal(false);
            setSyncIdentityError("");
          }}
          onSubmit={handleSyncIdentitySubmit}
          errorMessage={syncIdentityError}
        />

        <CartEmptyState
          domain={domain}
          handleSyncWithCloudClick={handleSyncWithCloudClick}
        />
        <ConflictDialog
          open={showSyncConflict}
          onClose={() => {
            setShowSyncConflict(false);
            setSyncConflictCloudItems([]);
          }}
          onMerge={handleSyncMerge}
          onOverwrite={handleSyncOverwrite}
        />

        <CardRelatedProductsSection
          tenant={tenant}
          products={suggestedProducts}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-6 pb-24 md:px-6 lg:pb-6">
      <PasswordPromptModal
        open={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        onSubmit={handlePasswordSubmit}
        errorMessage={passwordError}
      />
      <IdentityModal
        open={showSyncIdentityModal}
        onClose={() => {
          setShowSyncIdentityModal(false);
          setSyncIdentityError("");
        }}
        onSubmit={handleSyncIdentitySubmit}
        errorMessage={syncIdentityError}
      />

      {cartId && cartName && isAuthenticated && (
        <div className="mb-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-700">Your cart</p>
          <p className="mt-1 text-sm text-slate-600">
            {cartName} • {cartId}
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="min-w-0">
          <CartSummarySection />
        </div>
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <CartTotalCard />
          <ContactVendorCard tenant={tenant} />
          <CartAboutCard tenant={tenant} domain={domain} />
        </div>
      </div>
      <ConflictDialog
        open={showSyncConflict}
        onClose={() => {
          setShowSyncConflict(false);
          setSyncConflictCloudItems([]);
        }}
        onMerge={handleSyncMerge}
        onOverwrite={handleSyncOverwrite}
      />
      <div>
        <CardRelatedProductsSection
          tenant={tenant}
          products={suggestedProducts}
        />
      </div>
    </div>
  );
}
