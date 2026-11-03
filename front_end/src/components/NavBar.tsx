import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
// import LogoutIcon from "@mui/icons-material/Logout"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { RemoveLocalUser } from "../utils/handleLocalUser"
import { useState } from "react"
import DialogPopUp from "./popups/DialogPopUp"
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ManageProductsIcon from '@mui/icons-material/Inventory';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppSelector, useAppDispatch } from "../Redux/ReduxHooks";
import { clearUser } from "../Redux/ReduxUserSlice";
import handleValidateFetch from "../utils/Api/fetchWithValidation"
import LogoutIcon from '@mui/icons-material/Logout';
import { SpaceBar } from "@mui/icons-material"
export default function NavBar() {


    const [logoutPopUp , setLogoutPopUp] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    
    const nav = useNavigate()

//get userName and permissions from reduxStore: 
//because when the store values update react knowns to rerun the page unlike local storage
    const {SliceUserName , Permissions} = useAppSelector( state => state.user )  
    const dispatch = useAppDispatch()

    const handleLogout =  async () => {

        RemoveLocalUser()   //remove username and auth from the local storage
        try{
            const responce = await handleValidateFetch( `${import.meta.env.VITE_API_URL}/logout`,   //deletes the cookie
            {
                method: "POST" ,
                credentials: "include"
            })

        }catch(error){
            console.error("network error", error);
        }

        dispatch(clearUser())   //delete the userSlice

        nav(`/login`)
    }

    const handleUserPopupOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserPopupClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky" sx={{ top: 0 }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    FOOTBALL KITS
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                    {/*conditional rendoring - only show to admins(perm===true) */}
                    { Permissions&&(<> 
                        
                        <Button color="inherit" endIcon={<ManageAccountsIcon />} onClick={() => nav("/manageUsers")} >
                            Manage Users
                        </Button>    

                        <Button color="inherit" endIcon={<ManageProductsIcon />} onClick={() => nav("/manageProducts")} >
                            Manage Products
                        </Button>

                    </>)}

                    <Button color="inherit" endIcon={<StorefrontIcon />} onClick={() => nav("/products")} sx={{padding:'20px'}}>
                        Products
                    </Button>
                    
                    <Button color="inherit" endIcon={<ShoppingCartIcon />} onClick={() => nav("/cart")} sx={{padding:'20px'}}>
                        Cart
                    </Button>

                    <Box>

                        <IconButton
                            size="large"
                            aria-label="account profile menu"
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                            onClick={handleUserPopupOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin= {{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin= {{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleUserPopupClose}
                            sx={{width:'500px' , maxWidth:'1000px'}}
                        >
                            <Typography variant="body1" sx={{textAlign:'center' , }}> hello {localStorage.getItem('LocalUserName')}</Typography>

                            <MenuItem onClick={ () => { 
                                        handleUserPopupClose()
                                        setLogoutPopUp(true)    //open dialog confirm-logout
                                    }} 
                            >Log-out <LogoutIcon/> </MenuItem>

                            <MenuItem onClick={ () => { 
                                        handleUserPopupClose()
                                        nav(`/receipts`)
                                    }} 
                            >past orders</MenuItem>

                        </Menu>
                    </Box>
                </Box>
            </Toolbar>

            <DialogPopUp
                open={logoutPopUp}
                title="log-out of your account"
                description="are you sure you want to LOGOUT of your account?"
                confirmText = "confirm"
                onConfirm={handleLogout}
                onClose={() => setLogoutPopUp(false)}
            />

        </AppBar>

    );
}