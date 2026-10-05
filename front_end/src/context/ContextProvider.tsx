import { createContext } from "react";
import React from "react";


// The userContext is a React context that holds the user's permissions and authentication status.
export const userContext = createContext<{permissions: boolean ; auth: boolean}>
                                        ({permissions: false , auth: false});

const Context = ({ children }: { children: React.ReactNode }) => {
    const [permissions, setPermissions] = React.useState(false);
    const [auth, setAuth] = React.useState(false);
    return (
        <userContext.Provider value={{ permissions, auth }}>
            {children}
        </userContext.Provider>
    );
}


export default Context;