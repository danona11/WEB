// import { FormEvent, useState , useEffect} from "react";
// import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions, IconButton} from "@mui/material";
// import TextField from '@mui/material/TextField';
// import NumberField from "../../components/NumberField";
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import Product from "../../interfaces/ProductInterface";
// import DebouncedTextField from "../../components/DebouncedTextField";
// import AddIcon from '@mui/icons-material/Add';


// export default function ManageProductsPage() {
//     const [search, setSearch] = useState("")
//     const [productsList, setProductsList] = useState<Product[]>([])
//     const [productName, setProductName] = useState("")
//     const [productPrice, setProductPrice] = useState<number | undefined>(undefined)

//     const handleAddproduct = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:8080/addProduct", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     productName: productName,
//                     productPrice: productPrice
//                 }),
//                 credentials: "include"});

//                 if (response.ok) {
//                     alert("product added successfully");
//                 }
//                 else    alert("product name or price incorrect, pls try again")

//         } catch (error) {
//             console.error("Error adding product:", error);
//         }  
//     };

//     const handleDeleteproduct = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:8080/deleteProduct", {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     productName: productName,
//                     productPrice: productPrice
//                 }),
//                 credentials: "include"
//             });

//             if (response.ok) {
//                 alert("product deleted successfully");
//             } else {
//                 alert("failed to delete product");
//             }
//         } catch (error) {
//             console.error("Error deleting product:", error);
//         }
//     };

//     const handleUpdateproduct = async (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:8080/updateProduct", {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     productName: productName,
//                     productPrice: productPrice
//                 }),
//                 credentials: "include"
//             });

//             if (response.ok) {
//                 alert("product updated successfully");
//             } else {
//                 alert("failed to update product");
//             }
//         } catch (error) {
//             console.error("Error updating product:", error);
//         }
//     };

//     useEffect(() => {
//             const fetchProducts = async () => {
//                 try {
//                     const response = await fetch(`${import.meta.env.VITE_API_URL}/products/page/${page}`,
//                     {
//                         method: "GET",
//                         credentials: "include"
//                     })
    
//                     if (response.ok) {
//                         const data = await response.json()
//                         setProductsList(data.Products)
    
//                     } else {
//                         <Alert severity="error">failed to fetch the products</Alert>
//                     }
    
//                 } catch (error) {
//                     console.error("network error", error);
//                     <Alert severity="error">request not avilable rn</Alert>
//                 }
//             }
    
//             fetchProducts()
//         }, []) 

//     const rows = [
//     { productName: 1, photo: 'Snow', firstName: 'Jon', age: 14 },
//     { productName: 2, photo: 'Lannister', firstName: 'Cersei', age: 31 },
//     { productName: 3, photo: 'Lannister', firstName: 'Jaime', age: 31 },
//     { productName: 4, photo: 'Stark', firstName: 'Arya', age: 11 },
//     { productName: 5, photo: 'Targaryen', firstName: 'Daenerys', age: null },
//     { productName: 6, photo: 'Melisandre', firstName: null, age: 150 },
//     { productName: 7, photo: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { productName: 8, photo: 'Frances', firstName: 'Rossini', age: 36 },
//     { productName: 9, photo: 'Roxie', firstName: 'Harvey', age: 65 },
//     ];


//     const columns: GridColDef<(typeof rows)[number]>[] = [
//         { field: 'productName', headerName: 'productName', width: 200, editable: true },
//         { field: 'photo', headerName: 'photo', width: 100, editable: true },
//         { field: 'price', headerName: 'price', width: 100, editable: true },    
//         { field: 'stock', headerName: 'stock', width: 100, editable: true },
//         { field: 'delete', headerName: 'delete', width: 100 },
//         { field: 'edit', headerName: 'edit', width: 100 },
//     ];

    
//     return (
//         <Box sx={{ display:'flex' , justifyContent:'center' , alignItems:'center' , height: 400, width: '100%' }}>
//             <IconButton onClick={ () => ( handleAddproduct() ) } >
//                 <AddIcon />
//             </IconButton>
//             <Box>
//                 <DebouncedTextField label="search for product" type="text" setValue={setSearch}/>
//             </Box>
            
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 initialState={{
//                 pagination: {
//                     paginationModel: {
//                     pageSize: 5,
//                     },
//                 },
//                 }}
//                 pageSizeOptions={[5]}
//                 checkboxSelection
//                 disableRowSelectionOnClick
//             />
//         </Box>
//     // // <>
//     //     {/* <h1 style={{ textAlign: 'center' }}>Manage products Page - only accessable to admins</h1>

//     //     <div className="manage-products-page" style={{ display: 'flex', justifyContent: 'center'}}>


//     //         <div className="add-product" style={{ textAlign: 'center', marginTop: '50px' }}>
//     //             <h2>Add product</h2>
//         //             <form onSubmit={handleAddproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
//         //                 <label>product name: </label>
//         //                 <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
//         //                 <br></br>
//         //                 <label>product price: </label>
//         //                 <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
//         //                 <br></br>
//         //                 <br></br>

//         //                 <button type="submit">Add product</button>
//         //             </form>
//     //         </div>

//     //         <div className="delete-product" style={{ textAlign: 'center', marginTop: '50px' }}>
//     //             <h2>Delete product</h2>
//     //             <form onSubmit={handleDeleteproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
//     //                 <label>product name: </label>
//     //                 <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
//     //                 <br></br>
//     //                 <label>product price: </label>
//     //                 <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
//     //                 <br></br>
//     //                 <br></br>

//     //                 <button type="submit">Delete product</button>
//     //             </form>
//     //         </div>

//     //         <div className="update-product" style={{ textAlign: 'center', marginTop: '50px' }}>
//     //             <h2>Update product</h2>
//     //             <form onSubmit={handleUpdateproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
//     //                 <label>product name: </label>
//     //                 <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
//     //                 <br></br>
//     //                 <label>product price: </label>
//     //                 <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
                    
//     //                 <br></br>
//     //                 <br></br>

//     //                 <button type="submit">Update product</button>
//     //             </form>
//     //         </div>
//     //     </div>

//     //     <Box
//     //         component="form"
//     //         sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
//     //         noValidate
//     //         autoComplete="off"
//     //         >
//     //         <TextField id="outlined-basic" label="Outlined" variant="outlined" />
//     //     </Box>
//     //     <Box sx={{ display: 'grid', gap: 4 }}>
//     //         <NumberField label="Number Field" min={10} max={40} />
//     //         <NumberField label="Number Field (Small)" size="small" />
//     //         <NumberField
//     //             label="Number Field with Error"
//     //             min={10}
//     //             max={40}
//     //             defaultValue={100}
//     //             size="small"
//     //             error
//     //         />
//     //     </Box>
//     // </>
//     )
// }
