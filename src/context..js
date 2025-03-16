import React, { useState, useContext, useEffect } from 'react';
import { useCallback } from 'react';

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("the lost world");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const encodedSearch = encodeURIComponent(searchTerm);
            const response = await fetch(
                `https://openlibrary.org/search.json?title=${encodedSearch}&fields=key,author_name,cover_i,edition_count,first_publish_year,title,subject`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const { docs } = data;

            if (docs && docs.length > 0) {
                const newBooks = docs.slice(0, 20).map((bookSingle) => {
                    const { key, author_name, cover_i, edition_count, first_publish_year, title, subject } = bookSingle;

                    return {
                        id: key,
                        author: author_name || ["Unknown Author"],
                        cover_id: cover_i,
                        edition_count: edition_count || 0,
                        first_publish_year: first_publish_year || "Unknown Year",
                        title: title || "Untitled",
                        subject: subject || []
                    };
                });

                setBooks(newBooks);
                setResultTitle(`Found ${newBooks.length} results for "${searchTerm}"`);
            } else {
                setBooks([]);
                setResultTitle(`No results found for "${searchTerm}"`);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            setResultTitle("Search failed - please try again");
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks();
        }, 500); // Add debounce to prevent rapid API calls

        return () => clearTimeout(timer);
    }, [searchTerm, fetchBooks]);

    return (
        <AppContext.Provider value={{
            loading,
            books,
            setSearchTerm,
            resultTitle,
            error,
            setResultTitle,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider }; 