import { SxProps, Theme } from "@mui/material"
import { ProductCardStyle } from "../../globalStyles/CardStyle"
import { OutOfStockColor } from "./CartConstants"

export const pageBoxSx:SxProps<Theme> = { padding: "30px", position: "relative" }

export const headerSx:SxProps<Theme> = { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }

export const headerSpacerSx:SxProps<Theme> = { width: "100px" }

export const titleSx:SxProps<Theme> = { textAlign: "center", flexGrow: 1 }

export const clearButtonSx:SxProps<Theme> = { fontSize: "0.8rem", display: "flex", gap: 1 }

export const emptyMessageSx:SxProps<Theme> = { width: "100%", textAlign: "center", mt: 4 }

export const totalSx:SxProps<Theme> = { width: "100%", textAlign: "center", mt: 4 }

export const checkoutBoxSx:SxProps<Theme> = { mt: 3, textAlign: "center" }

export const cardSx = (outOfStock:boolean):SxProps<Theme> => ({ ...ProductCardStyle, backgroundColor: outOfStock ? OutOfStockColor : "white", opacity: outOfStock ? 0.7 : 1 })

export const cardImageSx:SxProps<Theme> = { height:300, objectFit:"contain" };

export const centeredTextSx = (struck:boolean):SxProps<Theme> => ({ textAlign: "center", textDecoration: struck ? "line-through" : "none" })

export const amountBoxSx:SxProps<Theme> = { display:"flex",	flexDirection:"row", justifyContent:"flex-end",	alignItems:"center" }