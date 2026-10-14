import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import Alert from '@mui/material/Alert';
import { Button } from "@mui/material";
import DebouncedTextField from "../components/DebouncedTextField"

export default function LoginPage() {
    
    const [userName, setUserName] = useState("");             
    const [password, setPassword] = useState("");

//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching 
    const nav = useNavigate();  

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();     //the page wont refresh when pressing login
        
        // sending the data to the BackEnd in json :
        try{
            const response = await fetch( `${import.meta.env.VITE_API_URL}/login`, 
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

            if (response.ok) {
                nav("/products")
            }

            else{
                <Alert severity="error">fetch failed</Alert>
            }               
        }
        
        catch(error){
            console.error("network error", error);
            <Alert severity="error">request not avilable rn</Alert>
        }
    }

    return (                
        <form className="loginpageUI" onSubmit={handleLogin} style= {{maxWidth: '400px', margin: '0 auto', padding: '20px' , textAlign: 'center'}}>
            
            <h1>Football Kits</h1>
            <h3>Log in</h3>

            <DebouncedTextField 
                label="user name:"
                type="text"
                setValue={setUserName}
            />

            <br></br>

            <DebouncedTextField 
                label="password:"
                type="password"
                setValue={setPassword}
            />

            <br></br>
            <br></br>

            <Button type="submit" variant="contained">
                login
            </Button>

            <p> don't have an account? </p>
            <Button onClick={()=>nav("/signup")} variant="contained">
                signup
            </Button>
        </form>

    );
}