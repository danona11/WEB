import { Box, Button, Dialog ,  DialogActions,  DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ToggleButton, Tooltip, Typography } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import { FormEvent, useState } from "react";
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import DialogPopUp from "../../components/popups/DialogPopUp"
import UserInterface from "../../interfaces/UserInterface";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useAppDispatch } from "../../Redux/ReduxHooks";
import { openSnackBar } from "../../Redux/ReduxPopupSlice";


export const AdminUsersActions = (params:any , setRefresh: React.Dispatch<React.SetStateAction<boolean>> ) => {
    
    const user:UserInterface = params.row

    const [userName, setUserName] =   useState<string>(user.UserName)
    const [email, setEmail] = useState<string>(user.Email)
    const [permissions, setPermissions] = useState<boolean>(user.Permissions)

    const [openPopupDelete , setOpenPopupDelete] = useState<boolean>(false)
    const [openPopupUpdate , setOpenPopupUpdate] = useState<boolean>(false)

    const dispatch = useAppDispatch();


    // const handleAddUser = async(e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/signup`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 userName: userName,
    //                 email: email,
    //                 password: password
    //             }),
    //             credentials: "include"});

    //             if (response.ok) {  //refresh the users, empty the addusers details
    //                 setEmail("")
    //                 setPassword("")
    //                 setUserName("")
    //                 // setRefresh(true)
    //             }
    //             else    alert("user email or password inccorect, pls try again")

    //     } catch (error) {
    //         console.error("Error adding user:", error);
    //     }

    // }
    
    const handleDeleteUser = async () => {
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/deleteUser/${user.UserID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if(response.ok){

                setOpenPopupDelete(false)   //close popup when succesfully added, and got statusok
                setRefresh( old => !old )

                dispatch( openSnackBar({    //open the snackbar alert - successfull
                    message: "succesfully deleted user",
                    severity: "success" ,
                }))

            } else{
                
                dispatch( openSnackBar({   //open the snackbar alert - error
                    message: 'error deleted user',
                    severity: "success" ,
                }))
            }


        } catch (error) {

            dispatch( openSnackBar({   //open the snackbar alert - error
                message: 'error deleted user' + error ,
                severity: "success" ,
            }))
        }
    }

    const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
            
        e.preventDefault()//prevent so that the page does not refresh when submitting added product

        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/updateUser/${user.UserID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    permissions: permissions,
                }),
                credentials: "include"
            })

            if (response.ok){
                setOpenPopupUpdate(false)   //close popup when succesfully added, and got statusok
                setRefresh( old => !old )
                console.log("user updated successfully")
            }    
            else    console.log("failed to update user")

        } catch(error) {
            console.error("Error updating product:", error);
        }
    }


    return(
        <Box>

            <Tooltip title='edit user details'>
        
                <IconButton onClick={ () => {setOpenPopupUpdate(true)} }>
                    <EditIcon />
                </IconButton>

            </Tooltip>

            <Tooltip title='delete user'>

                <IconButton onClick={ () => {setOpenPopupDelete(true)} }>
                    <RemoveCircleIcon />
                </IconButton>

            </Tooltip>

            <DialogPopUp 
                open={( openPopupDelete )}
                title="Delete user from the database"
                description={`sure u want to delete "${userName}" from the database?`}
                confirmText = "delete"
                onConfirm={ () => handleDeleteUser() }
                onClose={ () => ( setOpenPopupDelete(false) ) }
            />

            <Dialog 
                open={( openPopupUpdate )}
                onClose={ () => ( setOpenPopupUpdate(false) ) }  
                sx={{maxWidth:'100px'}}  
            >
                <form onSubmit={handleUpdateUser} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <DialogTitle>update user in the database</DialogTitle>
                    <br/>

                    <DialogContent>                        
                        <TextField label="user name: "      type="text"     value={userName}    onChange={ (event) => setUserName(event.target.value) } />
                        
                        <TextField label="user email: "     type="text"     value={email}       onChange={ (event) => setEmail(event.target.value) } />
                        
                        {/* <TextField label="is user admin: "  type="boolean"  value={permissions} onChange={ (event) => setPermissions(Boolean(event.target.value)) } /> */}
                        <br/>
                        
                        <Typography>change user perrmissions</Typography>
                        <ToggleButton aria-label="user permissions" value={permissions} selected={permissions} onChange={ () => setPermissions( (oldPermissions) => !oldPermissions ) } >
                                <WorkspacePremiumIcon/>
                        </ToggleButton>

                    </DialogContent>

                    <DialogActions>
                        <Button type="submit" color="success">
                            update
                        </Button>

                        <Button onClick={ () => (setOpenPopupUpdate(false))} color="error" variant="contained">
                            cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>            
        </Box>
    )
}