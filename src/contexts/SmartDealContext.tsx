import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  AppNotification,
  BulkDiscountTier,
  Complaint,
  GroupBuyCampaign,
  ManagedUser,
  NegotiationThread,
  Order,
  OrderStatus,
  Product,
  ProductCategory,
  UserRole,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_GROUP_CAMPAIGNS,
  INITIAL_NEGOTIATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  formatINR,
} from '../services/mockData';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  city: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'error';
}

interface SmartDealContextValue {
  currentUser: AuthUser | null;
  products: Product[];
  negotiations: NegotiationThread[];
  campaigns: GroupBuyCampaign[];
  orders: Order[];
  wishlistIds: string[];
  notifications: AppNotification[];
  users: ManagedUser[];
  complaints: Complaint[];
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  login: (email: string, role?: UserRole) => void;
  register: (payload: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    businessName?: string;
  }) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  startNegotiation: (payload: {
    product: Product;
    quantity: number;
    offerPricePerUnit: number;
    note?: string;
  }) => string;
  submitBuyerOffer: (threadId: string, offerPricePerUnit: number, quantity: number, note?: string) => void;
  acceptCounteroffer: (threadId: string) => void;
  rejectCounteroffer: (threadId: string) => void;
  sendSellerCounteroffer: (threadId: string, counterPricePerUnit: number, note?: string) => void;
  acceptBuyerOfferAsSeller: (threadId: string) => void;
  rejectBuyerOfferAsSeller: (threadId: string) => void;
  placeOrder: (payload: {
    product: Product;
    quantity: number;
    unitPrice: number;
    orderType: Order['orderType'];
  }) => Order;
  joinGroupCampaign: (campaignId: string, quantity: number) => void;
  addProduct: (payload: {
    name: string;
    description: string;
    category: ProductCategory;
    image: string;
    originalPrice: number;
    stock: number;
    moq: number;
    bulkTiers: BulkDiscountTier[];
  }) => Product;
  removeProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  verifySellerUser: (userId: string) => void;
  toggleSuspendUser: (userId: string) => void;
  resolveComplaint: (complaintId: string, status: Complaint['status']) => void;
}

const SmartDealContext = createContext<SmartDealContextValue | undefined>(undefined);

const DEMO_ACCOUNTS: Record<UserRole, AuthUser> = {
  buyer: {
    id: 'buyer-1',
    fullName: 'Aarav Mehta',
    email: 'aarav@mehtaoffice.in',
    phone: '+91 98201 44210',
    role: 'buyer',
    businessName: 'Mehta Office Mart',
    city: 'Mumbai',
  },
  seller: {
    id: 'seller-1',
    fullName: 'Karthik Subramanian',
    email: 'sales@technovaperipherals.in',
    phone: '+91 99001 77412',
    role: 'seller',
    businessName: 'TechNova Peripherals Pvt. Ltd.',
    city: 'Bengaluru',
  },
  admin: {
    id: 'admin-1',
    fullName: 'Divya Krishnan',
    email: 'admin@smartdeal.in',
    phone: '+91 98450 11220',
    role: 'admin',
    businessName: 'SmartDeal Operations',
    city: 'Bengaluru',
  },
};

export const SmartDealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEMO_ACCOUNTS.buyer);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [negotiations, setNegotiations] = useState<NegotiationThread[]>(INITIAL_NEGOTIATIONS);
  const [campaigns, setCampaigns] = useState<GroupBuyCampaign[]>(INITIAL_GROUP_CAMPAIGNS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'prod-wireless-mouse',
    'prod-cookware-set',
  ]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const addNotification = useCallback(
    (title: string, message: string, roleTarget: AppNotification['roleTarget'] = 'all', link?: string) => {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        title,
        message,
        timestamp: 'Just now',
        read: false,
        link,
        roleTarget,
      };
      setNotifications((prev) => [notif, ...prev]);
    },
    []
  );

  const login = useCallback(
    (email: string, role: UserRole = 'buyer') => {
      const normalized = email.trim().toLowerCase();
      let resolvedRole = role;
      if (normalized.includes('seller') || normalized.includes('technova')) {
        resolvedRole = 'seller';
      } else if (normalized.includes('admin')) {
        resolvedRole = 'admin';
      }
      const account = {
        ...DEMO_ACCOUNTS[resolvedRole],
        email: email.trim() || DEMO_ACCOUNTS[resolvedRole].email,
      };
      setCurrentUser(account);
      pushToast(`Signed in as ${account.fullName}`, `Workspace: ${resolvedRole.toUpperCase()}`, 'success');
    },
    [pushToast]
  );

  const register = useCallback(
    (payload: {
      fullName: string;
      email: string;
      phone: string;
      role: UserRole;
      businessName?: string;
    }) => {
      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        businessName: payload.businessName || (payload.role === 'seller' ? `${payload.fullName} Enterprises` : undefined),
        city: 'Bengaluru',
      };
      setCurrentUser(newUser);
      setUsers((prev) => [
        {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          businessName: newUser.businessName,
          city: newUser.city,
          verified: payload.role === 'buyer',
          status: 'Active',
          joinedAt: '17 Nov 2026',
        },
        ...prev,
      ]);
      pushToast('Account created successfully', `Welcome to SmartDeal, ${payload.fullName}.`, 'success');
    },
    [pushToast]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    pushToast('Signed out', 'You have been securely logged out of SmartDeal.', 'info');
  }, [pushToast]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
        pushToast(exists ? 'Removed from wishlist' : 'Saved to wishlist', undefined, 'info');
        return next;
      });
    },
    [pushToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const startNegotiation = useCallback(
    (payload: {
      product: Product;
      quantity: number;
      offerPricePerUnit: number;
      note?: string;
    }): string => {
      const id = `neg-${Date.now()}`;
      const buyerName = currentUser?.fullName || 'Guest Buyer';
      const buyerId = currentUser?.id || 'buyer-1';
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const text =
        payload.note && payload.note.trim().length > 0
          ? payload.note.trim()
          : `I would like to purchase ${payload.quantity} units at ${formatINR(payload.offerPricePerUnit)} each.`;

      const newThread: NegotiationThread = {
        id,
        productId: payload.product.id,
        productName: payload.product.name,
        productImage: payload.product.image,
        listedPrice: payload.product.originalPrice,
        buyerId,
        buyerName: currentUser?.businessName ? `${buyerName} (${currentUser.businessName})` : buyerName,
        sellerId: payload.product.sellerId,
        sellerName: payload.product.sellerName,
        sellerCity: payload.product.sellerCity,
        desiredQuantity: payload.quantity,
        currentOfferPrice: payload.offerPricePerUnit,
        status: 'pending',
        updatedAt: `Today, ${nowTime}`,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderRole: 'buyer',
            senderName: buyerName,
            text,
            offerPricePerUnit: payload.offerPricePerUnit,
            quantity: payload.quantity,
            timestamp: nowTime,
            type: 'offer',
          },
        ],
      };

      setNegotiations((prev) => [newThread, ...prev]);
      addNotification(
        'Offer Submitted to Seller',
        `Offered ${formatINR(payload.offerPricePerUnit)}/unit for ${payload.quantity} × ${payload.product.name}.`,
        'seller',
        `/negotiations/${id}`
      );
      pushToast('Price offer sent', `Sent ${formatINR(payload.offerPricePerUnit)}/unit offer to ${payload.product.sellerName}.`, 'success');
      return id;
    },
    [currentUser, addNotification, pushToast]
  );

  const submitBuyerOffer = useCallback(
    (threadId: string, offerPricePerUnit: number, quantity: number, note?: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const buyerName = currentUser?.fullName || 'Aarav Mehta';
      const text =
        note?.trim() ||
        `I would like to propose a new offer of ${formatINR(offerPricePerUnit)} per unit for ${quantity} units.`;

      setNegotiations((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                desiredQuantity: quantity,
                currentOfferPrice: offerPricePerUnit,
                status: 'pending',
                updatedAt: `Today, ${nowTime}`,
                messages: [
                  ...thread.messages,
                  {
                    id: `msg-${Date.now()}`,
                    senderRole: 'buyer',
                    senderName: buyerName,
                    text,
                    offerPricePerUnit,
                    quantity,
                    timestamp: nowTime,
                    type: 'offer',
                  },
                ],
              }
            : thread
        )
      );
      pushToast('New offer submitted', `Proposed ${formatINR(offerPricePerUnit)}/unit.`, 'success');
    },
    [currentUser, pushToast]
  );

  const acceptCounteroffer = useCallback(
    (threadId: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const buyerName = currentUser?.fullName || 'Aarav Mehta';
      setNegotiations((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            status: 'accepted',
            finalAgreedPrice: thread.currentOfferPrice,
            updatedAt: `Today, ${nowTime}`,
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: 'buyer',
                senderName: buyerName,
                text: `I accept your offer of ${formatINR(thread.currentOfferPrice)} per unit for ${thread.desiredQuantity} units.`,
                offerPricePerUnit: thread.currentOfferPrice,
                quantity: thread.desiredQuantity,
                timestamp: nowTime,
                type: 'accept',
              },
            ],
          };
        })
      );
      pushToast('Counteroffer accepted', 'Price locked! You can now proceed to confirm your order.', 'success');
    },
    [currentUser, pushToast]
  );

  const rejectCounteroffer = useCallback(
    (threadId: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const buyerName = currentUser?.fullName || 'Aarav Mehta';
      setNegotiations((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            status: 'rejected',
            updatedAt: `Today, ${nowTime}`,
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: 'buyer',
                senderName: buyerName,
                text: 'I must decline this counteroffer. Thank you for reviewing.',
                timestamp: nowTime,
                type: 'reject',
              },
            ],
          };
        })
      );
      pushToast('Counteroffer declined', 'You can still submit a revised offer anytime.', 'info');
    },
    [currentUser, pushToast]
  );

  const sendSellerCounteroffer = useCallback(
    (threadId: string, counterPricePerUnit: number, note?: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setNegotiations((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          const text =
            note?.trim() ||
            `I can offer ${formatINR(counterPricePerUnit)} per unit for ${thread.desiredQuantity} units.`;
          return {
            ...thread,
            currentOfferPrice: counterPricePerUnit,
            status: 'countered',
            updatedAt: `Today, ${nowTime}`,
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: 'seller',
                senderName: thread.sellerName,
                text,
                offerPricePerUnit: counterPricePerUnit,
                quantity: thread.desiredQuantity,
                timestamp: nowTime,
                type: 'counteroffer',
              },
            ],
          };
        })
      );
      addNotification(
        'Seller Counteroffer Sent',
        `Counteroffer of ${formatINR(counterPricePerUnit)}/unit sent to buyer.`,
        'buyer',
        `/negotiations/${threadId}`
      );
      pushToast('Counteroffer sent', `Offered ${formatINR(counterPricePerUnit)}/unit to buyer.`, 'success');
    },
    [addNotification, pushToast]
  );

  const acceptBuyerOfferAsSeller = useCallback(
    (threadId: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setNegotiations((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            status: 'accepted',
            finalAgreedPrice: thread.currentOfferPrice,
            updatedAt: `Today, ${nowTime}`,
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: 'seller',
                senderName: thread.sellerName,
                text: `Accepted! We confirm ${thread.desiredQuantity} units at ${formatINR(thread.currentOfferPrice)} per unit.`,
                offerPricePerUnit: thread.currentOfferPrice,
                quantity: thread.desiredQuantity,
                timestamp: nowTime,
                type: 'accept',
              },
            ],
          };
        })
      );
      pushToast('Buyer offer accepted', 'Agreed price locked and buyer notified.', 'success');
    },
    [pushToast]
  );

  const rejectBuyerOfferAsSeller = useCallback(
    (threadId: string) => {
      const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setNegotiations((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            status: 'rejected',
            updatedAt: `Today, ${nowTime}`,
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: 'seller',
                senderName: thread.sellerName,
                text: 'Unable to fulfill at this unit price due to margin floor.',
                timestamp: nowTime,
                type: 'reject',
              },
            ],
          };
        })
      );
      pushToast('Offer declined', 'Buyer has been notified.', 'info');
    },
    [pushToast]
  );

  const placeOrder = useCallback(
    (payload: {
      product: Product;
      quantity: number;
      unitPrice: number;
      orderType: Order['orderType'];
    }): Order => {
      const totalAmount = payload.unitPrice * payload.quantity;
      const savings = Math.max(0, (payload.product.originalPrice - payload.unitPrice) * payload.quantity);
      const newOrder: Order = {
        id: `SD-ORD-${Math.floor(4100 + Math.random() * 800)}`,
        productId: payload.product.id,
        productName: payload.product.name,
        productImage: payload.product.image,
        buyerId: currentUser?.id || 'buyer-1',
        buyerName: currentUser?.fullName || 'Aarav Mehta',
        sellerId: payload.product.sellerId,
        sellerName: payload.product.sellerName,
        quantity: payload.quantity,
        unitPrice: payload.unitPrice,
        originalUnitPrice: payload.product.originalPrice,
        totalAmount,
        savings,
        orderType: payload.orderType,
        status: 'Confirmed',
        createdAt: '17 Nov 2026',
      };
      setOrders((prev) => [newOrder, ...prev]);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === payload.product.id ? { ...p, stock: Math.max(0, p.stock - payload.quantity) } : p
        )
      );
      addNotification(
        `Order ${newOrder.id} Confirmed`,
        `${payload.quantity} × ${payload.product.name} for ${formatINR(totalAmount)} (Saved ${formatINR(savings)}).`,
        'buyer',
        '/buyer/dashboard'
      );
      pushToast(`Order ${newOrder.id} placed`, `Total ${formatINR(totalAmount)} · You saved ${formatINR(savings)}!`, 'success');
      return newOrder;
    },
    [currentUser, addNotification, pushToast]
  );

  const joinGroupCampaign = useCallback(
    (campaignId: string, quantity: number) => {
      const participantName = currentUser?.fullName || 'Aarav Mehta';
      const participantCity = currentUser?.city || 'Mumbai';
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id !== campaignId) return c;
          const updatedQty = c.currentQuantity + quantity;
          return {
            ...c,
            currentQuantity: updatedQty,
            participants: [
              {
                id: `part-${Date.now()}`,
                name: participantName,
                city: participantCity,
                quantity,
                joinedAt: 'Just now',
              },
              ...c.participants,
            ],
          };
        })
      );
      const campaign = campaigns.find((c) => c.id === campaignId);
      if (campaign) {
        addNotification(
          'Joined Group Buy Campaign',
          `Committed ${quantity} units to ${campaign.productName} at ${formatINR(campaign.groupBuyPrice)}/unit.`,
          'buyer',
          '/group-buying'
        );
        pushToast(
          'Group buy commitment confirmed',
          `Added ${quantity} units to ${campaign.productName} (${campaign.discountPercent}% off).`,
          'success'
        );
      }
    },
    [currentUser, campaigns, addNotification, pushToast]
  );

  const addProduct = useCallback(
    (payload: {
      name: string;
      description: string;
      category: ProductCategory;
      image: string;
      originalPrice: number;
      stock: number;
      moq: number;
      bulkTiers: BulkDiscountTier[];
    }): Product => {
      const lowestTierPrice =
        payload.bulkTiers.length > 0
          ? payload.bulkTiers[payload.bulkTiers.length - 1].pricePerUnit
          : Math.round(payload.originalPrice * 0.85);

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: payload.name,
        category: payload.category,
        description: payload.description,
        image: payload.image,
        sellerId: currentUser?.id || 'seller-1',
        sellerName: currentUser?.businessName || 'TechNova Peripherals Pvt. Ltd.',
        sellerRating: 4.8,
        sellerCity: currentUser?.city || 'Bengaluru',
        sellerVerified: true,
        originalPrice: payload.originalPrice,
        discountedPrice: lowestTierPrice,
        stock: payload.stock,
        moq: payload.moq,
        popularity: 80,
        bulkTiers: payload.bulkTiers,
        specs: [
          { label: 'Minimum Order Qty', value: `${payload.moq} units` },
          { label: 'Dispatch SLA', value: '48 Hours Pan-India' },
          { label: 'Billing', value: 'GST Input Credit Available' },
        ],
      };

      setProducts((prev) => [newProduct, ...prev]);
      pushToast('Product published', `${payload.name} is now live on SmartDeal.`, 'success');
      return newProduct;
    },
    [currentUser, pushToast]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      pushToast('Listing removed', 'Product listing has been archived.', 'info');
    },
    [pushToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      pushToast('Order status updated', `${orderId} marked as ${status}.`, 'success');
    },
    [pushToast]
  );

  const verifySellerUser = useCallback(
    (userId: string) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: true } : u)));
      pushToast('Seller verified', 'KYC and GST verification approved.', 'success');
    },
    [pushToast]
  );

  const toggleSuspendUser = useCallback(
    (userId: string) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const nextStatus = u.status === 'Suspended' ? 'Active' : 'Suspended';
          return { ...u, status: nextStatus };
        })
      );
      pushToast('Account status updated', 'User standing updated in directory.', 'info');
    },
    [pushToast]
  );

  const resolveComplaint = useCallback(
    (complaintId: string, status: Complaint['status']) => {
      setComplaints((prev) => prev.map((c) => (c.id === complaintId ? { ...c, status } : c)));
      pushToast('Ticket updated', `Complaint ${complaintId} marked as ${status}.`, 'success');
    },
    [pushToast]
  );

  return (
    <SmartDealContext.Provider
      value={{
        currentUser,
        products,
        negotiations,
        campaigns,
        orders,
        wishlistIds,
        notifications,
        users,
        complaints,
        toasts,
        dismissToast,
        pushToast,
        login,
        register,
        logout,
        toggleWishlist,
        markAllNotificationsRead,
        markNotificationRead,
        startNegotiation,
        submitBuyerOffer,
        acceptCounteroffer,
        rejectCounteroffer,
        sendSellerCounteroffer,
        acceptBuyerOfferAsSeller,
        rejectBuyerOfferAsSeller,
        placeOrder,
        joinGroupCampaign,
        addProduct,
        removeProduct,
        updateOrderStatus,
        verifySellerUser,
        toggleSuspendUser,
        resolveComplaint,
      }}
    >
      {children}
    </SmartDealContext.Provider>
  );
};

export function useSmartDeal(): SmartDealContextValue {
  const ctx = useContext(SmartDealContext);
  if (!ctx) {
    throw new Error('useSmartDeal must be used within a SmartDealProvider');
  }
  return ctx;
}
