export function InputBox({ text, type, value, setter }) {
  return (
    <div>
      <label htmlFor={text} className="block text-sm font-medium text-gray-700">
        {text}
      </label>
      <input
        id={text}
        type={type}
        required
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:border-b-2 focus:border-green-500 sm:text-sm bg-transparent border-b border-gray-300"
      />
    </div>
  );
}
