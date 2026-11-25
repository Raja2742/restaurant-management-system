import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    startTableSession,
    getSessionById
} from "../services/sessionService";

const SessionContext = createContext(null);

const SESSION_STORAGE_KEY = "restaurant.activeSession";

export const SessionProvider = ({ children }) => {

    const [table, setTable] = useState(null);
    const [session, setSession] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Save session details in sessionStorage
    const saveSession = (sessionData) => {
        sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify(sessionData)
        );

        setSession(sessionData);

        if (sessionData.tableId) {
            setTable({
                id: sessionData.tableId,
                tableNumber: sessionData.tableNumber
            });
        }
    };

    // Clear the current session
    const clearSession = () => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);

        setSession(null);
        setTable(null);
        setError(null);
    };

    // Start a session for the selected table
    const startSession = async (selectedTable) => {
        try {
            setError(null);

            const sessionData = await startTableSession(
                selectedTable.id
            );

            saveSession(sessionData);

            return sessionData;

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Unable to start table session.";

            setError(message);
            throw err;
        }
    };

    // Restore and validate a previously stored session
    const restoreSession = async () => {
        try {
            const storedSession = sessionStorage.getItem(
                SESSION_STORAGE_KEY
            );

            if (!storedSession) {
                return;
            }

            const parsedSession = JSON.parse(storedSession);

            if (!parsedSession.id) {
                clearSession();
                return;
            }

            const sessionData = await getSessionById(
                parsedSession.id
            );

            // Only retain sessions that are still usable
            if (
                sessionData.status === "ACTIVE" ||
                sessionData.status === "BILL_REQUESTED"
            ) {
                saveSession(sessionData);
            } else {
                clearSession();
            }

        } catch (err) {
            // Invalid or unavailable sessions should not remain stored
            clearSession();
        }
    };

    // Restore session when the provider first mounts
    useEffect(() => {
        const initializeSession = async () => {
            try {
                await restoreSession();
            } finally {
                setLoading(false);
            }
        };

        initializeSession();
    }, []);

    return (
        <SessionContext.Provider
            value={{
                table,
                session,
                loading,
                error,
                startSession,
                clearSession,
                restoreSession,
                setTable
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook
export const useSession = () => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error(
            "useSession must be used inside SessionProvider"
        );
    }

    return context;
};