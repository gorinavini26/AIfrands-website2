import React, { useState, useEffect } from 'react';
import { RoadmapModule } from '../types';
import { CurriculumView } from './CurriculumView';
import { INITIAL_CURRICULUM_SEMESTERS, SemesterData } from '../data/curriculumData';

interface RoadmapViewProps {
  roadmapModules: RoadmapModule[];
  onToggleTopicCheck: (moduleId: string, topicIndex: number) => void;
  onMarkModuleComplete: (moduleId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAIAssistant: () => void;
  onRestoreModules?: () => void;
  onShowToast?: (msg: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  onToggleTopicCheck,
  onShowToast,
}) => {
  // Curriculum Semesters State with local storage rehydration
  const [semestersData, setSemestersData] = useState<SemesterData[]>(() => {
    try {
      const saved = localStorage.getItem('aifrands_curriculum_semesters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial
    }
    return INITIAL_CURRICULUM_SEMESTERS;
  });

  // Save changes to localStorage whenever semestersData changes
  useEffect(() => {
    try {
      localStorage.setItem('aifrands_curriculum_semesters', JSON.stringify(semestersData));
    } catch {}
  }, [semestersData]);

  // Handler for topic checklist toggling in CurriculumView
  const handleCurriculumTopicToggle = (
    semesterId: number,
    subjectId: string,
    topicId: string
  ) => {
    setSemestersData((prevSems) => {
      const updated = prevSems.map((sem) => {
        if (sem.id !== semesterId) return sem;
        return {
          ...sem,
          subjects: sem.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) =>
                t.id === topicId ? { ...t, completed: !t.completed } : t
              ),
            };
          }),
        };
      });

      // Also try notifying parent onToggleTopicCheck if matching legacy IDs exist
      try {
        const matchingModIndex = 0;
        onToggleTopicCheck(subjectId, matchingModIndex);
      } catch {
        // Safe fallback
      }

      return updated;
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      <CurriculumView
        semestersData={semestersData}
        onToggleTopicCheck={handleCurriculumTopicToggle}
        onShowToast={onShowToast}
      />
    </div>
  );
};
