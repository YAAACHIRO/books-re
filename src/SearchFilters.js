// 2. Search Component (SearchFilters.js)
import { useBookContext } from './context';

export const SearchFilters = () => {
  const { filters, setFilters } = useBookContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-filters">
      <div className="filter-group">
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Book title..."
        />
      </div>

      <div className="filter-group">
        <input
          type="text"
          name="author"
          value={filters.author}
          onChange={handleChange}
          placeholder="Author name..."
        />
      </div>

      <div className="filter-group">
        <input
          type="text"
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          placeholder="Genre..."
        />
      </div>

      <div className="filter-group year-filter">
        <select 
          name="yearType" 
          value={filters.yearType}
          onChange={handleChange}
        >
          <option value="exact">Published in</option>
          <option value="before">Published before</option>
          <option value="after">Published after</option>
        </select>
        <input
          type="number"
          name="year"
          value={filters.year}
          onChange={handleChange}
          placeholder="Year"
          min="1800"
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  );
};