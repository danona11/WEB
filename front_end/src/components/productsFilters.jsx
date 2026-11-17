import { Typography } from "@mui/material"
import { useState } from "react"

export default function ProductFilter(){
    
    const [productTeams,setProductTeams] = useState<string>("")
    const [productDesigns,setProductDesigns] = useState<string>("")
    const [productYears,setProductYears] = useState<string>("")

    
    const handlePostFilters = async() => {

        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/getProductsByFilter` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ProductTeams: productTeams,
                    ProductDesigns: productDesigns,
                    ProductYears: productYears,
                }),
                credentials: "include"
            })

            if (response.ok){

                
            }
        }catch(error){

        }




    }

    return(

        <>
            <Typography>
                
            </Typography>
        </>

    )


}