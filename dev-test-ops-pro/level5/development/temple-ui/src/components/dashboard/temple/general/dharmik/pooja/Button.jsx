import React from "react";

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
