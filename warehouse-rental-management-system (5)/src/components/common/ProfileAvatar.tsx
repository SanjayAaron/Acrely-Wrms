import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  photoUrl?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  entityType?: string;
  editable?: boolean;
  onEditClick?: () => void;
  className?: string;
  statusColor?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  photoUrl,
  name,
  size = 'md',
  editable = false,
  onEditClick,
  className = '',
  statusColor,
}) => {
  const [imageError, setImageError] = useState(false);

  // Extract uppercase initials from name
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Size configurations
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-28 h-28 text-2xl',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-4.5 h-4.5',
    '2xl': 'w-5 h-5',
  };

  const editButtonSizes = {
    xs: 'p-0.5 -bottom-0.5 -right-0.5',
    sm: 'p-1 -bottom-0.5 -right-0.5',
    md: 'p-1.5 -bottom-1 -right-1',
    lg: 'p-1.5 -bottom-1 -right-1',
    xl: 'p-2 -bottom-1 -right-1',
    '2xl': 'p-2.5 bottom-1 right-1',
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white dark:border-[#334155] shadow-sm flex items-center justify-center font-bold tracking-wider transition-all duration-200 select-none ${
          photoUrl && !imageError
            ? 'bg-slate-100 dark:bg-slate-800'
            : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white'
        }`}
      >
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {statusColor && !editable && (
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1E293B] ${statusColor}`}
        />
      )}

      {editable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onEditClick) onEditClick();
          }}
          className={`absolute ${editButtonSizes[size]} bg-[#2563EB] hover:bg-blue-700 text-white rounded-full border-2 border-white dark:border-[#1E293B] shadow-md transition-transform transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center`}
          title="Edit Profile Photo"
        >
          <Camera className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};
