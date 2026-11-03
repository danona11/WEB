import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoutes( { children , isAdminRoute = false }: { children: React.ReactNode , isAdminRoute: boolean }) {
    
    const [auth , setAuth ] = useState<boolean | null>(null);
    const [permissions , setPermissions ] = useState<boolean | null>(null);

    useEffect( () => {

        const handlevVerifyAuth = async () => {

        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/validate`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                setAuth(true);
                const data = await response.json();
                setPermissions(data.permissions);
            }

            else {
                setAuth(false);            
            }
        } 
        catch(error){
            console.error("Error checking authentication:", error);
            setAuth(false);
        }
        
    }
        handlevVerifyAuth();
    }, []);


    //for when the backend is still checking if the user is authenticated/authorized or not - 
    //so it doesn't kick out until the responce from the server:
    if ( ( auth === null ) || ( (isAdminRoute) && (permissions === null) ) ) {
        
        return <Typography variant='h3'>Loading...</Typography>
    }    
    
    //if the user is not authenticated, redirect to the login page
    if (auth === false) {
        return <Navigate to="/login" />;
    }

    //if the user is authenticated: 
    //if route is admin route true and if the user has admin permissions:
    if ( isAdminRoute && permissions === false ) {
        alert("only users with admin permissions can access this page");
        return <Navigate to="/products" />;
    }

    return children;
}