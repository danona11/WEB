import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions} from "@mui/material";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Product from "../interfaces/ProductInterface";

const cardTheme = createTheme({
    components:{
        MuiCard:{
            variants: [],
        },
    },
})

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
    }, [page])  
    
    const addToCart = (prod:Product) => {
        const myCart = localStorage.getItem("my_cart")
        const cart = myCart ? JSON.parse(myCart) : []

        const existsID = cart.findIndex( (exists: Product) => exists.ProductID === prod.ProductID )
        
        if ( existsID >= 0 ){
            cart[existsID].ProductAmount++
        } else {
            cart.push({
                ProductID: prod.ProductID,
                ProductName: prod.ProductName,
                ProductPrice: prod.ProductPrice,
                ProductStock: prod.ProductStock,
                ProductAmount: 1
            })
        }
        
        localStorage.setItem( "my_cart" , JSON.stringify(cart) )
        console.log(`${prod.ProductName} added to cart`)
    }
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }    
    
    return (
        <Box className="productsPageBox" sx={{ flex:'center' , marginTop: '30px' }}>
            <Typography variant="h2" component="h2" align="center">
                PRODUCTS
            </Typography>

            <Grid container spacing={4} sx={{ padding: '20px' }}>
                {productsList.length > 0 ? (
                    productsList.map( (prod) => {    
                        const outOfStock = ( prod.ProductStock === 0 )

                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.ProductID}>
                                
                                <Card className="prodCard" sx={{ width: '500px' , cursor: 'pointer' , display: 'flex' , flexDirection:'column', backgroundColor: outOfStock ? '#ffcccc' : 'white', opacity: outOfStock ? 0.7 : 1}}>

                                    <CardMedia  
                                        component="img" 
                                        image="https://assets.adidas.com/images/w_500,f_auto,q_auto/417cd4eba2904c42b34f7be3521173c1_9366/Liverpool_FC_26-27_Third_Jersey_Authentic_Black_KA6858_HM5.jpg"
                                        alt=""
                                        sx={{ height: 300, objectFit:'contain', padding:'10px',
                                        }}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            {prod.ProductName}
                                        </Typography>

                                        <br/>
                                        
                                        <Typography variant="h6">
                                            {prod.ProductPrice} ILS
                                        </Typography>
                                        
                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount left:{prod.ProductStock}
                                        </Typography>                                                                                 
                                    </CardContent>  

                                    <CardActions>
                                        <Button 
                                            variant="contained" 
                                            fullWidth
                                            color={ outOfStock ? "inherit" : "primary" }
                                            endIcon={<AddShoppingCartOutlinedIcon />} 
                                            onClick={ () => addToCart(prod) }
                                            disabled={ outOfStock }
                                        >
                                            { outOfStock ? "OUT OF STOCK" : "add to cart" }
                                        </Button> 
                                    </CardActions>                
                                </Card>
                            </Grid>
                        )
                    })
                ) : (
                    <Typography variant="h6" component="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        fetching products - loading...
                    </Typography>
                )}
            </Grid>

            <Box sx={{ display:'flex' , justifyContent: 'center', mt: 4, mb: 4}}>
                <Stack spacing={2}>
                    <Pagination 
                        count={3} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Stack>
            </Box>
        </Box>
    )
}