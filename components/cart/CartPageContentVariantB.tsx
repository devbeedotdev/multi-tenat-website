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
import CartEmptyStateVariantB from "./CartEmptyStateVariantB";
import CartItemCardVariantB from "./CartItemCardVariantB";
import CardRelatedProductsSection from "./CartRelatedProductSection";
import ConflictDialog from "./ConflictDialog";
import IdentityModalVariantB from "./IdentityModalVariantB";
import OrderSummaryPanelVariantB from "./OrderSummaryPanelVariantB";
import PasswordPromptModal from "./PasswordPromptModal";
import PaymentMethodModal from "./PaymentMethodModal";
import VariantBSkeleton from "./VariantBSkeleton";

type CartPageContentVariantBProps = {
  tenant: Tenant;
  domain: string;
  suggestedProducts: Product[];
};

function getUnitPrice(item: CartItem): number {
  return item.discountPrice != null && item.discountPrice > 0
    ? item.discountPrice
    : item.productAmount;
}

export default function CartPageContentVariantB({
  tenant,
  domain,
  suggestedProducts,
}: CartPageContentVariantBProps) {
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
    return <VariantBSkeleton />;
  }

  if (items.length === 0 && !showSyncConflict) {
    return (
      <div className="mx-auto w-full max-w-6xl px-3 py-6 md:px-6">
        <PasswordPromptModal
          open={showPasswordPrompt}
          onClose={() => setShowPasswordPrompt(false)}
          onSubmit={handlePasswordSubmit}
          errorMessage={passwordError}
        />
        {cartId && cartName && isAuthenticated && (
          <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-700">Your cart</p>
            <p className="mt-1 text-sm text-neutral-600">
              {cartName} • {cartId}
            </p>
          </div>
        )}
        <IdentityModalVariantB
          open={showSyncIdentityModal}
          onClose={() => {
            setShowSyncIdentityModal(false);
            setSyncIdentityError("");
          }}
          onSubmit={handleSyncIdentitySubmit}
          errorMessage={syncIdentityError}
        />
        <CartEmptyStateVariantB
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
    <div className="min-h-screen bg-white font-sans">
      <PasswordPromptModal
        open={showPasswordPrompt}
        onClose={() => setShowPasswordPrompt(false)}
        onSubmit={handlePasswordSubmit}
        errorMessage={passwordError}
      />
      <IdentityModalVariantB
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
        <div className="mx-auto max-w-7xl px-3 pt-4 md:px-6">
          <div className="mb-4 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium text-neutral-700">Your cart</p>
            <p className="mt-1 text-sm text-neutral-600">
              {cartName} • {cartId}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-3 py-6 pb-5 md:px-6 md:pb-6 ">
        <div className="grid gap-82 lg:grid-cols-[1fr,360px]">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-medium text-neutral-900 md:text-3xl">
              Cart
            </h1>
            <ul className="mt-4 flex flex-col gap-3 md:mr-5" role="list">
              {items.map((item, index) => (
                <li key={item.productId}>
                  <CartItemCardVariantB
                    item={item}
                    index={index}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <OrderSummaryPanelVariantB
                tenant={tenant}
                domain={domain}
                onPayNowClick={() => setShowPaymentModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related products: full width, same horizontal padding as header */}
      <div className="mt-10 w-full  px-3 md:px-4 pb-28 md:pb-6">
        <CardRelatedProductsSection
          tenant={tenant}
          products={suggestedProducts}
        />
      </div>

      {/* Mobile: bottom bar with total + Pay Now */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Total
          </p>
          <p className="font-serif text-lg font-medium text-neutral-900">
            {currency}
            {formatPrice(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPaymentModal(true)}
          className="rounded-full px-6 py-3 text-sm font-medium text-white transition hover:opacity-95"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
