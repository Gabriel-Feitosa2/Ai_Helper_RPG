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
  action: string;
  theme: string;
  element: string;
  question: string;
}

function ChooseYourOwnHistory() {
  const { configs, firstOpen, setFirstOpen } = useConfigContext();

  const [response, setReponse] = useState<any>();
  const [parameters, setParameters] = useState({
    setting: "",
    worldInfo: "",
    action: "Random",
    theme: "Random",
    element: "Random",
    question: "",
  } as ParametersProps);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalConfig, setModalConfig] = useState(firstOpen);
  const [disabledButton, setDisabledButton] = useState(false);

  const GenerateResponse = async () => {
    setDisabledButton(true);
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      Title: "The Title of the adveture",
      Adventure_summary: "The summary of the adventure",
      Adventure_beginning:
        "the detailed story of the adventure and what the party encounters at the beginning of the adventure",
      Adventure_middle:
        "the detailed story of the adventure and what the party encounters at the middle of the adventure",
      Adventure_finale:
        "the detailed story of the adventure and what the party encounters at the finale of the adventure",
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
        action:
          parameters.action === "Random"
            ? getRandomString(actions)
            : parameters.action,
        theme:
          parameters.theme === "Random"
            ? getRandomString(themes)
            : parameters.theme,
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
          GenerateResponse();
        }
      } else {
        GenerateResponse();
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
              onChange={(e) =>
                setParameters((parameters) => ({
                  ...parameters,
                  action: e.target.value,
                }))
              }
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
              Themes
            </label>
            <select
              id="default"
              className="bg-neutral-800 border border-black mb-6 text-sm rounded-lg focus:bg-neutral-800 focus:border-blue-500 block w-38 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-800 dark:focus:border-red-800"
              onChange={(e) =>
                setParameters((parameters) => ({
                  ...parameters,
                  theme: e.target.value,
                }))
              }
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
        <div className="bg-neutral-800 min-w-[48rem] min-h-[5rem] max-w-[48rem]  rounded-md p-4 "></div>
        <button
          onClick={() => GenerateResponse()}
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
            <div>
              <label className="block mb-2 text-sm font-medium text-center dark:text-white">
                The Setting of the Community
              </label>
              <input
                type="text"
                placeholder="Setting"
                className="h-10 p-2 bg-neutral-900 rounded w-full"
                onChange={(e) =>
                  setParameters((parameters) => ({
                    ...parameters,
                    setting: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div className="flex flex-col gap-4">
              <textarea
                id="textarea"
                name="textarea"
                rows={8}
                cols={50}
                className="bg-neutral-900 p-2 resize-none"
                placeholder="Tell a little about the setting and the world in which the adventure takes place"
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

export default ChooseYourOwnHistory;
