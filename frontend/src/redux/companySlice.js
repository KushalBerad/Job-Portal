import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [], // Initialized safely as an empty array to protect .length evaluations
        searchCompanyByText: "",
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        // 🔥 FIXED: Renamed action from setCompanies to setAllCompanies to match your custom hooks exactly
        setAllCompanies: (state, action) => {
            state.companies = action.payload || [];
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload || "";
        },
        // 🔥 FIXED: Added clear action to prevent stale administrative cache leaks upon session logouts
        clearCompanyCache: (state) => {
            state.singleCompany = null;
            state.companies = [];
            state.searchCompanyByText = "";
        }
    }
});

// 🔥 FIXED: Exporting the corrected and updated action list signatures
export const { setSingleCompany, setAllCompanies, setSearchCompanyByText, clearCompanyCache } = companySlice.actions;
export default companySlice.reducer;
