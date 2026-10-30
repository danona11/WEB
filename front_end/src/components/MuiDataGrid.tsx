import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const rows = [
    { productName: 1, photo: 'Snow', firstName: 'Jon', age: 14 },
    { productName: 2, photo: 'Lannister', firstName: 'Cersei', age: 31 },
    { productName: 3, photo: 'Lannister', firstName: 'Jaime', age: 31 },
    { productName: 4, photo: 'Stark', firstName: 'Arya', age: 11 },
    { productName: 5, photo: 'Targaryen', firstName: 'Daenerys', age: null },
    { productName: 6, photo: 'Melisandre', firstName: null, age: 150 },
    { productName: 7, photo: 'Clifford', firstName: 'Ferrara', age: 44 },
    { productName: 8, photo: 'Frances', firstName: 'Rossini', age: 36 },
    { productName: 9, photo: 'Roxie', firstName: 'Harvey', age: 65 },
];


const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'productName', headerName: 'productName', width: 200, editable: true },
    { field: 'photo', headerName: 'photo', width: 100, editable: true },
    { field: 'price', headerName: 'price', width: 100, editable: true },    
    { field: 'stock', headerName: 'stock', width: 100, editable: true },
    { field: 'delete', headerName: 'delete', width: 100 },
    { field: 'edit', headerName: 'edit', width: 100 },
];

export default function DataGridDemo() {
    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
