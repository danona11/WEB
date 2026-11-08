import { Box , Button, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
export default function PageNotFound() {
    const nav = useNavigate()

    return(
        <Box className="page-not-found" style={{textAlign: 'center', marginTop: '50px'}}>
            <Typography variant="h3"> Page Not Found </Typography>
            <br/>
            <br/>

            <Button onClick={()=>nav("/products")} variant="contained">
                go back to the app page🔙
            </Button>
        </Box>    
    );
};

