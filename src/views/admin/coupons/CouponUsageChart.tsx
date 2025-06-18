import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
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
import { useSnackbar } from 'notistack';
import { axiosInstance } from 'utils/http-interceptor';

interface CouponUsage {
  couponCode: string;
  totalUsage: number;
  totalDiscount: number;
}

const CouponUsageChart: React.FC = () => {
  const [usageData, setUsageData] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response: any = await axiosInstance.get('/coupons/admin/usage');
        setUsageData(response);
      } catch (error) {
        enqueueSnackbar('נכשל בטעינת נתוני שימוש בקופונים', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          ניתוח שימוש בקופונים
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                שימוש לפי קופון
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="couponCode" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalUsage" name="סה״כ שימוש" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="totalDiscount" name="סה״כ הנחה" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                סיכום
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    סה״כ קופונים
                  </Typography>
                  <Typography variant="h4">
                    {usageData.length}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    סה״כ שימוש
                  </Typography>
                  <Typography variant="h4">
                    {usageData.reduce((sum, item) => sum + item.totalUsage, 0)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    סה״כ הנחה
                  </Typography>
                  <Typography variant="h4">
                    ₪{usageData.reduce((sum, item) => sum + item.totalDiscount, 0).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CouponUsageChart; 