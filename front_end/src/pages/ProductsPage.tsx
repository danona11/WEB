import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Product from "../components/ProductInterface";
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";

export default function ProductsPage() {
    const [productsList, setProductsList] = useState<Product[]>([])
    const [page, setPage] = useState<number>(1);

    const nav = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products/page/${page}`,
                {
                    method: "GET",
                    credentials: "include"
                })

                if (response.ok) {
                    const data = await response.json()
                    setProductsList(data.Products)

                } else {
                    <Alert severity="error">failed to fetch the products</Alert>
                }

            } catch (error) {
                console.error("network error", error);
                <Alert severity="error">request not avilable rn</Alert>
            }
        }

        fetchProducts()
    }, [page])  //will run fetch every time setPage triggers
    

    const addToCart = (prod:Product) => {
        //get my cart from local memmory
        const myCart = localStorage.getItem("my_cart")
        const cart = myCart ? JSON.parse(myCart): []    //if cart is empty return []

        cart.push(  
            {
                ProductID: prod.ProductID,
                ProductName: prod.ProductName,
                ProductPrice: prod.ProductPrice,
                ProductAmount: 1
            }
        )

        localStorage.setItem( "my_cart" , cart )
    }

    if (productsList.length > 0) {
        for( const prod of productsList){
            return(    
                <Box key={prod.ProductID} 
                    style={{ textAlign: "left" , border: '1px solid black', padding: '15px', margin: '10px', width: '300px', backgroundColor: prod.ProductStock===0 ? '#ad4949' : 'white' }}>
                    
                    <p style={{textDecoration: prod.ProductStock===0 ? 'line-through' : 'none' }}>kit:{prod.ProductName}</p>

                    <p>price:{prod.ProductPrice}</p>
                    
                    <p>amount left:{prod.ProductStock}</p>
                    
                    <Button 
                        variant="contained" 
                        color={prod.ProductStock === 0 ? "inherit" : "primary"}
                        startIcon={<AddShoppingCartOutlinedIcon />} 
                        onClick={() => addToCart(prod)}
                        disabled={prod.ProductStock === 0}
                        style={{ display: 'flex' , marginTop: '10px' }}
                    >
                        {prod.ProductStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </Box>
            ) 
        }
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }    
    
    
    
    return (
        <div className="ProductsPage" style={{ textAlign:'center' , marginTop: '30px' }}>
            <h1>products page:</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <Stack spacing={2}>
                    <Pagination 
                        count={2} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Stack>
            </div>

        </div>
    )
}
