import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Grid,Typography, Card, CardMedia, CardContent, CardActions, Button , IconButton} from "@mui/material";
import Product from "../interfaces/ProductInterface"
import { GetLocalUserName } from '../utils/handleLocalUser'
import { formatProductName } from '../utils/Format'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { ProductCardStyle } from "../styles/CardStyle";
import { GridContainerStyle } from "../styles/GridStyle";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DialogPopUp from "../components/popups/DialogPopUp"
import handleValidateFetch from "../utils/Api/fetchWithValidation";
import { useAppSelector } from "../Redux/ReduxHooks";
import { setUser } from "../Redux/ReduxUserSlice";
import CheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

export default function CartPage(){
    
    const [itemsList , setItemsList] = useState<Product[]>([]);    
    const [itemToDelete , setItemToDelete] = useState < Product | null > (null)    //null when the dialog isn't popped up
    const [clearPopup,setClearPopup] = useState<boolean>(false)   
    const [checkOutPopup,setCheckOutPopup] = useState<boolean>(false)   

    const {SliceUserName} = useAppSelector( state => state.user )
    const cartID = `${SliceUserName}'s_cart`

    let checkOutTotal = 0
    for (const item of itemsList){
        checkOutTotal+=item.ProductPrice*item.AmountInCart
    }


    useEffect( () =>{
        
        const myCart = localStorage.getItem(cartID)
        
        if(myCart){
            try{
                const cart = JSON.parse(myCart)
                setItemsList(cart)

            } catch{
                console.error("parsing the locals storage cart data failed")
                setItemsList([])
            } 
        } else{
            setItemsList([])
        }

    } , [cartID])//runs every new user, in case of switching users


    const handleChangeAmountInCart = ( item:Product , change:number ) => {

        const updatedAmountInCart = item.AmountInCart + change  //amount in cart after change
        let excededStock = false  //if the amount is more than the stock availble 

        if( updatedAmountInCart <= 0 ){ //if its 0 or below remove from cart
            setItemToDelete(item)
            return
        }
        
        if( updatedAmountInCart > item.ProductStock ){   //if its more than there is in stock 
            excededStock = true
        }   

        const final = updatedAmountInCart*( Number(!excededStock) ) + item.ProductStock*( Number(excededStock) )

        const newList = itemsList.map( (prod:Product) => ( ( prod.ProductID === item.ProductID ) ? ( {  ...prod , AmountInCart: final } ) : ( prod ) ) )
        
        localStorage.setItem(cartID, JSON.stringify(newList))
        setItemsList(newList)

    }


    const handleRemoveItem = () =>{
        
        if(!itemToDelete)   return;

        const newList = itemsList.filter( (item) => item.ProductID !== itemToDelete.ProductID )
        setItemsList( newList)
        localStorage.setItem(cartID , JSON.stringify(newList)) 

        setItemToDelete(null)   //remove the confirmPopup
    }

    const handleClearCart = () =>{
        setItemsList( [] )
        localStorage.removeItem(cartID) 
        setClearPopup(false) //REMOVE clearPOPuP AFTER CART GETS CLEARED

    }

    const handleCheckOutCart = async() => {

        if(itemsList.length === 0){
            console.log("cart is empty")
            setCheckOutPopup(false) //close the popup if cart is empty
            return
        }

        //give the cart list the expected format for the back end: [ {ProductID , AmountInCart} ]
        const cartBody = itemsList.map( (item) => ( { ProductID: item.ProductID , AmountInCart: item.AmountInCart } ) )

        try{
            const responce = await handleValidateFetch( `${import.meta.env.VITE_API_URL}/checkOutCart`, 
                {
                    method: "POST" ,
                    headers: { "Content-Type" : "application/json"},
                    
                    body: JSON.stringify(cartBody),

                    credentials: "include"
                }   
            )
            
            const data = await responce.json()
            
            if (responce.ok) {


                handleClearCart() //clear the cart after checkout

                setCheckOutPopup(false) //close the popup after checkout

                console.log("checkout successful")
            }

            else{
                console.log("checkout failed")
                setCheckOutPopup(false) //close the popup if checkout fails
            }               
        }
        
        catch(error){
            console.error("network error", error)
            setCheckOutPopup(false) //close the popup if network error
        }
    }


    return(
        <Box className="cartPageBox" sx={{ padding:'30px', position: 'relative' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: '100px' }} /> 
                
                <Typography variant="h3" sx={{ textAlign: 'center', flexGrow: 1 }}> 
                    MY CART 
                </Typography> 

                <IconButton 
                    color="error"
                    onClick={()=> setClearPopup(true) } 
                    disabled={itemsList.length === 0}
                    sx={{ fontSize: "0.8rem", display: 'flex', gap: 1 }}
                >   
                    CLEAR CART
                    <RemoveShoppingCartIcon fontSize="small"/>
                </IconButton>
            </Box>

            <Grid container spacing={3} sx={ GridContainerStyle }>
            { 
                itemsList.length > 0 ? (
                    itemsList.map( (item) => {
                        const outOfStock = item.ProductStock === 0;
                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.ProductID}>
                                <Card className="prodCard" sx={{ ...ProductCardStyle, backgroundColor: outOfStock ? '#ffcccc' : 'white', opacity: outOfStock ? 0.7 : 1  }}>                                    
                                    <CardMedia  
                                        component="img" 
                                        image={ item.ProductPhotoUrl }
                                        alt=""
                                        sx={{ height: 300, objectFit:'contain'}}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            { formatProductName(item.ProductName) }
                                        </Typography>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            stock left:{item.ProductStock}
                                        </Typography>

                                        <Typography variant="h6" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            total: { (item.ProductPrice * item.AmountInCart).toFixed(2) } ILS
                                        </Typography>
                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={{display:"flex" , flexDirection:'row', justifyContent:'flex-end', alignItems: 'center'}}>   
                                            <Typography variant="h6" sx={{ mr: 1 }}>
                                                amount:
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , -1 ) )} >
                                                <RemoveIcon />
                                            </IconButton>

                                            <Typography variant="h6" sx={{ mx: 1 }}>
                                                {item.AmountInCart}
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , 1 ) ) } disabled={ item.AmountInCart >= item.ProductStock || outOfStock}  >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        
                                        <Button title='remove item from cart' variant='outlined' size='small' endIcon={<DeleteIcon />} onClick={() => setItemToDelete(item)} >
                                            DELETE
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                ) : (
                    <Typography variant="h6" component="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        your cart is currently empty - go to products page to add items to cart
                    </Typography>
                )
            }
            </Grid>

            <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                CHECKOUT TOTAL: {checkOutTotal.toFixed(2)} ILS
            </Typography>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={ () => setCheckOutPopup(true) } 
                    disabled={itemsList.length === 0}
                    endIcon={<CheckoutIcon />}
                >
                    CHECKOUT
                </Button>
            </Box>

            <DialogPopUp 
                open={( itemToDelete !== null )}
                title="remove item from cart"
                description={`sure u want to delete ${itemToDelete?.ProductName} from your cart?`}
                confirmText = "delete"
                onConfirm={ handleRemoveItem }
                onClose={ () => ( setItemToDelete(null) ) }
            />

            <DialogPopUp 
                open={ clearPopup }
                title="clear cart"
                description={`sure u want to clear all the items from your cart?`}
                confirmText = "clear"
                onConfirm={ handleClearCart }
                onClose={ () => ( setClearPopup(false) ) }
            />

            <DialogPopUp 
                open={ checkOutPopup }
                title="checkout"
                description={`sure u want to proceed to checkout cart?`}
                confirmText = "checkout"
                onConfirm={ handleCheckOutCart }
                onClose={ () => ( setCheckOutPopup(false) ) }
            />
        </Box>
    )
}