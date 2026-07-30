import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProfileAvatar } from './ProfileAvatar';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Check,
  RotateCcw,
  ZoomIn,
  Loader2,
  Sparkles,
  UserCheck
} from 'lucide-react';

export type EntityTypeLabel =
  | 'Broker'
  | 'Staff'
  | 'User'
  | 'Tenant'
  | 'Property Owner'
  | 'Administrator';

interface ProfilePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType?: EntityTypeLabel;
  currentPhotoUrl?: string | null;
  onSavePhoto: (newPhotoUrl: string | null) => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ProfilePhotoUploadModal: React.FC<ProfilePhotoUploadModalProps> = ({
  isOpen,
  onClose,
  entityName,
  entityType = 'Broker',
  currentPhotoUrl,
  onSavePhoto,
  onShowToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Reset modal state whenever it opens
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhotoUrl || null);
      setErrorMessage(null);
      setDragActive(false);
      setIsUploading(false);
      setUploadProgress(0);
      setFileName(null);
      setFileSizeStr(null);
      setZoomLevel(1);
      setIsSaved(false);
    }
  }, [isOpen, currentPhotoUrl]);

  // Format file size nicely
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate and process selected file
  const processFile = (file: File) => {
    setErrorMessage(null);

    // 1. Check file extension & MIME type
    const fileType = file.type.toLowerCase();
    const fileNameLower = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));

    if (!ALLOWED_TYPES.includes(fileType) && !hasValidExtension) {
      setErrorMessage('Invalid file format. Please upload a JPG, JPEG, PNG, or WebP image.');
      return;
    }

    // 2. Check file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large (${formatBytes(file.size)}). Maximum allowed size is 5 MB.`);
      return;
    }

    // 3. Process image with progress simulation
    setFileName(file.name);
    setFileSizeStr(formatBytes(file.size));
    setIsUploading(true);
    setUploadProgress(15);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 90);
        setUploadProgress(percent);
      }
    };

    reader.onload = (e) => {
      setUploadProgress(100);
      setTimeout(() => {
        setPreviewUrl(e.target?.result as string);
        setIsUploading(false);
      }, 300);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setErrorMessage('Failed to read image file. Please try selecting a different photo.');
    };

    reader.readAsDataURL(file);
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setFileName(null);
    setFileSizeStr(null);
    setErrorMessage(null);
    setZoomLevel(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    onSavePhoto(previewUrl);
    
    const message = previewUrl
      ? `${entityType} profile photo updated successfully!`
      : `${entityType} profile photo removed.`;

    if (onShowToast) {
      onShowToast(message, 'success');
    }

    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${entityType} Profile Photo`}
      description={`Manage profile image for ${entityName}`}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Top Avatar Preview & Circular Crop Mask */}
        <div className="p-6 bg-slate-50 dark:bg-[#0F172A]/70 border border-[#E5E7EB] dark:border-[#334155] rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative group">
            {/* Circular Crop Mask Container */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#1E293B] shadow-lg ring-4 ring-blue-500/20 flex items-center justify-center bg-slate-200 dark:bg-slate-800 transition-transform transform group-hover:scale-102">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={entityName}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              ) : (
                <ProfileAvatar name={entityName} size="2xl" />
              )}
            </div>

            {previewUrl && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-[#1E293B]">
                <Check className="w-4 h-4" />
              </span>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              {entityName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-[#94A3B8] mt-0.5">
              {previewUrl ? 'Circular crop preview applied' : 'Default initials avatar active'}
            </p>
          </div>

          {/* Zoom Slider when image exists */}
          {previewUrl && (
            <div className="w-full max-w-xs pt-2 flex items-center gap-3">
              <ZoomIn className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748B] shrink-0" />
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="text-[10px] font-semibold text-gray-400 dark:text-[#94A3B8] hover:text-[#2563EB] cursor-pointer"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* File Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-[#2563EB] bg-blue-50/60 dark:bg-blue-950/40 shadow-inner'
              : 'border-gray-300 dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:border-[#2563EB] hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                Drag and drop your image here, or{' '}
                <span className="text-[#2563EB] dark:text-blue-400 underline">browse</span>
              </p>
              <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] mt-1">
                Supports JPG, JPEG, PNG, WebP (Max 5 MB)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-[#2563EB] dark:text-blue-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Reading and processing image...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-900/50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            {fileName && (
              <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] truncate">
                File: {fileName} ({fileSizeStr})
              </p>
            )}
          </div>
        )}

        {/* Modal Action Buttons Footer */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#334155] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Remove Photo Button */}
          {previewUrl ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemovePhoto}
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40"
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Remove Photo
            </Button>
          ) : (
            <span className="text-xs text-gray-400 dark:text-[#64748B] italic">
              No photo attached
            </span>
          )}

          {/* Right: Save & Cancel Buttons */}
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isUploading}
              icon={<Check className="w-4 h-4" />}
            >
              Save Photo
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
