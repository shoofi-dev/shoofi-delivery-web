import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  DialogTitle,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { Coupon } from '../../../types/coupon';
import CouponForm from './CouponForm';
import { axiosInstance } from 'utils/http-interceptor';

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCoupons = async () => {
    try {
      const response:any = await axiosInstance.get('/admin/coupons');
      console.log('Fetched coupons:', response);
      setCoupons(response);
    } catch (error) {
      enqueueSnackbar('נכשל בטעינת קופונים', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = () => {
    setEditingCoupon(null);
    setOpenDialog(true);
  };

  const handleEdit = (coupon: Coupon) => {
    console.log('Editing coupon:', coupon);
    console.log('Start date type:', typeof coupon.start, 'value:', coupon.start);
    console.log('End date type:', typeof coupon.end, 'value:', coupon.end);
    setEditingCoupon(coupon);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק קופון זה?')) {
      try {
        await axiosInstance.delete(`/admin/coupon/delete`, { data: { couponId: id } });
        enqueueSnackbar('קופון נמחק בהצלחה', { variant: 'success' });
        fetchCoupons();
      } catch (error) {
        enqueueSnackbar('נכשל במחיקת קופון', { variant: 'error' });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingCoupon) {
        await axiosInstance.post('/admin/coupon/update', {
          ...data,
          couponId: editingCoupon._id,
        });
        enqueueSnackbar('קופון עודכן בהצלחה', { variant: 'success' });
      } else {
          await axiosInstance.post('/admin/coupon/create', data);
        enqueueSnackbar('קופון נוצר בהצלחה', { variant: 'success' });
      }
      setOpenDialog(false);
      fetchCoupons();
    } catch (error) {
      enqueueSnackbar('נכשל בשמירת קופון', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">קופונים</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            צור קופון
          </Button>
        </Box>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>קוד קופון</TableCell>
                  <TableCell>סוג</TableCell>
                  <TableCell>ערך</TableCell>
                  <TableCell>מגבלת שימוש</TableCell>
                  <TableCell>שימוש לכל משתמש</TableCell>
                  <TableCell>תאריך התחלה</TableCell>
                  <TableCell>תאריך סיום</TableCell>
                  <TableCell>סטטוס</TableCell>
                  <TableCell>פעולות</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons?.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.type}</TableCell>
                    <TableCell>{coupon.value}</TableCell>
                    <TableCell>{coupon.usageLimit}</TableCell>
                    <TableCell>{coupon.usagePerUser}</TableCell>
                    <TableCell>{format(new Date(coupon.start), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{format(new Date(coupon.end), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Chip
                        label={coupon.isActive ? 'פעיל' : 'לא פעיל'}
                        color={coupon.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(coupon)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(coupon._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <CouponForm
          open={openDialog}
          initialValues={editingCoupon || undefined}
          onClose={() => setOpenDialog(false)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Container>
  );
};

export default CouponList; 