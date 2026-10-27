import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StorefrontIcon from "@mui/icons-material/Storefront"
import { getLocalUserName, removeLocalUserName } from "../utils/Auth"
import { useState } from "react"
import DialogPopUp from "../components/DialogPopUp"
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ManageProductsIcon from '@mui/icons-material/Inventory';
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function NavBar() {

    const [auth, setAuth] = useState<boolean>(false)
    const [logoutPopUp , setLogoutPopUp] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const nav = useNavigate();
    const currentUser = getLocalUserName();

    const handleLogout =  async () => {
        removeLocalUserName();
        try{
            const response = await fetch( `${import.meta.env.VITE_API_URL}/logout`, 
                {
                    method: "POST" ,
                    credentials: "include"
                }   
            )
        }catch(error){
            console.error("network error", error);
        }

        removeLocalUserName()
        setLogoutPopUp(false)
        nav(`/login`)
    }

    //control popup:
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
                        
  
                        <Button color="inherit" startIcon={<ManageAccountsIcon />} onClick={() => nav("/manageUsers")}>
                            Manage Users
                        </Button>    

                        <Button color="inherit" startIcon={<ManageProductsIcon />} onClick={() => nav("/manageProducts")}>
                            Manage Products
                        </Button>

                    <Button color="inherit" startIcon={<StorefrontIcon />} onClick={() => nav("/products")}>
                        Products
                    </Button>
                    
                    <Button color="inherit" startIcon={<ShoppingCartIcon />} onClick={() => nav("/cart")}>
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
                        >
                            <MenuItem onClick={ () => { 
                                        handleUserPopupClose()
                                        handleLogout()
                                    }} 
                            >log out</MenuItem>

                            <MenuItem onClick={ () => { 
                                        handleUserPopupClose()
                                        nav(`/receipts`)
                                    }} 
                            >past orders</MenuItem>

                            {/* {currentUser ===    
                                <MenuItem onClick={ () => { 
                                            handleUserPopupClose()
                                            nav(`/manageUsers`)
                                        }} 
                                >manage users</MenuItem> */}

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