import fetchWithValidation from "../../../utils/Api/fetchWithValidation";
import CartItem from "../../../interfaces/CartItemInterface";

export const CallGetProductByIdAPI = async( prodID:number ): Promise<CartItem[]> =>{
        try {
            const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/getProductById/${prodID}`,
            {
                method: "GET",
                credentials: "include"
            })

            if (responce.ok) {
                const data = await responce.json()
                return data.Product || []
            }

            return []

        } catch (error) {
            console.error("network error", error)
            return []
        }
    }