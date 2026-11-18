import fetchWithValidation from "../../../utils/Api/fetchWithValidation";
import CartItem from "../../../interfaces/CartItemInterface";

export const CallGetProductsByNameAPI = async( prodName:string ): Promise<CartItem[]> => {
        
    try {
        const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/getProductById/${prodName}`, {
            method: "GET",
            credentials: "include"
        })

        if (responce.ok) {
            const data = await responce.json()
            return data.Products || []
        }
        return []

    } catch (error) {
        console.error("network error", error)
        return []
    }
}