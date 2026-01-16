import { useState, useRef, useCallback } from "react";
import { Upload, X, AlertCircle, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 5,
  maxSizeMB = 5,
}: PhotoUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Invalid file type. Please use JPEG, PNG, or WebP.`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSizeMB}MB.`;
    }
    return null;
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    const response = await fetch("/api/uploads/request-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { uploadURL, objectPath } = await response.json();

    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    return objectPath;
  };

  const processFiles = useCallback(
    async (files: FileList) => {
      setError(null);

      if (photos.length + files.length > maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed.`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      const newPhotos: string[] = [];
      const totalFiles = files.length;

      try {
        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            setIsUploading(false);
            return;
          }

          const objectPath = await uploadToStorage(file);
          newPhotos.push(objectPath);
          setUploadProgress(((i + 1) / totalFiles) * 100);
        }

        onChange([...photos, ...newPhotos]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [photos, onChange, maxPhotos, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0 && !isUploading) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles, isUploading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0 && !isUploading) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles, isUploading]
  );

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onChange(newPhotos);
    setError(null);
  };

  const getPhotoUrl = (photo: string): string => {
    if (photo.startsWith("data:") || photo.startsWith("http")) {
      return photo;
    }
    return photo;
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isUploading ? "cursor-wait" : "cursor-pointer"
        } ${
          isDragging
            ? "border-[#ebba48] bg-amber-50 dark:bg-amber-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } ${photos.length >= maxPhotos || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        data-testid="photo-dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleFileSelect}
          disabled={photos.length >= maxPhotos || isUploading}
          className="hidden"
          data-testid="photo-input"
        />
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 mx-auto mb-2 text-[#ebba48] animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {photos.length >= maxPhotos
                ? `Maximum ${maxPhotos} photos reached`
                : "Drag and drop photos here, or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP (max {maxSizeMB}MB each, up to {maxPhotos} photos)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm" data-testid="photo-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-5 gap-2" data-testid="photo-preview-grid">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={getPhotoUrl(photo)}
                alt={`Upload ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
                data-testid={`photo-preview-${index}`}
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove photo"
                data-testid={`photo-remove-${index}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
