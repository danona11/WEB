import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Button,Grid,Pagination,Stack,Typography, Card , CardMedia, CardContent, CardActions, IconButton} from "@mui/material";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Product from "../interfaces/ProductInterface";
import { GetLocalUserName } from '../utils/handleLocalUser'
import { formatProductName } from '../utils/Format'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { ProductCardStyle } from "../styles/CardStyle";
import { GridContainerStyle } from "../styles/GridStyle";


export default function ProductsPage() {

    const [productsList, setProductsList] = useState<Product[]>([])
    const [page, setPage] = useState<number>(1)
    const [amountToAdd, setAmountToAdd] = useState<Record<number,number>>({})   //list of all cards in page- each card has { key(prodID): value(amountToAdd) }
    const [myCartList, setMyCartList ] = useState<Product[]>([])
    const [maxPage, setMaxPage] = useState<number>(1);
    
    const nav = useNavigate();

    useEffect(() => {   //get users cart only on first run
        const LocalUserName = GetLocalUserName()
        const cartID = `${LocalUserName}'s_cart`
        const myCart = localStorage.getItem(cartID)

        if(myCart){
            try{
                setMyCartList( JSON.parse(myCart) )//users cart products list
            }catch(err){
                console.error("failed to find users cart" , err)
            }
        }
    },[])


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
                    setProductsList(data.products)
                    setMaxPage(data.maxPage)
                }

            } catch (error) {
                console.error("network error", error);
            }
        }

        fetchProducts()
    }, [page])  
    
    const addToCart = (prod:Product) => {

        const LocalUserName = GetLocalUserName()
        const cartID = `${LocalUserName}'s_cart`
        
        const amountInCart = AmountInCartByID(prod.ProductID)

        let amountToAdd = AmountToAddByID(prod.ProductID)

        const updatedStock = prod.ProductStock - amountInCart    //the stock left, adding the amount user has in his cart - cant add to cart more than there is in stock

        if ( updatedStock<=0 ){
            return;
        }

        if( amountToAdd > updatedStock ) amountToAdd = updatedStock
                
        const existsIndex = myCartList.findIndex( (exists: Product) => exists.ProductID === prod.ProductID )
        let updatedCart : Product[] = []

        if ( existsIndex >= 0 ){
                updatedCart = myCartList.map(
                    (item, index) => (index === existsIndex) ? { ...item, AmountInCart: item.AmountInCart + amountToAdd } : item );
        }else {
            updatedCart = [
                ...myCartList,
                {
                    ProductID:      prod.ProductID,
                    ProductName:    prod.ProductName,
                    ProductPrice:   prod.ProductPrice,
                    ProductStock:   prod.ProductStock,
                    AmountInCart:   amountToAdd,
                    ProductPhotoUrl:prod.ProductPhotoUrl
                }
            ]
        }
        setMyCartList(updatedCart)
        localStorage.setItem( cartID , JSON.stringify(updatedCart) )
        console.log(`${prod.ProductName} added to cart`)

        setAmountToAdd( (old) => ({ ...old , [prod.ProductID]:1 }) )
    }
    
    const handlePageChange = (event:React.ChangeEvent<unknown> , value:number) =>{
        setPage(value)
    }  
    
    //insert the amount to add into the list, default:1
    const AmountToAddByID = ( prodID:number ) =>{   
        return amountToAdd[prodID] || 1
    }
    
    //product amount in cart by id
    const AmountInCartByID = ( prodID:number ) =>{
        const found = myCartList.find( (item) => item.ProductID === prodID )
        return found ? (found.AmountInCart) : 0
    }
    
    const handleChangeAmountToAdd = ( prodID:number , update:number ) =>{
        const oldAmountToAdd = AmountToAddByID(prodID)
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
                        const productAmountInCart = AmountInCartByID(prod.ProductID)
                        const updatedStock = prod.ProductStock - productAmountInCart
                        const outOfStock = ( prod.ProductStock === 0 )  //when there is no more stock
                        const maxedOutInCart = updatedStock <= 0        //when the user has the rest of the remaining stock already in his cart
                        const amountToAddNow = AmountToAddByID(prod.ProductID)

                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prod.ProductID}>                                
                                <Card className="prodCard" sx={{ ...ProductCardStyle , backgroundColor: (outOfStock || maxedOutInCart) ? '#ffebee' : 'white', opacity: outOfStock ? 0.7 : 1  }}>                                    
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

                                        <Typography variant="h6">
                                            amount in cart:{productAmountInCart}
                                        </Typography>
                                        
                                        <br/>

                                        <Typography variant="h6" color={maxedOutInCart ? "error" : "text.secondary"}>
                                            stock left:{ prod.ProductStock }
                                        </Typography>


                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={{display:"flex" , flexDirection:'row'}}>   
                                            <IconButton onClick={ () => ( handleChangeAmountToAdd( prod.ProductID , -1 ) ) } disabled={ (amountToAddNow <= 1) || (maxedOutInCart) }>
                                                <RemoveIcon />
                                            </IconButton>

                                            <Typography variant="h6" sx={{textAlign:'center'}}>
                                                {amountToAddNow}
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountToAdd( prod.ProductID , 1 ) ) } disabled={ ( amountToAddNow>= updatedStock ) || (maxedOutInCart) }  >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>

                                        <Button 
                                            variant="contained" 
                                            color={ (outOfStock || maxedOutInCart) ? "inherit" : "primary" }
                                            endIcon={<AddShoppingCartOutlinedIcon />} 
                                            onClick={ () => addToCart(prod) }
                                            disabled={ outOfStock || maxedOutInCart }
                                        >
                                            { 
                                                outOfStock ? "OUT OF STOCK" :
                                                maxedOutInCart ? "STOCK MAXED OUT IN CART" :
                                                "add to cart"
                                            }
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
                        count={maxPage} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Stack>
            </Box>
        </Box>
    )
}