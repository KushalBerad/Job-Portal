import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Extract user profile context state from the correct global auth slice
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // 🔥 FIXED: Safe null verification check handles pending store initialization smoothly
        if (!user) {
            navigate("/login"); // Route unauthenticated traffic to login instead of landing page
        } else if (user.role !== 'recruiter') {
            navigate("/"); // Route authenticated students away from administrative pages
        }
    }, [user, navigate]); // 🔥 FIXED: Adding dependencies guarantees continuous route guarding protection

    // 🚀 UX Win: Prevent content flashing by blocking child rendering while user state is absent
    if (!user || user.role !== 'recruiter') {
        return null; // Renders an empty track frame safely during redirect execution phases
    }

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
