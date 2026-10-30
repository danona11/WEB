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

export default function CartPage(){
    
    const [itemsList , setItemsList] = useState<Product[]>([]);    
    const [itemToDelete , setItemToDelete] = useState < Product | null > (null)    //null when the dialog isn't popped up
    const [popup,setPopup] = useState<boolean>(false)   

    const LocalUserName = GetLocalUserName()
    const cartID = `${LocalUserName}'s_cart`

    let checkOutTotal = 0
    for (const item of itemsList){
        checkOutTotal+=item.ProductPrice*item.AmountInCart
    }


    useEffect( () =>{
        const LocalUserName = GetLocalUserName()
        const cartID = `${LocalUserName}'s_cart`
        const myCart = localStorage.getItem(cartID)
        
        if(myCart){
            try{
                const cart = JSON.parse(myCart)
                setItemsList(cart)
            } catch{
                console.error("parsing the locals storage cart data failed")
                localStorage.removeItem(cartID) //if failed remove it from the local so it doesent make issues later
            } 
        } else;

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

        setItemToDelete(null)   //remove the popup
    }

    const handleClearCart = () =>{
        setItemsList( [] )
        localStorage.setItem(cartID , JSON.stringify([])) 
        setPopup(false) //REMOVE POPuP AFTER CART GETS CLEARED

    }


    return(
        <Box className="cartPageBox" sx={{ textAlign:'center' , padding:'30px' }}>
            <Typography variant="h3"> MY CART </Typography> 

            <Grid container spacing={3} sx={ GridContainerStyle }>
                { itemsList.length >0 ? (
                    
                    itemsList.map( (item) => {
                        const outOfStock = item.ProductStock === 0;
                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.ProductID}>
                                <Card className="prodCard" sx={{ ...ProductCardStyle, backgroundColor: outOfStock ? '#ffcccc' : 'white', opacity: outOfStock ? 0.7 : 1  }}>                                    
                                    <CardMedia  
                                        component="img" 
                                        image={item.ProductPhotoUrl ||"https://i.pinimg.com/736x/74/49/9f/74499f7623bbe946867f791f863a4f87.jpg"}
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
                                            total: { (item.ProductPrice*item.AmountInCart).toFixed(2) } ILS
                                        </Typography>

                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={{display:"flex" , flexDirection:'row', justifyContent:'flex-end'}}>   
                                            
                                            <Typography variant="h6">
                                                amount:
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , -1 ) )} >
                                                <RemoveIcon />
                                            </IconButton>

                                            <Typography variant="h6">
                                                {item.AmountInCart}
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , 1 ) ) } disabled={ item.AmountInCart>=item.ProductStock || outOfStock}  >
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
                )}
            </Grid>

            <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                CHEKOUT TOTAL: {checkOutTotal.toFixed(2)} ILS
            </Typography>

            <IconButton sx={{fontSize:"small"}} onClick={()=> setPopup(true) }
            >   
                CLEAR CART
                <RemoveShoppingCartIcon fontSize="medium"/>
            </IconButton>

            <DialogPopUp 
                open={( itemToDelete!==null )}
                title="remove item from cart"
                description={`Sure U Want to delete ${itemToDelete?.ProductName} From Your Cart?`}
                confirmText = "delete"
                onConfirm={ handleRemoveItem }
                onClose={ () => ( setItemToDelete(null) ) }

            />

            <DialogPopUp 
                open={ popup }
                title="clear cart"
                description={`Sure U Want to clear all the items From Your Cart?`}
                confirmText = "clear"
                onConfirm={ handleClearCart }
                onClose={ () => ( setPopup(false) ) }

            />

        </Box>
    )
}                                 