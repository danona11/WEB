import {  useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import Alert from '@mui/material/Alert';
import { Button } from "@mui/material";
import DebouncedTextField from "../components/DebouncedTextField"
import { Typography } from "@mui/material";
import { setUser } from "../Redux/ReduxUserSlice";
import { useAppSelector, useAppDispatch } from "../Redux/ReduxHooks";
import { useDispatch } from "react-redux";

export default function LoginPage() {
    
    const [userName, setUserName] = useState("");             
    const [password, setPassword] = useState("");

//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching
    const nav = useNavigate() 
    const dispatch = useAppDispatch()


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
            
            const data = await responce.json()  //login controller sends a json with username and perrmissions

            if (responce.ok) {

                dispatch( setUser({ userName: data.userName , permissions: data.perrmissions }) ) 
                nav("/products")
            }

            else{
                <Alert severity="error">login failed</Alert>
                console.log('invalid username or password');
            }               
        }
        
        catch(error){
            console.error("network error", error);
            <Alert severity="error">request not avilable rn</Alert>
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