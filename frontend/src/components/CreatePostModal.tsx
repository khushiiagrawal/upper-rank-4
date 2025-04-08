"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaTags,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPoll,
  FaLink,
  FaCode,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdPreview } from "react-icons/md";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [platformUsage, setPlatformUsage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("general");
  const [visibility, setVisibility] = useState("public");
  const [showPreview, setShowPreview] = useState(false);
  const [postType, setPostType] = useState("text");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [linkUrl, setLinkUrl] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setTags("");
      setPlatformUsage("");
      setCategory("general");
      setVisibility("public");
      setPostType("text");
      setPollOptions(["", ""]);
      setLinkUrl("");
      setCodeSnippet("");
      setCodeLanguage("javascript");
      setFormErrors({});
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          image: "Image size should be less than 5MB",
        });
        return;
      }

      setImageFile(file);
      setFormErrors({
        ...formErrors,
        image: "",
      });

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Title is required";
    }

    if (postType === "text" && !description.trim()) {
      errors.description = "Description is required";
    }

    if (postType === "poll") {
      const emptyOptions = pollOptions.filter((option) => !option.trim());
      if (emptyOptions.length > 0) {
        errors.pollOptions = "All poll options must be filled";
      }

      // Check for duplicate options
      const uniqueOptions = new Set(
        pollOptions.map((option) => option.trim().toLowerCase())
      );
      if (uniqueOptions.size !== pollOptions.length) {
        errors.pollOptions = "Poll options must be unique";
      }
    }

    if (postType === "link" && !linkUrl.trim()) {
      errors.linkUrl = "Link URL is required";
    } else if (postType === "link" && linkUrl.trim() && !isValidUrl(linkUrl)) {
      errors.linkUrl = "Please enter a valid URL";
    }

    if (postType === "code" && !codeSnippet.trim()) {
      errors.codeSnippet = "Code snippet is required";
    }

    if (!platformUsage.trim()) {
      errors.platformUsage = "Platform usage description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("platformUsage", platformUsage);
      formData.append("category", category);
      formData.append("visibility", visibility);
      formData.append("postType", postType);

      if (postType === "poll") {
        formData.append("pollOptions", JSON.stringify(pollOptions));
      } else if (postType === "link") {
        formData.append("linkUrl", linkUrl);
      } else if (postType === "code") {
        formData.append("codeSnippet", codeSnippet);
        formData.append("codeLanguage", codeLanguage);
      }

      // Append image file if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Submit post to API
      await onSubmit(formData);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setFormErrors({
        ...formErrors,
        submit: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600">Create a Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-3 border ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black`}
                placeholder="Give your post a title"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Post Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPostType("text")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    postType === "text"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("image")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    postType === "image"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <FaImage className="mr-1" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("poll")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    postType === "poll"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <FaPoll className="mr-1" />
                  <span>Poll</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("link")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    postType === "link"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <FaLink className="mr-1" />
                  <span>Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("code")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    postType === "code"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <FaCode className="mr-1" />
                  <span>Code</span>
                </button>
              </div>
            </div>

            {postType === "text" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-3 border ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 text-black`}
                  placeholder="Describe your experience with waste management"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>
            )}

            {postType === "image" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Image
                </label>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {imagePreview ? (
                          <div className="relative w-full h-32">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                              <IoMdClose size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <FaUpload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG or JPEG (MAX. 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.image}
                  </p>
                )}
              </div>
            )}

            {postType === "poll" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Poll Options
                </label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className={`flex-1 p-3 border ${
                        formErrors.pollOptions
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black`}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="bg-red-500 text-white px-3 rounded-r-lg hover:bg-red-600 transition-colors"
                      disabled={pollOptions.length <= 2}
                    >
                      <IoMdClose size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
                    disabled={pollOptions.length >= 10}
                  >
                    + Add Option
                  </button>
                  <span className="text-xs text-gray-500">
                    {pollOptions.length}/10 options
                  </span>
                </div>
                {formErrors.pollOptions && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.pollOptions}
                  </p>
                )}
              </div>
            )}

            {postType === "link" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className={`w-full p-3 border ${
                    formErrors.linkUrl ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black`}
                  placeholder="https://example.com"
                />
                {formErrors.linkUrl && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.linkUrl}
                  </p>
                )}
              </div>
            )}

            {postType === "code" && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Code Language
                </label>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black mb-2"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="php">PHP</option>
                  <option value="sql">SQL</option>
                </select>
                <label className="block text-gray-700 font-medium mb-2">
                  Code Snippet
                </label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className={`w-full p-3 border ${
                    formErrors.codeSnippet
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 font-mono text-black`}
                  placeholder="Paste your code here"
                />
                {formErrors.codeSnippet && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.codeSnippet}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                  placeholder="recycling, sustainability, waste (comma separated)"
                />
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  <FaTags />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              >
                <option value="general">General</option>
                <option value="recycling">Recycling</option>
                <option value="reuse">Reuse</option>
                <option value="resale">Resale</option>
                <option value="sustainability">Sustainability</option>
                <option value="education">Education</option>
                <option value="success-story">Success Story</option>
                <option value="question">Question</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Visibility
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mr-2"
                  />
                  <span className="flex items-center">
                    <FaEye className="mr-1" /> Public
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mr-2"
                  />
                  <span className="flex items-center">
                    <FaEyeSlash className="mr-1" /> Private
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                How did you use our platform?
              </label>
              <textarea
                value={platformUsage}
                onChange={(e) => setPlatformUsage(e.target.value)}
                className={`w-full p-3 border ${
                  formErrors.platformUsage
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 text-black`}
                placeholder="Describe how you used 3RVision for waste management"
              />
              {formErrors.platformUsage && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.platformUsage}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <MdPreview className="mr-1" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>

            {showPreview && (
              <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">
                  {title || "Post Title"}
                </h3>
                {postType === "text" && (
                  <p className="text-gray-700">
                    {description || "Post content will appear here..."}
                  </p>
                )}
                {postType === "image" && imagePreview && (
                  <div className="my-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                  </div>
                )}
                {postType === "poll" && (
                  <div className="my-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input type="radio" name="poll" className="mr-2" />
                        <span>{option || `Option ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                )}
                {postType === "link" && linkUrl && (
                  <div className="my-2">
                    <a
                      href={linkUrl}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {linkUrl}
                    </a>
                  </div>
                )}
                {postType === "code" && codeSnippet && (
                  <div className="my-2">
                    <div className="bg-gray-800 text-white p-3 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{codeSnippet}</pre>
                    </div>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.split(",").map(
                    (tag, index) =>
                      tag.trim() && (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      )
                  )}
                </div>
              </div>
            )}

            {formErrors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {formErrors.submit}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreatePostModal;
