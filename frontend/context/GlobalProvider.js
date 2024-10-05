import React, { createContext, useContext, useEffect, useState } from "react";
import { getItem } from "./SecureStorage";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isUserFound = getItem('isUserFound')
        const isUserLoggedIn = getItem('refreshToken')

        //TODO: ako pronadje refreshToken treba pozvati rutu na backendu za refreshanje access tokena
        // i spremiti taj access token u storage
        
        setIsFirstTime(isUserFound === undefined || isUserFound === null);
        setIsLogged(isUserLoggedIn !== undefined && isUserLoggedIn !== null);

        setLoading(false);
    }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        isFirstTime,
        setIsFirstTime,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;