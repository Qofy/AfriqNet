"use client"
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search movies..." }) {
  // Support controlled usage (pass `value` + `onChange`) or uncontrolled local state
  const [local, setLocal] = useState("");
  const isControlled = value !== undefined;
  const val = isControlled ? value : local;

  const handleChange = (e) => {
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
    </div>
  );
}