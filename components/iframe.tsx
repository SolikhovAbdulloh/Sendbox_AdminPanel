import {X} from "lucide-react"
export const IframeModal = ({ isOpen, onClose, url }:any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[60vw] h-[80vh] relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-1 text-black hover:text-gray-700"
        >
        <X/>
        </button>
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="VNC Viewer"
        />
      </div>
    </div>
  );
};
