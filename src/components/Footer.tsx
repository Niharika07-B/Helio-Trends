'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Linkedin, Github, Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/niharika-bandaru/',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/Niharika07-B',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/___.nihaaaaaa.___/?igsh=MTh2MWV3dDg1NmNicw%3D%3D#',
      color: 'hover:text-pink-400'
    }
  ];

  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className="px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Creator Info */}
          <motion.div 
            className="flex items-center space-x-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-2xl">🔮</span>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Niharika's Creation
              </h3>
              <p className="text-sm text-slate-400">
                © 2025 — All Rights Reserved
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center space-x-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm text-slate-400 mr-3">
              ⚡ Stay Connected
            </span>
            
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-slate-400 transition-all duration-200 ${link.color} hover:bg-white/5`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <span>→</span>
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </motion.a>
            ))}
          </motion.div>


        </div>
      </div>
    </footer>
  );
}