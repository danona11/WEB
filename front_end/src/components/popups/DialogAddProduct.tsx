import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ToggleButton, Typography } from "@mui/material";
import DebouncedTextField from "../DebouncedTextField";
import { FormEvent, useState } from "react";
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import { useAppDispatch } from "../../Redux/ReduxHooks";
import { openSnackBar } from "../../Redux/ReduxPopupSlice";
import AddDialogInterface from '../../interfaces/DialogInterface'


export default function DialogAddProduct( props:AddDialogInterface ){           
      
    const [productTeam , setProductTeam] = useState<string>("")
    const [productDesign , setProductDesign] = useState<string>("")
    const [productYear , setProductYear] = useState<string>("")
    const [productName , setProductName] = useState<string>(`${productTeam} ${productDesign} ${productYear}`)
    
    const dispatch = useAppDispatch()

    const handleAddProduct = async( e:FormEvent<HTMLFormElement> ) => {

        e.preventDefault()//wont reload on submit - just according to setRefresh
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/signup` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productTeam: productTeam,
                    productDesign: productDesign,
                    productYear: productYear,

                }),
                credentials: "include"
            })

            if (response.ok){

                props.setRefresh( old => !old )

                props.onClose
                setProductName(`${productTeam} ${productDesign} ${productYear}`)   
                
                dispatch( openSnackBar({    //open the snackbar alert - successfull
                    message: `product ${productName} added`,
                    severity: "success" ,
                }))
                console.log("user updated successfully")
                
                setProductTeam("")
                setProductDesign("")
                setProductYear("")
                setProductName("")
            }    
            else{
                
                console.log("failed to add product")
                dispatch( openSnackBar({    //open the snackbar alert - error
                    message: "failed to add product",
                    severity: "error" ,
                }))
            }

        } catch(error) {
            console.error("Error adding product:", error)
            dispatch( openSnackBar({    //open the snackbar alert - error
                message: "failed to add product",
                severity: "error" ,
            }))
        }
    }

    return(            
        <Dialog
            open={ props.open }
            onClose={ props.onClose }  
            maxWidth="xs" 
            fullWidth       
        >
            <form onSubmit={handleAddProduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
                <DialogTitle>update user in the database</DialogTitle>
                
                <br/>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>                        
                    <DebouncedTextField label="user name: " type="text"     setValue={ setProductTeam }/>
                    
                    <DebouncedTextField label="email: "     type="text"     setValue={ setProductDesign } />
                    
                    <DebouncedTextField label="password: "  type="text"     setValue={ setProductYear } />
                    
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