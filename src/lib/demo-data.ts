import { Customer, Project } from '@/types';

// Helper to calculate future dates
const getDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const DEMO_CUSTOMERS: Customer[] = [
  {
    crc53_customerid: 'demo-customer-1',
    crc53_name: 'Contoso Manufacturing',
    crc53_keystakeholders: [
      { id: '1', name: 'Sarah Chen', role: 'CTO', email: 'sarah.chen@contoso.com' },
      { id: '2', name: 'Michael Rodriguez', role: 'VP of Digital Transformation', email: 'm.rodriguez@contoso.com' }
    ],
    crc53_primarytechfocus: 100000000, // M365 Copilot
    createdon: '2024-01-15T10:30:00Z',
    modifiedon: '2024-10-20T14:45:00Z'
  },
  {
    crc53_customerid: 'demo-customer-2',
    crc53_name: 'Fabrikam Healthcare',
    crc53_keystakeholders: [
      { id: '3', name: 'Dr. James Liu', role: 'Chief Information Officer', email: 'james.liu@fabrikam.health' },
      { id: '4', name: 'Amanda Foster', role: 'IT Director', email: 'a.foster@fabrikam.health' }
    ],
    crc53_primarytechfocus: 100000003, // Power Apps
    createdon: '2024-02-10T09:15:00Z',
    modifiedon: '2024-10-18T11:20:00Z'
  },
  {
    crc53_customerid: 'demo-customer-3',
    crc53_name: 'Adventure Works Retail',
    crc53_keystakeholders: [
      { id: '5', name: 'Emily Thompson', role: 'VP of Technology', email: 'emily.t@adventureworks.com' },
      { id: '6', name: 'David Park', role: 'Solutions Architect', email: 'd.park@adventureworks.com' }
    ],
    crc53_primarytechfocus: 100000001, // Copilot Studio
    createdon: '2024-01-05T13:00:00Z',
    modifiedon: '2024-10-22T16:30:00Z'
  },
  {
    crc53_customerid: 'demo-customer-4',
    crc53_name: 'Northwind Financial Services',
    crc53_keystakeholders: [
      { id: '7', name: 'Robert Chang', role: 'Chief Digital Officer', email: 'r.chang@northwind.com' },
      { id: '8', name: 'Lisa Martinez', role: 'Head of Innovation', email: 'lisa.m@northwind.com' }
    ],
    crc53_primarytechfocus: 100000038, // Azure AI Foundry
    createdon: '2024-03-12T08:45:00Z',
    modifiedon: '2024-10-25T10:15:00Z'
  },
  {
    crc53_customerid: 'demo-customer-5',
    crc53_name: 'Tailspin Logistics',
    crc53_keystakeholders: [
      { id: '9', name: 'Jennifer Wu', role: 'VP Operations', email: 'jwu@tailspin.com' }
    ],
    crc53_primarytechfocus: 100000004, // Power Automate
    createdon: '2024-02-20T14:30:00Z',
    modifiedon: '2024-10-19T09:45:00Z'
  },
  {
    crc53_customerid: 'demo-customer-6',
    crc53_name: 'Woodgrove Bank',
    crc53_keystakeholders: [
      { id: '10', name: 'Marcus Johnson', role: 'CTO', email: 'marcus.j@woodgrove.bank' },
      { id: '11', name: 'Priya Sharma', role: 'AI Program Manager', email: 'priya.s@woodgrove.bank' }
    ],
    crc53_primarytechfocus: 100000000, // M365 Copilot
    createdon: '2024-01-28T11:00:00Z',
    modifiedon: '2024-10-24T13:20:00Z'
  },
  {
    crc53_customerid: 'demo-customer-7',
    crc53_name: 'Proseware Insurance',
    crc53_keystakeholders: [
      { id: '12', name: 'Angela Morrison', role: 'VP of IT', email: 'a.morrison@proseware.com' }
    ],
    crc53_primarytechfocus: 100000001, // Copilot Studio
    createdon: '2024-03-05T09:30:00Z',
    modifiedon: '2024-10-21T15:45:00Z'
  },
  {
    crc53_customerid: 'demo-customer-8',
    crc53_name: 'VanArsdel Energy',
    crc53_keystakeholders: [
      { id: '13', name: 'Thomas Anderson', role: 'Director of Digital Services', email: 't.anderson@vanarsdel.energy' },
      { id: '14', name: 'Maria Garcia', role: 'Chief Data Officer', email: 'm.garcia@vanarsdel.energy' }
    ],
    crc53_primarytechfocus: 100000038, // Azure AI Foundry
    createdon: '2024-02-14T10:15:00Z',
    modifiedon: '2024-10-23T11:30:00Z'
  },
  {
    crc53_customerid: 'demo-customer-9',
    crc53_name: 'Litware Education',
    crc53_keystakeholders: [
      { id: '15', name: 'Dr. Karen White', role: 'CIO', email: 'k.white@litware.edu' }
    ],
    crc53_primarytechfocus: 100000003, // Power Apps
    createdon: '2024-01-18T13:45:00Z',
    modifiedon: '2024-10-20T16:00:00Z'
  },
  {
    crc53_customerid: 'demo-customer-10',
    crc53_name: 'Fourth Coffee Hospitality',
    crc53_keystakeholders: [
      { id: '16', name: 'Daniel Kim', role: 'VP Technology', email: 'd.kim@fourthcoffee.com' },
      { id: '17', name: 'Sophie Laurent', role: 'Digital Experience Lead', email: 's.laurent@fourthcoffee.com' }
    ],
    crc53_primarytechfocus: 100000004, // Power Automate
    createdon: '2024-02-28T15:20:00Z',
    modifiedon: '2024-10-26T14:10:00Z'
  },
  {
    crc53_customerid: 'demo-customer-11',
    crc53_name: 'Alpine Ski House',
    crc53_keystakeholders: [
      { id: '18', name: 'Erik Olsen', role: 'IT Manager', email: 'erik.o@alpineskihouse.com' }
    ],
    crc53_primarytechfocus: 100000006, // Dataverse
    createdon: '2024-03-08T12:00:00Z',
    modifiedon: '2024-10-22T10:45:00Z'
  },
  {
    crc53_customerid: 'demo-customer-12',
    crc53_name: 'Relecloud Technologies',
    crc53_keystakeholders: [
      { id: '19', name: 'Nina Patel', role: 'Chief Technology Officer', email: 'nina.p@relecloud.com' },
      { id: '20', name: 'Alex Turner', role: 'Head of AI Strategy', email: 'a.turner@relecloud.com' }
    ],
    crc53_primarytechfocus: 100000038, // Azure AI Foundry
    createdon: '2024-01-22T14:30:00Z',
    modifiedon: '2024-10-27T09:15:00Z'
  }
];

export const DEMO_PROJECTS: Project[] = [
  // Projects due in ~7 days (urgent)
  {
    crc53_projectid: 'demo-project-1',
    crc53_name: 'M365 Copilot Pilot Expansion',
    crc53_primarystakeholder: 'Sarah Chen',
    crc53_description: 'Expand M365 Copilot pilot from 50 to 500 users across finance and operations departments',
    crc53_notes: [
      { id: 'n1', content: 'Initial pilot showed 40% productivity gains', timestamp: '2024-10-15T10:00:00Z' },
      { id: 'n2', content: 'Executive approval received for expansion', timestamp: '2024-10-28T14:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(7),
    crc53_primarytechnology: 100000000, // M365 Copilot
    _crc53_customerid_value: 'demo-customer-1',
    crc53_customerid: DEMO_CUSTOMERS[0],
    createdon: '2024-09-10T08:00:00Z',
    modifiedon: '2024-10-29T15:45:00Z'
  },
  {
    crc53_projectid: 'demo-project-2',
    crc53_name: 'Patient Portal Power App',
    crc53_primarystakeholder: 'Dr. James Liu',
    crc53_description: 'Deploy patient-facing mobile app for appointment scheduling and medical records access',
    crc53_notes: [
      { id: 'n3', content: 'HIPAA compliance review completed', timestamp: '2024-10-20T11:00:00Z' },
      { id: 'n4', content: 'Beta testing with 100 patients scheduled', timestamp: '2024-10-25T09:15:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(8),
    crc53_primarytechnology: 100000003, // Power Apps
    _crc53_customerid_value: 'demo-customer-2',
    crc53_customerid: DEMO_CUSTOMERS[1],
    createdon: '2024-09-05T09:30:00Z',
    modifiedon: '2024-10-26T12:15:00Z'
  },
  {
    crc53_projectid: 'demo-project-3',
    crc53_name: 'Customer Service Copilot',
    crc53_primarystakeholder: 'Emily Thompson',
    crc53_description: 'Implement AI-powered customer service agent using Copilot Studio integrated with existing CRM',
    crc53_notes: [
      { id: 'n5', content: 'Knowledge base with 500+ articles imported', timestamp: '2024-10-12T13:00:00Z' },
      { id: 'n6', content: 'Conversation flows for top 20 inquiries designed', timestamp: '2024-10-22T10:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(6),
    crc53_primarytechnology: 100000001, // Copilot Studio
    _crc53_customerid_value: 'demo-customer-3',
    crc53_customerid: DEMO_CUSTOMERS[2],
    createdon: '2024-09-01T10:00:00Z',
    modifiedon: '2024-10-27T09:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-4',
    crc53_name: 'Azure AI Document Intelligence',
    crc53_primarystakeholder: 'Robert Chang',
    crc53_description: 'Deploy Azure AI Foundry solution for automated loan document processing and risk assessment',
    crc53_notes: [
      { id: 'n7', content: 'Model trained on 10K historical loan applications', timestamp: '2024-10-18T15:00:00Z' },
      { id: 'n8', content: 'Accuracy rate: 94% on validation set', timestamp: '2024-10-24T11:45:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(9),
    crc53_primarytechnology: 100000038, // Azure AI Foundry
    _crc53_customerid_value: 'demo-customer-4',
    crc53_customerid: DEMO_CUSTOMERS[3],
    createdon: '2024-09-15T14:00:00Z',
    modifiedon: '2024-10-25T16:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-5',
    crc53_name: 'Automated Invoice Processing',
    crc53_primarystakeholder: 'Jennifer Wu',
    crc53_description: 'Power Automate workflows to process supplier invoices and integrate with SAP',
    crc53_notes: [
      { id: 'n9', content: 'Currently processing 200 invoices/day manually', timestamp: '2024-10-10T08:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(7),
    crc53_primarytechnology: 100000004, // Power Automate
    _crc53_customerid_value: 'demo-customer-5',
    crc53_customerid: DEMO_CUSTOMERS[4],
    createdon: '2024-09-20T11:30:00Z',
    modifiedon: '2024-10-28T14:20:00Z'
  },
  {
    crc53_projectid: 'demo-project-6',
    crc53_name: 'Banking Operations Copilot',
    crc53_primarystakeholder: 'Marcus Johnson',
    crc53_description: 'M365 Copilot deployment for 800 banking staff with focus on compliance and documentation',
    crc53_notes: [
      { id: 'n10', content: 'Security assessment completed successfully', timestamp: '2024-10-14T10:00:00Z' },
      { id: 'n11', content: 'Regulatory approval from compliance team', timestamp: '2024-10-21T16:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(8),
    crc53_primarytechnology: 100000000, // M365 Copilot
    _crc53_customerid_value: 'demo-customer-6',
    crc53_customerid: DEMO_CUSTOMERS[5],
    createdon: '2024-09-08T09:00:00Z',
    modifiedon: '2024-10-26T13:45:00Z'
  },

  // Projects due in ~30 days (medium term)
  {
    crc53_projectid: 'demo-project-7',
    crc53_name: 'Claims Processing Copilot Studio Bot',
    crc53_primarystakeholder: 'Angela Morrison',
    crc53_description: 'Intelligent chatbot to guide customers through insurance claims submission process',
    crc53_notes: [
      { id: 'n12', content: 'User journey mapping completed with UX team', timestamp: '2024-10-05T14:00:00Z' },
      { id: 'n13', content: 'Integration with claims system tested', timestamp: '2024-10-19T11:20:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(28),
    crc53_primarytechnology: 100000001, // Copilot Studio
    _crc53_customerid_value: 'demo-customer-7',
    crc53_customerid: DEMO_CUSTOMERS[6],
    createdon: '2024-09-12T10:30:00Z',
    modifiedon: '2024-10-23T15:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-8',
    crc53_name: 'Predictive Maintenance AI',
    crc53_primarystakeholder: 'Maria Garcia',
    crc53_description: 'Azure AI Foundry solution to predict equipment failures in power generation facilities',
    crc53_notes: [
      { id: 'n14', content: 'IoT sensors deployed across 5 facilities', timestamp: '2024-09-25T13:15:00Z' },
      { id: 'n15', content: 'Initial model shows 85% prediction accuracy', timestamp: '2024-10-15T10:45:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(32),
    crc53_primarytechnology: 100000038, // Azure AI Foundry
    _crc53_customerid_value: 'demo-customer-8',
    crc53_customerid: DEMO_CUSTOMERS[7],
    createdon: '2024-08-20T11:00:00Z',
    modifiedon: '2024-10-20T14:30:00Z'
  },
  {
    crc53_projectid: 'demo-project-9',
    crc53_name: 'Student Services Portal',
    crc53_primarystakeholder: 'Dr. Karen White',
    crc53_description: 'Unified Power Apps portal for enrollment, grades, and student support services',
    crc53_notes: [
      { id: 'n16', content: 'Requirements gathered from 500+ students', timestamp: '2024-09-18T09:00:00Z' },
      { id: 'n17', content: 'Prototype approved by student council', timestamp: '2024-10-10T15:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(30),
    crc53_primarytechnology: 100000003, // Power Apps
    _crc53_customerid_value: 'demo-customer-9',
    crc53_customerid: DEMO_CUSTOMERS[8],
    createdon: '2024-08-28T14:00:00Z',
    modifiedon: '2024-10-18T12:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-10',
    crc53_name: 'Guest Experience Automation',
    crc53_primarystakeholder: 'Daniel Kim',
    crc53_description: 'Power Automate workflows for guest check-in, room service, and feedback collection',
    crc53_notes: [
      { id: 'n18', content: 'Pilot at flagship hotel shows 60% faster check-in', timestamp: '2024-10-08T16:00:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(29),
    crc53_primarytechnology: 100000004, // Power Automate
    _crc53_customerid_value: 'demo-customer-10',
    crc53_customerid: DEMO_CUSTOMERS[9],
    createdon: '2024-09-03T10:15:00Z',
    modifiedon: '2024-10-22T11:45:00Z'
  },
  {
    crc53_projectid: 'demo-project-11',
    crc53_name: 'Dataverse Customer 360',
    crc53_primarystakeholder: 'Erik Olsen',
    crc53_description: 'Centralized Dataverse platform for unified customer data across retail and resort operations',
    crc53_notes: [
      { id: 'n19', content: 'Data model design approved by stakeholders', timestamp: '2024-10-12T13:30:00Z' },
      { id: 'n20', content: 'Legacy system integration plan finalized', timestamp: '2024-10-20T09:45:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(31),
    crc53_primarytechnology: 100000006, // Dataverse
    _crc53_customerid_value: 'demo-customer-11',
    crc53_customerid: DEMO_CUSTOMERS[10],
    createdon: '2024-09-07T12:00:00Z',
    modifiedon: '2024-10-24T10:20:00Z'
  },
  {
    crc53_projectid: 'demo-project-12',
    crc53_name: 'Code Review AI Assistant',
    crc53_primarystakeholder: 'Nina Patel',
    crc53_description: 'Azure AI Foundry solution to automate code review and suggest improvements for dev teams',
    crc53_notes: [
      { id: 'n21', content: 'Model trained on internal codebase standards', timestamp: '2024-10-11T14:15:00Z' },
      { id: 'n22', content: 'Integration with GitHub completed', timestamp: '2024-10-19T10:00:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(33),
    crc53_primarytechnology: 100000038, // Azure AI Foundry
    _crc53_customerid_value: 'demo-customer-12',
    crc53_customerid: DEMO_CUSTOMERS[11],
    createdon: '2024-08-30T15:00:00Z',
    modifiedon: '2024-10-25T16:30:00Z'
  },
  {
    crc53_projectid: 'demo-project-13',
    crc53_name: 'Supply Chain Visibility Platform',
    crc53_primarystakeholder: 'Michael Rodriguez',
    crc53_description: 'Power Apps solution for real-time supply chain tracking and vendor management',
    crc53_notes: [
      { id: 'n23', content: 'Onboarded 50 key suppliers to platform', timestamp: '2024-10-16T11:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(30),
    crc53_primarytechnology: 100000003, // Power Apps
    _crc53_customerid_value: 'demo-customer-1',
    crc53_customerid: DEMO_CUSTOMERS[0],
    createdon: '2024-09-10T13:45:00Z',
    modifiedon: '2024-10-21T14:15:00Z'
  },

  // Projects due in ~60 days (long term)
  {
    crc53_projectid: 'demo-project-14',
    crc53_name: 'Clinical Decision Support AI',
    crc53_primarystakeholder: 'Amanda Foster',
    crc53_description: 'Azure AI Foundry solution to assist physicians with diagnosis recommendations based on patient data',
    crc53_notes: [
      { id: 'n24', content: 'Ethical review board approval received', timestamp: '2024-10-01T09:00:00Z' },
      { id: 'n25', content: 'Initial dataset of 5,000 cases prepared', timestamp: '2024-10-14T13:45:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(62),
    crc53_primarytechnology: 100000038, // Azure AI Foundry
    _crc53_customerid_value: 'demo-customer-2',
    crc53_customerid: DEMO_CUSTOMERS[1],
    createdon: '2024-08-15T10:00:00Z',
    modifiedon: '2024-10-17T15:20:00Z'
  },
  {
    crc53_projectid: 'demo-project-15',
    crc53_name: 'Omnichannel Retail Copilot',
    crc53_primarystakeholder: 'David Park',
    crc53_description: 'Copilot Studio bot for unified customer support across web, mobile, and in-store channels',
    crc53_notes: [
      { id: 'n26', content: 'Channel integration architecture designed', timestamp: '2024-09-22T14:00:00Z' },
      { id: 'n27', content: 'Product catalog sync tested successfully', timestamp: '2024-10-09T11:15:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(58),
    crc53_primarytechnology: 100000001, // Copilot Studio
    _crc53_customerid_value: 'demo-customer-3',
    crc53_customerid: DEMO_CUSTOMERS[2],
    createdon: '2024-08-25T11:30:00Z',
    modifiedon: '2024-10-16T09:45:00Z'
  },
  {
    crc53_projectid: 'demo-project-16',
    crc53_name: 'Trading Desk M365 Copilot',
    crc53_primarystakeholder: 'Lisa Martinez',
    crc53_description: 'Specialized M365 Copilot deployment for trading desk with market data integration',
    crc53_notes: [
      { id: 'n28', content: 'Compliance requirements documented', timestamp: '2024-09-28T10:30:00Z' },
      { id: 'n29', content: 'Bloomberg data feed integration designed', timestamp: '2024-10-13T15:00:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(61),
    crc53_primarytechnology: 100000000, // M365 Copilot
    _crc53_customerid_value: 'demo-customer-4',
    crc53_customerid: DEMO_CUSTOMERS[3],
    createdon: '2024-08-18T09:15:00Z',
    modifiedon: '2024-10-19T12:30:00Z'
  },
  {
    crc53_projectid: 'demo-project-17',
    crc53_name: 'Fleet Management Power Platform',
    crc53_primarystakeholder: 'Jennifer Wu',
    crc53_description: 'Comprehensive solution using Power Apps, Power Automate, and Dataverse for fleet operations',
    crc53_notes: [
      { id: 'n30', content: 'GPS tracking integration completed', timestamp: '2024-10-04T14:45:00Z' },
      { id: 'n31', content: 'Maintenance scheduling workflows built', timestamp: '2024-10-18T10:15:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(59),
    crc53_primarytechnology: 100000006, // Dataverse
    _crc53_customerid_value: 'demo-customer-5',
    crc53_customerid: DEMO_CUSTOMERS[4],
    createdon: '2024-08-22T13:00:00Z',
    modifiedon: '2024-10-23T11:00:00Z'
  },
  {
    crc53_projectid: 'demo-project-18',
    crc53_name: 'Financial Advisory Copilot',
    crc53_primarystakeholder: 'Priya Sharma',
    crc53_description: 'Copilot Studio solution to assist financial advisors with client portfolio recommendations',
    crc53_notes: [
      { id: 'n32', content: 'Risk assessment algorithms validated', timestamp: '2024-10-07T09:30:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(60),
    crc53_primarytechnology: 100000001, // Copilot Studio
    _crc53_customerid_value: 'demo-customer-6',
    crc53_customerid: DEMO_CUSTOMERS[5],
    createdon: '2024-08-28T14:30:00Z',
    modifiedon: '2024-10-15T16:45:00Z'
  },
  {
    crc53_projectid: 'demo-project-19',
    crc53_name: 'HR Onboarding Automation',
    crc53_primarystakeholder: 'Angela Morrison',
    crc53_description: 'End-to-end Power Automate solution for employee onboarding across 15 departments',
    crc53_notes: [
      { id: 'n33', content: 'Workflow reduces onboarding time from 2 weeks to 3 days', timestamp: '2024-10-11T11:00:00Z' },
      { id: 'n34', content: 'Integration with HRIS and IT systems completed', timestamp: '2024-10-20T14:20:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(63),
    crc53_primarytechnology: 100000004, // Power Automate
    _crc53_customerid_value: 'demo-customer-7',
    crc53_customerid: DEMO_CUSTOMERS[6],
    createdon: '2024-08-19T10:45:00Z',
    modifiedon: '2024-10-24T13:15:00Z'
  },
  {
    crc53_projectid: 'demo-project-20',
    crc53_name: 'DevOps Productivity Copilot',
    crc53_primarystakeholder: 'Alex Turner',
    crc53_description: 'M365 Copilot customized for engineering teams with Azure DevOps and GitHub integration',
    crc53_notes: [
      { id: 'n35', content: 'Custom prompts for code documentation created', timestamp: '2024-10-06T15:30:00Z' },
      { id: 'n36', content: 'Sprint planning assistant tested with pilot team', timestamp: '2024-10-17T10:00:00Z' }
    ],
    crc53_estimatedduedate: getDaysFromNow(58),
    crc53_primarytechnology: 100000000, // M365 Copilot
    _crc53_customerid_value: 'demo-customer-12',
    crc53_customerid: DEMO_CUSTOMERS[11],
    createdon: '2024-08-26T12:15:00Z',
    modifiedon: '2024-10-22T09:30:00Z'
  }
];
