import type { CartItem } from "@/types/cart";
import type { Order, OrderStatus, LandingOrder } from "@/types/order";

/**
 * Repository pattern for orders so we can swap the storage
 * layer (mock DB → Prisma) without touching UI or server actions.
 */

export interface TenantOrderRepository {
  createOrder(
    tenantId: string,
    items: CartItem[],
    totalAmount: number,
    options?: { paystackReference?: string },
  ): Promise<Order>;

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    options?: { paystackReference?: string },
  ): Promise<Order | null>;
}

export type CreateLandingOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName: string;
  productType: string;
  amount: number;
};

export interface LandingOrderRepository {
  createLandingOrder(input: CreateLandingOrderInput): Promise<LandingOrder>;

  updateLandingOrderStatus(
    orderId: string,
    status: OrderStatus,
    options?: { paystackReference?: string },
  ): Promise<LandingOrder | null>;
}

/**
 * In-memory implementations.
 * These are thin wrappers around module-level arrays and can later
 * be replaced with Prisma-backed implementations without changing
 * the DAL or UI call sites.
 */

const tenantOrders: Order[] = [];
const landingOrders: LandingOrder[] = [];

class InMemoryTenantOrderRepository implements TenantOrderRepository {
  async createOrder(
    tenantId: string,
    items: CartItem[],
    totalAmount: number,
    options?: { paystackReference?: string },
  ): Promise<Order> {
    const orderId = `order-${tenantId}-${Date.now()}-${tenantOrders.length + 1}`;

    const order: Order = {
      orderId,
      tenantId,
      items: [...items],
      totalAmount,
      status: "pending",
      paystackReference: options?.paystackReference,
    };

    tenantOrders.push(order);
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    options?: { paystackReference?: string },
  ): Promise<Order | null> {
    const order = tenantOrders.find((o) => o.orderId === orderId);
    if (!order) return null;

    order.status = status;
    if (options?.paystackReference !== undefined) {
      order.paystackReference = options.paystackReference;
    }

    return order;
  }
}

class InMemoryLandingOrderRepository implements LandingOrderRepository {
  async createLandingOrder(
    input: CreateLandingOrderInput,
  ): Promise<LandingOrder> {
    const orderId = `landing-${Date.now()}-${landingOrders.length + 1}`;

    const order: LandingOrder = {
      orderId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      businessName: input.businessName,
      productType: input.productType,
      amount: input.amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    landingOrders.push(order);
    return order;
  }

  async updateLandingOrderStatus(
    orderId: string,
    status: OrderStatus,
    options?: { paystackReference?: string },
  ): Promise<LandingOrder | null> {
    const order = landingOrders.find((o) => o.orderId === orderId);
    if (!order) return null;

    order.status = status;
    if (options?.paystackReference !== undefined) {
      order.paystackReference = options.paystackReference;
    }

    return order;
  }
}

export const tenantOrderRepository: TenantOrderRepository =
  new InMemoryTenantOrderRepository();

export const landingOrderRepository: LandingOrderRepository =
  new InMemoryLandingOrderRepository();

