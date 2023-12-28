import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/runnables";
import { actions, themes } from "../utils/tables";
import { getRandomString } from "../utils/random";

export const AdventureGeneratorWorker = async ({
  openAiUrl,
  setting,
  action,
  theme,
  worldInfo,
}: any) => {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    Title: "The Title of the adveture",
    Adventure_summary: "The summary of the adventure",
    adventure_details:
      "the detailed story of the adventure as well as the objectives ",
    Plot_twist: "A Plot twist in the end of the adveture",
  });
  const model = new OpenAI({
    temperature: 0.9,
    openAIApiKey: "YOUR-API-KEY",
    maxTokens: -1,
    configuration: {
      baseURL: `${openAiUrl.trim()}/v1`,
    },
  });
  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `You are a assistant made to help create tabletop RPG adventures, make a RPG adventure with this world build info in mind {world_info}. use the following structure.
     {format_instructions} use the following setting: {setting} and the following theme: {action} and {theme}, RESPOND ONLY WITH THE JSON
      `
    ),
    model,
    parser,
  ]);
  const response = async () => {
    try {
      const responseData: any = await chain.invoke({
        setting: setting,
        action: action === "Random" ? getRandomString(actions) : action,
        theme: theme === "Random" ? getRandomString(themes) : theme,
        format_instructions: parser.getFormatInstructions(),
        world_info: worldInfo,
      });
      console.log(responseData);
      return responseData.json({ responseData });
    } catch (error: any) {
      console.log(error);
      const errorReponse = error as string;
      const match = String(errorReponse).match(/\{([^}]+)\}/);

      if (match) {
        const jsonSubstring = match[0];

        try {
          const responseData = JSON.parse(jsonSubstring);
          console.log(responseData);
          return responseData.json({ responseData });
        } catch {
          response();
        }
      } else {
        response();
      }
    }
  };

  response();
};
