import { ReduxStore } from "../../Redux/ReduxStore"
import { openLoginPopup  } from "../../Redux/ReduxUserSlice"

//check if the back end returns http.StatusUnauthorized - for all fetch requests that require validation
export default async function handleValidateFetch(input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>{

    const responce = await fetch(input, init)
    if( responce.status === 401 ){

        ReduxStore.dispatch( openLoginPopup() ) //if the backend replies with 401 - http.StatusUnauthorized, login will pop up
    }


	return responce
}