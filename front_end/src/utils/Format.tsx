export const formatProductName = (name: string): string => {
    if (!name) return "";
    
    //enter a space before capital letters/and first number
    return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([a-zA-Z])([0-9])/g, '$1 $2').replace(/^./, (char) => char.toUpperCase());
};
