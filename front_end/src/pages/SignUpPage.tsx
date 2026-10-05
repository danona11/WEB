import { Link, useNavigate } from "react-router-dom";

import { FormEvent, useState } from "react";

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
            const response = await fetch(
                "http://localhost:8080/signup" , 
                {
                    method: "POST" ,

                    headers: { "Content-Type" : "application/json"},
                    
                    body: JSON.stringify(   //converts a JS object to a JSON string
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
                nav("/home")
            }

            else    alert("user details not valid, pls try again")
        }
        
        catch(error){
            console.error("network error", error)
            alert("network error")
        }
    }

    return (    
        <div className="signup-page" style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Football Kits</h1>
            <h3>Sign Up</h3>

            <form onSubmit={handleSignUp} style= {{marginLeft: '20px', marginRight: '20px'}}>

                <label>username: </label>
                <input type="text" value={userName} onChange={ (event) => setUserName(event.target.value) }/>
                <br></br>

                <label>email address: </label>
                <input type="text" value={email} onChange={ (event) => setEmail(event.target.value) }/>
                <br></br>

                <label>password: </label>
                <input type="password" value={password} onChange={ (event) => setPassword(event.target.value) }/>
                        
                <br></br>
                <br></br>

                <button type="submit">Sign Up</button>

            </form>
            <br></br>

            
        </div>
    );
}