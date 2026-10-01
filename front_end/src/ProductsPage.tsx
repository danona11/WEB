import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function ProductsPage() {
    
    const [products, setProducts] = useState()

    const nav = useNavigate();  
    useEffect( () => {
        const fetchProducts = async() => {   //async - allows await when fetching
                    
            // sending the data to the BackEnd in json :
            try{
                const response = await fetch(
                    "http://localhost:8080/productsPage" , 
                    {
                        method: "GET" ,
                        credentials: "include" //cookies
                    }   
                )

                if (response.ok) {
                    alert("the connection worked")
                    const data = await response.json()
                    setProducts(data.Product)   //ProdIndx func in the controller sent: {} "Product": prods_list }
                }

                else    alert("the connection hasn't worked ")
            }
            
            catch(error){
                console.error("network error", error)
                alert("request not avilable rn")
            }
        }

        fetchProducts()//calling the func



    } , []);






}
