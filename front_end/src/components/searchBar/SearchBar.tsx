import DebouncedTextField from "../DebouncedTextField";
import { useEffect, useState } from "react"
import { CallGetProductByIdAPI } from "./ApiCalls/ProductByIdAPI";
import { CallGetProductsByNameAPI } from "./ApiCalls/ProductsByNameAPI";
import CartItem from "../../interfaces/CartItemInterface";


export default function SearchBar( onSubmitSearch: (searchProdsList: (CartItem[] | null) ) => void ){

    const [ searchInoput , setSearchInput ] = useState<string>("")
    
    useEffect(() =>{
        
        const callSearchProduct = async() =>{

            const cleaned = searchInoput.trim()
            if (cleaned === "") {

                onSubmitSearch(null)
                return
            }

            const searchIsID = Number(cleaned)

            if ( isNaN( searchIsID ) ){     //if the search is by name(string)

                const call = await CallGetProductsByNameAPI(cleaned)
                onSubmitSearch(call)

            }else{                               //the search is by id(int)

                if( searchIsID > 0 ){

                    const call = await CallGetProductByIdAPI( searchIsID )
                    onSubmitSearch(call)
                }

                else{
                    onSubmitSearch([])

                }
            }
        }
        callSearchProduct()

    } , [ searchInoput ] )//every time the debounced text field chooses to refresh- fetch the products matching the search

    return(

        <DebouncedTextField
            label="search..."
            type="text"
            setValue={setSearchInput}
        />

    )
    
}