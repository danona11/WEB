import { useEffect, useState } from "react";
import {Box,Grid,Typography, Card, CardMedia, CardContent, CardActions, Button , IconButton} from "@mui/material";
import CartItem from "../../interfaces/CartItemInterface"
import { formatProductName } from '../../utils/Format'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { ProductCardStyle } from "../../globalStyles/CardStyle";
import { GridContainerStyle } from "../../globalStyles/GridStyle";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DialogPopUp from "../../components/popups/DialogPopUp"
import { useAppSelector } from "../../Redux/ReduxHooks";
import CheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useAppDispatch } from "../../Redux/ReduxHooks";
import { openSnackBar } from "../../Redux/ReduxPopupSlice"
import { CheckOutCartApiCall } from "./CartApiCalls";

import * as CartStyles from "./CartStyles"
import * as CartConstants from "./CartConstants"

export default function CartPage(){
    
    const [itemsList , setItemsList] = useState<CartItem[]>([]);    
    const [itemToDelete , setItemToDelete] = useState < CartItem | null > (null)    //null when the dialog isn't popped up
    const [clearPopup,setClearPopup] = useState<boolean>(false)   
    const [checkOutPopup,setCheckOutPopup] = useState<boolean>(false)   

    const dispatch = useAppDispatch()

    const {SliceUserName} = useAppSelector( state => state.user )
    const cartID = `${SliceUserName}'s_cart`

    let checkOutTotal = 0
    for (const item of itemsList){
        checkOutTotal+=item.ProductPrice*item.AmountInCart
    }


    useEffect( () =>{
        
        const myCart = localStorage.getItem(cartID);
            
        if(myCart){
            try{
                const cart = JSON.parse(myCart)
                setItemsList(cart)

            } catch{
                
                dispatch( openSnackBar({    //open the snackbar alert - error
                    message: 'cart empty',
                    severity: "error" ,
                }))                
                setItemsList([])
            } 
        } else{
            setItemsList([])
        }

    } , [cartID])//runs every new user, in case of switching users


    const handleChangeAmountInCart = ( item:CartItem , change:number ) => {

        const updatedAmountInCart = item.AmountInCart + change  //amount in cart after change
        let excededStock = false  //if the amount is more than the stock availble 

        if( updatedAmountInCart <= 0 ){ //if its 0 or below remove from cart
            
            dispatch( openSnackBar({    //open the snackbar alert - success
                message: 'item removed from cart',
                severity: "success" ,
            }))

            setItemToDelete(item)
            return
        }
        
        if( updatedAmountInCart > item.ProductStock ){   //if its more than there is in stock 
            excededStock = true
        }   

        const final = updatedAmountInCart*( Number(!excededStock) ) + item.ProductStock*( Number(excededStock) )

        const newList = itemsList.map( (prod:CartItem) => ( ( prod.ProductID === item.ProductID ) ? ( {  ...prod , AmountInCart: final } ) : ( prod ) ) )
        
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
        
        dispatch( openSnackBar({    //open the snackbar alert - success
            message: 'cart cleared',
            severity: "success" ,
        }))
    }

    const handleCheckOutCart = async() => {

        if(itemsList.length === 0){
            
            dispatch( openSnackBar({    //open the snackbar alert - error
                message: 'cart empty',
                severity: "error" ,
            }))
            setCheckOutPopup(false) //close the popup if cart is empty
            return
        }

        //give the cart list the expected format for the back end: [ {ProductID , AmountInCart} ]
        const cartBody = itemsList.map( (item) => ( { ProductID: item.ProductID , AmountInCart: item.AmountInCart } ) )

        const call = await CheckOutCartApiCall( cartBody )

        if(call){
            handleClearCart() //clear the cart after checkout

            dispatch( openSnackBar({    //open the snackbar alert - success
                message: 'checkout successfull, enjoy your new kits',
                severity: "success" ,
            }))

            console.log("checkout successful")
        
        }else{
            dispatch( openSnackBar({    //open the snackbar alert - error
                message: 'error checking-out',
                severity: "error" ,
            }))
            
            console.log("checkout failed")
        }                       
        setCheckOutPopup(false)
    }


    return(

        <Box className="cartPageBox" sx={ CartStyles.pageBoxSx }>
            
            <Box sx={CartStyles.headerSx}>
                <Box sx={ CartStyles.headerSpacerSx } /> 
                
                <Typography variant="h3" sx={ CartStyles.titleSx }> 
                    { CartConstants.CartTexts.pageHeader } 
                </Typography> 

                <IconButton 
                    color="error"
                    onClick={()=> setClearPopup(true) } 
                    disabled={itemsList.length === 0}
                    sx={ CartStyles.clearButtonSx }
                >   
                    { CartConstants.CartTexts.clearButton }
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
                                <Card className="prodCard" sx={{ ...ProductCardStyle, backgroundColor: outOfStock ? CartConstants.OutOfStockColor : 'white', opacity: outOfStock ? CartConstants.OutOfStockOpacity : CartConstants.InStockOpacity  }}>                                    
                                    <CardMedia  
                                        component="img" 
                                        image={ item.ProductPhotoURL }
                                        alt=""
                                        sx={ CartStyles.cardImageSx }
                                    />
                                    <CardContent>
                                        <Typography variant="h5" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            { formatProductName(item.ProductName) }
                                        </Typography>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            {CartConstants.CartTexts.stockLeft} {item.ProductStock}
                                        </Typography>

                                        <Typography variant="h6" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            {CartConstants.CartTexts.total} { (item.ProductPrice * item.AmountInCart).toFixed(2) } { CartConstants.CartTexts.currency }
                                        </Typography>
                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={CartStyles.amountBoxSx}>   
                                            <Typography variant="h6" sx={{ mr: 1 }}>
                                                {CartConstants.CartTexts.amount}
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
                                        
                                        <Button title={CartConstants.CartTexts.deleteText} variant='outlined' size='small' endIcon={<DeleteIcon />} onClick={() => setItemToDelete(item)} >
                                            DELETE
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                ) : (
                    <Typography variant="h6" component="h6" sx={CartStyles.totalSx}>
                        {CartConstants.CartTexts.emptyMessage}
                    </Typography>
                )
            }
            </Grid>

            <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                {CartConstants.CartTexts.checkoutTotal} {checkOutTotal.toFixed(2)} {CartConstants.CartTexts.currency}
            </Typography>

            <Box sx={ CartStyles.checkoutBoxSx }>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={ () => setCheckOutPopup(true) } 
                    disabled={itemsList.length === 0}
                    endIcon={<CheckoutIcon />}
                >
                    {CartConstants.CartTexts.checkoutButton}
                </Button>
            </Box>

{/*dilog popup for removing item: */}
            <DialogPopUp 
                open={clearPopup}
                title={CartConstants.CartDialog.removeItem.title}
                description={CartConstants.CartDialog.removeItem.description()}
                confirmText ={CartConstants.CartDialog.removeItem.confirmText}
                onConfirm={ handleRemoveItem }
                onClose={ () => ( setItemToDelete(null) ) }
            />

{/*dilog popup for clearing cart: */}
            <DialogPopUp 
                open={ clearPopup }
                title={CartConstants.CartDialog.clearCart.title}
                description={CartConstants.CartDialog.clearCart.description}
                confirmText = {CartConstants.CartDialog.clearCart.confirmText}
                onConfirm={ handleClearCart }
                onClose={ () => ( setClearPopup(false) ) }
            />

{/*dilog popup for checking outt cart: */}
            <DialogPopUp 
                open={ clearPopup }
                title={CartConstants.CartDialog.checkout.title}
                description={CartConstants.CartDialog.checkout.description}
                confirmText = {CartConstants.CartDialog.checkout.confirmText}
                onConfirm={ handleCheckOutCart }
                onClose={ () => ( setCheckOutPopup(false) ) }
            />
        </Box>
    )
}