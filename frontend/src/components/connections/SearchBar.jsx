const SearchBar = ({ value, onChange, placeholder = "Search by username..." }) => {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-sm py-sm text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/25"
      />
    </div>
  );
};

export default SearchBar;
