const axios = require("axios");
const { EXECUTION_URL } = require("../config");

async function executeCode(language, version, code, input = "") {
  try {
    const response = await axios.post(
      EXECUTION_URL,
      {
        language,
        version,
        files: [
          {
            name: "main.cpp",
            content: code,
          },
        ],
        stdin: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await response.data;
  } catch (error) {
    throw new Error(`Error executing code: ${error}`);
  }
}

module.exports = { executeCode };
