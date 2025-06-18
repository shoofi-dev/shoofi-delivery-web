import axios from 'axios';
import { Coupon } from '../types/coupon';

const API_BASE = '/coupons/admin';

export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await axios.get(`${API_BASE}/coupons`);
  return res.data;
};

export const createCoupon = async (data: Partial<Coupon>) => {
  const res = await axios.post(`${API_BASE}/coupon/create`, data);
  return res.data;
};

export const updateCoupon = async (couponId: string, data: Partial<Coupon>) => {
  const res = await axios.post(`${API_BASE}/coupon/update`, { ...data, couponId });
  return res.data;
};

export const deleteCoupon = async (couponId: string) => {
  const res = await axios.delete(`${API_BASE}/coupon/delete`, { data: { couponId } });
  return res.data;
}; 