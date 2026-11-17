import handleValidateFetch from '../../utils/Api/fetchWithValidation'
import CheckOutItemInterface from '../../interfaces/CheckOutItemInterface'

export const CheckOutCartApiCall = async( cartBody:CheckOutItemInterface[] ): Promise<boolean> => {

    try{
        const responce = await handleValidateFetch( `${import.meta.env.VITE_API_URL}/checkOutCart`, 
            {
                method: "POST" ,
                headers: { "Content-Type" : "application/json"},
                
                body: JSON.stringify(cartBody),

                credentials: "include"
            }   
        )
        
        const data = await responce.json()
        
        return responce.ok

    }catch{ return false }        
}