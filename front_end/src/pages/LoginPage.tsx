import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import Alert from '@mui/material/Alert';


export default function LoginPage() {
    
    const [userName, setUserName] = useState("");             //returns the user name string and a setter func - will rerender when updated
    const [password, setPassword] = useState("");      //returns the password string and the setter func

//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching 
    const nav = useNavigate();  

//when the user presses the login button th efunction will activate:
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();     //the page wont refresh when pressing login
        
        // sending the data to the BackEnd in json :
        try{
            const response = await fetch( `${import.meta.env.VITE_API_URL}/`, 
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
        <div className="login-page" style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Football Kits</h1>
            <h3>Log in</h3>

            <form onSubmit={handleLogin} style= {{marginLeft: '20px', marginRight: '20px'}}>
                <label>user name: </label>
                <input type="text" value={userName} onChange={ (event) => setUserName(event.target.value) }/>

                <br></br>

                <label>password: </label>
                <input type="password" value={password} onChange={ (event) => setPassword(event.target.value) }/>
                        
                <br></br>
                <br></br>

                <button type="submit">Log In</button>

            </form>
            <br></br>

            <p> don't have an account? </p>
            <Link to={"/signUp"}>
                <button>Sign Up</button>
            </Link>
        </div>
    );
}

