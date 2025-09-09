import { Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ColorTheme } from '../../types';

interface ColorThemeSelectorProps {
  onClose: () => void;
}

export function ColorThemeSelector({ onClose }: ColorThemeSelectorProps) {
  const { colorTheme, setColorTheme, language } = useStore();

  const themes: { id: ColorTheme; name: string; name_fr: string; color: string; bgColor: string }[] = [
    { id: 'blue', name: 'Ocean Blue', name_fr: 'Bleu Océan', color: '#3b82f6', bgColor: 'bg-blue-600' },
    { id: 'green', name: 'Forest Green', name_fr: 'Vert Forêt', color: '#10b981', bgColor: 'bg-green-600' },
    { id: 'purple', name: 'Royal Purple', name_fr: 'Violet Royal', color: '#8b5cf6', bgColor: 'bg-purple-600' },
    { id: 'orange', name: 'Sunset Orange', name_fr: 'Orange Coucher', color: '#f59e0b', bgColor: 'bg-orange-600' },
    { id: 'red', name: 'Crimson Red', name_fr: 'Rouge Cramoisi', color: '#ef4444', bgColor: 'bg-red-600' },
  ];

  const handleThemeSelect = (theme: ColorTheme) => {
    setColorTheme(theme);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-48">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {language === 'en' ? 'Choose Theme' : 'Choisir le Thème'}
      </h3>
      
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-6 h-6 rounded-full ${theme.bgColor} flex items-center justify-center`}>
              {colorTheme === theme.id && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-sm text-gray-700">
              {language === 'en' ? theme.name : theme.name_fr}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}