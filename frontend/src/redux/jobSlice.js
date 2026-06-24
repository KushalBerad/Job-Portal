import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],         // Active student-facing marketplace job array
        allAdminJobs: [],    // Recruiter administrative posted jobs array
        allAppliedJobs: [],  // Candidate profile application tracking history array
        singleJob: null, 
        searchJobByText: "", // Dashboard filter string tracking field
        searchedQuery: "",   // Global marketplace search tag string tracking field
    },
    reducers: {
        setAllJobs: (state, action) => {
            // 🔥 FIXED: Embedded fallback ensures code structures always receive an array to map
            state.allJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            // 🔥 FIXED: Guard rails insulate components against null values on data synchronization drops
            state.allAdminJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload || "";
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload || "";
        },
        // 🔥 FIXED: Added cache purge action to isolate cross-user profiles completely upon logouts
        clearJobStateCache: (state) => {
            state.allJobs = [];
            state.allAdminJobs = [];
            state.allAppliedJobs = [];
            state.singleJob = null;
            state.searchJobByText = "";
            state.searchedQuery = "";
        }
    }
});

// Exporting updated actions including the critical session security cleaner utility
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    clearJobStateCache
} = jobSlice.actions;

export default jobSlice.reducer;
