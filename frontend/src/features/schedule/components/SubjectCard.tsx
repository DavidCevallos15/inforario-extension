import React from 'react';
import { ClassSession } from '../../../types';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  session: ClassSession;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ session, className = '', style, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 md:p-4 rounded-2xl cursor-pointer transition-shadow border-l-4 min-h-[76px] hover:shadow-editorial relative flex flex-col justify-between ${className}`}
      style={style}
      layoutId={`card-${session.id}`}
    >
      <h4 className="font-bold leading-tight break-words whitespace-normal text-[0.95em] text-left">
        {session.subject || 'Materia sin nombre'}
      </h4>
      <div className="flex justify-between items-end mt-1 text-[0.8em] opacity-85">
        <p className="leading-none shrink-0">
          {session.startTime && session.endTime
            ? `${session.startTime} - ${session.endTime}`
            : 'Sin horario'}
        </p>
        {session.location && session.location !== 'Sin asignar' && (
          <span className="text-[0.95em] truncate pl-2 max-w-[120px] font-medium leading-none">
            {session.location.split(' - ')[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
};
