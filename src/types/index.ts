export type UserRole = 'buyer' | 'seller' | 'admin';

export type ProductCategory =
  | 'Electronics'
  | 'Clothing'
  | 'Groceries'
  | 'Home & Kitchen'
  | 'Stationery'
  | 'Industrial Supplies';

export interface BulkDiscountTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
  discountPercent: number;
}

export interface SellerProfile {
  id: string;
  name: string;
  businessName: string;
  city: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
  responseTime: string;
  joinedYear: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  gallery?: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerCity: string;
  sellerVerified: boolean;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  moq: number;
  popularity: number;
  bulkTiers: BulkDiscountTier[];
  specs: { label: string; value: string }[];
}

export type NegotiationStatus = 'pending' | 'countered' | 'accepted' | 'rejected';

export interface NegotiationMessage {
  id: string;
  senderRole: 'buyer' | 'seller';
  senderName: string;
  text: string;
  offerPricePerUnit?: number;
  quantity?: number;
  timestamp: string;
  type: 'offer' | 'counteroffer' | 'accept' | 'reject' | 'note';
}

export interface NegotiationThread {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  listedPrice: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  desiredQuantity: number;
  currentOfferPrice: number;
  finalAgreedPrice?: number;
  status: NegotiationStatus;
  updatedAt: string;
  messages: NegotiationMessage[];
}

export interface GroupBuyParticipant {
  id: string;
  name: string;
  city: string;
  quantity: number;
  joinedAt: string;
}

export interface GroupBuyCampaign {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  image: string;
  sellerName: string;
  originalPrice: number;
  groupBuyPrice: number;
  discountPercent: number;
  targetQuantity: number;
  currentQuantity: number;
  deadline: string;
  rules: string[];
  participants: GroupBuyParticipant[];
}

export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  totalAmount: number;
  savings: number;
  orderType: 'Negotiated' | 'Bulk Discount' | 'Group Buy' | 'Direct';
  status: OrderStatus;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  roleTarget: UserRole | 'all';
}

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  city: string;
  verified: boolean;
  status: 'Active' | 'Reported' | 'Suspended';
  joinedAt: string;
}

export interface Complaint {
  id: string;
  reporterName: string;
  reportedAccount: string;
  subject: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: string;
}
