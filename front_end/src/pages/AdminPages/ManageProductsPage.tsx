import { useState , useEffect, useMemo} from "react";
import { Box , Typography , Avatar } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Product from "../../interfaces/ProductInterface"
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import { AdminProductsActions } from "../../utils/AdminActions/AdminProductsActions";

export default function ManageProductsPage(){

    const [productsList, setProductsList] = useState<Product[]>([])
    const [refresh, setRefresh] = useState(false)
    const [maxRows , setMaxRows] = useState<number>(0)
    const [paginationModel, setPaginationModel ] = useState({page:0,pageSize:6})

    useEffect(() => {
            const fetchProducts = async () => {
                try {
                    const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/products/page/${paginationModel.page+1}`,
                    {
                        method: "GET",
                        credentials: "include"
                    })
    
                    if (responce.ok) {
                        const data = await responce.json()
                        setProductsList(data.Products)

                        setMaxRows( ( data.MaxPage )*( data.ProductsPerPage ) )
                    } else {
                    console.log("failed to fetch the users");
                    }
    
                } catch (error) {
                    console.error("network error", error);
                }
            }
    
            fetchProducts()
        }, [paginationModel.page , refresh])   //fetch again when page changes, or when refresh- after every admin action

        
    const columns = useMemo<GridColDef<Product>[]>( () => [

        { field: 'ProductID' , headerName: 'id' , width:50 },
        { field: 'ProductPhotoURL', headerName: 'view', width: 70, sortable: false , editable: false , renderCell:( (params) => ( <Avatar variant='square' src={params.row.ProductPhotoURL}/> ) ) },
        { field: 'ProductName', headerName: 'shirt info', width: 300, editable: true },
        { field: 'ProductTeam', headerName: 'kit team', width: 200, editable: true },
        { field: 'ProductDesign', headerName: 'kit design', width: 200, editable: true },
        { field: 'ProductPrice', headerName: 'price', width: 200, editable: true , renderCell:( (params) => `${params.row.ProductPrice.toFixed(2)} ILS` )},    
        { field: 'ProductStock', headerName: 'stock', width: 200, editable: true },
        { field: 'actions' , headerName: 'actions' , type:'actions' , width:250 ,sortable: false, editable: false , renderCell:( (params) => AdminProductsActions(params, setRefresh))},

    ], [] )

    return (
        <Box className="manage-products-page" sx={{ design:'flex' , height:450 , width:'100%', marginTop: '50px'}}>
            
            <Typography variant='h4' component='h4' sx={{textAlign:'center' , mt:3 , mb:3}}>
                manage products - admin only
            </Typography>
                
            <DataGrid 
                rows={productsList} 
                columns={columns} 
                getRowId={ (row) => (row.ProductID) } 
                paginationMode="server" 
                rowCount={maxRows}
                paginationModel={paginationModel} 
                onPaginationModelChange={setPaginationModel} 
            />
        </Box>
    )
}