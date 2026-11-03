import {Box,Typography} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormEvent, useMemo, useState , useEffect} from "react";
import Users from "../../interfaces/UserInterface"
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import AdminActions from "../../utils/AdminActions/AdminUsersActions";

export default function ManageUsersPage() {

    const [usersList, setUsersList] = useState<Users[]>([])
    const [userID, setUserID] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [refresh, setRefresh] = useState<boolean>(false)
    const [rowID, setRowID] = useState()


    useEffect(() => {

        const fetchUsers = async() => {
            try{
                const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/users`, {
                    method: "GET",
                    credentials: "include"
                })
                if (responce.ok) {
                    const data = await responce.json()
                    setUsersList(data.users)

                } else {
                    console.log("failed to fetch the users");
                }

            } catch (error) {
                console.error("network error", error);
            }
        }

        fetchUsers()
    },[refresh])


    const columns = useMemo<GridColDef<Users>[]>( () => [
        {field:'UserID' , headerName: 'id' , width:50 },
        {field:'UserName' , headerName: 'user name' , width:150 },
        {field:'Permissions' , headerName: 'is admin' , width:150 , type:'boolean' ,editable:true},
        {field:'Email' , headerName: 'email' , width:300 },
        {field:'RegisterDate' , headerName: 'date first joined' , width:200, type:'dateTime' , valueGetter:( (date) => (!date) ? null : new Date(date) ) },
        // {field:'actions' , headerName: 'actions', sortable: false , width:400 , renderCell:( (params) => <AdminActions params={params} setRefresh = {setRefresh}/>) },
    
    ], [rowID] )    //when rowID changes, rfresh the grid


    return (
        <Box className="manage-users-page" sx={{ height:600,width:'100%', textAlign: 'center', marginTop: '50px'}}>
            
            <Typography variant='h4' component='h4' sx={{textAlign:'center' , mt:3 , mb:3}}>
                manage users - admin only
            </Typography>
                
            <DataGrid rows={usersList} columns={columns} getRowId={ (row) => (row.UserID) } pageSizeOptions={[5,10,20]} />
        </Box>
    )
}
