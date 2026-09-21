import { useState } from "react";


function SearchBar({
  onSearch,
  loading
}) {

  const [query, setQuery] =
    useState("Python Developer");


  const [location, setLocation] =
    useState("Hyderabad");


  const handleSubmit = (event) => {

    event.preventDefault();


    if (!query.trim()) {

      return;

    }


    onSearch(
      query,
      location
    );

  };


  return (

    <form
      className="search-form"
      onSubmit={handleSubmit}
    >


      <div className="search-input">

        <span>🔎</span>

        <input
          type="text"
          placeholder="Job title, skills or keyword"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

      </div>


      <div className="search-input">

        <span>📍</span>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        />

      </div>


      <button
        type="submit"
        disabled={loading}
        className="search-button"
      >

        {loading
          ? "Searching..."
          : "Search Jobs"}

      </button>


    </form>

  );

}


export default SearchBar;