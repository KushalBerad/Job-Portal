import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    // 🔥 FIXED: Pre-populated nested array placeholders prevent null rendering crashes on mount
    initialState: {
        applicants: {
            title: "",
            applications: [] // Safely structures array length queries before API requests resolve
        },
        loading: false // Added a clean loading flag to manage UI placeholder skeletons natively
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload || { title: "", applications: [] };
        },
        setApplicationLoading: (state, action) => {
            state.loading = action.payload;
        },
        // 🔥 FIXED: Added clear action to prevent stale recruiter cache leaks upon page unmounts
        clearApplicantsState: (state) => {
            state.applicants = { title: "", applications: [] };
            state.loading = false;
        }
    }
});

export const { setAllApplicants, setApplicationLoading, clearApplicantsState } = applicationSlice.actions;
export default applicationSlice.reducer;
