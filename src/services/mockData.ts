import {
  DEMO_USERS_LIST,
  DEMO_DEPARTMENTS_LIST,
  DEMO_COMPLAINTS_LIST,
  DEMO_LOCATIONS_LIST,
  DEMO_NOTIFICATIONS_LIST,
  DEMO_LOST_FOUND_LIST,
} from './db';
import { User, Department, Complaint, CampusNotification, LostFoundItem, RecurringIssueCluster } from '../types';

export const DEMO_USERS: Record<string, User> = {
  student: DEMO_USERS_LIST.find(u => u.role === 'student') || DEMO_USERS_LIST[0],
  faculty: DEMO_USERS_LIST.find(u => u.role === 'faculty') || DEMO_USERS_LIST[1],
  staff: DEMO_USERS_LIST.find(u => u.role === 'staff') || DEMO_USERS_LIST[2],
  admin: DEMO_USERS_LIST.find(u => u.role === 'admin') || DEMO_USERS_LIST[3],
};

export const INITIAL_DEPARTMENTS: Department[] = DEMO_DEPARTMENTS_LIST;
export const INITIAL_COMPLAINTS: Complaint[] = DEMO_COMPLAINTS_LIST;
export const INITIAL_NOTIFICATIONS: CampusNotification[] = DEMO_NOTIFICATIONS_LIST;
export const INITIAL_LOST_FOUND: LostFoundItem[] = DEMO_LOST_FOUND_LIST;
export const CAMPUS_LOCATIONS = DEMO_LOCATIONS_LIST;

export const RECURRING_ISSUE_CLUSTERS: RecurringIssueCluster[] = [
  {
    id: 'cluster_01',
    category: 'electrical_power',
    location: 'Auditorium Main Stage',
    complaintCount: 5,
    frequencyTrend: 'increasing',
    rootCauseHypothesis: 'HVAC circuit breaker overload during peak lecture hours.',
    recommendedAction: 'Facility dispatch inspecting rooftop compressor and auxiliary relay unit.',
    affectedStudentsEstimate: 120,
  },
  {
    id: 'cluster_02',
    category: 'it_network',
    location: 'Computer Lab 2',
    complaintCount: 4,
    frequencyTrend: 'increasing',
    rootCauseHypothesis: 'EdgeSwitch 48-port SFP module thermal throttling.',
    recommendedAction: 'Replace EdgeSwitch 48-port core SFP module.',
    affectedStudentsEstimate: 65,
  },
];

export const INITIAL_CLUSTERS = RECURRING_ISSUE_CLUSTERS;
