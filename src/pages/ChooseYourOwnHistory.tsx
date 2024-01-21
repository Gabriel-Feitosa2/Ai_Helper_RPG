import { useEffect, useState } from "react";
import { actions, elements, positiveOrNegative, themes } from "../utils/tables";
import { getRandomString } from "../utils/random";

import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import Sidebar from "../components/sidebar";
import { Modal } from "@mui/material";

import { useConfigContext } from "../context/configcontext";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { useNavigate } from "react-router-dom";

interface ParametersProps {
  setting: string;
  worldInfo: string;
  community_Society: string;
  action: string;
  theme: string;
  element: string;
  question: string;
  alignmentAxes1: string;
  alignmentAxes2: string;
}

interface ResponseData {
  responseData: {
    difficulties: string;
    solution1: string;
    solutionPositive1: string;
    solutionNegative1: string;
    solution2: string;
    solutionPositive2: string;
    solutionNegative2: string;
    solutionChosse?: string;
  };
}

interface ResponseProps {
  data: ResponseData;
  from: string;
  solution?: string;
  resolution?: string;
  summary?: string;
}

function ChooseYourOwnHistory() {
  const { configs } = useConfigContext();

  const [responseCurrent, setResponseCurrent] = useState<ResponseProps>();
  const [responseHistory, setResponseHistory] = useState<ResponseProps[]>([]);
  const [parameters, setParameters] = useState({
    setting: "",
    worldInfo: "",
    community_Society: "",
    action: "Random",
    theme: "Random",
    element: "Random",
    question: "",
    alignmentAxes1: "",
    alignmentAxes2: "",
  } as ParametersProps);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(true);
  const [count, setCount] = useState(1);
  const [error, setError] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  const navigate = useNavigate();

  // const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setParameters((parameters) => ({
  //     ...parameters,
  //     alignmentAxes1: event.target.value,
  //   }));
  // };

  // const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setParameters((parameters) => ({
  //     ...parameters,
  //     alignmentAxes2: event.target.value,
  //   }));
  // };

  const GenerateResponse = async () => {
    if (!configs.openAiUrl) {
      setError(true);
      return;
    }
    setError(false);
    setModal(false);
    setDisabledButton(true);
    setLoading(true);
    const model = new OpenAI({
      temperature: 0.9,
      openAIApiKey: "null",
      maxTokens: -1,
      configuration: { baseURL: `${configs.openAiUrl.trim()}/v1` },
    });

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      difficulties:
        "describes some catastrophe, war, political situation etc... that happens in the setting",
      solution1: `a possible solution to the difficulties, `,
      solutionPositive1: "a positive result from the solution1",
      solutionNegative1: "a negative solution from the solution1",
      solution2: "a possible solution to the difficulties",
      solutionPositive2: "a positive result from the solution2",
      solutionNegative2: "a negative result from the solution2",
    });

    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory: memory });

    try {
      const res1 = await chain.call({
        input: `let's play a game, I will describe a Community/Society such as a medieval kingdom, an exploring spaceship, a space colony etc..., and you will describe a scenario of difficultie and two possible solutions considering the previous scenarios, I will choose the scenario and I will talk about whether there will be a positive, negative or ambiguous result. use the following structure.
     ${parser.getFormatInstructions()}. Be objective in your answers, never saying if. For the difficultie, generates based on the following elements, action: ${getRandomString(
          actions
        )}, theme: ${getRandomString(themes)} element: ${getRandomString(
          elements
        )} .The setting is ${parameters.setting} and Community/Society is: ${
          parameters.community_Society
        }. ${
          parameters.worldInfo
            ? `here is some information about the world: ${parameters.worldInfo}`
            : ""
        }. ${
          parameters.alignmentAxes1 && parameters.alignmentAxes2
            ? `based on the D&D alignment structure, make solutions based only on this alignment: ${parameters.alignmentAxes1} ${parameters.alignmentAxes2}`
            : ""
        }. RESPOND ONLY WITH THE JSON`,
      });
      const match = String(res1.response).match(/\{([^}]+)\}/);
      if (match) {
        const jsonSubstring = match[0];
        const responseData = JSON.parse(jsonSubstring);

        setResponseCurrent({ data: { responseData }, from: "IA" });
        setLoading(false);
      } else {
        GenerateResponse();
      }
    } catch (error) {
      console.log(error);
      GenerateResponse();
    }
  };

  const ChosseOne = (
    data: ResponseData,
    solution: string,
    solution1: boolean
  ) => {
    const getPositiveOrNegative = () => {
      if (solution1) {
        return getRandomString(positiveOrNegative) === "positive"
          ? data.responseData.solutionPositive1
          : data.responseData.solutionNegative1;
      } else {
        return getRandomString(positiveOrNegative) === "positive"
          ? data.responseData.solutionPositive2
          : data.responseData.solutionNegative2;
      }
    };

    setResponseHistory([
      ...responseHistory,
      { data: data, from: "AI" },
      { data: data, from: "USER", solution: solution },
      { data: data, from: "AI", resolution: getPositiveOrNegative() },
    ]);
    setResponseCurrent(undefined);
    setCount(count + 1);
    if (count <= 4) {
      GenerateResponse();
    }
  };

  const genereteSummary = async () => {
    setLoading(true);
    let summaryData = "";
    responseHistory.map((log) => {
      if (log.resolution) {
        summaryData += " resolution: " + log.resolution;
      } else if (log.solution) {
        summaryData += " solution: " + log.solution;
      } else {
        summaryData.concat(
          " difficultie: ",
          log.data.responseData.difficulties
        );
        summaryData += " difficultie: " + log.data.responseData.difficulties;
      }
    });

    const model = new OpenAI({
      temperature: 0.9,
      openAIApiKey: "null",
      maxTokens: -1,
      configuration: { baseURL: `${configs.openAiUrl.trim()}/v1` },
    });
    const res = await model.call(
      `Are you a writer of stories like Tolkien, George R. R. Martin
and other fantasy and science fiction writers. I'm going to describe a series of scenarios, put all these stories together to create a cohesive story. here are the scenarios: ${summaryData}. Respond as if you were telling an epic tale`
    );
    // setSummary(res);
    setResponseHistory([
      ...responseHistory,
      {
        data: responseHistory[1].data,
        from: "AI",
        summary: res,
      },
    ]);
    setLoading(false);
    setDisabledButton(false);
    setCount(1);
  };

  useEffect(() => {
    if (count >= 6) {
      genereteSummary();
    }
  }, [count]);

  return (
    <Sidebar>
      <div className="w-full flex justify-center items-center flex-col">
        <div className="flex items-center justify-between w-full">
          <div>
            {/* <IconButton onClick={() => setModalConfig(true)}>
              <SettingsIcon className="fill-white" />
            </IconButton> */}
          </div>
          <div>
            <button
              onClick={() => setModal(true)}
              className="bg-fuchsia-950 rounded p-2 h-12"
            >
              World/Setting Info
            </button>
          </div>
        </div>
        <div className="mb-12">
          <h1 className="font-extrabold text-3xl">Choose Your Own History</h1>
        </div>
        <div className="bg-neutral-800 min-w-[32rem] min-h-[5rem] w-[60%] h-[34rem] rounded-md p-4 overflow-auto">
          {responseHistory.map((response) => {
            return (
              <>
                {" "}
                <div
                  className={`flex ${
                    response.from === "AI" ? "justify-end" : ""
                  } w-full mb-4`}
                >
                  <p
                    className={`${
                      response.from === "AI" ? "bg-gray-600" : "bg-green-500"
                    } ${
                      response.summary ? "max-w-96" : "max-w-64"
                    } rounded-md p-2`}
                  >
                    {response.summary
                      ? response.summary
                      : response.resolution
                      ? response.resolution
                      : response.from === "AI"
                      ? response.data.responseData.difficulties
                      : response.solution}
                  </p>
                </div>
              </>
            );
          })}
          {responseCurrent && (
            <>
              <div className="flex justify-end w-full mb-4">
                <p
                  className={`${
                    responseCurrent.from === "IA"
                      ? "bg-gray-600"
                      : "bg-green-500"
                  } max-w-64 rounded-md p-2`}
                >
                  {responseCurrent.data.responseData.difficulties}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 ">
                <div>
                  <h1 className="font-bold mb-8">Chosse one</h1>
                </div>
                <div className="flex items-center gap-8 justify-around w-full">
                  <p
                    className="bg-gray-600 max-w-64 rounded-md p-2 cursor-pointer hover:bg-gray-700"
                    onClick={() =>
                      ChosseOne(
                        responseCurrent.data,
                        responseCurrent.data.responseData.solution1,
                        true
                      )
                    }
                  >
                    {responseCurrent.data.responseData.solution1}
                  </p>
                  <p
                    className="bg-gray-600 max-w-64 rounded-md p-2 cursor-pointer hover:bg-gray-700"
                    onClick={() =>
                      ChosseOne(
                        responseCurrent.data,
                        responseCurrent.data.responseData.solution2,
                        false
                      )
                    }
                  >
                    {responseCurrent.data.responseData.solution2}
                  </p>
                </div>
              </div>
            </>
          )}
          {/* {summary && (
            <div className={"flex justify-endw-full mb-4"}>
              <p className={"bg-gray-600 max-w-96 rounded-md p-2"}>{summary}</p>
            </div>
          )} */}
          {loading && (
            <div role="status" className="flex justify-center items-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-fuchsia-950"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className="absolute top-2/4 left-2/4 bg-neutral-800 p-4 rounded-lg border border-neutral-800"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-center dark:text-white">
                    Setting
                  </label>
                  <input
                    type="text"
                    placeholder="medieval fantasy, sci fi, etc..."
                    className="min-w-64 h-10 p-2 bg-neutral-900 rounded"
                    value={parameters.setting}
                    onChange={(e) =>
                      setParameters((parameters) => ({
                        ...parameters,
                        setting: e.target.value,
                      }))
                    }
                  ></input>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-center dark:text-white">
                    Community/Society
                  </label>
                  <input
                    type="text"
                    placeholder="Dwarf kingdom, space colony,rebel group "
                    className="min-w-72 h-10 p-2 bg-neutral-900 rounded w-full"
                    value={parameters.community_Society}
                    onChange={(e) =>
                      setParameters((parameters) => ({
                        ...parameters,
                        community_Society: e.target.value,
                      }))
                    }
                  ></input>
                </div>
              </div>
            </div>
            {/* <div className="flex justify-between items-center gap-4">
              <div className="w-full bg-white h-[1px]"></div>
              <p>Alignment(optional)</p>
              <div className="w-full bg-white h-[1px]"></div>
            </div> */}

            {/* <FormControl component="fieldset">
              <RadioGroup
                aria-label="grupo1"
                name="grupo1"
                value={parameters.alignmentAxes1}
                onChange={handleChange1}
              >
                <div className="flex justify-between items-center">
                  <FormControlLabel
                    value="Lawful"
                    control={<Radio />}
                    label="Lawful"
                  />
                  <FormControlLabel
                    value="Neutral"
                    control={<Radio />}
                    label="Neutral"
                  />
                  <FormControlLabel
                    value="Chaotic"
                    control={<Radio />}
                    label="Chaotic"
                  />
                </div>
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <RadioGroup
                aria-label="grupo2"
                name="grupo2"
                value={parameters.alignmentAxes2}
                onChange={handleChange2}
              >
                <div className="flex justify-between items-center ">
                  <FormControlLabel
                    value="Good"
                    control={<Radio />}
                    label="Good"
                  />
                  <FormControlLabel
                    value="Neutral"
                    control={<Radio />}
                    label="Neutral"
                  />
                  <FormControlLabel
                    value="Evil"
                    control={<Radio />}
                    label="Evil"
                  />
                </div>
              </RadioGroup>
            </FormControl> */}

            <div className="flex flex-col gap-4">
              <textarea
                id="textarea"
                name="textarea"
                rows={8}
                cols={50}
                className="bg-neutral-900 p-2 resize-none"
                placeholder="Tell a little about the setting and the world in which the Community takes place"
                value={parameters.worldInfo}
                onChange={(e) =>
                  setParameters((parameters) => ({
                    ...parameters,
                    worldInfo: e.target.value,
                  }))
                }
              ></textarea>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-8">
            <button
              onClick={() => {
                GenerateResponse();
              }}
              className="bg-fuchsia-900 rounded p-2 h-12 mt-4 disabled:opacity-60 hover:bg-fuchsia-950"
              disabled={disabledButton}
            >
              Generate History
            </button>
          </div>
          <div className="flex items-center justify-center mt-2">
            {error && (
              <p className="text-red-600">
                You need to enter a URL in configs,{" "}
                <b
                  onClick={() => navigate("/info")}
                  className="cursor-pointer underline hover:text-red-700"
                >
                  click here to set up a url
                </b>
              </p>
            )}
          </div>
        </div>
      </Modal>
    </Sidebar>
  );
}

export default ChooseYourOwnHistory;
