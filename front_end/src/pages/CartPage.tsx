import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions} from "@mui/material";
import CartItem from "../interfaces/CartItemInterface";
import DeleteIcon from "@mui/icons-material/Delete"

export default function ProductsPage(){
    const [itemsList , setItemsList] = useState<CartItem[]>([]);

    useEffect( () =>{
        const myCart = localStorage.getItem("my_cart")
        
        if(myCart){
            try{
                const cart = JSON.parse(myCart)
                setItemsList(cart)
            } catch{
                console.error("parsing the locals storage cart data failed")
                localStorage.removeItem("my_cart")
            } 
        } else;

    } , [])

    let checkOutTotal = 0
    for (const item of itemsList){
        checkOutTotal+=item.ProductPrice*item.ProductAmount
    }


    const handleRemoveFromCart = ( prodID:number ) => {
        const newList = itemsList.filter( (item) => item.ProductID !== prodID )//will the rest
        localStorage.setItem("my_cart", JSON.stringify(newList))
        setItemsList(newList)

    }

    return(
        <Box className="cartPageBox" sx={{ marginTop: '30px' }}>
            <Typography variant="h2" align='center'>
                MY CART
            </Typography> 

            <Grid container spacing={4} sx={{ padding: '20px' }}>
                { itemsList.length >0 ? (
                    itemsList.map( (item) => {
                        const outOfStock = ( item.ProductStock === 0 )

                        return(
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.ProductID}>
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
                                            {item.ProductName}
                                        </Typography>

                                        <br/>
                                        
                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount in cart:{item.ProductAmount}
                                        </Typography>

                                        <Typography variant="h6" color={outOfStock ? "error" : "text.secondary"}>
                                            amount left:{item.ProductStock}
                                        </Typography>

                                        <br/>

                                        <Typography variant="h5" sx={{textAlign:'center' , textDecoration: outOfStock ? 'line-through' : 'none' }}>
                                            {item.ProductPrice} ILS
                                        </Typography>
                                                                                                                         
                                    </CardContent>  

                                    <CardActions>
                                        <Button 
                                            variant="contained" 
                                            fullWidth
                                            endIcon={<DeleteIcon />} 
                                            onClick={ () => handleRemoveFromCart(item.ProductID) }
                                        >
                                            remove from cart
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
                <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                    MY CART CHEKOUT TOTAL: {checkOutTotal} ILS
                </Typography>
        </Box>

    )

}



                                    