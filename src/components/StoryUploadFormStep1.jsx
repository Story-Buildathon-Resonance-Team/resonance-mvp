import React, { useState } from 'react';

const StoryUploadFormStep1 = ({ form, authorName, fillSampleStory }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      form.setValue('coverImage', files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      form.setValue('coverImage', files[0]);
    }
  };

  const handleUploadAreaClick = () => {
    document.getElementById('coverImageInput').click();
  };

  // Watch form values
  const title = form.watch('title');
  const synopsis = form.watch('description'); // Using 'description' to match existing form
  const fullStory = form.watch('content');
  const contentType = form.watch('contentType');
  const coverImageFile = form.watch('coverImage');
  const storyFile = form.watch('storyFile');

  return (
    <div className="space-y-6">
      {/* Author and Sample Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <strong>Author:</strong> {authorName}
        </div>
        <button
          type="button"
          onClick={fillSampleStory}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white rounded-md transition-colors border-0"
        >
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Fill Sample Story
        </button>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-white text-lg font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Your story's name"
          className="w-full p-3 rounded-lg bg-[#2A2D3C] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
          value={title || ''}
          onChange={(e) => form.setValue('title', e.target.value)}
        />
        {form.formState.errors.title && (
          <p className="text-red-400 text-sm">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Synopsis Textarea */}
      <div className="space-y-2">
        <label htmlFor="synopsis" className="block text-white text-lg font-medium">
          Synopsis
        </label>
        <textarea
          id="synopsis"
          placeholder="Describe your world and characters..."
          rows="4"
          className="w-full p-3 rounded-lg bg-[#2A2D3C] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y border border-gray-600"
          value={synopsis || ''}
          onChange={(e) => form.setValue('description', e.target.value)}
        />
        {form.formState.errors.description && (
          <p className="text-red-400 text-sm">{form.formState.errors.description.message}</p>
        )}
      </div>

      {/* Content Type Selection */}
      <div className="space-y-2">
        <label className="block text-white text-lg font-medium">Content Type</label>
        <div className="flex gap-6">
          <label className="flex items-center space-x-2 cursor-pointer text-white">
            <input
              type="radio"
              value="text"
              checked={contentType === "text"}
              onChange={(e) => form.setValue('contentType', e.target.value)}
              className="w-4 h-4 text-blue-500 bg-[#2A2D3C] border-gray-600 focus:ring-blue-500"
            />
            <span>Text Content</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer text-white">
            <input
              type="radio"
              value="pdf"
              checked={contentType === "pdf"}
              onChange={(e) => form.setValue('contentType', e.target.value)}
              className="w-4 h-4 text-blue-500 bg-[#2A2D3C] border-gray-600 focus:ring-blue-500"
            />
            <span>PDF Upload</span>
          </label>
        </div>
        <p className="text-gray-400 text-sm">Choose how you want to provide your story content</p>
      </div>

      {/* Full Story Textarea - Only show if text content is selected */}
      {contentType === "text" && (
        <div className="space-y-2">
          <label htmlFor="fullStory" className="block text-white text-lg font-medium">
            Full Story
          </label>
          <textarea
            id="fullStory"
            placeholder="Share your complete story..."
            rows="8"
            className="w-full p-3 rounded-lg bg-[#2A2D3C] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y border border-gray-600"
            value={fullStory || ''}
            onChange={(e) => form.setValue('content', e.target.value)}
          />
          <p className="text-gray-400 text-sm">Your complete story content in plain text</p>
          {form.formState.errors.content && (
            <p className="text-red-400 text-sm">{form.formState.errors.content.message}</p>
          )}
        </div>
      )}

      {/* PDF Upload - Only show if PDF content is selected */}
      {contentType === "pdf" && (
        <div className="space-y-2">
          <label htmlFor="storyPdf" className="block text-white text-lg font-medium">
            Story PDF File
          </label>
          <input
            type="file"
            id="storyPdf"
            accept=".pdf"
            className="w-full p-3 rounded-lg bg-[#2A2D3C] text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 border border-gray-600"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) form.setValue('storyFile', file);
            }}
          />
          {storyFile && (
            <div className="p-3 border border-gray-600 border-dashed rounded-lg bg-[#2A2D3C]">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Selected: {storyFile.name} ({(storyFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </div>
          )}
          <p className="text-gray-400 text-sm">Upload your story as a PDF file (max 10MB recommended)</p>
        </div>
      )}

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label htmlFor="coverImage" className="block text-white text-lg font-medium">
          Cover Image *
        </label>
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer bg-[#2A2D3C] transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-[#2A2D3C]/80' 
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadAreaClick}
        >
          {coverImageFile ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-white font-medium">{coverImageFile.name}</p>
              <p className="text-gray-400 text-sm mt-1">Click to change</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.832 1.573l-7 10A1 1 0 019 18v-5H5a1 1 0 01-.832-1.573l7-10a1 1 0 011.132-.381z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-white text-lg font-medium mb-1">Upload cover</p>
              <p className="text-gray-400 text-sm">Drag & drop or click</p>
            </>
          )}
          <input
            type="file"
            id="coverImageInput"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
          />
        </div>
        {form.formState.errors.coverImage && (
          <p className="text-red-400 text-sm">{form.formState.errors.coverImage.message}</p>
        )}
        <p className="text-gray-400 text-sm">Upload a cover image for your story (JPG, PNG). This is required for IP registration.</p>
      </div>

      {/* Story Protocol Info Box */}
      <div className="bg-[#2A2D3C] p-4 rounded-lg flex items-start border border-gray-600">
        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Your story will be registered on Story Protocol, enabling secure remixing while protecting
          your intellectual property
        </p>
      </div>
    </div>
  );
};

export default StoryUploadFormStep1; 