import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';


interface Props {
    label:      string;
    type:       string;
    setValue:   React.Dispatch<React.SetStateAction<string>>;
}

export default function DebouncedTextField( { label, type, setValue }: Props ) {
    
    const [liveText, setLiveText] = useState("");

    useEffect(() => {

        const timeout = setTimeout(() => {

            setValue(liveText); 

        }, 500);

        return () => clearTimeout(timeout);
    
    }, [liveText, setValue]);


    return (
        <TextField
            variant="standard"
            label={label}
            type={type}
            value={liveText}
            onChange={(e) => setLiveText(e.target.value)}
        />
    ); 
}