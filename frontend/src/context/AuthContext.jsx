import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

export const AuthContext = createContext();


// reducer
const authReducer = (state, action) => {

  switch (action.type) {

    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return {
        user: null,
        token: null,
      };

    default:
      return state;
  }
};


// provider
export const AuthContextProvider = ({ children }) => {

  const [loading, setLoading] = useState(true);

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
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
          token,
        },
      });
    }

    setLoading(false);

  }, []);


  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthContextProvider'
    );
  }

  return context;
};