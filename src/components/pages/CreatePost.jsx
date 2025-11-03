import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { postsService } from "@/services/api/postsService";
import { toast } from "react-toastify";

const CreatePost = () => {
  const navigate = useNavigate();
  
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    type: "text",
    imageUrl: "",
    linkUrl: "",
    communityName: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const communities = [
    "technology", "programming", "gaming", "science", 
    "music", "movies", "books", "sports", "art", "photography"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!postData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!postData.communityName) {
      newErrors.communityName = "Please select a community";
    }

    if (postData.type === "text" && !postData.content.trim()) {
      newErrors.content = "Content is required for text posts";
    }

    if (postData.type === "link" && !postData.linkUrl.trim()) {
      newErrors.linkUrl = "URL is required for link posts";
    }

    if (postData.type === "image" && !postData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required for image posts";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleTypeChange = (type) => {
    setPostData(prev => ({
      ...prev,
      type,
      content: type === "text" ? prev.content : "",
      linkUrl: type === "link" ? prev.linkUrl : "",
      imageUrl: type === "image" ? prev.imageUrl : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const newPost = await postsService.create(postData);
      toast.success("Post created successfully!");
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Create a post
        </h1>
        <p className="text-gray-600">
          Share something interesting with the community
        </p>
      </div>

      {/* Create Post Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Community Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Choose a community
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {communities.map(community => (
              <button
                key={community}
                type="button"
                onClick={() => handleInputChange("communityName", community)}
                className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                  postData.communityName === community
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                r/{community}
              </button>
            ))}
          </div>
          
          {errors.communityName && (
            <p className="text-error text-sm mt-2">{errors.communityName}</p>
          )}
        </div>

        {/* Post Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Post type
          </label>
          
          <div className="flex space-x-2">
            {[
              { type: "text", icon: "FileText", label: "Text" },
              { type: "image", icon: "Image", label: "Image" },
              { type: "link", icon: "ExternalLink", label: "Link" }
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  postData.type === type
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={icon} className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Title *
            </label>
            <Input
              value={postData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="An interesting title"
              error={errors.title}
              maxLength={300}
            />
            {errors.title && (
              <p className="text-error text-sm mt-2">{errors.title}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {postData.title.length}/300 characters
            </p>
          </div>

          {/* Text Content */}
          {postData.type === "text" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Content *
              </label>
              <Textarea
                value={postData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="What would you like to discuss?"
                rows={8}
                error={errors.content}
              />
              {errors.content && (
                <p className="text-error text-sm mt-2">{errors.content}</p>
              )}
            </div>
          )}

          {/* Link URL */}
          {postData.type === "link" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                URL *
              </label>
              <Input
                type="url"
                value={postData.linkUrl}
                onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                placeholder="https://example.com"
                error={errors.linkUrl}
              />
              {errors.linkUrl && (
                <p className="text-error text-sm mt-2">{errors.linkUrl}</p>
              )}
            </div>
          )}

          {/* Image URL */}
          {postData.type === "image" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Image URL *
              </label>
              <Input
                type="url"
                value={postData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                error={errors.imageUrl}
              />
              {errors.imageUrl && (
                <p className="text-error text-sm mt-2">{errors.imageUrl}</p>
              )}
              
              {postData.imageUrl && (
                <div className="mt-3">
                  <img
                    src={postData.imageUrl}
                    alt="Preview"
                    className="max-w-xs h-auto rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Optional Content for non-text posts */}
          {postData.type !== "text" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Additional content (optional)
              </label>
              <Textarea
                value={postData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Add some context or description..."
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !postData.title.trim() || !postData.communityName}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {submitting ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;