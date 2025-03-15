import { Pre } from "./Pre";

export function ProblemPanel({ question }) {
  return (
    <div className="h-full p-4 overflow-auto">
      <div className="h-full">
        <h2 className="text-3xl font-bold mb-4">Problem Statement:</h2>
        {question?.description ? (
          question.description.split("\\n").map((line, index) => {
            const trimmedLine = line.trim();
            const isHeading = trimmedLine
              .toLowerCase()
              .startsWith("output format");
            if (isHeading) {
              const parts = trimmedLine.split(":");
              return (
                <div className="mt-10" key={index}>
                  <h3 className="text-lg font-semibold mt-4">
                    {parts[0].trim() + " :"}
                  </h3>
                  <p className="mt-1">{parts[1].trim()}</p>
                </div>
              );
            } else {
              return <p key={index}>{trimmedLine}</p>;
            }
          })
        ) : (
          <p className="text-gray-500">Problem description will appear here.</p>
        )}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mt-4">Sample Testcase :</h3>
          <Pre text={question.sampleTestCase.input} />
          <h3 className="text-lg font-semibold mt-4">Expected Output :</h3>
          <Pre text={question.sampleTestCase.output} />
        </div>
      </div>
    </div>
  );
}
