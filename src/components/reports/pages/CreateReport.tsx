// ==================== REPORTS MODULE - CREATE REPORT PAGE ====================
import React from 'react';
import { CreateReportForm } from '../components';
import type { Report } from '../types/reports.types';

interface CreateReportProps {
  onBack: () => void;
  onSave: (report: Partial<Report>) => void;
  initialSection?: 'templates' | 'schedules' | 'shared';
  onNavigateToSection?: (section: 'templates' | 'schedules' | 'shared') => void;
}

export const CreateReport: React.FC<CreateReportProps> = ({
  onBack,
  onSave,
  initialSection,
  onNavigateToSection,
}) => {
  return (
    <div className="space-y-6">
      <CreateReportForm
        onBack={onBack}
        onSave={onSave}
        initialSection={initialSection}
        onNavigateToSection={onNavigateToSection}
      />
    </div>
  );
};

export default CreateReport;

