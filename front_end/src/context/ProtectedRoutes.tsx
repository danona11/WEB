import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Redux/ReduxHooks'
import { openLoginPopup } from '../Redux/ReduxPopupSlice'

export default function ProtectedRoutes( { children , isAdminRoute = false }: { children: React.ReactNode , isAdminRoute: boolean }) {
    
    const [auth , setAuth ] = useState<boolean | null>(null);
    const [permissions , setPermissions ] = useState<boolean | null>(null);

    const dispatch = useAppDispatch()   
    const popup:boolean = useAppSelector( (state:any) => state.user.LoginPopupOpen )  //the current state of LoginPopupOpen


//when user makes request check validate(on mount), 
//and when the login popup closes so if he is a different user now, want to check authorization again
    
    useEffect( () => {  //check authorization/athentication on clicking route

        handleVerifyAuth()
    },[])

    useEffect( () => {  //check authorization/athentication after login in the popup - in case switched from admin to non admin
        if( ( auth === false ) && ( popup === false ) ){    //so it dosn't run every time popup changes the conditions:   
            handleVerifyAuth()                              //  auth === false => runs only when popup closes, not opens
        }                                                   //  popup === false => so doesn't run but popup hasn't opend yet - popup === false, on mount so will run and ruin popup
    },[popup])
    
    const handleVerifyAuth = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/validate`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                setAuth(true)
                const data = await response.json()
                setPermissions(data.Permissions)
            
            }else{
                setAuth(false);   
                dispatch(openLoginPopup())
            }
        } 
        catch(error){
            console.error("Error checking authentication: ", error)
            setAuth(false)
            dispatch( openLoginPopup() )
        }
    }

    //for when the backend is still checking if the user is authenticated/authorized or not - 
    //so it doesn't kick out until the responce from the server:
    if ( ( auth === null ) || ( (isAdminRoute) && (permissions === null) ) ) {
        
        return <Typography variant='h3'>Loading...</Typography>
    }    
    
    //if the user is not authenticated, open loginPopup
    if (auth === false) {
        return( //keep the backround page alive, while the popup is open: (children is the backround page comp')
            
            <Box sx={{ filter: 'blur(4px)' , pointerEvents:'none'}}>
                {children}
            </Box>
        )
    }

    //if the user is authenticated: 
    //if route is admin route true and if the user has admin permissions:
    if ( isAdminRoute && permissions === false ) {
        alert("only users with admin permissions can access this page");
        return <Navigate to="/products" />;
    }

    return (//render the page the protected route was protecting
        <>{children}</>
    )
}