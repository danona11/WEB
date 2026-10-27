import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, List} from "@mui/material";
import Product from "../interfaces/ProductInterface"
import { getLocalUserName} from '../utils/Auth'
import { formatProductName } from '../utils/Format'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { ProductCardStyle } from "../styles/CardStyle";
import { GridContainerStyle } from "../styles/GridStyle";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DialogPopUp from "../components/DialogPopUp"

export default function CartPage(){
    const [itemsList , setItemsList] = useState<Product[]>([]);    
    const [itemToDelete , setItemToDelete] = useState < Product | null > (null)    //null when the dialog isn't popped up
    const [popup,setPopup] = useState<boolean>(false)   
    const [outOfStock , SetOutOfStock] = useState<boolean>(false)

    const LocalUserName = getLocalUserName()
    const cartID = `${LocalUserName}'s_cart`

    let checkOutTotal = 0
    for (const item of itemsList){
        checkOutTotal+=item.ProductPrice*item.AmountInCart
    }


    useEffect( () =>{
        const LocalUserName = getLocalUserName()
        const cartID = `${LocalUserName}'s_cart`
        const myCart = localStorage.getItem(cartID)
        
        if(myCart){
            try{
                const cart = JSON.parse(myCart)
                setItemsList(cart)
            } catch{
                console.error("parsing the locals storage cart data failed")
                localStorage.removeItem(cartID)
            } 
        } else;

    } , [])


    const handleChangeAmountInCart = ( item:Product , change:number ) => {

        if( item.AmountInCart+change <= 0 ){
            setItemToDelete(item)
            return
        }
        
        

        const newList = itemsList.map( (Product) =>{
            if(Product.ProductID === item.ProductID){

                if( item.AmountInCart + change >  item.ProductStock){
                    SetOutOfStock(true)
                    return({  
                        ...Product , AmountInCart: item.ProductStock
                    })
                }
                return({  
                    ...Product , AmountInCart: item.AmountInCart+change
                })
            }
            return Product
        })
        
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
            <Typography variant="h3">
                MY CART
            </Typography> 

            <Grid container spacing={3} sx={ GridContainerStyle }>
                { itemsList.length >0 ? (
                    
                    itemsList.map( (item) => {

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

                                        <br/>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount in cart:{item.AmountInCart}
                                        </Typography>

                                        {/* when clicking the button the item to delete changes from null to the item - so the dialog box pops up to confirm deletion */}
                                        <IconButton onClick={() => setItemToDelete(item)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <DeleteIcon />
                                        </IconButton>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount left:{item.ProductStock}
                                        </Typography>

                                        <br/>

                                        <Typography variant="h6" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            { (item.ProductPrice*item.AmountInCart).toFixed(2) } ILS
                                        </Typography>
                                                                                                                            
                                    </CardContent>  

                                    <CardActions>
                                        <Box sx={{display:"flex" , flexDirection:'row', justifyContent:'flex-end'}}>   
                    
                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , -1 ) )}>
                                                <RemoveIcon />
                                            </IconButton>

                                            <Typography variant="h6">
                                                {item.AmountInCart}
                                            </Typography>

                                            <IconButton onClick={ () => ( handleChangeAmountInCart( item , 1 ) ) } disabled={ item.AmountInCart>=item.ProductStock || outOfStock}  >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        
                                        <IconButton onClick={() => setItemToDelete(item)}>
                                            <DeleteIcon />
                                        </IconButton>

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
                CHEKOUT TOTAL: {checkOutTotal} ILS
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