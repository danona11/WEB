import { useEffect, useMemo, useState } from "react"
import ReceiptProductData from "../interfaces/ReceiptProductData"
import fetchWithValidation from "../utils/Api/fetchWithValidation"
import { GridColDef } from "@mui/x-data-grid/models"
import { Avatar, Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid/DataGrid"

export default function ReceipsPage() {

    const [receiptsList, setReceiptsList] = useState<ReceiptProductData[]>([])

    useEffect(() => {
        const handleGetUserReceipts = async () => {
            try {
                const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/userReceipts`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!responce.ok) {
                    console.log("failed to fetch the user receipts")
                
                }else {
                    const data = await responce.json()
                    setReceiptsList(data.receipts)
                }
   
            } catch (error) {
                console.error("Error fetching user receipts:", error)
            }
        }

        handleGetUserReceipts()
    }, [])

    const columns = useMemo<GridColDef<ReceiptProductData>[]>( () => [

        { field: 'receipt_id',              headerName: 'Receipt ID',       width: 150 },
        { field: 'product_name',            headerName: 'Product Name',     width: 200 },
        { field: 'product_sum_price',       headerName: 'Sum Price',        width: 150 },
        { field: 'product_amount_in_cart',  headerName: 'Amount in Cart',   width: 150 },
        { field: 'product_price_per_unit',  headerName: 'Price per Unit',   width: 150 },
        { field: 'product_photo_url',       headerName: 'Photo',            width: 100 , 
            renderCell: (params) => ( <Avatar src={params.value} variant="circular" sx={{ width: 50, height: 50 }} /> )
        },
    ],[] )



    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={receiptsList}
                columns={columns}
                getRowId={ (row: ReceiptProductData) => row.ReceiptID }
            />
        </Box>
    )

}