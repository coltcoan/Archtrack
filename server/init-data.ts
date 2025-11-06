import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const DATABASE_ROOT = path.join(
  os.homedir(),
  'Library',
  'CloudStorage',
  'OneDrive-Microsoft',
  'CSA Tracker Database'
);

const CUSTOMERS_DIR = path.join(DATABASE_ROOT, 'customers');
const PROJECTS_DIR = path.join(DATABASE_ROOT, 'projects');

async function initializeData() {
  try {
    // Ensure directories exist
    await fs.mkdir(CUSTOMERS_DIR, { recursive: true });
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    
    console.log('📁 Creating sample data...');
    
    // Create sample customers
    const customers = [
      {
        crc53_customerid: '1',
        crc53_name: 'Acme Corporation',
        crc53_keystakeholders: [
          { id: '1', name: 'John Smith', role: 'CEO', email: 'john@acme.com' },
          { id: '2', name: 'Sarah Johnson', role: 'CTO', email: 'sarah@acme.com' },
          { id: '3', name: 'Mike Davis', role: 'Project Manager', email: 'mike@acme.com' },
        ],
        crc53_primarytechfocus: 'PowerApps',
        createdon: new Date().toISOString(),
      },
      {
        crc53_customerid: '2',
        crc53_name: 'TechStart Inc',
        crc53_keystakeholders: [
          { id: '4', name: 'Emily Chen', role: 'VP of Operations', email: 'emily@techstart.com' },
          { id: '5', name: 'David Brown', role: 'IT Director', email: 'david@techstart.com' },
        ],
        crc53_primarytechfocus: 'M365Copilot',
        createdon: new Date().toISOString(),
      },
    ];
    
    for (const customer of customers) {
      await fs.writeFile(
        path.join(CUSTOMERS_DIR, `${customer.crc53_customerid}.json`),
        JSON.stringify(customer, null, 2),
        'utf-8'
      );
      console.log(`✓ Created customer: ${customer.crc53_name}`);
    }
    
    // Create sample projects
    const projects = [
      {
        crc53_projectid: '1',
        crc53_name: 'Employee Portal Modernization',
        crc53_primarystakeholder: 'Sarah Johnson',
        crc53_description: 'Complete overhaul of internal employee portal using modern Power Apps',
        crc53_notes: [
          { id: '1', content: 'Initial requirements gathering completed', timestamp: new Date('2024-01-05').toISOString() },
          { id: '2', content: 'Design mockups approved by stakeholders', timestamp: new Date('2024-01-15').toISOString() },
          { id: '3', content: 'Development 60% complete', timestamp: new Date('2024-02-01').toISOString() },
        ],
        crc53_estimatedduedate: '2024-03-15',
        crc53_primarytechnology: 'PowerApps',
        _crc53_customerid_value: '1',
        createdon: new Date().toISOString(),
      },
      {
        crc53_projectid: '2',
        crc53_name: 'AI Assistant Implementation',
        crc53_primarystakeholder: 'Emily Chen',
        crc53_description: 'Deploy M365 Copilot across organization with custom training',
        crc53_notes: [
          { id: '4', content: 'Project kickoff scheduled for March', timestamp: new Date('2024-02-10').toISOString() },
        ],
        crc53_estimatedduedate: '2024-06-30',
        crc53_primarytechnology: 'M365Copilot',
        _crc53_customerid_value: '2',
        createdon: new Date().toISOString(),
      },
      {
        crc53_projectid: '3',
        crc53_name: 'Dataverse Migration',
        crc53_primarystakeholder: 'Mike Davis',
        crc53_description: 'Migrate legacy data systems to Dataverse',
        crc53_notes: [
          { id: '5', content: 'Data mapping completed', timestamp: new Date('2023-11-15').toISOString() },
          { id: '6', content: 'Migration phase 1 completed successfully', timestamp: new Date('2023-12-01').toISOString() },
          { id: '7', content: 'All data migrated and validated', timestamp: new Date('2024-01-20').toISOString() },
          { id: '8', content: 'Project closed successfully', timestamp: new Date('2024-02-01').toISOString() },
        ],
        crc53_estimatedduedate: '2024-02-01',
        crc53_primarytechnology: 'Dataverse',
        _crc53_customerid_value: '1',
        createdon: new Date().toISOString(),
      },
    ];
    
    for (const project of projects) {
      await fs.writeFile(
        path.join(PROJECTS_DIR, `${project.crc53_projectid}.json`),
        JSON.stringify(project, null, 2),
        'utf-8'
      );
      console.log(`✓ Created project: ${project.crc53_name}`);
    }
    
    console.log('\n✅ Sample data initialized successfully!');
    console.log(`📁 Location: ${DATABASE_ROOT}`);
    
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    process.exit(1);
  }
}

initializeData();
