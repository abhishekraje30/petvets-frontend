import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getAllUsersAPI } from '../actions/users.actions';

const columns = [
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 150,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  {
    field: 'id',
    headerName: 'Link to Open',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 150,
    // renderCell: (params) => <Navigate to={`${params.row.id}`}>Open</Navigate>,
    renderCell: (params) => (
      <Link className="link black" to={`${params.row.id}`}>
        Open
      </Link>
    ),
  },
];

const AllDoctors = () => {
  const { data } = useQuery('getAllUser', () => getAllUsersAPI('doctor'));
  const rows = [];
  data?.forEach((element) => {
    rows.push({
      id: element.userId,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email,
      status: element.status,
    });
  });

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default AllDoctors;
