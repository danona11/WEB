import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { getLocalUserName, removeLocalUserName } from "../utils/Auth";
import { useState } from "react";
import DialogPopUp from "../components/DialogPopUp"


export default function NavBar() {
    const [logoutPopUp , setLogoutPopUp] = useState<boolean>(false)

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
    
    return (
        <AppBar position="sticky" sx={{ top: 0 }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    FOOTBALL KITS
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                    <Button color="inherit" startIcon={<StorefrontIcon />} onClick={() => nav("/products")}>
                        Products
                    </Button>
                    
                    <Button color="inherit" startIcon={<ShoppingCartIcon />} onClick={() => nav("/cart")}>
                        Cart
                    </Button>

                    {currentUser !== "guest" && (
                        <Button color="error" variant="contained" size="small" startIcon={<LogoutIcon />} onClick={ () => setLogoutPopUp(true) }>
                            Logout
                        </Button>
                    )}
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