import { FormEvent, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function ManageProductsPage() {

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState<number | undefined>(undefined);
    const handleAddproduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: productName,
                    productPrice: productPrice
                }),
                credentials: "include"});

                if (response.ok) {
                    alert("product added successfully");
                }
                else    alert("product name or price incorrect, pls try again")

        } catch (error) {
            console.error("Error adding product:", error);
        }

        
    };

    const handleDeleteproduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/deleteProduct", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: productName,
                    productPrice: productPrice
                }),
                credentials: "include"
            });

            if (response.ok) {
                alert("product deleted successfully");
            } else {
                alert("failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleUpdateproduct = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/updateProduct", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: productName,
                    productPrice: productPrice
                }),
                credentials: "include"
            });

            if (response.ok) {
                alert("product updated successfully");
            } else {
                alert("failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
    <>
        <h1 style={{ textAlign: 'center' }}>Manage products Page - only accessable to admins</h1>

        <div className="manage-products-page" style={{ display: 'flex', justifyContent: 'center'}}>


            <div className="add-product" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Add product</h2>
                <form onSubmit={handleAddproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>product name: </label>
                    <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
                    <br></br>
                    <label>product price: </label>
                    <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
                    <br></br>
                    <br></br>

                    <button type="submit">Add product</button>
                </form>
            </div>

            <div className="delete-product" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Delete product</h2>
                <form onSubmit={handleDeleteproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>product name: </label>
                    <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
                    <br></br>
                    <label>product price: </label>
                    <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
                    <br></br>
                    <br></br>

                    <button type="submit">Delete product</button>
                </form>
            </div>

            <div className="update-product" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Update product</h2>
                <form onSubmit={handleUpdateproduct} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>product name: </label>
                    <input type="text" value={productName} onChange={(event) => setProductName(event.target.value)} />
                    <br></br>
                    <label>product price: </label>
                    <input type="number" value={productPrice} onChange={(event) => setProductPrice(Number(event.target.value))} />
                    
                    <br></br>
                    <br></br>

                    <button type="submit">Update product</button>
                </form>
            </div>
        </div>

        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            >
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </Box>
    </>
    );
}
