import { useState } from "react";
import { actions, themes } from "../utils/tables";
import { getRandomString } from "../utils/random";
import { RunnableSequence } from "langchain/runnables";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import Sidebar from "../components/sidebar";
import { Modal } from "@mui/material";
import ConfigModal from "../components/configModal";
import { useConfigContext } from "../context/configcontext";

interface ParametersProps {
  setting: string;
  worldInfo: string;
}

function AdventureGenerator() {
  const { configs, firstOpen, setFirstOpen } = useConfigContext();

  const [response, setReponse] = useState<any>();
  const [parameters, setParameters] = useState({} as ParametersProps);
  const [action, setAction] = useState("Random");
  const [theme, setTheme] = useState("Random");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalConfig, setModalConfig] = useState(firstOpen);
  const [disabledButton, setDisabledButton] = useState(false);

  const teste = async () => {
    setDisabledButton(true);
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      Title: "The Title of the adveture",
      Adventure_summary: "The summary of the adventure",
      Adventure_details:
        "the detailed story of the adventure as well as the objectives ",
      Plot_twist: "A Plot twist in the end of the adveture",
    });

    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        `You are a assistant made to help create tabletop RPG adventures, make a RPG adventure with this world build info in mind {world_info}. use the following structure.
     {format_instructions} use the following setting: {setting} and the following theme: {action} and {theme}, RESPOND ONLY WITH THE JSON
      `
      ),
      new OpenAI({
        temperature: 0.9,
        openAIApiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
        maxTokens: -1,
        configuration: {
          baseURL: `${configs.openAiUrl.trim()}/v1`,
        },
      }),
      parser,
    ]);

    try {
      setLoading(true);
      const responseData: any = await chain.invoke({
        setting: parameters.setting,
        action: action === "Random" ? getRandomString(actions) : action,
        theme: theme === "Random" ? getRandomString(themes) : theme,
        format_instructions: parser.getFormatInstructions(),
        world_info: parameters.worldInfo,
      });
      console.log({ responseData });
      setReponse({ responseData });
      setLoading(false);
      setDisabledButton(false);
    } catch (error) {
      console.log(error);
      const errorReponse = error as string;
      const match = String(errorReponse).match(/\{([^}]+)\}/);
      console.log(match);
      if (match) {
        // Obter a substring entre as chaves
        const jsonSubstring = match[0];

        // Converter a substring em um objeto JSON
        try {
          const responseData = JSON.parse(jsonSubstring);
          console.log("consertado: ", responseData);
          setReponse({ responseData });
          setDisabledButton(false);
          setLoading(false);
        } catch {
          teste();
        }
      } else {
        teste();
      }
    }
  };

  console.log(response);
  console.log(configs);

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
        <div className="flex gap-[9rem] ">
          <div>
            <label className="block mb-2 text-sm font-medium text-center dark:text-white">
              Actions
            </label>
            <select
              id="default"
              className="bg-neutral-800 border border-black mb-6 text-sm rounded-lg focus:bg-neutral-800 focus:border-blue-500 block w-38 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-800 dark:focus:border-red-800"
              onChange={(e) => setAction(e.target.value)}
            >
              <option selected value="Random">
                Random
              </option>
              {actions.map((action, index) => (
                <option value={action} key={index}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-center dark:text-white">
              The Setting of the adventure
            </label>
            <input
              type="text"
              placeholder="Setting"
              className="h-10 p-2 bg-neutral-800 rounded"
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
              Themes
            </label>
            <select
              id="default"
              className="bg-neutral-800 border border-black mb-6 text-sm rounded-lg focus:bg-neutral-800 focus:border-blue-500 block w-38 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-800 dark:focus:border-red-800"
              onChange={(e) => setTheme(e.target.value)}
            >
              <option selected value="Random">
                Random
              </option>
              {themes.map((theme, index) => (
                <option value={theme} key={index}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-neutral-800 min-w-[48rem] min-h-[5rem] max-w-[48rem]  rounded-md p-4 ">
          <div className="whitespace-pre-wrap">
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
            {response && !loading && (
              <div>
                <p>
                  <b>Title: </b>
                  {response?.responseData.Title}
                </p>
                <br />
                <p>
                  <b>Adventure Summary: </b>
                  {response?.responseData.Adventure_summary}
                </p>
                <br />
                <p>
                  <b>Adventure Details: </b>
                  {response?.responseData.Adventure_details}
                </p>
                <br />
                <p>
                  <b>Plot Twist: </b> {response?.responseData.Plot_twist}
                </p>
                <br />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => teste()}
          className="bg-fuchsia-950 rounded p-2 h-12 mt-4 disabled:opacity-60"
          disabled={disabledButton}
        >
          Generate Adventure
        </button>
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
            <textarea
              id="textarea"
              name="textarea"
              rows={8}
              cols={50}
              className="bg-neutral-900 p-2 resize-none"
              placeholder="Tell a little about the setting and the world in which the
                adventure takes place"
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
      </Modal>
      <ConfigModal
        openModal={modalConfig}
        onClose={() => {
          setModalConfig(false), setFirstOpen(false);
        }}
      />
    </Sidebar>
  );
}

export default AdventureGenerator;
