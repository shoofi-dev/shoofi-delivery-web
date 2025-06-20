export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery';
  value: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit: number;
  usagePerUser: number;
  start: string;
  end: string;
  applicableTo?: {
    categories?: string[];
    products?: string[];
    stores?: string[];
  };
  isActive: boolean;
  isCustomerSpecific?: boolean;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
  isUsed?: boolean;
} 