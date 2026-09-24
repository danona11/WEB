import { Link, useNavigate } from "react-router-dom";

import { use, useState } from "react";


function Register_page () {
    const [email, setEmail] = useState()        //returns the email string and a setter func - will rerender when updated
    const [password, setPassword] = useState()  //returns the password string and the setter func

//Link will send the client straight to the next page, without waiting for the responce of the BE
//NAV: when pressing a button for fetching 
    const nav = useNavigate();  

//when the user presses the login button thefunction will activate:
    const handleLogin = async(event) => {   //async - allows await when fetching
        
        event.preventDefault();     //the page wont refresh when pressing login
        
        // sending the data to the BackEnd in json :
        try{
            const response = await fetch(
                "http://localhost:8080/Login" , 
                {
                    method: "POST" ,

                    header: { "Content-Type" : "application/json"},
                    
                    body: JSON.stringify(   //converts a JS object to a JSON string
                        {
                            Email: email,
                            Password: password
                        }
                    ),
                    credentials: "include" //cookies
                }   
            )

            if (response.ok) {
                alert("the connection worked")
                nav("/Home")
            }

            else    alert("the connection hasn't worked ")
        }
        
        catch(error){
            console.error("network error", error)
            alert("request not avilable rn")
        }
    }
    return (    
        <div className="register-page" style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Football Kits</h1>
            <h3>Register</h3>

{//comment:
            //will activate the handleLogin func:
}

            <form onSubmit= {handleLogin} style= {{marginLeft: '20px', marginRight: '20px'}}>
                <label>email address: </label>
                <input type="text" value={email} onChange={ (event) => setEmail(event.target.value) }/>

                <br></br>

                <label>password:  </label>
                <input type="password" value={password} onChange={ (event) => setEmail(event.target.value) }/>
                        
                <br></br>
                <br></br>

                <button type="submit">Log In</button>

            </form>
            <br></br>

            <p> don't have an account? </p>
            <Link to={"/sign_up_page"}>
                <button>Sign Up</button>
            </Link>
        </div>
    );
}

export default Register_page;