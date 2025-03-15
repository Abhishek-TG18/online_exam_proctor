export function Pre({ text, color }) {
  return (
    <pre
      className={`p-2 bg-gray-100 mt-2 border border-gray-200 rounded-md text-sm whitespace-pre-wrap pr-10 ${
        color ? "text-red-500" : "text-black"
      }`}
    >
      {text}
    </pre>
  );
}
