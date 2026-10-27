import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import DebouncedTextField from "../components/DebouncedTextField"


export default function SignUpPage() {

    const [userName, setUserName] = useState("");        
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching 
    const nav = useNavigate();  

//when the user presses the signup button th efunction will activate:
    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();     //the page wont refresh when pressing login
        
        // sending the data to the BackEnd in json :
        try{            
            const response = await fetch( `${import.meta.env.VITE_API_URL}/signup`, 
                {
                    method: "POST" ,
                    headers: { "Content-Type" : "application/json"},
                    body: JSON.stringify(
                        {
                            Email: email,
                            Password: password, 
                            UserName: userName
                        }
                    ),
                    credentials: "include" //cookies
                }   
            )

            if (response.ok) {
                nav("/products")
            }

            else{
                <Alert severity="error">failed to fetch the products</Alert>
            }
        }
        
        catch(error){
            console.error("network error", error);
            <Alert severity="error">request not avilable rn</Alert>
        }
    }

    return (    
        <form className="signup-page" onSubmit={handleSignUp} style= {{maxWidth: '400px', margin: '0 auto', padding: '20px' , textAlign: 'center'}}>
            <Typography variant="h2" align="center">Kits page</Typography>
            <Typography variant="h5" align="center">Sign-Up</Typography>
            
            <br/>
            
            <DebouncedTextField 
                label="user name:"
                type="text"
                setValue={setUserName}
            />
            
            <DebouncedTextField 
                label="email:"
                type="text"
                setValue={setEmail}
            />

            <DebouncedTextField 
                label="password:"
                type="password"
                setValue={setPassword}
            />

            <br/>
            <br/>

            <Button type="submit" variant="contained">
                sign-up
            </Button>

            <br/>
            <br/>

            <Typography variant="body1" align="center">Already Have an Account?</Typography>
            <Button onClick={()=>nav("/login")} variant="contained">
                log-in
            </Button>

        </form>
    );
}