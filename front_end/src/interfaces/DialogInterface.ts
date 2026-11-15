export default interface AddDialogInterface {

    open: boolean
    onClose: ( () => void )
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}