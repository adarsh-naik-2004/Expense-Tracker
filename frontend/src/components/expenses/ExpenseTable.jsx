import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../../services/api';

const ExpenseTable = ({ expenses, total, pagination, setPagination, refreshData }) => {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      refreshData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const columns = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton href={`/edit-expense/${params.row._id}`}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <DataGrid
      rows={expenses}
      columns={columns}
      rowCount={total}
      paginationMode="server"
      paginationModel={pagination}
      onPaginationModelChange={setPagination}
      pageSizeOptions={[5, 10, 25]}
      getRowId={(row) => row._id}
      sx={{ height: 500, width: '100%' }}
    />
  );
};

export default ExpenseTable;