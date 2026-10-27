import {Box,Button,Grid,Pagination,Alert,Stack,Typography, Paper, Card , ThemeProvider, createTheme, CardMedia, CardContent, CardActions, IconButton} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormEvent, useMemo, useState , useEffect} from "react";
import Users from "../../interfaces/UserInterface"
export default function ManageUsersPage() {

    const [usersList, setUsersList] = useState<Users[]>([])
    const [userID, setUserID] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [refresh, setRefresh] = useState<boolean>(false)

    useEffect(() => {

        const fetchUsers = async() => {
            try{
                const responce = await fetch(`${import.meta.env.VITE_API_URL}/users`,
                {
                    method: "GET",
                    credentials: "include"
                })
                if (responce.ok) {
                    const data = await responce.json()
                    setUsersList(data.users)

                } else {
                    console.log("failed to fetch the products");
                    <Alert severity="error">failed to fetch the products</Alert>
                }

            } catch (error) {
                console.error("network error", error);
                <Alert severity="error">request not avilable rn</Alert>
            }
        }

        fetchUsers()
    },[refresh])

    
    const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
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
                    setRefresh(true)
                }
                else    alert("user email or password inccorect, pls try again")

        } catch (error) {
            console.error("Error adding user:", error);
        }

    }

    const handleDeleteUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteUser/${userID}`, {
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
    };

    const columns = useMemo<GridColDef<Users>[]>( () => [
        {field:'UserID' , headerName: 'id' , width:50 },
        {field:'UserName' , headerName: 'user name' , width:250 },
        {field:'Permissions' , headerName: 'permissions' , width:250 },
        {field:'Email' , headerName: 'email' , width:250 },
        {field:'AdminFunctions' , headerName: 'admin functions' , width:400 },
    ], [] ) 


    return (
        <Box className="manage-users-page" sx={{ textAlign: 'center', marginTop: '50px'}}>
            
            <Typography variant="h3" sx={{textAlign:'center' , mt:3 , mb:3 }}>Manage Users Page - only accessable to admins</Typography>
            
            <br></br>
            <Box sx={{height:400 , width:'100%' }}>
                
                <DataGrid 
                    columns={columns} rows={usersList} 
                    initialState={{
                        pagination: { paginationModel: {pageSize: 5} }
                    }} 
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={ (row) => row.UserID }
                />

            </Box>

            <Box className="add-user-form" sx={{ textAlign: 'center', marginTop: '50px' }}>

                <Typography variant="h5" sx={{textAlign:'center' , mt:3 , mb:3 }}>Add User</Typography>

                <form onSubmit={handleAddUser} style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <label>Username: </label>
                    <input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} />
                    
                    <br></br>
                    
                    <label>Email: </label>
                    
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    
                    <br></br>
                    
                    <label>Password: </label>
                    
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    
                    <br></br>
                    <br></br>

                    <button type="submit">Add User</button>
                </form>
            </Box>

        </Box>
        );
}
