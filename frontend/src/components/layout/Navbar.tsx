import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

/**
 * Barra de navegación simplificada.
 * Muestra solo el branding de Inforario y un enlace de feedback.
 */
export const Navbar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full h-20"
      style={{
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,73,37,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-on-primary" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-primary">
            Inforario
          </span>
        </div>

        {/* Feedback */}
        <a
          href="https://wa.me/593979107716?text=Hola,%20quiero%20dejar%20feedback%20sobre%20Inforario"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full font-semibold text-sm hover:bg-primary-container transition-colors duration-200"
        >
          <MessageCircle size={14} className="hidden sm:block" />
          <span className="hidden sm:block">Feedback</span>
          <span className="sm:hidden">FB</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
