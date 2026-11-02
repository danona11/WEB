import { Fragment , useId , useState } from "react"
import {  ReceiptsList } from "../interfaces/ReceiptProductData"
import { Avatar } from "@mui/material"
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


export default function Row(props: { row: ReceiptsList }) {
    
    const { row } = props
    const [open, setOpen] = useState(false)
    const detailsId = useId()

    return(
        <Fragment>
            <TableRow sx={{ '& > .MuiTableCell-root': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label={open ? 'collapse row' : 'expand row'}
                        aria-expanded={open}
                        aria-controls={detailsId}
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>

                </TableCell>
                    
                <TableCell component="th" scope="row">
                    Order #{row.ReceiptID}
                </TableCell>

                <TableCell align="right">{row.SumPrice} ILS</TableCell>
                
            </TableRow>

            <TableRow id={detailsId} aria-hidden={!open ? true : undefined}>
                
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            
                            <Typography variant="h6" gutterBottom component="div">
                                Order Details
                            </Typography>

                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Photo</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                
                                <TableBody>

                                    {row.ProductDetails.map((item) => (
                                        <TableRow key={item.RowID}>
                                            
                                            <TableCell component="th" scope="row">
                                                <Avatar src={item.ProductPhotoURL} variant="circular" alt={item.ProductName} sx={{ width: 40, height: 40, borderRadius: 1 }} />
                                            </TableCell>
                                            
                                            <TableCell>{item.ProductName}</TableCell>
                                            
                                            <TableCell align="right">{item.AmountInCart}</TableCell>
                                            
                                            <TableCell align="right">{item.ProductPricePerUnit} ILS</TableCell>
                                        
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}