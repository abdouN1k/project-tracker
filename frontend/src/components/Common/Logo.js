import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xl font-extrabold text-red-600 tracking-tight leading-none">
        CoSider Agrico
      </span>
      <span className="text-xs font-semibold text-green-700 tracking-wider">
        Unité Espaces Verts
      </span>
    </div>
  );
};

export default Logo;
