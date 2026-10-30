import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/ReduxHooks";
import handleValidateFetch from "../../utils/Api/handleValidateFetch";
import { setUser , openLoginPopup } from "../../Redux/ReduxUserSlice";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import DebouncedTextField from "../DebouncedTextField";


export default function LoginPopup(){

    const [userName , setUserName] = useState<string>("")
    const [password , setPassword] = useState<string>("")

    const dispatch = useAppDispatch();

//the state of LoginPopupOpen userSlice will chnage to true when the user fetches unauthorizred
//the whole component will reRun when openPopup value chnges and then the dialog ui will show
    const openPopup = useAppSelector( state => state.user.LoginPopupOpen )

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
            
        e.preventDefault();     //the page wont refresh when pressing login
        
        try{    
            const responce = await fetch( `${import.meta.env.VITE_API_URL}/login`,{
                method: "POST" , 
                
                headers: { "Content-Type" : "application/json"}, 
                
                body: JSON.stringify({
                    UserName: userName,
                    Password: password
                }),

                credentials: "include"
            })
            
            const data = await responce.json()  //login controller sends a json with username and perrmissions

            if (responce.ok) {  //authorized user
                dispatch( setUser({ userName: data.userName , permissions: data.perrmissions }) ) 
                dispatch(openLoginPopup())
            }

            else{
                console.log('invalid username or password');
            }               
        }
        
        catch(error){
            console.error("network error", error);
        }
    }

    return (   
        <Dialog 
            open={openPopup} 
            onClose={ (event,reason) => { if(reason === 'backdropClick' || reason === 'escapeKeyDown') return }}    //closing the popup through pressing outside it or pressing esc wont close the popup(onclose(return))
            aria-labelledby="login-dialog-title"
            aria-describedby="login-dialog-description"
            maxWidth='xs'
        >
            
            <DialogTitle id="login-dialog-title">token expired - confirm user</DialogTitle>
            <form className="login-page" onSubmit={handleLogin} style= {{maxWidth: '400px', margin: '0 auto', padding: '20px' , textAlign: 'center'}}>
                <DialogContent>
                                            
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

                </DialogContent>        

                <DialogActions> 
                    
                    <Button type="submit" variant="contained">
                        log-in
                    </Button>
        
                </DialogActions>

            </form>

        </Dialog>

    );
}
