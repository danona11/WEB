import { useEffect} from "react"

export default function Debounce(value: string , setValue: React.Dispatch<React.SetStateAction<string>> , delay = 500){
  
  useEffect(() => {
        const timeout = setTimeout(() => {

            setValue(value);

            }, delay)

        return () => clearTimeout(timeout)

    }, [value , delay])

    
    return value

}