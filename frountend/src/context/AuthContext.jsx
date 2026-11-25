import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);

    }, []);

    const login = (authResponse) => {

        localStorage.setItem(
            "token",
            authResponse.token
        );

        const userData = {
            userId: authResponse.userId,
            name: authResponse.name,
            email: authResponse.email,
            role: authResponse.role
        };

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};