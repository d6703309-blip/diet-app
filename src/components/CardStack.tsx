
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Utensils, ScanSearch, Activity } from 'lucide-react';

interface CardStackProps {
  step: number; // 0, 1, or 2
  imageUri: string | null;
  result: AnalysisResult | null;
}

export const CardStack: React.FC<CardStackProps> = ({ step, imageUri, result }) => {
  const COLORS = ['#38bdf8', '#f87171', '#fbbf24', '#a3a3a3']; // Sky, Red, Amber, Grey

  const chartData = result ? [
    { name: '蛋白质', value: result.macros.protein },
    { name: '碳水', value: result.macros.carbs },
    { name: '脂肪', value: result.macros.fat },
  ] : [];

  return (
    <div className="relative w-full h-72 flex justify-center items-center perspective-1000 overflow-hidden pt-4">
      
      {/* Card 1: Image Upload */}
      <div 
        className={`absolute w-48 h-64 bg-white rounded-2xl shadow-xl border-4 border-white transition-all duration-500 ease-out z-30 flex flex-col overflow-hidden
          ${step === 0 ? 'scale-110 rotate-0 translate-y-0 opacity-100' : ''}
          ${step === 1 ? 'scale-95 -rotate-6 -translate-x-12 translate-y-4 opacity-90' : ''} 
          ${step === 2 ? 'scale-90 -rotate-12 -translate-x-24 translate-y-8 opacity-80' : ''}
        `}
      >
        <div className="flex-1 bg-gray-100 relative">
          {imageUri ? (
            <img src={imageUri} alt="Food" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
               <Utensils size={48} />
            </div>
          )}
        </div>
        <div className="h-10 bg-white flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wide">
          已选餐品
        </div>
      </div>

      {/* Card 2: Ingredients */}
      <div 
        className={`absolute w-48 h-64 bg-white rounded-2xl shadow-xl border-4 border-white transition-all duration-500 ease-out z-20 flex flex-col overflow-hidden
          ${step === 0 ? 'scale-90 rotate-6 translate-x-12 translate-y-4 opacity-0' : ''}
          ${step === 1 ? 'scale-110 rotate-0 translate-y-0 opacity-100' : ''}
          ${step === 2 ? 'scale-95 -rotate-6 -translate-x-12 translate-y-4 opacity-90' : ''}
        `}
      >
        <div className="flex-1 bg-gray-50 p-3 overflow-y-auto">
          {result ? (
            <div className="space-y-2">
              {result.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between items-center text-xs border-b border-gray-200 pb-1">
                  <span className="font-medium text-gray-700 truncate w-20">{ing.name}</span>
                  <span className="text-gray-500">{ing.weightG}g</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ScanSearch size={40} className="mb-2" />
              <span className="text-xs">等待识别...</span>
            </div>
          )}
        </div>
        <div className="h-10 bg-white flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wide">
          识别结果
        </div>
      </div>

      {/* Card 3: Stats */}
      <div 
        className={`absolute w-48 h-64 bg-white rounded-2xl shadow-xl border-4 border-white transition-all duration-500 ease-out z-10 flex flex-col overflow-hidden
          ${step === 0 ? 'scale-90 translate-x-24 opacity-0' : ''}
          ${step === 1 ? 'scale-90 rotate-6 translate-x-12 translate-y-4 opacity-0' : ''}
          ${step === 2 ? 'scale-110 rotate-0 translate-y-0 opacity-100' : ''}
        `}
      >
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-2">
           {result ? (
             <>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-1">
                  <p className="text-2xl font-black text-gray-800">{result.totalCalories}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Kcal 总热量</p>
                </div>
             </>
           ) : (
            <div className="flex flex-col items-center text-gray-400">
               <Activity size={40} className="mb-2"/>
               <span className="text-xs">等待分析...</span>
            </div>
           )}
        </div>
        <div className="h-10 bg-white flex items-center justify-center text-xs font-bold text-gray-600 uppercase tracking-wide">
          营养总结
        </div>
      </div>
    </div>
  );
};
