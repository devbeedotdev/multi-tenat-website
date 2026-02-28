"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  getCartById,
  setCartPassword,
  verifyCartPassword,
} from "@/lib/actions";
import { mergeCartItems } from "@/lib/cart-utils";
import { formatPrice } from "@/src/utils/string.utils";
import type { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import type { Tenant } from "@/types/tenant";
import { useEffect, useState } from "react";
import CartEmptyStateVariantC from "./CartEmptyStateVariantC";
import CartItemCardVariantC from "./CartItemCardVariantC";
import CardRelatedProductsSection from "./CartRelatedProductSection";
import ConflictDialog from "./ConflictDialog";
import IdentityModalVariantC from "./IdentityModalVariantC";
import PasswordPromptModal from "./PasswordPromptModal";
import PaymentMethodModal from "./PaymentMethodModal";
import VariantCSkeleton from "./VariantCSkeleton";

type CartPageContentVariantCProps = {
  tenant: Tenant;
  domain: string;
  suggestedProducts: Product[];
};

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

export default function CartPageContentVariantC({
  tenant,
  domain,
  suggestedProducts,
}: CartPageContentVariantCProps) {
  const {
    items,
    cartId,
    cartName,
    isAuthenticated,
    isLoading,
    setAuthenticated,
    setIdentity,
    replaceCart,
    syncCartToCloud,
    setCartPageMounted,
    setPullCompleted,
    updateQuantity,
    removeFromCart,
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    setCartPageMounted(true);
    return () => {
      setCartPageMounted(false);
      setPullCompleted(false);
      setSyncChecked(false);
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
    if (!cartId || !isAuthenticated || syncChecked) return;
    let cancelled = false;
    (async () => {
      const cloudCart = await getCartById(cartId);
      if (cancelled) return;
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

  const total = items.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.selectedQuantity,
    0,
  );
  const currency = items[0]?.currency ?? "₦";

  if (isLoading) {
    return <VariantCSkeleton />;
  }

  if (items.length === 0 && !showSyncConflict) {
    return (
      <div className="mx-auto w-full    py-6 ">
        <PasswordPromptModal
          open={showPasswordPrompt}
          onClose={() => setShowPasswordPrompt(false)}
          onSubmit={handlePasswordSubmit}
          errorMessage={passwordError}
        />
        {cartId && cartName && isAuthenticated && (
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700">Your cart</p>
            <p className="mt-1 text-sm text-gray-600">
              {cartName} • {cartId}
            </p>
          </div>
        )}
        <IdentityModalVariantC
          open={showSyncIdentityModal}
          onClose={() => {
            setShowSyncIdentityModal(false);
            setSyncIdentityError("");
          }}
          onSubmit={handleSyncIdentitySubmit}
          errorMessage={syncIdentityError}
        />
        <CartEmptyStateVariantC
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
        <div className="mt-8 w-full px-3 md:px-4">
          <CardRelatedProductsSection
            tenant={tenant}
            products={suggestedProducts}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <PasswordPromptModal
        open={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        onSubmit={handlePasswordSubmit}
        errorMessage={passwordError}
      />
      <IdentityModalVariantC
        open={showSyncIdentityModal}
        onClose={() => {
          setShowSyncIdentityModal(false);
          setSyncIdentityError("");
        }}
        onSubmit={handleSyncIdentitySubmit}
        errorMessage={syncIdentityError}
      />
      <PaymentMethodModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tenant={tenant}
        domain={domain}
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

      {cartId && cartName && isAuthenticated && (
        <div className="mx-auto max-w-2xl px-3 pt-4 md:px-6">
          <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700">Your cart</p>
            <p className="mt-1 text-sm text-gray-600">
              {cartName} • {cartId}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-2xl px-3 py-6 md:px-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">My Cart</h1>
        <ul className="mt-4 flex flex-col gap-3" role="list">
          {items.map((item, index) => (
            <li key={item.productId}>
              <CartItemCardVariantC
                item={item}
                index={index}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <CardRelatedProductsSection
            tenant={tenant}
            products={suggestedProducts}
          />
        </div>
      </div>

      {/* App-style sticky bottom bar: total + Checkout */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:rounded-t-2xl md:mx-auto md:max-w-2xl md:left-1/2 md:right-auto md:-translate-x-1/2 md:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total
          </p>
          <p className="text-lg font-bold text-gray-900">
            {currency}
            {formatPrice(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPaymentModal(true)}
          className="flex-1 rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] md:max-w-xs"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
