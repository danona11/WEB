import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ToggleButton, Typography } from "@mui/material";
import DebouncedTextField from "../DebouncedTextField";
import { FormEvent, useState } from "react";
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import { useAppDispatch } from "../../Redux/ReduxHooks";
import { openSnackBar } from "../../Redux/ReduxPopupSlice";
import { HTMLFormMethod } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

interface DialogAddUsersInterface {

    open: boolean
    onClose: ( () => void )
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DialogAddUsers( props:DialogAddUsersInterface ){           
      
    const [userName , setUserName] = useState<string>("")
    const [email , setEmail] = useState<string>("")
    const [password , setPassword] = useState<string>("")
    const [showPassword , setShowPassword] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleAddUser = async( e:FormEvent<HTMLFormElement> ) => {

        e.preventDefault()//wont reload on submit - just according to setRefresh
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/signup` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password,
                }),
                credentials: "include"
            })

            if (response.ok){

                props.setRefresh( old => !old )

                props.onClose
                
                setUserName("")
                setEmail("")
                setPassword("")

                dispatch( openSnackBar({    //open the snackbar alert - successfull
                    message: `user ${userName} added`,
                    severity: "success" ,
                }))
                console.log("user updated successfully")
            }    
            else{
                
                console.log("failed to add user")
                dispatch( openSnackBar({    //open the snackbar alert - error
                    message: "failed to add user",
                    severity: "error" ,
                }))
            }

        } catch(error) {
            console.error("Error updating product:", error)
            dispatch( openSnackBar({    //open the snackbar alert - error
                message: "failed to add user",
                severity: "error" ,
            }))
        }
    }

    const handleShowPassword = () =>{
        setShowPassword( (old) => (!old) )
    }

    return(            
        <Dialog
            open={ props.open }
            onClose={ props.onClose }  
            maxWidth="xs" 
            fullWidth       
        >
            <form onSubmit={handleAddUser} style={{ marginLeft: '20px', marginRight: '20px' }}>
                <DialogTitle>update user in the database</DialogTitle>
                
                <br/>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>                        
                    <DebouncedTextField label="user name: " type="text"     setValue={ setUserName }/>
                    
                    <DebouncedTextField label="email: "     type="text"     setValue={ setEmail } />
                    
                    <DebouncedTextField label="password: "  type={ showPassword ? "text" : "password" }   setValue={ setPassword } />
                    <IconButton aria-label="show password" size="small" onClick={ handleShowPassword }>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                </DialogContent>

                <DialogActions>
                    <Button type="submit" color="success" variant="contained">
                        ADD
                    </Button>

                    <Button onClick={ props.onClose } color="error" variant="contained">
                        CANCEL
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}