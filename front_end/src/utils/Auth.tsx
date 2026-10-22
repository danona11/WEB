export const getLocalUserName = () =>
{
    return localStorage.getItem("LocalUserName")
}

export const removeLocalUserName = () =>{
    localStorage.removeItem("LocalUserName")
}