import DebouncedTextField from "../DebouncedTextField";
import { useEffect, useState } from "react"
import { CallGetProductByIdAPI } from "./ApiCalls/ProductByIdAPI";
import { CallGetProductsByNameAPI } from "./ApiCalls/ProductsByNameAPI";
// import Api from './ApiCalls'

export default function SearchBar( search?: string , ){

    const [ searchInoput , setSearchInput ] = useState<string>("")
    

    useEffect(() =>{
        
        
        const callSearchProduct = async() =>{

            const cleaned = searchInoput.trim()
            if (cleaned === "") {
                return "empty"
            }

            const searchIsID = Number(cleaned)

            if ( !isNaN( searchIsID ) ){   //if the search is by name(string)

                const call = await CallGetProductsByNameAPI(cleaned)


            }else{                               //the search is by id(int)

                if( searchIsID > 0 ){

                    const call = await CallGetProductByIdAPI( searchIsID )
                
                }


            }

        }
        callSearchProduct()

    } , [ searchInoput ] )

    return(

        <DebouncedTextField
            label="search field"
            type="text"
            setValue={setSearchInput}
        />

    )
    
}