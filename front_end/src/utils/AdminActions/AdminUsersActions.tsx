import React, { FormEvent , ReactNode, useState} from "react";
import fetchWithValidation from "../Api/fetchWithValidation";




export default function AdminUsersActions(){
    
    const [loading, setLoading] = useState<boolean>(false)
    const [Delete, setDelete] = useState<boolean>(false)
    const [update, setUpdate] = useState<boolean>(false)
    const [userName,setUserName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [userID, setUserID] = useState()
    
    const handleAddUser = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                }),
                credentials: "include"});

                if (response.ok) {  //refresh the users, empty the addusers details
                    setEmail("")
                    setPassword("")
                    setUserName("")
                    // setRefresh(true)
                }
                else    alert("user email or password inccorect, pls try again")

        } catch (error) {
            console.error("Error adding user:", error);
        }

    }
    
    const handleDeleteUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/deleteUser/${userID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    email: email,
                    password: password
                }),
                credentials: "include"
            });

            if (response.ok) {
                alert("user deleted successfully");
            } else {
                alert("failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
}