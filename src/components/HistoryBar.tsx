import React from 'react';
import { HistoryItem } from '../types';
import { Trash2 } from 'lucide-react';

interface HistoryBarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const HistoryBar: React.FC<HistoryBarProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full py-4 bg-white border-t border-gray-100">
      <div className="px-4 mb-2 flex justify-between items-center">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">History Gallery</h3>
        <span className="text-xs text-gray-400">{history.length} 记录</span>
      </div>
      <div className="flex overflow-x-auto px-4 space-x-4 hide-scrollbar pb-2">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden relative border border-gray-200 shadow-sm cursor-pointer group"
          >
            <img src={item.imageUri} alt="History" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white text-center p-0.5 truncate">
               {item.result.totalCalories} kcal
            </div>
            <button 
              onClick={(e) => onDelete(item.id, e)}
              className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
