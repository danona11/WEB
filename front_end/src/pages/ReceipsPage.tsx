import { useEffect , useState } from "react"
import { ReceiptsList } from "../interfaces/ReceiptProductData"
import fetchWithValidation from "../utils/Api/fetchWithValidation"
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReceiptsTable from "../components/ReceiptsTable";
import { useAppDispatch } from "../Redux/ReduxHooks";
import { openSnackBar } from "../Redux/ReduxPopupSlice";


export default function ReceipsPage() {

    const [receiptsList, setReceiptsList] = useState<ReceiptsList[]>([])

    const dispatch = useAppDispatch()

    useEffect(() => {
        const handleGetUserReceipts = async () => {
            try {
                const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/userReceipts`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!responce.ok) {
                    dispatch( openSnackBar({    //open the snackbar alert - successfull
                        message: 'error loging in',
                        severity: "error" ,
                    }))
                    console.log("failed to fetch the user receipts")
                
                }else {
                    const data = await responce.json()
                    setReceiptsList(data.receipts || [])
                }
   
            } catch (error) {
                console.error("Error fetching user receipts:", error)
            }
        }

        handleGetUserReceipts()
    }, [])

   return (
        <Box sx={{ maxWidth: '900px', margin: '0 auto', mt: 4 }}>
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">

                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Order Number</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                    {receiptsList.map((row) => (

                        <ReceiptsTable key={row.ReceiptID} row={row} />
                    ))}

                </TableBody>

            </Table>
        </TableContainer>
        </Box>
    );
}