import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions, IconButton} from "@mui/material";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Product from "../interfaces/ProductInterface";
import { getLocalUserName } from '../utils/Auth'
import { formatProductName } from '../utils/Format'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { ProductCardStyle } from "../styles/CardStyle";
import { GridContainerStyle } from "../styles/GridStyle";


export default function ProductsPage() {

    const [productsList, setProductsList] = useState<Product[]>([])
    const [page, setPage] = useState<number>(1)
    const [amountToAdd, setAmountToAdd] = useState<Record<number,number>>({})   //list of all cards in page- each card has { key(prodID): value(amountToAdd) }
    const [amountInCart, setAmountInCart] = useState<number>(0)
    const nav = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const responce = await fetch(`${import.meta.env.VITE_API_URL}/products/page/${page}`,
                {
                    method: "GET",
                    credentials: "include"
                })

                if (responce.ok) {
                    const data = await responce.json()
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

        const LocalUserName = getLocalUserName()
        const cartID = `${LocalUserName}'s_cart`
        const myCart = localStorage.getItem(cartID)
        const cart = myCart ? JSON.parse(myCart) : []

        const amountToAdd = GetAmountToAdd(prod.ProductID)
        const existsIndex = cart.findIndex( (exists: Product) => exists.ProductID === prod.ProductID )

        if ( existsIndex >= 0 ){
            setAmountInCart( cart[existsIndex].ProductAmount )
            if( prod.ProductStock >= amountInCart + amountToAdd ){

                cart[existsIndex].ProductAmount+= amountToAdd  
                setAmountInCart( cart[existsIndex].ProductAmount )
            }
        }else {
            cart.push({
                ProductID:      prod.ProductID,
                ProductName:    prod.ProductName,
                ProductPrice:   prod.ProductPrice,
                ProductStock:   prod.ProductStock,
                AmountInCart:   amountToAdd,
                ProductPhotoUrl:prod.ProductPhotoUrl
            })
            setAmountInCart( amountToAdd )
        }
        
        localStorage.setItem( cartID , JSON.stringify(cart) )
        console.log(`${prod.ProductName} added to cart`)

        setAmountToAdd( (old) => ({
            ...old , [prod.ProductID]:1
        })
        )
    }
    
    const handlePageChange = (event:React.ChangeEvent<unknown> , value:number) =>{
        setPage(value)
    }  
    
    //insert the amount to add into the list, default:1
    const GetAmountToAdd = ( prodID:number ) =>{    
        return amountToAdd[prodID] || 1
    }
    
    const handleChangeAmountToAdd = ( prodID:number , update:number ) =>{
        const oldAmountToAdd = GetAmountToAdd(prodID)
        const newAmountToAdd = (oldAmountToAdd + update)
        setAmountToAdd( (old) => ({
            ...old , [prodID]:newAmountToAdd
        })
        )
    }

    return (
        <Box className="productsPageBox" sx={{ flex:'center' , marginTop: '30px' }}>
            <Typography variant="h2" align="center">Kits page</Typography>

            <Grid container spacing={3} sx={ GridContainerStyle }>
                {productsList.length > 0 ? (
                    productsList.map( (prod) => {  

                        const outOfStock = ( prod.ProductStock === 0 )
                        const amountNow = GetAmountToAdd(prod.ProductID)

                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.ProductID}>                                
                                <Card className="prodCard" sx={{ ...ProductCardStyle , backgroundColor: outOfStock ? '#ffcccc' : 'white', opacity: outOfStock ? 0.7 : 1  }}>                                    
                                    <CardMedia  
                                        component="img" 
                                        image={prod.ProductPhotoUrl || "https://i.pinimg.com/736x/74/49/9f/74499f7623bbe946867f791f863a4f87.jpg"} 
                                        alt=""
                                        sx={{ height: 300, objectFit:'contain', padding:'10px'}}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            { formatProductName(prod.ProductName) }
                                        </Typography>

                                        <br/>
                                        
                                        <Typography variant="h6">
                                            {prod.ProductPrice} ILS
                                        </Typography>

                                        <br/>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount in cart:{amountInCart}
                                        </Typography>
                                        
                                        <br/>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount left:{prod.ProductStock}
                                        </Typography>


                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={{display:"flex" , flexDirection:'row'}}>   
                                            <IconButton onClick={ () => ( handleChangeAmountToAdd( prod.ProductID , -1 ) ) } disabled={ amountNow <= 1 }>
                                                <RemoveIcon />
                                            </IconButton>

                                            <Typography variant="h6" sx={{textAlign:'center'}}>
                                                {amountNow}
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountToAdd( prod.ProductID , 1 ) ) } disabled={ amountNow >= prod.ProductStock || outOfStock }  >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>

                                        <Button 
                                            variant="contained" 
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