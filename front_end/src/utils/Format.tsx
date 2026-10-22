export const formatProductName = (name: string): string => {
    if (!name) return "";
    
    return name
        // 1. Insert a space before capital letters (e.g., "Third" -> " Third")
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // 2. Insert a space before numbers (e.g., "Kit2026" -> "Kit 2026")
        .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
        // 3. Capitalize the very first letter if lowercase (e.g., "liverpool" -> "Liverpool")
        .replace(/^./, (char) => char.toUpperCase());
};
