import React, { useState, useEffect } from "react";
import { updateWarehouse } from "./khoHangApi";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function KhoHang_Update({ data, onSuccess, onCancel }) {
  const [form, setForm] = useState(data || {});

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWarehouse(data.ma_kho, form);
      alert("Cập nhật kho thành công!");
      onSuccess();
    } catch {
      alert("Lỗi khi cập nhật kho!");
    }
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Sửa kho</Typography>
      <TextField name="ma_kho" label="Mã kho" value={form.ma_kho} disabled fullWidth sx={{ my: 1 }} />
      <TextField name="ten_kho" label="Tên kho" value={form.ten_kho || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="vi_tri_kho" label="Vị trí kho" value={form.vi_tri_kho || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="tinh_trang" label="Tình trạng" value={form.tinh_trang || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="nguoi_tao" label="Người tạo" value={form.nguoi_tao || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="quan_ly_kho" label="Quản lý kho" value={form.quan_ly_kho || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="ngay_tao" label="Ngày tạo" type="date" value={form.ngay_tao ? form.ngay_tao.slice(0,10) : ""} onChange={handleChange} fullWidth sx={{ my: 1 }} InputLabelProps={{ shrink: true }}/>
      <TextField name="ngay_kiem_ke_gan_nhat" label="Ngày kiểm kê gần nhất" type="date" value={form.ngay_kiem_ke_gan_nhat ? form.ngay_kiem_ke_gan_nhat.slice(0,10) : ""} onChange={handleChange} fullWidth sx={{ my: 1 }} InputLabelProps={{ shrink: true }}/>
      <TextField name="tong_gia_tri_nhap" label="Tổng nhập" type="number" value={form.tong_gia_tri_nhap || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="tong_gia_tri_xuat" label="Tổng xuất" type="number" value={form.tong_gia_tri_xuat || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="tong_gia_tri_ton_kho" label="Tổng tồn kho" type="number" value={form.tong_gia_tri_ton_kho || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="ghi_chu" label="Ghi chú" value={form.ghi_chu || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <Box mt={2}>
        <Button variant="contained" type="submit">Lưu</Button>
        <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>Hủy</Button>
      </Box>
    </Box>
  );
}
