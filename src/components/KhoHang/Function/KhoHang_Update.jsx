import React, { useState, useEffect } from "react";
import { updateWarehouse, getAccountList } from "./khoHangApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';

export default function KhoHang_Update({ data, onSuccess, onCancel }) {
  const [form, setForm] = useState(data || {});
  const [user, setUser] = useState({ ho_va_ten: "", ma_nguoi_dung: "" });
  const [accounts, setAccounts] = useState([]);
  const [previewImg, setPreviewImg] = useState(data?.hinh_anh || "");

  useEffect(() => {
    setForm(data || {});
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser(storedUser);

    // Lấy danh sách tài khoản (user)
    async function fetchAccounts() {
      try {
        const resAcc = await getAccountList();
        const dataAcc = (resAcc.data && resAcc.data.data) ? resAcc.data.data : [];
        setAccounts(dataAcc);
      } catch (err) {
        setAccounts([]);
      }
    }
    fetchAccounts();
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (event, value) => {
    setForm((prev) => ({
      ...prev,
      quan_ly_kho: value ? value.MaNguoiDung : "",
      quan_ly_kho_name: value ? value.TenDayDu : "",
    }));
  };

  const handleSelectChange = (e) => {
    setForm((prev) => ({ ...prev, tinh_trang: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, hinh_anh: ev.target.result }));
        setPreviewImg(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      nguoi_tao: form.nguoi_tao,
    };
    try {
      await updateWarehouse(form.ma_kho, body);
      onSuccess();
    } catch (err) {
      if (err.response) {
        console.log("API Error:", err.response.data);
      }
    }
  };

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Sửa kho</Typography>
      <TextField name="ma_kho" label="Mã kho" value={form.ma_kho || ""} disabled fullWidth sx={{ my: 1 }} />
      <TextField name="ten_kho" label="Tên kho" value={form.ten_kho || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="vi_tri_kho" label="Vị trí kho" value={form.vi_tri_kho || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />

      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="tinh-trang-label">Tình trạng</InputLabel>
        <Select
          labelId="tinh-trang-label"
          name="tinh_trang"
          value={form.tinh_trang || ""}
          label="Tình trạng"
          onChange={handleSelectChange}
        >
          <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
          <MenuItem value="Bảo trì">Bảo trì</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Người tạo"
        value={user.ho_va_ten && user.ma_nguoi_dung === form.nguoi_tao ? user.ho_va_ten : form.nguoi_tao}
        disabled
        fullWidth
        sx={{ my: 1 }}
      />

      {/* Autocomplete cho Quản lý kho */}
      <Autocomplete
        options={accounts}
        getOptionLabel={(option) => option.ho_va_ten || option.TenDayDu || ""}
        value={
          accounts.find(
            (acc) =>
              acc.ma_nguoi_dung === form.quan_ly_kho ||
              acc.MaNguoiDung === form.quan_ly_kho
          ) || null
        }
        onChange={(event, value) => {
          setForm((prev) => ({
            ...prev,
            quan_ly_kho: value ? value.ma_nguoi_dung || value.MaNguoiDung : "",
            quan_ly_kho_name: value ? value.ho_va_ten || value.TenDayDu : "",
          }));
        }}
        renderInput={(params) => (
          <TextField {...params} label="Quản lý kho" fullWidth sx={{ my: 1 }} />
        )}
        isOptionEqualToValue={(option, value) =>
          (option.ma_nguoi_dung || option.MaNguoiDung) ===
          (value?.ma_nguoi_dung || value?.MaNguoiDung)
        }
      />

      <TextField
        name="ngay_kiem_ke_gan_nhat"
        label="Ngày kiểm kê gần nhất"
        type="date"
        value={form.ngay_kiem_ke_gan_nhat ? form.ngay_kiem_ke_gan_nhat.slice(0, 10) : ""}
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField name="tong_gia_tri_nhap" label="Tổng nhập" type="number" value={form.tong_gia_tri_nhap || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="tong_gia_tri_xuat" label="Tổng xuất" type="number" value={form.tong_gia_tri_xuat || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="tong_gia_tri_ton_kho" label="Tổng tồn kho" type="number" value={form.tong_gia_tri_ton_kho || 0} onChange={handleChange} fullWidth sx={{ my: 1 }} />
      <TextField name="ghi_chu" label="Ghi chú" value={form.ghi_chu || ""} onChange={handleChange} fullWidth sx={{ my: 1 }} />

      {/* Ẩn phần chọn ảnh kho */}
      {/* <Box mb={2}>
        <img
          src={previewImg || form.hinh_anh || "/warehouse-default.png"}
          alt="Hình kho"
          style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
        />
        <Button variant="outlined" component="label" sx={{ ml: 2 }}>
          Chọn ảnh kho
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
      </Box> */}

      <Box mt={2}>
        <Button variant="contained" type="submit">Lưu</Button>
        <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>Hủy</Button>
      </Box>
    </Box>
  );
}
