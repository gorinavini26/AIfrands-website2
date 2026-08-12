import React from 'react';
import { MindMapData } from '../data/curriculumData';

interface MindMapDiagramProps {
  data: MindMapData;
}

export const MindMapDiagram: React.FC<MindMapDiagramProps> = ({ data }) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-6">
      {/* Background Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Mind Map Title & Label */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">account_tree</span>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-white tracking-wide">Interactive Concept Mind Map</h4>
            <p className="text-xs text-slate-400">Visual mapping of topics, connections, and foundational subnodes</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Chapter Map
        </span>
      </div>

      {/* Center & Branches Layout */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Central Root Node */}
        <div className="btn-3d btn-3d-amber px-6 py-3.5 rounded-2xl shadow-xl border-2 border-amber-400/50 flex items-center gap-3 mb-8 text-slate-950 font-black text-sm tracking-wide">
          <span className="material-symbols-outlined text-xl">bubble_chart</span>
          <span>{data.centralTopic}</span>
        </div>

        {/* Central Connecting Lines down to branches */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-indigo-500 mb-2" />

        {/* Branch Nodes Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {data.branches.map((branch, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-indigo-500/30 hover:border-indigo-500/60 transition-all rounded-2xl p-5 shadow-lg flex flex-col relative group"
            >
              {/* Connector line top */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-indigo-500/40 group-hover:bg-indigo-400 transition-colors hidden md:block" />

              {/* Branch Header */}
              <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                <h5 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  {branch.title}
                </h5>
              </div>

              {/* Subnode Items */}
              <ul className="space-y-2 text-xs font-medium text-slate-300">
                {branch.subnodes.map((subnode, sIdx) => (
                  <li
                    key={sIdx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[16px] text-indigo-400">
                      subdirectory_arrow_right
                    </span>
                    <span>{subnode}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
