import { useState, useRef } from "react";
import { UploadCloud, X, Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const AvatarUploadModal = ({ onClose }) => {
  const { updateProfilePicture, isUpdatingProfilePicture } = useAuthStore();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  // Handlers para sa drag and drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handler kapag kinlick at pumili ng file manually
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Validation at pag-create ng preview URL
  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    // Limit to 5MB (katulad ng sa backend natin)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const success = await updateProfilePicture(selectedFile);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-300/60 backdrop-blur-sm px-4">
      <div className="flex flex-col bg-white rounded-lg w-full max-w-md h-80 p-6 relative shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isUpdatingProfilePicture}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="size-4" />
        </button>

        <h3 className="text-xl font-black uppercase text-center mb-4">
          Upload Profile Picture
        </h3>

        {/* Click, Drag & Drop Zone */}
        {!previewUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-15 flex flex-col items-center justify-center text-center transition-colors ${
              dragActive
                ? "border-[#9A0AED] bg-[#9A0AED]/5"
                : "border-gray-300 hover:border-[#9A0AED]/50 hover:bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            <UploadCloud
              className={`size-12 mb-4 ${dragActive ? "text-[#9A0AED]" : "text-gray-400"}`}
            />
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (max. 5MB)
            </p>
          </div>
        ) : (
          /* Preview Section */
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg mb-4 relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Option to change photo again */}
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
              >
                <span className="text-white text-sm font-bold">
                  Change Photo
                </span>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUpdatingProfilePicture}
              className="w-80 bg-[#9A0AED] text-white font-bold py-1 px-2 rounded-md flex items-center justify-center gap-1 hover:opacity-90 disabled:opacity-70 transition-all shadow-md"
            >
              {isUpdatingProfilePicture ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Set as Profile Picture"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUploadModal;
