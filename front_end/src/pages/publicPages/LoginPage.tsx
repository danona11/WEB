import {  useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@mui/material";
import DebouncedTextField from "../../components/DebouncedTextField"
import { Typography } from "@mui/material";
import { clearUser, setUser } from "../../Redux/ReduxUserSlice";
import { useAppDispatch } from "../../Redux/ReduxHooks";
import { openSnackBar } from "../../Redux/ReduxPopupSlice";

export default function LoginPage() {
    
    const [userName, setUserName] = useState("");             
    const [password, setPassword] = useState("");

//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching
    const nav = useNavigate() 
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(clearUser()) //clear the old user data from store when switching users

    }, []) //runs when page loads, so old user data gets wiped from store when switching users
    
    
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();     //the page wont refresh when pressing login
        
        // sending the data to the BackEnd in json :
        try{
            const responce = await fetch( `${import.meta.env.VITE_API_URL}/login`, 
                {
                    method: "POST" ,
                    headers: { "Content-Type" : "application/json"},
                    
                    body: JSON.stringify(
                        {
                            UserName: userName,
                            Password: password
                        }
                    ),
                    credentials: "include"
                }   
            )
            
            const data = await responce.json()  //login controller sends a json with username and permissions

            if (responce.ok) {
                
                dispatch( setUser({ userName: data.user.UserName , permissions: data.user.Permissions }) ) 

                dispatch( openSnackBar({    //open the snackbar alert - successfull
                    message: 'succesfully login - shop away',
                    severity: "success" ,
                }))                
                nav("/products")
            }

            else{
                dispatch( openSnackBar({    //open the snackbar alert - successfull
                    message: 'error loging in - now login',
                    severity: "error" ,
                }))            
            }               
        }
        
        catch(error){
            console.error("network error", error)
            dispatch( openSnackBar({    //open the snackbar alert - successfull
                message: 'error loging in',
                severity: "error" ,
            }))
        }
    }

    return (                
        <form className="login-page" onSubmit={handleLogin} style= {{maxWidth: '400px', margin: '0 auto', padding: '20px' , textAlign: 'center'}}>
            
            <Typography variant="h2" align="center">Kits page</Typography>
            <Typography variant="h5" align="center">Log-In</Typography>
            
            <DebouncedTextField 
                label="user name:"
                type="text"
                setValue={setUserName}
            />

            <DebouncedTextField 
                label="password:"
                type="password"
                setValue={setPassword}
            />

            <br/>
            <br/>

            <Button type="submit" variant="contained">
                log-in
            </Button>

            <br/>
            <br/>

            <Typography variant="body1" align="center">Don't have An Account?</Typography>
            <Button onClick={()=>nav("/signup")} variant="contained">
                sign-up
            </Button>
        </form>

    );
}