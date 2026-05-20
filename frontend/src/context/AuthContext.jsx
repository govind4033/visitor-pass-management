import { createContext, useContext, useEffect, useReducer } from 'react';
export const AuthContext = createContext();

// reducer
const authReducer = (state, action) => {

    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            };

        case 'LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                user: null,
                token: null
            };

        default:
            return state;

    }

};


// provider
export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null
    });


  // restore login after refresh
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            dispatch({
                type: 'LOGIN',

                payload: {
                user,
                token
                }
            });
        }
    }, []);


    return (
        <AuthContext.Provider
        value={{
            ...state,
            dispatch
        }}
        >
        {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);

    // Safety check: If a component tries to use useAuth outside of the AuthContextProvider
    if (!context) {
        throw new Error('useAuth must be used inside an AuthContextProvider');
    }

    return context;
};