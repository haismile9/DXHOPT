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
import KhoHang_Add from "../Function/KhoHang_Add";
import KhoHang_Update from "../Function/KhoHang_Update";
import KhoHang_Delete from "../Function/KhoHang_Delete";
import KhoHang_Filter from "../Function/KhoHang_Filter";
import { getWarehouses, getAccountList } from "../Function/khoHangApi";


export default function KhoHang_Main() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [accounts, setAccounts] = useState([]);

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
  );

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

      <Grid container spacing={3}>
        {filteredList.map((kho) => (
          <Grid item xs={12} md={6} key={kho.ma_kho}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
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
                      {kho.ghi_chu && (
                        <Chip
                          label={kho.ghi_chu}
                          color="info"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2">
                      <b>Người tạo:</b> {kho.accounts_warehouse_nguoi_taoToaccounts?.ho_va_ten || kho.nguoi_tao}
                    </Typography>
                    <Typography variant="body2">
                      <b>Ngày tạo:</b> {kho.ngay_tao && new Date(kho.ngay_tao).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <b>Quản lý:</b> {kho.accounts_warehouse_quan_ly_khoToaccounts?.ho_va_ten || kho.quan_ly_kho}
                    </Typography>
                    <Typography variant="body2">
                      <b>Ngày kiểm kê gần nhất:</b>{" "}
                      {kho.ngay_kiem_ke_gan_nhat && new Date(kho.ngay_kiem_ke_gan_nhat).toLocaleDateString()}
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
                    <Stack direction="row" spacing={1} mt={2}>
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
                </Stack>
                {kho.ghi_chu && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary">
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
