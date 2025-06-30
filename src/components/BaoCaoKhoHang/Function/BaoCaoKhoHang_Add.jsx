import React, { useState, useEffect } from "react";
import { createWarehouse, getWarehouses, getAccountList } from "./khoHangApi";
import {
  Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from "dayjs/esm/index.js";

const init = {
  ma_kho: "",
  ten_kho: "",
  vi_tri_kho: "",
  tinh_trang: "Đang hoạt động",
  quan_ly_kho: "", // sẽ là MaNguoiDung của người quản lý kho
  ngay_kiem_ke_gan_nhat: "",
  tong_gia_tri_nhap: 0,
  tong_gia_tri_xuat: 0,
  tong_gia_tri_ton_kho: 0,
  ghi_chu: "",
  hinh_anh: "", // đường dẫn hoặc base64 ảnh
};

function getNextMaKho(list) {
  const arr = list.map((kho) => kho.ma_kho || "").filter(Boolean);
  if (!arr.length) return "K01";
  const numbers = arr.map((ma) => Number(ma.replace(/[^\d]/g, "")) || 0);
  const max = Math.max(...numbers);
  return `K${(max + 1).toString().padStart(2, "0")}`;
}

export default function KhoHang_Add({ onSuccess, onCancel }) {
  const [form, setForm] = useState(init);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ ho_va_ten: "", ma_nguoi_dung: "" });
  const [accounts, setAccounts] = useState([]);
  const [previewImg, setPreviewImg] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    setUser({
      ho_va_ten: storedUser.ho_va_ten || storedUser.TenDayDu || "",
      ma_nguoi_dung: storedUser.ma_nguoi_dung || storedUser.MaNguoiDung || "",
    });

    async function fetchAndSet() {
      setLoading(true);
      try {
        const res = await getWarehouses();
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const nextMaKho = getNextMaKho(list);
        setForm((prev) => ({ ...init, ma_kho: nextMaKho }));

        // Lấy danh sách user (Accounts)
        const resAcc = await getAccountList();
        const dataAcc = Array.isArray(resAcc.data?.data) ? resAcc.data.data : [];
        setAccounts(dataAcc);
      } finally {
        setLoading(false);
      }
    }
    fetchAndSet();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (event, value) => {
    setForm((prev) => ({
      ...prev,
      quan_ly_kho: value ? value.MaNguoiDung : "",
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
    if (!form.ma_kho || !form.ten_kho.trim() || !form.vi_tri_kho.trim()) {
      alert("Mã kho, tên kho và vị trí kho là bắt buộc!");
      return;
    }
    if (!form.quan_ly_kho) {
      alert("Vui lòng chọn người quản lý kho!");
      return;
    }
    const body = {
      ...form,
      nguoi_tao: user.ma_nguoi_dung,
      ngay_tao: dayjs().format("DD/MM/YYYY"), // chuẩn Việt Nam
      ngay_kiem_ke_gan_nhat: form.ngay_kiem_ke_gan_nhat
        ? dayjs(form.ngay_kiem_ke_gan_nhat).format("DD/MM/YYYY")
        : undefined,
      tong_gia_tri_nhap: Number(form.tong_gia_tri_nhap) || 0,
      tong_gia_tri_xuat: Number(form.tong_gia_tri_xuat) || 0,
      tong_gia_tri_ton_kho: Number(form.tong_gia_tri_ton_kho) || 0,
    };

    try {
      await createWarehouse(body);
      onSuccess();
    } catch (err) {
      if (err.response) {
        console.log("API Error:", err.response.data);
      }
    }
  };

  console.log("form.quan_ly_kho:", form.quan_ly_kho, accounts);

  return (
    <Box p={3} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">Thêm kho mới</Typography>
      <TextField
        name="ma_kho"
        label="Mã kho"
        value={form.ma_kho}
        disabled
        required
        fullWidth
        sx={{ my: 1 }}
      />
      <TextField
        name="ten_kho"
        label="Tên kho"
        value={form.ten_kho}
        onChange={handleChange}
        required
        fullWidth
        sx={{ my: 1 }}
      />
      <TextField
        name="vi_tri_kho"
        label="Vị trí kho"
        value={form.vi_tri_kho}
        onChange={handleChange}
        required
        fullWidth
        sx={{ my: 1 }}
      />

      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel id="tinh-trang-label">Tình trạng</InputLabel>
        <Select
          labelId="tinh-trang-label"
          name="tinh_trang"
          value={form.tinh_trang}
          label="Tình trạng"
          onChange={handleSelectChange}
        >
          <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
          <MenuItem value="Bảo trì">Bảo trì</MenuItem>
        </Select>
      </FormControl>

      {/* Người tạo */}
      <TextField
        label="Người tạo"
        value={user.ho_va_ten}
        disabled
        fullWidth
        sx={{ my: 1 }}
      />

      {/* Autocomplete Quản lý kho */}
      <Autocomplete
        options={accounts}
        getOptionLabel={(option) => option.ho_va_ten}
        value={accounts.find(acc => acc.ma_nguoi_dung === form.quan_ly_kho) || null}
        onChange={(e, value) => {
          setForm((prev) => ({
            ...prev,
            quan_ly_kho: value ? value.ma_nguoi_dung : "",
          }));
        }}
        renderInput={(params) => <TextField {...params} label="Quản lý kho" variant="outlined" required />}
      />

      <TextField
        name="ngay_kiem_ke_gan_nhat"
        label="Ngày kiểm kê gần nhất"
        type="date"
        value={
          form.ngay_kiem_ke_gan_nhat
            ? dayjs(form.ngay_kiem_ke_gan_nhat, ["YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD")
            : ""
        }
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="tong_gia_tri_nhap"
        label="Tổng nhập"
        type="number"
        value={form.tong_gia_tri_nhap}
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
      />
      <TextField
        name="tong_gia_tri_xuat"
        label="Tổng xuất"
        type="number"
        value={form.tong_gia_tri_xuat}
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
      />
      <TextField
        name="tong_gia_tri_ton_kho"
        label="Tổng tồn kho"
        type="number"
        value={form.tong_gia_tri_ton_kho}
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
      />
      <TextField
        name="ghi_chu"
        label="Ghi chú"
        value={form.ghi_chu}
        onChange={handleChange}
        fullWidth
        sx={{ my: 1 }}
      />

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
        <Button variant="contained" type="submit" disabled={loading}>
          Thêm
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
