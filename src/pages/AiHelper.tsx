import { useState } from "react";
import { actions, elements, themes } from "../utils/tables";
import { getRandomString } from "../utils/random";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import Sidebar from "../components/sidebar";
import { Modal } from "@mui/material";
import ConfigModal from "../components/configModal";
import { useConfigContext } from "../context/configcontext";
import { LLMChain } from "langchain/chains";

interface ParametersProps {
  setting: string;
  worldInfo: string;
  action: string;
  theme: string;
  element: string;
  question: string;
}

function AiHelper() {
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

  const teste = async () => {
    setDisabledButton(true);

    const prompt = PromptTemplate.fromTemplate(
      `You are an assistant made to help an RPG master answer his questions. 
        Answer the question and be objective in your answer. 
        Take into account a {setting} setting and the this world info: {world_info}. 
        answer the question with a history with the following Elements: {action}, {theme}, {element}.  
        Combine the themes to create the answers. Be objective and don't say what could happen/could happen, say what happens and what happens. the answer will be a hook for some adventure The question is {question}
      `
    );

    const model = new OpenAI({
      temperature: 0.9,
      openAIApiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
      maxTokens: -1,
      configuration: {
        baseURL: `${configs.openAiUrl.trim()}/v1`,
      },
    });

    const chain = new LLMChain({ llm: model, prompt });

    try {
      setLoading(true);
      const responseData: any = await chain.call({
        setting: parameters.setting,
        action:
          parameters.action === "Random"
            ? getRandomString(actions)
            : parameters.action,
        theme:
          parameters.theme === "Random"
            ? getRandomString(themes)
            : parameters.theme,
        element:
          parameters.element === "Random"
            ? getRandomString(themes)
            : parameters.theme,

        world_info: parameters.worldInfo,
        question: parameters.question,
      });
      console.log({ responseData });
      setReponse({ responseData });
      setLoading(false);
      setDisabledButton(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar>
      <div className="w-full justify-center items-center flex  flex-col">
        <div className="flex flex-col">
          <div className="flex flex-col mb-4">
            <label className="block mb-2 text-sm font-medium text-center dark:text-white">
              The Setting of the adventure
            </label>
            <input
              type="text"
              placeholder="Setting"
              className="h-10 p-2 bg-neutral-800 rounded "
              onChange={(e) =>
                setParameters((parameters) => ({
                  ...parameters,
                  setting: e.target.value,
                }))
              }
            ></input>
          </div>
          <div className="flex justify-between">
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
            <div>
              <label className="block mb-2 text-sm font-medium text-center dark:text-white">
                Elements
              </label>
              <select
                id="default"
                className="bg-neutral-800 border border-black mb-6 text-sm rounded-lg focus:bg-neutral-800 focus:border-blue-500 block w-38 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-800 dark:focus:border-red-800"
                onChange={(e) =>
                  setParameters((parameters) => ({
                    ...parameters,
                    element: e.target.value,
                  }))
                }
              >
                <option selected value="Random">
                  Random
                </option>
                {elements.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="whitespace-pre-wrap">
              <div className="flex flex-col gap-4">
                <textarea
                  id="textarea"
                  name="textarea"
                  rows={8}
                  cols={80}
                  className="bg-neutral-800 p-2 resize-none rounded"
                  placeholder={`Give a little context about the question, if for example it's a question like "what's in that tarvena" talk a little about the city or kingdom that tarvena is in`}
                  value={parameters.worldInfo}
                  onChange={(e) =>
                    setParameters((parameters) => ({
                      ...parameters,
                      worldInfo: e.target.value,
                    }))
                  }
                ></textarea>
                <textarea
                  id="textarea"
                  name="textarea"
                  rows={8}
                  cols={80}
                  className="bg-neutral-800 p-2 resize-none rounded"
                  placeholder="Tell a little about the setting and the world in which the adventure takes place"
                  value={parameters.question}
                  onChange={(e) =>
                    setParameters((parameters) => ({
                      ...parameters,
                      question: e.target.value,
                    }))
                  }
                ></textarea>
                <div className="bg-neutral-800 min-w-[48rem] min-h-[5rem] max-w-[48rem]  rounded-md p-4 ">
                  {loading ? (
                    <div
                      role="status"
                      className="flex justify-center items-center"
                    >
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
                  ) : (
                    <p className="text-white">{response?.responseData?.text}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => teste()}
              className="bg-fuchsia-950 rounded p-2 h-12 mt-4 disabled:opacity-60 w-48"
              disabled={disabledButton}
            >
              Generate Response
            </button>
          </div>
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

export default AiHelper;
