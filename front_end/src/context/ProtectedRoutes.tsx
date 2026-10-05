
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoutes( { children , isAdminRoute = false }: { children: React.ReactNode , isAdminRoute?: boolean }) {
    const [auth , setAuth ] = useState<boolean | null>(null);
    const [permissions , setPermissions ] = useState<boolean | null>(null);

    useEffect(() => {
        verifyauth();
    }, []);

    const verifyauth = async () => {

        try{
            const response = await fetch('http://localhost:8080/validate', {
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

    //for when the backend is still checking if the user is authenticated or not,
    // we can show a loading spinner or a message to the user.   
    if (auth === null) {
        return <div>Loading...</div>; // or a loading spinner
    }    
    
    // If the user is not authenticated, redirect to the login page
    if (auth === false) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated: 

    // if route is admin route and if the user has admin permissions:
    if (isAdminRoute && !permissions) {
        alert("only users with admin permissions can access this page");
        return <Navigate to="/home" />;
    }

    return children;
}