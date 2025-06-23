import React from 'react';

export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      <span className="ml-3 text-gray-600">Carregando...</span>
    </div>
  );
} 