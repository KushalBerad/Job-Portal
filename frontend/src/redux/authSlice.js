import { createSlice } from "@reduxjs/toolkit";

// Safe State Hydration: Attempt to recover the user profile from localStorage if a browser refresh occurs
const getInitialUserSession = () => {
    try {
        const persistedUser = localStorage.getItem("jobportal_user_session");
        return persistedUser ? JSON.parse(persistedUser) : null;
    } catch (error) {
        console.error("Failed to hydrate user session state from browser storage:", error);
        return null;
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: getInitialUserSession() // 🔥 FIXED: Handles browser refreshes cleanly without session loss
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            
            // Sync session profile data to storage layer automatically to support page refreshes
            if (action.payload) {
                localStorage.setItem("jobportal_user_session", JSON.stringify(action.payload));
            } else {
                // Completely clear out the session storage token space when user passes null (Logout)
                localStorage.removeItem("jobportal_user_session");
            }
        },
        // 🔥 FIXED: Dedicated security action to clear memory across all store domains cleanly
        purgeSessionState: (state) => {
            state.loading = false;
            state.user = null;
            localStorage.removeItem("jobportal_user_session");
        }
    }
});

export const { setLoading, setUser, purgeSessionState } = authSlice.actions;
export default authSlice.reducer;
