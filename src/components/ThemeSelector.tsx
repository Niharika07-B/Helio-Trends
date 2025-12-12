'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import { Sun, Tv, Zap, ChevronDown } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const themes = [
  {
    value: 'auto',
    label: 'Auto Switch',
    icon: Zap,
    description: 'Switches based on data activity'
  },
  {
    value: 'solar',
    label: 'Solar Mode',
    icon: Sun,
    description: 'Orange/yellow solar theme'
  },
  {
    value: 'netflix',
    label: 'Netflix Mode',
    icon: Tv,
    description: 'Red/black cinematic theme'
  }
] as const;

export default function ThemeSelector() {
  const { theme, setTheme, currentTheme, isTransitioning } = useTheme();

  const selectedTheme = themes.find(t => t.value === theme) || themes[0];
  const SelectedIcon = selectedTheme.icon;

  return (
    <div className="relative">
      <Listbox value={theme} onChange={setTheme}>
        <div className="relative">
          <Listbox.Button className={`relative w-full cursor-pointer rounded-lg py-2 pl-3 pr-10 text-left transition-all duration-200 ${
            currentTheme === 'solar'
              ? 'bg-solar-500/20 hover:bg-solar-500/30 text-solar-300 border border-solar-500/30'
              : 'bg-netflix-500/20 hover:bg-netflix-500/30 text-netflix-300 border border-netflix-500/30'
          } theme-transition ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
            <span className="flex items-center space-x-2">
              <SelectedIcon className="w-4 h-4" />
              <span className="block truncate text-sm font-medium">
                {selectedTheme.label}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-64 overflow-auto rounded-lg glass-dark border border-white/20 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <Listbox.Option
                    key={themeOption.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-3 px-4 transition-colors ${
                        active ? 'bg-white/10' : ''
                      }`
                    }
                    value={themeOption.value}
                  >
                    {({ selected }) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-3"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          selected
                            ? currentTheme === 'solar'
                              ? 'bg-solar-500/30 text-solar-400'
                              : 'bg-netflix-500/30 text-netflix-400'
                            : 'bg-slate-700 text-slate-400'
                        } theme-transition`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            selected ? 'text-white' : 'text-slate-300'
                          }`}>
                            {themeOption.label}
                            {selected && (
                              <span className="ml-2 text-xs opacity-70">(Active)</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {themeOption.description}
                          </div>
                        </div>
                        
                        {selected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-2 h-2 rounded-full ${
                              currentTheme === 'solar' ? 'bg-solar-400' : 'bg-netflix-400'
                            } theme-transition`}
                          />
                        )}
                      </motion.div>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}