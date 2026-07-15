import { ClipboardPlus, FileText, FlaskConical, Pill, Stethoscope } from 'lucide-react';

export const timelineTypeMeta = {
  'Visit Created': {
    icon: ClipboardPlus,
    tone: 'bg-blue-50 text-blue-700 ring-blue-100'
  },
  'Diagnosis Added': {
    icon: Stethoscope,
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  },
  'Prescription Issued': {
    icon: Pill,
    tone: 'bg-violet-50 text-violet-700 ring-violet-100'
  },
  'Lab Result Uploaded': {
    icon: FlaskConical,
    tone: 'bg-amber-50 text-amber-700 ring-amber-100'
  },
  'Doctor Note Added': {
    icon: FileText,
    tone: 'bg-slate-100 text-slate-700 ring-slate-200'
  }
};
