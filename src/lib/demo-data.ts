import { Customer, Project } from '@/types';

export const DEMO_CUSTOMERS: Customer[] = [
  {
    crc53_customerid: 'demo-customer-1',
    crc53_name: 'Contoso Ltd',
    crc53_keystakeholders: [
      { id: '1', name: 'John Smith', role: 'CTO', email: 'john.smith@contoso.com' },
      { id: '2', name: 'Sarah Johnson', role: 'VP Engineering', email: 'sarah.j@contoso.com' }
    ],
    crc53_primarytechfocus: 100000000, // M365 Copilot
    createdon: '2024-01-15T10:30:00Z',
    modifiedon: '2024-03-20T14:45:00Z'
  },
  {
    crc53_customerid: 'demo-customer-2',
    crc53_name: 'Fabrikam Inc',
    crc53_keystakeholders: [
      { id: '3', name: 'Michael Chen', role: 'IT Director', email: 'mchen@fabrikam.com' }
    ],
    crc53_primarytechfocus: 100000003, // Power Apps
    createdon: '2024-02-10T09:15:00Z',
    modifiedon: '2024-03-18T11:20:00Z'
  },
  {
    crc53_customerid: 'demo-customer-3',
    crc53_name: 'Adventure Works',
    crc53_keystakeholders: [
      { id: '4', name: 'Emily Davis', role: 'Digital Transformation Lead', email: 'emily.d@adventure-works.com' },
      { id: '5', name: 'Robert Wilson', role: 'Solutions Architect', email: 'rwilson@adventure-works.com' }
    ],
    crc53_primarytechfocus: 100000001, // Copilot Studio
    createdon: '2024-01-05T13:00:00Z',
    modifiedon: '2024-03-22T16:30:00Z'
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    crc53_projectid: 'demo-project-1',
    crc53_name: 'M365 Copilot Deployment',
    crc53_primarystakeholder: 'John Smith',
    crc53_description: 'Deploy Microsoft 365 Copilot across the organization with phased rollout strategy',
    crc53_notes: [
      { id: 'n1', content: 'Initial requirements gathering completed', timestamp: '2024-03-15T10:00:00Z' },
      { id: 'n2', content: 'Pilot group identified - 50 users from Finance dept', timestamp: '2024-03-18T14:30:00Z' }
    ],
    crc53_estimatedduedate: '2024-06-30T00:00:00Z',
    crc53_primarytechnology: 100000000, // M365 Copilot
    _crc53_customerid_value: 'demo-customer-1',
    crc53_customerid: DEMO_CUSTOMERS[0],
    createdon: '2024-03-10T08:00:00Z',
    modifiedon: '2024-03-20T15:45:00Z'
  },
  {
    crc53_projectid: 'demo-project-2',
    crc53_name: 'Power Apps Modernization',
    crc53_primarystakeholder: 'Michael Chen',
    crc53_description: 'Modernize legacy applications using Power Apps platform',
    crc53_notes: [
      { id: 'n3', content: 'Identified 5 legacy apps for migration', timestamp: '2024-03-12T11:00:00Z' }
    ],
    crc53_estimatedduedate: '2024-08-15T00:00:00Z',
    crc53_primarytechnology: 100000003, // Power Apps
    _crc53_customerid_value: 'demo-customer-2',
    crc53_customerid: DEMO_CUSTOMERS[1],
    createdon: '2024-03-05T09:30:00Z',
    modifiedon: '2024-03-18T12:15:00Z'
  },
  {
    crc53_projectid: 'demo-project-3',
    crc53_name: 'Custom Copilot Development',
    crc53_primarystakeholder: 'Emily Davis',
    crc53_description: 'Build custom copilot for customer service team using Copilot Studio',
    crc53_notes: [
      { id: 'n4', content: 'Use cases defined with customer service team', timestamp: '2024-03-08T13:00:00Z' },
      { id: 'n5', content: 'Knowledge base integration design approved', timestamp: '2024-03-14T10:30:00Z' }
    ],
    crc53_estimatedduedate: '2024-07-20T00:00:00Z',
    crc53_primarytechnology: 100000001, // Copilot Studio
    _crc53_customerid_value: 'demo-customer-3',
    crc53_customerid: DEMO_CUSTOMERS[2],
    createdon: '2024-03-01T10:00:00Z',
    modifiedon: '2024-03-22T09:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-4',
    crc53_name: 'Power Automate Workflows',
    crc53_primarystakeholder: 'Sarah Johnson',
    crc53_description: 'Implement automated workflows for HR processes',
    crc53_notes: [],
    crc53_estimatedduedate: '2024-05-30T00:00:00Z',
    crc53_primarytechnology: 100000004, // Power Automate
    _crc53_customerid_value: 'demo-customer-1',
    crc53_customerid: DEMO_CUSTOMERS[0],
    createdon: '2024-03-12T14:00:00Z',
    modifiedon: '2024-03-19T16:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-5',
    crc53_name: 'Dataverse Implementation',
    crc53_primarystakeholder: 'Robert Wilson',
    crc53_description: 'Set up Dataverse as central data platform for business applications',
    crc53_notes: [
      { id: 'n6', content: 'Data model design reviewed and approved', timestamp: '2024-03-16T15:00:00Z' }
    ],
    crc53_estimatedduedate: '2024-09-15T00:00:00Z',
    crc53_primarytechnology: 100000006, // Dataverse
    _crc53_customerid_value: 'demo-customer-3',
    crc53_customerid: DEMO_CUSTOMERS[2],
    createdon: '2024-03-08T11:30:00Z',
    modifiedon: '2024-03-21T14:20:00Z'
  }
];
