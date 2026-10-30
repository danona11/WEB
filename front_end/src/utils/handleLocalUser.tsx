export const SetLocalUser = ( userName:string , perm:boolean ) => {
    
    localStorage.setItem("LocalUserName" , userName )
    localStorage.setItem("localUserPermissions" , String(perm) )

} 

export const RemoveLocalUser = () => {  //when user loggs out - remove from local storage

    localStorage.removeItem("LocalUserName")
    localStorage.removeItem("localUserPermissions")

}


export const GetLocalUserName = (): (string|null) => {

    return localStorage.getItem("localUserName")

}

export const GetLocalUserPermissions = (): boolean => {

    return( localStorage.getItem("localUserPermissions") === "true" )   // from string to bolean
}