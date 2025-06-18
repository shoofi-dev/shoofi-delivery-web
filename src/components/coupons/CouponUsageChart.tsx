import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Typography, Box } from '@mui/material';

interface CouponUsageData {
  couponCode: string;
  totalUsage: number;
  totalDiscount: number;
}

interface CouponUsageChartProps {
  data: CouponUsageData[];
}

const CouponUsageChart: React.FC<CouponUsageChartProps> = ({ data }) => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Usage by Coupon
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="couponCode" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="totalUsage" name="Total Usage" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="totalDiscount" name="Total Discount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default CouponUsageChart; 