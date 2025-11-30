 
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [defaultShare, setDefaultShare] = useState(false);

  useEffect(() => {
    const savedDefaultShare = localStorage.getItem('defaultShare');
    setDefaultShare(savedDefaultShare === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('defaultShare', defaultShare);
    toast.success('Settings saved successfully!');
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <div className="bg-white dark:bg-[#181f36] rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-blue-900">
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-8">Settings</h1>
        {/* Appearance */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-100">Dark Mode</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">
                {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-blue-200'
              }`}
              aria-label="Toggle Dark Mode"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        {/* Privacy */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Privacy</h2>
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <input
              type="checkbox"
              id="defaultShare"
              checked={defaultShare}
              onChange={(e) => setDefaultShare(e.target.checked)}
              className="accent-blue-600 h-5 w-5"
            />
            <label htmlFor="defaultShare" className="text-blue-900 dark:text-blue-100 font-medium text-sm">
              Share my notes by default
            </label>
          </div>
        </div>
        {/* Notifications (Coming Soon) */}
        <div className="mb-8 opacity-50 cursor-not-allowed">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Notifications</h2>
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <input type="checkbox" disabled className="accent-blue-600" />
            <label className="text-blue-700 dark:text-blue-200 font-medium">Email Notifications (coming soon)</label>
          </div>
        </div>
        {/* Editor (Coming Soon) */}
        <div className="mb-8 opacity-50 cursor-not-allowed">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Editor</h2>
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <input type="checkbox" disabled className="accent-blue-600" />
            <label className="text-blue-700 dark:text-blue-200 font-medium">Auto Save (coming soon)</label>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition font-medium"
          >
            Back to Notes
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
