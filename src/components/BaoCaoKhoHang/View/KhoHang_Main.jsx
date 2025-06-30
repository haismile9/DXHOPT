import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Stack,
  Chip,
  Divider,
  Dialog,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from "@mui/icons-material";
import KhoHang_Add from "../Function/BaoCaoKhoHang_Add";
import KhoHang_Update from "../Function/BaoCaoKhoHang_Update";
import KhoHang_Delete from "../Function/BaoCaoKhoHang_Delete";
import KhoHang_Filter from "../Function/BaoCaoKhoHang_Filter";
import { getWarehouses, getAccountList } from "../Function/khoHangApi";
import dayjs from "dayjs/esm/index.js";
import Autocomplete from "@mui/material/Autocomplete";

export default function KhoHang_Main() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");

  useEffect(() => {
    fetchWarehouses();
    fetchAccounts();
  }, []);

  const fetchWarehouses = async () => {
  const res = await getWarehouses();
  let data = res.data?.data;
  if (!Array.isArray(data)) {
    // Nếu trả về 1 object đơn lẻ, đưa vào mảng
    if (data) data = [data];
    else data = [];
  }
  setList(data);
};

const fetchAccounts = async () => {
  const res = await getAccountList();
  setAccounts(res.data?.data || []);
};

  const handleFilter = (value) => setSearch(value);

  const handleEdit = (kho) => {
    setSelected(kho);
    setOpenUpdate(true);
  };

  const handleDelete = (kho) => {
    setSelected(kho);
    setOpenDelete(true);
  };

  const filteredList = list.filter((kho) =>
    kho.ten_kho.toLowerCase().includes(search.toLowerCase())
  ).filter(kho => {
    if (statusFilter === "") return true;
    return kho.tinh_trang === statusFilter;
  }).filter(kho => {
    if (managerFilter === "") return true;
    return kho.accounts_warehouse_quan_ly_khoToaccounts?.ho_va_ten === managerFilter;
  });

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="black">
        Danh sách Kho ({filteredList.length})
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm tên kho"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ minWidth: 260, flex: 1 }}
        />
        <Autocomplete
          size="small"
          options={accounts}
          getOptionLabel={(option) => option.ho_va_ten || ""}
          value={accounts.find(acc => acc.ho_va_ten === managerFilter) || null}
          onChange={(_, value) => setManagerFilter(value ? value.ho_va_ten : "")}
          renderInput={(params) => (
            <TextField {...params} label="Người quản lý" sx={{ minWidth: 240 }} />
          )}
          isOptionEqualToValue={(option, value) => option.ho_va_ten === value?.ho_va_ten}
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ minWidth: 140, fontWeight: 600 }}
        >
          Thêm Kho
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          label="Tất cả trạng thái"
          clickable
          color={statusFilter === "" ? "primary" : "default"}
          onClick={() => setStatusFilter("")}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label="Đang hoạt động"
          clickable
          color={statusFilter === "Đang hoạt động" ? "success" : "default"}
          onClick={() => setStatusFilter("Đang hoạt động")}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label="Bảo trì"
          clickable
          color={statusFilter === "Bảo trì" ? "warning" : "default"}
          onClick={() => setStatusFilter("Bảo trì")}
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      <Grid container spacing={3}>
        {filteredList.map((kho) => (
          <Grid item xs={12} md={6} key={kho.ma_kho}>
            <Card elevation={3} sx={{ borderRadius: 3, mt: 2 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  {/* Hình ảnh kho */}
                  <Box mr={2}>
                    <img
                      src={kho.hinh_anh || "/warehouse-default.png"}
                      alt="Hình kho"
                      style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
                    />
                  </Box>
                  {/* Thông tin kho */}
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {kho.ten_kho}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {kho.vi_tri_kho}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Chip
                        label={kho.tinh_trang}
                        color={kho.tinh_trang === "Đang hoạt động" ? "success" : "warning"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                    <Typography variant="body2">
                      <b>Người tạo:</b> {kho.accounts_warehouse_nguoi_taoToaccounts?.ho_va_ten || kho.nguoi_tao}
                    </Typography>
                    <Typography variant="body2">
                      <b>Ngày tạo:</b>{" "}
                      {kho.ngay_tao && dayjs(kho.ngay_tao).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="body2">
                      <b>Quản lý:</b> {kho.accounts_warehouse_quan_ly_khoToaccounts?.ho_va_ten || kho.quan_ly_kho}
                    </Typography>
                    <Typography variant="body2">
                      <b>Ngày kiểm kê gần nhất:</b>{" "}
                      {kho.ngay_kiem_ke_gan_nhat && dayjs(kho.ngay_kiem_ke_gan_nhat).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                  <Stack spacing={1} alignItems="flex-end">
                    <Typography variant="body2">
                      <b>Nhập:</b> {kho.tong_gia_tri_nhap?.toLocaleString()} VNĐ
                    </Typography>
                    <Typography variant="body2">
                      <b>Xuất:</b> {kho.tong_gia_tri_xuat?.toLocaleString()} VNĐ
                    </Typography>
                    <Typography variant="body2">
                      <b>Tồn:</b> {kho.tong_gia_tri_ton_kho?.toLocaleString()} VNĐ
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(kho)}
                    >
                      Sửa
                    </Button>
                  </Stack>
                </Stack>
                {kho.ghi_chu && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "normal", // Cho phép xuống dòng
                        mt: 1,
                      }}
                    >
                      <b>Ghi chú:</b> {kho.ghi_chu}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialogs */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <KhoHang_Add
          accounts={accounts}
          onSuccess={() => {
            setOpenAdd(false);
            fetchWarehouses();
          }}
          onCancel={() => setOpenAdd(false)}
        />
      </Dialog>
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} maxWidth="sm" fullWidth>
        <KhoHang_Update
          data={selected}
          accounts={accounts}
          onSuccess={() => {
            setOpenUpdate(false);
            fetchWarehouses();
          }}
          onCancel={() => setOpenUpdate(false)}
        />
      </Dialog>
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <KhoHang_Delete
          data={selected}
          onSuccess={() => {
            setOpenDelete(false);
            fetchWarehouses();
          }}
          onCancel={() => setOpenDelete(false)}
        />
      </Dialog>
    </Box>
  );
}
