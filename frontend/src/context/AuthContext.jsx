import React, {
    createContext,
    useContext,
    useState
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user")
        ) || null
    );

    const [token, setToken] = useState(
        localStorage.getItem(
            "jobfinder_token"
        ) || null
    );


    // =========================
    // REGISTER
    // =========================

    const register = async (
        name,
        email,
        password
    ) => {

        const response = await API.post(
            "/auth/register",
            {
                name,
                email,
                password
            }
        );

        return response.data;
    };


    // =========================
    // LOGIN
    // =========================

    const login = async (
        email,
        password
    ) => {

        const response = await API.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        const receivedToken =
            response.data.token;

        const receivedUser =
            response.data.user;


        localStorage.setItem(
            "jobfinder_token",
            receivedToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(receivedUser)
        );


        setToken(receivedToken);
        setUser(receivedUser);

        return response.data;
    };


    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        localStorage.removeItem(
            "jobfinder_token"
        );

        localStorage.removeItem(
            "user"
        );

        setToken(null);
        setUser(null);
    };


    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                register,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}


// =========================
// USE AUTH
// =========================

export function useAuth() {

    return useContext(AuthContext);

}