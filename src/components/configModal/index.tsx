import { IconButton, Modal } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useConfigContext } from "../../context/configcontext";
import { useNavigate } from "react-router-dom";

interface ConfigModalProps {
  openModal: boolean;
  onClose: () => void;
}

function ConfigModal({ openModal, onClose }: ConfigModalProps) {
  const { configs, setConfigs } = useConfigContext();

  const navigate = useNavigate();

  return (
    <Modal
      open={openModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        className="absolute top-2/4 left-2/4 bg-neutral-800 p-8 rounded-lg border border-neutral-800"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-2">
            <label className="block mb-2 text-lg font-medium text-center dark:text-white">
              Config the URL endpoints or OpenAI key
            </label>
            <IconButton onClick={() => navigate("/info")}>
              <HelpOutlineOutlinedIcon className="fill-white" />
            </IconButton>
          </div>
          <div className="flex flex-col items-start gap-3">
            <label className="block mb-2 text-sm font-medium text-center dark:text-white">
              URL endpoints
            </label>
            <input
              type="text"
              placeholder="URL endpoints"
              value={configs.openAiUrl}
              className="h-10 w-full p-2 bg-neutral-800 rounded border"
              onChange={(e) =>
                setConfigs((config) => ({
                  ...config,
                  openAiUrl: e.target.value,
                }))
              }
            ></input>
          </div>
          <span className="flex justify-center">OR</span>
          <div className="flex flex-col items-start gap-3">
            <label className="block mb-2 text-sm font-medium text-center dark:text-white">
              OpenAi Key
            </label>
            <input
              type="text"
              placeholder="OpenAi Key"
              value={configs.openAiKey}
              className="h-10 w-full p-2 bg-neutral-800 rounded border"
              onChange={(e) =>
                setConfigs((config) => ({
                  ...config,
                  openAiKey: e.target.value,
                }))
              }
            ></input>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfigModal;
