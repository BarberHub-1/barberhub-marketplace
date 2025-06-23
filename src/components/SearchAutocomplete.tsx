import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchAutocompleteProps {
  type: 'search' | 'location';
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder: string;
  suggestions: string[];
}

const SearchAutocomplete = ({
  type,
  value,
  onChange,
  onSelect,
  placeholder,
  suggestions
}: SearchAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Icon = type === 'search' ? Search : MapPin;

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Icon size={18} className="absolute left-3 text-barber-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full py-3 pl-10 pr-4 bg-transparent text-barber-900 placeholder-barber-400 outline-none"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-barber-50 text-barber-900 text-sm"
              onClick={() => {
                onSelect(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete; 