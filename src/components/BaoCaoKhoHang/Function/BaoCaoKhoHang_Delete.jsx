import React from "react";
import { deleteWarehouse } from "./khoHangApi";
import { Box, Button, Typography } from "@mui/material";

export default function KhoHang_Delete({ data, onSuccess, onCancel }) {
  const handleDelete = async () => {
    try {
      await deleteWarehouse(data.ma_kho);
      alert("Đã xóa kho thành công!");
      onSuccess();
    } catch {
      alert("Lỗi khi xóa kho!");
    }
  };

  if (!data) return null;
  return (
    <Box p={3}>
      <Typography>Bạn chắc chắn muốn xoá kho <b>{data.ten_kho}</b>?</Typography>
      <Box mt={2}>
        <Button color="error" variant="contained" onClick={handleDelete}>Xoá</Button>
        <Button onClick={onCancel} sx={{ ml: 2 }}>Huỷ</Button>
      </Box>
    </Box>
  );
}
