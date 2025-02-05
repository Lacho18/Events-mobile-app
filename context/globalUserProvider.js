import React, { createContext, useContext, useState } from 'react';

// Create the context
const GlobalStateContext = createContext();

// Create the provider component
export const GlobalStateProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isAuthenticated: false,
    });

    return (
        <GlobalStateContext.Provider value={{ state, setState }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalUser = () => useContext(GlobalStateContext);