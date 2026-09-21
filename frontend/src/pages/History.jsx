import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../services/api";


function History() {

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const navigate = useNavigate();


    // =====================================================
    // LOAD HISTORY
    // =====================================================

    const loadHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/history/");

            setHistory(
                response.data.history || []
            );

        } catch (error) {

            console.error(
                "History loading error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load search history"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD HISTORY WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadHistory();

    }, []);


    // =====================================================
    // DELETE ONE HISTORY ITEM
    // =====================================================

    const deleteHistory = async (id) => {

        try {

            await api.delete(
                `/history/${id}`
            );

            setHistory(
                (currentHistory) =>
                    currentHistory.filter(
                        (item) =>
                            item.id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Delete history error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete history"
            );

        }
    };


    // =====================================================
    // CLEAR ALL HISTORY
    // =====================================================

    const clearHistory = async () => {

        const confirmClear =
            window.confirm(
                "Are you sure you want to delete all search history?"
            );

        if (!confirmClear) {
            return;
        }

        try {

            await api.delete(
                "/history/clear"
            );

            setHistory([]);

        } catch (error) {

            console.error(
                "Clear history error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to clear history"
            );

        }
    };


    // =====================================================
    // SEARCH AGAIN
    // =====================================================

    const searchAgain = (item) => {

        const query =
            item.query || "";

        const location =
            item.location || "";

        navigate(
            `/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <main className="page-container">

                <div className="loading-page">

                    <div className="spinner"></div>

                    <p>
                        Loading search history...
                    </p>

                </div>

            </main>

        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="page-container">


            {/* PAGE TITLE */}

            <div className="page-title">

                <p className="eyebrow">
                    SEARCH ACTIVITY
                </p>

                <h1>
                    Search History
                </h1>

                <p>
                    Review and reuse your previous
                    job searches.
                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* HISTORY HEADER */}

            {history.length > 0 && (

                <div className="history-header">

                    <div>

                        <strong>
                            {history.length}
                        </strong>

                        <span>
                            {" "}searches
                        </span>

                    </div>


                    <button
                        className="clear-history-button"
                        onClick={clearHistory}
                    >
                        🗑 Clear All
                    </button>

                </div>

            )}


            {/* EMPTY STATE */}

            {history.length === 0 ? (

                <div className="empty-state">

                    <div>
                        🕐
                    </div>

                    <h2>
                        No Search History
                    </h2>

                    <p>
                        Your previous job searches
                        will appear here.
                    </p>

                </div>

            ) : (

                <div className="history-list">

                    {history.map((item) => (

                        <article
                            className="history-card"
                            key={item.id}
                        >


                            {/* ICON */}

                            <div className="history-icon">

                                🔎

                            </div>


                            {/* INFORMATION */}

                            <div className="history-information">

                                <h3>

                                    {item.query ||
                                        "All Jobs"}

                                </h3>


                                <p>

                                    📍{" "}

                                    {item.location ||
                                        "Any Location"}

                                </p>


                                <small>

                                    {item.searched_at
                                        ? new Date(
                                            item.searched_at
                                        ).toLocaleString()
                                        : "Date unavailable"}

                                </small>

                            </div>


                            {/* ACTIONS */}

                            <div className="history-actions">


                                <button
                                    className="search-again-button"
                                    onClick={() =>
                                        searchAgain(item)
                                    }
                                >

                                    🔎 Search Again

                                </button>


                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteHistory(
                                            item.id
                                        )
                                    }
                                >

                                    🗑 Delete

                                </button>


                            </div>


                        </article>

                    ))}

                </div>

            )}


        </main>

    );

}


export default History;