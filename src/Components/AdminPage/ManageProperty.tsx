import React, {createContext, useState} from "react"

type ManageType = "All Properties" | "For Sale" | "For Rent" | "Featured" | "Draft" | "Add Property" | "Update Property" | "Dashboard" | "Enquiries";

export type ManageContextType = {
    activepage: ManageType;
    searchBar: string;
    setActivePage: (tab: ManageType)=> void;
    setSearchBar: (bar: string)=> void;
}

export const ManageContext = createContext<ManageContextType | null>(null);

export const ManageProvider: React.FC<{children: React.ReactNode}>= ({children})=>{
    const [activepage, setActivePage] = useState<ManageType>("Dashboard")
    const [searchBar, setSearchBar] = useState<string>("")

    console.log(activepage);
    

    
    return(
        <ManageContext.Provider value={{activepage,setActivePage,searchBar,setSearchBar}}>
              {children}
        </ManageContext.Provider>
    )
}