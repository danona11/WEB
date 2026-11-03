import { Box, Button, Dialog ,  DialogActions,  DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import { FormEvent, useState } from "react";
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import DialogPopUp from "../../components/popups/DialogPopUp"



export const AdminProductsActions = ( params:any , setRefresh: React.Dispatch<React.SetStateAction<boolean>> ) => {


    const prod = params.row

    const [productName, setProductName] =   useState<string>(prod.ProductName)
    const [productTeam, setProductTeam] =   useState<string>(prod.ProductTeam)
    const [productYear, setProductYear] = useState<number>(prod.productYear)
    const [productDesign, setProductDesign] = useState<string>(prod.productDesign)
    const [productPrice, setProductPrice] = useState<number>(prod.ProductPrice)
    const [productStock, setProductStock] = useState<number>(prod.productStock)

    const [openPopupDelete , setOpenPopupDelete] = useState<boolean>(false)
    const [openPopupUpdate , setOpenPopupUpdate] = useState<boolean>(false)


    // const handleAddproduct = async () => {
        
    //     try {
    //         const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/addProduct`, {
                   
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 productTeam: productTeam,
    //                 productYear: productYear,
    //                 productDesign: productDesign,
    //                 productPrice: productPrice,
    //                 productStock: productStock,
    //             }),
    //             credentials: "include"
    //         })

    //         if (response.ok)    alert("product added successfully")
    //         else                alert("product name or price incorrect, pls try again")

    //     } catch (error) {
    //         console.error("Error adding product:", error)
    //     }  
    // }


    const handleDeleteproduct = async () => {
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/deleteProduct/${prod.ProductID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (response.ok)    alert("product deleted successfully")
            else                alert("failed to delete product")

        } catch (error) {
            console.error("Error deleting product:", error)
        }
    }

    const handleUpdateProduct = async (e: FormEvent<HTMLFormElement>) => {
        
        e.preventDefault()//prevent so that the page does not refresh when submitting added product

        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/updateProduct/${prod.ProductID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productTeam: productTeam,
                    productYear: productYear,
                    productDesign: productDesign,
                    productPrice: productPrice,
                    productStock: productStock,
                }),
                credentials: "include"
            })

            if (response.ok){
                setOpenPopupUpdate(false)   //close popup when succesfully added, and got statusok
                setRefresh( old => !old )
                alert("product updated successfully");
            }    
            else                alert("failed to update product");

        } catch(error) {
            console.error("Error updating product:", error);
        }
    }

    return(
        <Box>
            {/* <Tooltip title='view product'>

                <IconButton onClick={ () => {} }>
                    <VisibilityIcon />
                </IconButton>

            </Tooltip> */}

            <Tooltip title='edit product details'>

                <IconButton onClick={ () => {setOpenPopupUpdate(true)} }>
                    <EditIcon />
                </IconButton>

            </Tooltip>

            <Tooltip title='delete product'>

                <IconButton onClick={ () => {setOpenPopupDelete(true)} }>
                    <RemoveCircleIcon />
                </IconButton>

            </Tooltip>

            <DialogPopUp 
                open={( openPopupDelete )}
                title="Delete Product from stock"
                description={`sure u want to delete "${productName}" from the stock?`}
                confirmText = "delete"
                onConfirm={ handleDeleteproduct }
                onClose={ () => ( setOpenPopupDelete(false) ) }
            />

            <Dialog 
                open={( openPopupUpdate )}
                onClose={ () => ( setOpenPopupUpdate(false) ) }    
            >
                <form onSubmit={handleUpdateProduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <DialogTitle>update Product from stock</DialogTitle>
                    <DialogContent>                        
                        <TextField label="kit team: "   type="text"     value={productTeam} onChange={ (event) => setProductTeam(event.target.value) } required />
                        
                        <TextField label="kit year: "   type="number"   value={productYear} onChange={ (event) => setProductYear(Number(event.target.value)) } required />
                        
                        <TextField label="kit design: " type="text"     value={productDesign} onChange={ (event) => setProductDesign(event.target.value) } required />
                        
                        <TextField label="kit price: "  type="number"   value={productPrice} onChange={ (event) => setProductPrice(Number(event.target.value)) } required />
                        
                        <TextField label="kit stock: "  type="number"   value={productStock} onChange={ (event) => setProductStock(Number(event.target.value)) } required />

                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" color="primary">
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