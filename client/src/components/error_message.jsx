import React, { useEffect, useState } from 'react';

export default function Error_Message({ message, setVisible }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // 🌀 Start fade out
      setTimeout(() => {
        setVisible(false); // 🔥 After fade-out finishes, remove from screen
      }, 500); // 500ms = how long the fade out animation lasts
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute bg-red-600 rounded-lg shadow-lg w-[30vw] text-white h-[20] top-15 right-2 z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Modal header */}
      <div className="flex items-center justify-between p-4 rounded-t">
        <p className="text-white text-lg font-bold">Error: {message}</p>
      </div>
    </div>
  );
}
