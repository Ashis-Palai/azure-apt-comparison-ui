export function Button({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={`p-2 bg-blue-500 text-white rounded ${className}`}>
      {children}
    </button>
  );
}
