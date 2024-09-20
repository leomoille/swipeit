import React from "react";

type ButtonProps = {
  onClick: () => void; // Fonction appelée lors du clic
  label: string; // Texte du bouton
  icon?: React.ReactNode; // Optionnel : Icône
};

export default function Button({ onClick, label, icon }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg sm:text-xl rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
    >
      {icon && <span className="mr-2">{icon}</span>}{" "}
      {/* Affiche l'icône si elle est présente */}
      {label}
    </button>
  );
}
