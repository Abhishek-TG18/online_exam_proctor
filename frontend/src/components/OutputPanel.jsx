import { useRecoilValue } from "recoil";
import { viewAtom } from "../store/atoms/atoms";
import { ViewToggleButton } from "./ViewToggleButton";
import { TestcaseView } from "./TestcaseView";
import { TestResultView } from "./TestResultView";

export function OutputPanel() {
  const view = useRecoilValue(viewAtom);

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="ml-1 mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <ViewToggleButton
            text={"Testcase"}
            context={"testcase"}
            key={"testcase"}
          />
          <ViewToggleButton
            text={"Test Result"}
            context={"testresult"}
            key={"testresult"}
          />
        </div>
      </div>

      {view === "testcase" ? <TestcaseView /> : <TestResultView />}
    </div>
  );
}
