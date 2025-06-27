import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function KhoHang_Filter({ onSearch }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        size="small"
        placeholder="Tìm kiếm tên kho"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ width: 220 }}
      />
      <Button type="submit" variant="outlined" sx={{ ml: 1 }}>Tìm</Button>
    </form>
  );
}
