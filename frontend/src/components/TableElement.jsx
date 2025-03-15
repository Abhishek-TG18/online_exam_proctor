export function TableElement({ text, className = "" }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      <div className="text-xs sm:text-sm text-gray-900 text-center">{text}</div>
    </td>
  );
}
