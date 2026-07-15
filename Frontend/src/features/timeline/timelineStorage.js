import { patientTimelineEvents } from './data/timelineData';

const STORAGE_KEY = 'timeline_events';

function initializeStorage() {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(patientTimelineEvents)
    );
  }
}

export function getTimelineEvents() {
  initializeStorage();

  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
  } catch {
    return [];
  }
}

export function getPatientTimelineEvents(patientId) {
  return getTimelineEvents().filter(
    (event) =>
      !patientId ||
      event.patientId === patientId
  );
}

export function saveTimelineEvents(events) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events)
  );
}

export function addTimelineEvent(event) {
  const events = getTimelineEvents();

  events.unshift({
    ...event,
    id: event.id || `evt-${Date.now()}`
  });

  saveTimelineEvents(events);
}