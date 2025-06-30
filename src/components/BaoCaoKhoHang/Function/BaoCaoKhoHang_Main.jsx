import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Autocomplete, TextField, Divider } from "@mui/material";
import axios from "axios";

export default function BaoCaoKhoHang_Main() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu song song
    Promise.all([
      axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/warehouses"),
      axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/products"),
      axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-in"),
      axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/stock-out"),
      axios.get("https://dx.hoangphucthanh.vn:3000/warehouse/inventory"),
    ]).then(([wRes, pRes, inRes, outRes, invRes]) => {
      setWarehouses(wRes.data.data || []);
      setProducts(pRes.data.data || []);
      setStockIn(inRes.data.data || []);
      setStockOut(outRes.data.data || []);
      setInventory(invRes.data.data || []);
    });
  }, []);

  // Tổng hợp nhập-xuất-tồn cho từng sản phẩm trong kho được chọn
  const tongHopNhapXuatTon = () => {
    if (!selectedWarehouse) return [];
    // Lọc nhập/xuất/tồn theo kho
    const ma_kho = selectedWarehouse.ma_kho;
    const nhap = stockIn.filter(i => i.ten_kho === ma_kho);
    const xuat = stockOut.filter(o => o.ten_kho === ma_kho);
    const ton = inventory.filter(t => t.ten_kho === ma_kho);

    // Tổng hợp theo mã hàng
    return products.map(prod => {
      const nhapHang = nhap.filter(i => i.ma_hang === prod.ma_hang);
      const xuatHang = xuat.filter(o => o.ma_hang === prod.ma_hang);
      const tonHang = ton.find(t => t.ma_hang === prod.ma_hang);

      const tongNhap = nhapHang.reduce((sum, i) => sum + (i.so_luong_nhap || 0), 0);
      const tongXuat = xuatHang.reduce((sum, o) => sum + (o.so_luong_xuat || 0), 0);
      const tonCuoiKy = tonHang ? tonHang.ton_hien_tai : (tongNhap - tongXuat);

      return {
        ten_hang: prod.ten_hang,
        ma_hang: prod.ma_hang,
        tong_nhap: tongNhap,
        tong_xuat: tongXuat,
        ton_cuoi_ky: tonCuoiKy,
        don_vi: prod.don_vi_ban_hang,
      };
    }).filter(row => row.tong_nhap > 0 || row.tong_xuat > 0 || row.ton_cuoi_ky > 0);
  };

  const bangNhapXuatTon = tongHopNhapXuatTon();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>BÁO CÁO NHẬP - XUẤT - TỒN</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={warehouses}
            getOptionLabel={w => w.ten_kho || ""}
            value={selectedWarehouse}
            onChange={(_, v) => setSelectedWarehouse(v)}
            renderInput={params => <TextField {...params} label="Chọn kho" />}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Bảng tổng hợp nhập - xuất - tồn</Typography>
          <Grid container spacing={2} sx={{ fontWeight: 600, mb: 1 }}>
            <Grid item xs={3}>Mã hàng</Grid>
            <Grid item xs={3}>Tên hàng</Grid>
            <Grid item xs={2}>Tổng nhập</Grid>
            <Grid item xs={2}>Tổng xuất</Grid>
            <Grid item xs={2}>Tồn cuối kỳ</Grid>
          </Grid>
          {bangNhapXuatTon.map((row, idx) => (
            <Grid container spacing={2} key={idx}>
              <Grid item xs={3}>{row.ma_hang}</Grid>
              <Grid item xs={3}>{row.ten_hang}</Grid>
              <Grid item xs={2}>{row.tong_nhap}</Grid>
              <Grid item xs={2}>{row.tong_xuat}</Grid>
              <Grid item xs={2}>{row.ton_cuoi_ky}</Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}