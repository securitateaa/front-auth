import React, { createContext, useState, useEffect, useMemo, ReactNode, useCallback } from "react";
import {
    onAuthStateChanged,
    onIdTokenChanged,
    signInWithEmailAndPassword,
    signOut,
    UserCredential,
} from "firebase/auth";
import { deleteValueFor, getValueFor, save } from "../utils/session";
import api from "../api/api";
import { auth } from "../fireBaseConfig";

interface User {
    role?: string;
    uid: string;
    email?: string | null;
    name?: string | null;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authError: string;
    setAuthError: (error: string) => void;
    signUp: (data: {
        email: string;
        password: string;
        displayName: string;
        adminToken?: string;
        systemLocation?: string;
    }) => Promise<void>;
    signIn: (data: { email: string; password: string }) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUser = async () => {
        try {
            const storedUser = await getValueFor("user");
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
                return parsedUser;
            }
        } catch (error) {
            console.error("Failed to fetch user from SecureStore:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthStateChanged = useCallback(
        async (authUser: any) => {
            try {
                if (authUser) {
                    const userToken = await authUser.getIdToken(true);
                    const userData: User = {
                        uid: authUser.uid,
                        email: authUser.email,
                        name: authUser.displayName,
                        token: userToken,
                    };

                    setUser(userData);
                    await save("user", JSON.stringify(userData));
                } else {
                    setUser(null);
                    await deleteValueFor("user");
                }
            } catch (error) {
                console.error("Error during auth state change:", error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchUser();
        const unsubscribeAuthStateChanged = onAuthStateChanged(auth, handleAuthStateChanged);
        const unsubscribeIdTokenChanged = onIdTokenChanged(auth, handleAuthStateChanged);

        return () => {
            unsubscribeAuthStateChanged();
            unsubscribeIdTokenChanged();
        };
    }, []);

    return {
        user,
        error,
        loading,
        setUser,
        setError,
        signUp: async (data: { email: string; password: string; displayName: string; adminToken?: string; systemLocation?: string }) => {
            try {
                const { data: responseData } = await api.post("/auth/register", data);
                return responseData;
            } catch (error: any) {
                setError(error.response?.data?.message || "An unexpected error occurred");
            }
        },
        signOut: async () => {
            try {
                await signOut(auth);
                await deleteValueFor("user");
                setUser(null);
            } catch (error) {
                console.error("SignOut error:", error);
            }
        },
        signIn: async ({ email, password }: { email: string; password: string }) => {
            try {
                const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const token = await user.getIdToken(true);
                const userData: User = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    token,
                };

                setUser(userData);
                await save("user", JSON.stringify(userData));
            } catch (error: any) {
                console.log(error.message);
                setError(error.message);
            }
        },
    };
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, error, loading, setError, signUp, signIn, signOut } = useAuth();

    const contextValue = useMemo(
        () => ({
            user,
            loading,
            signUp,
            signIn,
            signOut,
            authError: error,
            setAuthError: setError,
        }),
        [user, error, loading]
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
