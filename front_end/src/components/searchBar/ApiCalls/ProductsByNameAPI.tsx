import { useState } from "react";
import fetchWithValidation from "../../../utils/Api/fetchWithValidation";

export const CallGetProductsByNameAPI = async( prodName:string ) => {
        
    const [productsNamesList , setProductsNamesList] = useState<string[]>([])
    try {
        const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/getProductById/${prodName}`,
        {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify({
                ProdName: prodName
            }),

            credentials: "include"
        })

        if (responce.ok) {
            const data = await responce.json()
        }

    } catch (error) {
        console.error("network error", error)
    }
}