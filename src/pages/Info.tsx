import Sidebar from "../components/sidebar";
import Colab from "../assets/colab.png";
import ColabConfig from "../assets/colab_config.png";
import ColabFinal from "../assets/colab_final.png";
import ColabUrl from "../assets/colab_trycloudflare.png";
import Url from "../assets/url.png";

export default function InfoPage() {
  return (
    <Sidebar>
      <div className="flex justify-center flex-col items-center gap-4">
        <h1 className="text-3xl text-purple-600">
          How can I run llms(GPT Like) locally ?
        </h1>
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="w-[32rem] flex flex-col justify-center items-center gap-8">
            <p className="text-base">
              For you to use the AI helper you will need to locally run an LLM
              model that has a drop-in replacement OpenAi API, this can be done
              in several ways, I will be showing the two easiest in my opinion.
              In the first the model will run locally on your PC and in the
              second we will run it on a colab notebook using oobabooga
            </p>
            <h1 className="text-xl text-purple-600">
              First, let’s go to the official “oobabooga” github:
            </h1>
            <p>
              First let s go to the official oobabooga github{" "}
              <a
                href="https://github.com/oobabooga/text-generation-webui"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-purple-700"
              >
                https://github.com/oobabooga/text-generation-webui
              </a>{" "}
              By scrolling down, you will find the Google Colab notebook link.
              Click on it:
            </p>
          </div>
          <img src={Colab} alt="google colab" width={800} height={800} />
          <div className="w-[32rem] flex flex-col justify-center items-center gap-8">
            <p>Now you will see in the screen something like this:</p>
          </div>
          <img src={ColabConfig} alt="google colab" width={1100} height={800} />
          <div className="w-[34rem] flex flex-col justify-center items-center gap-8">
            <p>
              In the “Launch the web UI section” you will see a field called
              <b> model_url:</b> NOW PAY ATTENTION, YOU HAVE TO USE A MODEL
              OTHER THAN https://huggingface.co/TheBloke/MythoMax-L2-13B-GPTQ, I
              recommend using the different model{" "}
              <b>
                https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GPTQ,
              </b>{" "}
              Just replace the <b>model_url:</b> from one to another.
            </p>
            <p>
              About the branch “command line flags”, you can leave it the way it
              is, but it’s VERY IMPORTANT that you check the <b>“API”</b>{" "}
              checkbox.
            </p>
            <p>In the end your colab should look something like this:</p>
          </div>
          <img src={ColabFinal} alt="google colab" width={1100} height={800} />
        </div>
        <div className="w-[32rem] flex flex-col justify-center items-center gap-8">
          <p>Just click the play icon (below the “Launch web UI”) to run.</p>
          <p>After a few minutes, you will see a screen like this:</p>
        </div>
        <img src={ColabUrl} alt="google colab" width={1100} height={800} />
        <div className="w-[32rem] flex flex-col justify-center items-center gap-8">
          <p>
            Now, all you need to do is copy the url that was generated, with the
            “trycloudflare” end, and put it in the config tab shown below:
          </p>
        </div>
        <img src={Url} alt="google colab" width={1100} height={800} />
        <div className="w-[32rem] flex flex-col justify-center items-center gap-8">
          <p>Now you are ready to use the application! Enjoy! :)</p>
        </div>
      </div>
    </Sidebar>
  );
}
