"use client"
import { Search } from "lucide-react";
import { useState, FC, ChangeEvent } from "react";
import { useSearchContent } from "@/features/contentBrowserSlice";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  enableGlobalSearch?: boolean;
  contentType?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search movies...",
  enableGlobalSearch = false,
  contentType = 'all'
}) => {
  // Support controlled usage (pass `value` + `onChange`) or uncontrolled local state
  const [local, setLocal] = useState("");
  const isControlled = value !== undefined;
  const val = isControlled ? value : local;

  // Use global search if enabled
  const { data: globalResults = [] } = useSearchContent(
    enableGlobalSearch && val ? val : "",
    contentType
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    if (isControlled) {
      if (typeof onChange === 'function') onChange(v);
    } else {
      setLocal(v);
      if (typeof onChange === 'function') onChange(v);
    }
  };

  return (
    <div className="relative mt-6 max-w-lg">
      <input
        type="text"
        placeholder={placeholder}
        value={val}
        onChange={handleChange}
        className="w-full px-5 py-3 pr-12 rounded-lg bg-white/10 text-white placeholder-[#a2cbf9] border border-[#a2cbf9]/30 focus:outline-none focus:ring-2 focus:ring-[#006eeb]"
      />
      <Search
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a2cbf9]"
        size={18}
      />

      {enableGlobalSearch && globalResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-[#a2cbf9]/30 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {globalResults.slice(0, 5).map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-[#a2cbf9]/10 cursor-pointer text-[#a2cbf9] text-sm"
            >
              {result.title || result.name}
            </div>
          ))}
          {globalResults.length > 5 && (
            <div className="px-4 py-2 text-center text-[#a2cbf9]/60 text-xs">
              +{globalResults.length - 5} more results
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;