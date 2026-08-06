import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SoundType,
  HapticType,
  ExperienceSettings,
  DEFAULT_EXPERIENCE_SETTINGS,
  experienceEngine
} from '../utils/experienceManager';
import { SystemSettings } from '../types';

interface ExperienceContextType {
  settings: ExperienceSettings;
  updateSettings: (newSettings: Partial<ExperienceSettings>) => void;
  playSound: (type: SoundType, customVolumeMultiplier?: number) => void;
  triggerHaptic: (type?: HapticType) => void;
  syncWithSystemSettings: (sysSettings: Partial<SystemSettings>) => void;
}

const STORAGE_KEY = 'acrely_experience_settings';

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ExperienceSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_EXPERIENCE_SETTINGS, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to default
      }
    }
    return DEFAULT_EXPERIENCE_SETTINGS;
  });

  // Keep experienceEngine synced whenever settings state changes
  useEffect(() => {
    experienceEngine.updateSettings(settings);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // Ignore storage errors
      }

      // Apply root class for reduce motion if enabled
      if (settings.reduceMotion || !settings.enableAnimations) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    }
  }, [settings]);

  // Sync when SystemSettings props arrive from app level
  const syncWithSystemSettings = (sysSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated: ExperienceSettings = {
        enableUiSounds: sysSettings.enableUiSounds ?? prev.enableUiSounds,
        soundVolume: sysSettings.soundVolume ?? prev.soundVolume,
        enableHaptics: sysSettings.enableHaptics ?? prev.enableHaptics,
        enableAnimations: sysSettings.enableAnimations ?? prev.enableAnimations,
        reduceMotion: sysSettings.reduceMotion ?? prev.reduceMotion,
        muteAllSounds: sysSettings.muteAllSounds ?? prev.muteAllSounds,
        followSystemPreferences: sysSettings.followSystemPreferences ?? prev.followSystemPreferences
      };
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<ExperienceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const playSound = (type: SoundType, customVolumeMultiplier?: number) => {
    experienceEngine.playSound(type, customVolumeMultiplier);
  };

  const triggerHaptic = (type: HapticType = 'light') => {
    experienceEngine.triggerHaptic(type);
  };

  return (
    <ExperienceContext.Provider
      value={{
        settings,
        updateSettings,
        playSound,
        triggerHaptic,
        syncWithSystemSettings
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = (): ExperienceContextType => {
  const context = useContext(ExperienceContext);
  if (!context) {
    // Provide safe fallback if hook used outside provider
    return {
      settings: DEFAULT_EXPERIENCE_SETTINGS,
      updateSettings: () => {},
      playSound: (type: SoundType) => experienceEngine.playSound(type),
      triggerHaptic: (type: HapticType = 'light') => experienceEngine.triggerHaptic(type),
      syncWithSystemSettings: () => {}
    };
  }
  return context;
};
