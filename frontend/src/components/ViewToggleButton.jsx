import { useRecoilState } from "recoil";
import { viewAtom } from "../store/atoms/atoms";

export function ViewToggleButton({ text, context }) {
  const [view, setView] = useRecoilState(viewAtom);
  return (
    <button
      className={`py-1 px-4 border rounded-md transition duration-300 ${
        view === context
          ? "bg-green-500 text-white border-green-500"
          : "bg-gray-50 text-green-500 border-green-500 hover:bg-gray-100"
      }`}
      onClick={() => setView(context)}
    >
      {text}
    </button>
  );
}
