import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import type { UserSettings } from '../../types/settings';
import { Button } from '../../components/common/Button';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Save, Cpu, User } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    await settingsService.updateSettings(settings);
    setIsSaving(false);
    alert('Settings updated successfully!');
  };

  if (isLoading || !settings) {
    return <SkeletonLoader count={3} className="h-48" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold font-headline text-on-surface">Workspace Settings</h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure AI parameters, notification alerts, and account preferences.
        </p>
      </div>

      {/* Account Info */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-on-surface">User Account Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Full Name</label>
            <input
              type="text"
              value={settings.account.name}
              onChange={(e) =>
                setSettings({ ...settings, account: { ...settings.account, name: e.target.value } })
              }
              className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl p-3 text-sm text-on-surface"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email Address</label>
            <input
              type="email"
              value={settings.account.email}
              readOnly
              className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl p-3 text-sm text-on-surface-variant/70 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Cpu className="w-5 h-5 text-tertiary" />
          <h3 className="text-base font-bold text-on-surface">Gemini AI Model Tuning</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">AI Model Target</label>
            <select
              value={settings.aiConfig.preferredModel}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aiConfig: { ...settings.aiConfig, preferredModel: e.target.value as any },
                })
              }
              className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl p-3 text-sm text-on-surface"
            >
              <option value="gemini-3.5-pro">Google Gemini 3.5 Pro (Recommended)</option>
              <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Ultra Fast)</option>
              <option value="fastapi-custom">FastAPI Custom Backend Microservice</option>
            </select>
          </div>

          <div className="flex flex-col justify-center space-y-3 pt-2">
            <label className="flex items-center gap-3 text-xs text-on-surface font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiConfig.autoDraftReplies}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiConfig: { ...settings.aiConfig, autoDraftReplies: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-primary bg-surface-container-lowest border-white/10"
              />
              Auto-generate smart draft replies
            </label>

            <label className="flex items-center gap-3 text-xs text-on-surface font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiConfig.extractTasksAutomatically}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    aiConfig: { ...settings.aiConfig, extractTasksAutomatically: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-primary bg-surface-container-lowest border-white/10"
              />
              Automatically extract actionable tasks
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          className="font-bold px-6"
        >
          Save Workspace Preferences
        </Button>
      </div>
    </div>
  );
};
