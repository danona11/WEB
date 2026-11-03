import {Box,Typography} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormEvent, useMemo, useState , useEffect} from "react";
import Users from "../../interfaces/UserInterface"
import fetchWithValidation from "../../utils/Api/fetchWithValidation";
import {AdminUsersActions} from "../../utils/AdminActions/AdminUsersActions";

export default function ManageUsersPage() {

    const [usersList, setUsersList] = useState<Users[]>([])
    const [refresh, setRefresh] = useState<boolean>(false)
    const [rowID, setRowID] = useState()
    const [maxRows , setMaxRows] = useState<number>(0)
    const [paginationModel, setPaginationModel ] = useState({page:0,pageSize:6})


    useEffect(() => {

        const fetchUsers = async() => {
            try{
                const responce = await fetchWithValidation(`${import.meta.env.VITE_API_URL}/users/page/${paginationModel.page+1}`, {
                    method: "GET",
                    credentials: "include"
                })
                if (responce.ok) {
                    const data = await responce.json()
                    setUsersList(data.Users)
                        
                    setMaxRows( ( data.MaxPage )*( data.UsersPerPage ) )

                } else {
                    console.log("failed to fetch the users");
                }

            } catch (error) {
                console.error("network error", error);
            }
        }

        fetchUsers()
    },[ paginationModel.page , refresh ])


    const columns = useMemo<GridColDef<Users>[]>( () => [
        {field:'UserID' , headerName: 'id' , width:50 },
        {field:'UserName' , headerName: 'user name' , width:150 },
        {field:'Permissions' , headerName: 'is admin' , width:150 , type:'boolean' ,editable:true},
        {field:'Email' , headerName: 'email' , width:300 },
        {field:'RegisterDate' , headerName: 'date first joined' , width:200, type:'dateTime' , valueGetter:( (date) => (!date) ? null : new Date(date) ) },
        {field: 'actions' , headerName: 'actions' , type:'actions' , width:250 ,sortable: false, editable: false , renderCell:( (params) => AdminUsersActions(params, setRefresh))},
    
    ], [rowID] )    //when rowID changes, rfresh the grid


    return (
        <Box className="manage-users-page" sx={{ height:600,width:'100%', textAlign: 'center', marginTop: '50px'}}>
                        
            <Typography variant='h4' component='h4' sx={{textAlign:'center' , mt:3 , mb:3}}>
                manage products - admin only
            </Typography>
                
            <DataGrid 
                rows={usersList} 
                columns={columns} 
                getRowId={ (row) => (row.UserID) } 
                paginationMode="server" 
                rowCount={maxRows}
                paginationModel={paginationModel} 
                onPaginationModelChange={setPaginationModel} 
            />

        </Box>
    )
}
