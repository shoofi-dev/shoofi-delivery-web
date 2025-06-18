import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { format } from "date-fns";
import { Coupon } from "../../../types/coupon";
import { axiosInstance } from "utils/http-interceptor";

interface CouponFormProps {
  open: boolean;
  initialValues?: Coupon;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CouponForm: React.FC<CouponFormProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState(initialValues?.code || "");
  const [loadingCode, setLoadingCode] = useState(false);

  const handleGenerateCode = async () => {
    setLoadingCode(true);
    try {
      const res:any = await axiosInstance.get("/admin/coupon/generate-code");
      setCode(res.code);
    } catch (err) {
      // Optionally show error
    }
    setLoadingCode(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      code: code,
      type: formData.get("type"),
      value: parseFloat(formData.get("value") as string),
      maxDiscount: formData.get("maxDiscount")
        ? parseFloat(formData.get("maxDiscount") as string)
        : null,
      minOrderAmount: formData.get("minOrderAmount")
        ? parseFloat(formData.get("minOrderAmount") as string)
        : null,
      usageLimit: parseInt(formData.get("usageLimit") as string),
      usagePerUser: parseInt(formData.get("usagePerUser") as string),
      start: new Date(formData.get("start") as string),
      end: new Date(formData.get("end") as string),
      isActive: formData.get("isActive") === "true",
    };
    onSubmit(data);
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      return "";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialValues ? "עריכת קופון" : "יצירת קופון"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                קוד קופון*
                <div style={{ display: "flex", flexDirection: "row-reverse", gap: 8 }}>
                  <input
                    type="text"
                    name="code"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      textAlign: "right",
                      marginTop: 4,
                      padding: 8,
                      boxSizing: "border-box",
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleGenerateCode}
                    disabled={loadingCode}
                    style={{ whiteSpace: "nowrap", minWidth: 0 }}
                  >
                    {loadingCode ? "..." : "צור אוטומטי"}
                  </Button>
                </div>
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                סוג*
                <select
                  name="type"
                  defaultValue={initialValues?.type || "percentage"}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                  className="rtl-select"
                >
                  <option value="percentage">אחוזים</option>
                  <option value="fixed_amount">סכום קבוע</option>
                  <option value="free_delivery">משלוח חינם</option>
                </select>
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                ערך*
                <input
                  type="number"
                  name="value"
                  defaultValue={initialValues?.value}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                הנחה מקסימלית
                <input
                  type="number"
                  name="maxDiscount"
                  defaultValue={initialValues?.maxDiscount}
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                סכום הזמנה מינימלי
                <input
                  type="number"
                  name="minOrderAmount"
                  defaultValue={initialValues?.minOrderAmount}
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                מגבלת שימוש*
                <input
                  type="number"
                  name="usageLimit"
                  defaultValue={initialValues?.usageLimit}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                שימוש לכל משתמש*
                <input
                  type="number"
                  name="usagePerUser"
                  defaultValue={initialValues?.usagePerUser}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                תאריך התחלה*
                <input
                  type="datetime-local"
                  name="start"
                  defaultValue={formatDateForInput(initialValues?.start)}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <label
                style={{ display: "block", textAlign: "right", width: "100%" }}
              >
                תאריך סיום*
                <input
                  type="datetime-local"
                  name="end"
                  defaultValue={formatDateForInput(initialValues?.end)}
                  required
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: 4,
                    padding: 8,
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </Grid>
            {initialValues && (
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      defaultChecked={initialValues.isActive}
                    />
                  }
                  label="פעיל"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? "עדכן" : "צור"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouponForm;
