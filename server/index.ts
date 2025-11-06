import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import * as XLSX from 'xlsx';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Default OneDrive for Business path
let DATABASE_ROOT = path.join(
  os.homedir(),
  'Library',
  'CloudStorage',
  'OneDrive-Microsoft',
  'CSA Tracker Database'
);

let CUSTOMERS_DIR = path.join(DATABASE_ROOT, 'customers');
let PROJECTS_DIR = path.join(DATABASE_ROOT, 'projects');

// Config file will be stored in the database root after it's configured
// Initially stored in home directory for backward compatibility
const HOME_CONFIG_FILE = path.join(os.homedir(), '.csa-tracker-config.json');
let CONFIG_FILE = HOME_CONFIG_FILE;

// Track if user has configured a custom database location
// We'll check if directories exist and have data to determine initial state
let isConfigured = false;
let isDemoMode = false;
let solutionArea: string | null = null;
let skillset: number[] = []; // Array of TechnologyType values

// Load config from file
async function loadConfig() {
  try {
    // Try loading from home directory first (backward compatibility)
    let configData: string;
    try {
      configData = await fs.readFile(HOME_CONFIG_FILE, 'utf-8');
      CONFIG_FILE = HOME_CONFIG_FILE;
    } catch (homeError) {
      // Try loading from database directory
      const dbConfigFile = path.join(DATABASE_ROOT, 'settings.json');
      configData = await fs.readFile(dbConfigFile, 'utf-8');
      CONFIG_FILE = dbConfigFile;
    }
    
    const config = JSON.parse(configData);
    if (config.databasePath) {
      DATABASE_ROOT = config.databasePath;
      CUSTOMERS_DIR = path.join(DATABASE_ROOT, 'customers');
      PROJECTS_DIR = path.join(DATABASE_ROOT, 'projects');
      // Use config file in database directory
      CONFIG_FILE = path.join(DATABASE_ROOT, 'settings.json');
      
      // Re-read config from the database directory to get all settings
      try {
        const dbConfigData = await fs.readFile(CONFIG_FILE, 'utf-8');
        const dbConfig = JSON.parse(dbConfigData);
        isDemoMode = dbConfig.isDemoMode || false;
        solutionArea = dbConfig.solutionArea || null;
        skillset = Array.isArray(dbConfig.skillset) ? dbConfig.skillset : [];
      } catch (readError) {
        // Use values from initial config if database config can't be read
        isDemoMode = config.isDemoMode || false;
        solutionArea = config.solutionArea || null;
        skillset = Array.isArray(config.skillset) ? config.skillset : [];
      }
    } else {
      isDemoMode = config.isDemoMode || false;
      solutionArea = config.solutionArea || null;
      skillset = Array.isArray(config.skillset) ? config.skillset : [];
    }
    
    console.log('📋 Loaded config:', { 
      databasePath: DATABASE_ROOT, 
      configFile: CONFIG_FILE, 
      isDemoMode, 
      solutionArea: solutionArea || '(not set)', 
      skillset: skillset.length > 0 ? skillset : '(empty)',
      skillsetCount: skillset.length 
    });
  } catch (error) {
    // Config file doesn't exist yet, use defaults
    console.log('📋 Using default config');
  }
}

// Save config to file
async function saveConfig() {
  try {
    const config = {
      databasePath: DATABASE_ROOT,
      isDemoMode,
      solutionArea,
      skillset
    };
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    console.log('💾 Config saved');
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

// Default OneDrive path for reference
const DEFAULT_DATABASE_ROOT = path.join(
  os.homedir(),
  'Library',
  'CloudStorage',
  'OneDrive-Microsoft',
  'CSA Tracker Database'
);

// Sample data for demo mode
const SAMPLE_CUSTOMERS = [
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

const SAMPLE_PROJECTS = [
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
    crc53_customerid: SAMPLE_CUSTOMERS[0],
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
    crc53_customerid: SAMPLE_CUSTOMERS[1],
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
    crc53_customerid: SAMPLE_CUSTOMERS[2],
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
    crc53_customerid: SAMPLE_CUSTOMERS[0],
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
    crc53_customerid: SAMPLE_CUSTOMERS[2],
    createdon: '2024-03-08T11:30:00Z',
    modifiedon: '2024-03-21T14:20:00Z'
  }
];

// Check if database has been configured (has existing data or non-default path)
async function checkIfConfigured(): Promise<boolean> {
  try {
    // Check if directories exist
    const customersExist = await fs.access(CUSTOMERS_DIR).then(() => true).catch(() => false);
    const projectsExist = await fs.access(PROJECTS_DIR).then(() => true).catch(() => false);
    
    if (!customersExist || !projectsExist) {
      return false;
    }
    
    // Check if there's any data in the directories
    const customerFiles = await fs.readdir(CUSTOMERS_DIR).catch(() => []);
    const projectFiles = await fs.readdir(PROJECTS_DIR).catch(() => []);
    
    const hasCustomerData = customerFiles.filter(f => f.endsWith('.json')).length > 0;
    const hasProjectData = projectFiles.filter(f => f.endsWith('.json')).length > 0;
    
    // If there's any data, consider it configured
    return hasCustomerData || hasProjectData;
  } catch (error) {
    return false;
  }
}

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(CUSTOMERS_DIR, { recursive: true });
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    console.log(`📁 Database directories ready at: ${DATABASE_ROOT}`);
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Update database path
function updateDatabasePath(newPath: string) {
  DATABASE_ROOT = newPath;
  CUSTOMERS_DIR = path.join(DATABASE_ROOT, 'customers');
  PROJECTS_DIR = path.join(DATABASE_ROOT, 'projects');
  isConfigured = true;
}

// Helper functions
async function listFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files.filter(f => f.endsWith('.json'));
  } catch (error) {
    return [];
  }
}

async function readFile<T>(dir: string, filename: string): Promise<T | null> {
  try {
    const content = await fs.readFile(path.join(dir, filename), 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    return null;
  }
}

async function writeFile(dir: string, filename: string, data: any): Promise<void> {
  await fs.writeFile(
    path.join(dir, filename),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

async function deleteFile(dir: string, filename: string): Promise<void> {
  try {
    await fs.unlink(path.join(dir, filename));
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    // If demo mode is enabled, return sample projects
    if (isDemoMode) {
      return res.json(SAMPLE_PROJECTS);
    }

    const files = await listFiles(PROJECTS_DIR);
    const projects = [];
    
    for (const file of files) {
      const project = await readFile(PROJECTS_DIR, file);
      if (project) projects.push(project);
    }
    
    // Sort by creation date, newest first
    projects.sort((a: any, b: any) => 
      new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
    );
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Export projects to Excel
app.get('/api/projects/export', async (req, res) => {
  try {
    // Get projects data
    const files = await listFiles(PROJECTS_DIR);
    const projects = [];
    
    for (const file of files) {
      const project = await readFile(PROJECTS_DIR, file);
      if (project) projects.push(project);
    }
    
    // Sort by creation date, newest first
    projects.sort((a: any, b: any) => 
      new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
    );
    
    // Transform projects data for Excel
    const exportData = projects.map((project: any) => ({
      'Project ID': project.crc53_projectid || '',
      'Project Name': project.crc53_name || '',
      'Customer': project.crc53_customer || '',
      'Primary Stakeholder': project.crc53_primarystakeholder || '',
      'Description': project.crc53_description || '',
      'Primary Technology': project.crc53_primarytechnology || '',
      'Estimated Due Date': project.crc53_estimatedduedate ? new Date(project.crc53_estimatedduedate).toLocaleDateString() : '',
      'Created On': project.createdon ? new Date(project.createdon).toLocaleDateString() : '',
      'Modified On': project.modifiedon ? new Date(project.modifiedon).toLocaleDateString() : '',
      'Notes': project.crc53_notes ? project.crc53_notes.map((n: any) => `${n.date}: ${n.text}`).join(' | ') : ''
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Project ID
      { wch: 30 }, // Project Name
      { wch: 25 }, // Customer
      { wch: 25 }, // Primary Stakeholder
      { wch: 40 }, // Description
      { wch: 20 }, // Primary Technology
      { wch: 15 }, // Est Due Date
      { wch: 12 }, // Created On
      { wch: 12 }, // Modified On
      { wch: 50 }  // Notes
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=projects-export-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    res.send(excelBuffer);
  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ error: 'Failed to export projects' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    // If demo mode is enabled, return sample project
    if (isDemoMode) {
      const project = SAMPLE_PROJECTS.find(p => p.crc53_projectid === req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json(project);
    }

    const project = await readFile(PROJECTS_DIR, `${req.params.id}.json`);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot modify data in demo mode' });
    }

    const id = `${Date.now()}`;
    
    // Handle customer relationship
    let customerIdValue: string | undefined;
    if (req.body['crc53_customerid@odata.bind']) {
      // Extract customer ID from OData bind format: /crc53_customers(ID)
      const match = req.body['crc53_customerid@odata.bind'].match(/\(([^)]+)\)/);
      if (match) {
        customerIdValue = match[1];
      }
    }
    
    const project = {
      ...req.body,
      crc53_projectid: id,
      _crc53_customerid_value: customerIdValue,
      createdon: new Date().toISOString(),
      modifiedon: new Date().toISOString(),
    };
    
    // Remove the odata.bind field as it's been converted
    delete project['crc53_customerid@odata.bind'];
    
    await writeFile(PROJECTS_DIR, `${id}.json`, project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot modify data in demo mode' });
    }

    const existing = await readFile(PROJECTS_DIR, `${req.params.id}.json`);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Handle customer relationship
    let customerIdValue = (existing as any)._crc53_customerid_value;
    if (req.body['crc53_customerid@odata.bind']) {
      // Extract customer ID from OData bind format: /crc53_customers(ID)
      const match = req.body['crc53_customerid@odata.bind'].match(/\(([^)]+)\)/);
      if (match) {
        customerIdValue = match[1];
      }
    }
    
    const updated = {
      ...existing,
      ...req.body,
      crc53_projectid: req.params.id,
      _crc53_customerid_value: customerIdValue,
      modifiedon: new Date().toISOString(),
    };
    
    // Remove the odata.bind field as it's been converted
    delete updated['crc53_customerid@odata.bind'];
    
    await writeFile(PROJECTS_DIR, `${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot delete data in demo mode' });
    }

    await deleteFile(PROJECTS_DIR, `${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Customers API
app.get('/api/customers', async (req, res) => {
  try {
    // If demo mode is enabled, return sample customers
    if (isDemoMode) {
      return res.json(SAMPLE_CUSTOMERS);
    }

    const files = await listFiles(CUSTOMERS_DIR);
    const customers = [];
    
    for (const file of files) {
      const customer = await readFile(CUSTOMERS_DIR, file);
      if (customer) customers.push(customer);
    }
    
    // Sort by name
    customers.sort((a: any, b: any) => a.crc53_name.localeCompare(b.crc53_name));
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    // If demo mode is enabled, return sample customer
    if (isDemoMode) {
      const customer = SAMPLE_CUSTOMERS.find(c => c.crc53_customerid === req.params.id);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      return res.json(customer);
    }

    const customer = await readFile(CUSTOMERS_DIR, `${req.params.id}.json`);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot modify data in demo mode' });
    }

    const id = `${Date.now()}`;
    const customer = {
      ...req.body,
      crc53_customerid: id,
      createdon: new Date().toISOString(),
      modifiedon: new Date().toISOString(),
    };
    
    await writeFile(CUSTOMERS_DIR, `${id}.json`, customer);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot modify data in demo mode' });
    }

    const existing = await readFile(CUSTOMERS_DIR, `${req.params.id}.json`);
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const updated = {
      ...existing,
      ...req.body,
      crc53_customerid: req.params.id,
      modifiedon: new Date().toISOString(),
    };
    
    await writeFile(CUSTOMERS_DIR, `${req.params.id}.json`, updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    // Prevent modifications in demo mode
    if (isDemoMode) {
      return res.status(403).json({ error: 'Cannot delete data in demo mode' });
    }

    await deleteFile(CUSTOMERS_DIR, `${req.params.id}.json`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Settings API - Check if database is configured
app.get('/api/settings/is-configured', async (req, res) => {
  console.log('🔍 Client requesting config - Current values:', { 
    solutionArea: solutionArea || '(not set)', 
    skillsetCount: skillset?.length || 0 
  });
  res.json({ 
    isConfigured, 
    isDemoMode, 
    databasePath: DATABASE_ROOT,
    solutionArea,
    skillset
  });
});

// Settings API - Update solution area and skillset
app.post('/api/settings/preferences', async (req, res) => {
  try {
    const { solutionArea: newSolutionArea, skillset: newSkillset } = req.body;
    
    console.log('💾 Updating preferences:', { 
      before: { solutionArea, skillsetCount: skillset?.length || 0 },
      incoming: { solutionArea: newSolutionArea, skillsetCount: newSkillset?.length || 0 }
    });
    
    if (newSolutionArea !== undefined) {
      solutionArea = newSolutionArea;
    }
    if (newSkillset !== undefined) {
      skillset = newSkillset;
    }
    
    await saveConfig();
    
    console.log('✅ Preferences saved:', { solutionArea, skillsetCount: skillset?.length || 0 });
    
    res.json({ 
      success: true, 
      solutionArea,
      skillset
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Settings API - Toggle demo mode
app.post('/api/settings/demo-mode', async (req, res) => {
  try {
    const { enabled } = req.body;
    isDemoMode = enabled === true;
    await saveConfig();
    console.log('🎭 Demo mode:', isDemoMode ? 'enabled' : 'disabled');
    res.json({ success: true, isDemoMode });
  } catch (error) {
    console.error('Error toggling demo mode:', error);
    res.status(500).json({ error: 'Failed to toggle demo mode' });
  }
});

// Settings API - Reset to default database path
app.post('/api/settings/reset', async (req, res) => {
  try {
    console.log('🔄 Resetting database to default path');
    updateDatabasePath(DEFAULT_DATABASE_ROOT);
    await ensureDirectories();
    await saveConfig();
    
    // Check if this is actually configured or just default
    const configured = await checkIfConfigured();
    
    console.log('✅ Reset complete. Database path:', DATABASE_ROOT);
    console.log('🔧 Database configured:', configured);
    
    res.json({ 
      success: true, 
      path: DATABASE_ROOT,
      isConfigured: configured
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Settings API - Update database path
app.post('/api/settings/database-path', async (req, res) => {
  try {
    const { path: newPath } = req.body;
    
    console.log('📝 Received database path update request:', newPath);
    
    if (!newPath) {
      return res.status(400).json({ error: 'Path is required' });
    }

    // Update the database path
    updateDatabasePath(newPath);
    
    // Update config file location to database directory
    CONFIG_FILE = path.join(DATABASE_ROOT, 'settings.json');
    
    console.log('📁 Updated database path to:', DATABASE_ROOT);
    console.log('📁 Settings file:', CONFIG_FILE);
    console.log('📁 Customers directory:', CUSTOMERS_DIR);
    console.log('📁 Projects directory:', PROJECTS_DIR);
    
    // Ensure the directories exist (create if needed)
    await ensureDirectories();
    
    // Migrate old config to new location if it exists
    try {
      const oldConfigData = await fs.readFile(HOME_CONFIG_FILE, 'utf-8');
      await fs.writeFile(CONFIG_FILE, oldConfigData, 'utf-8');
      console.log('✅ Migrated settings to database directory');
    } catch (error) {
      // No old config to migrate, just save current state
      await saveConfig();
    }
    
    // Check if directories were created successfully
    const customersExist = await fs.access(CUSTOMERS_DIR).then(() => true).catch(() => false);
    const projectsExist = await fs.access(PROJECTS_DIR).then(() => true).catch(() => false);
    
    console.log('✅ Customers directory exists:', customersExist);
    console.log('✅ Projects directory exists:', projectsExist);
    
    if (!customersExist || !projectsExist) {
      return res.status(500).json({ error: 'Failed to create required directories' });
    }
    
    res.json({ 
      success: true, 
      path: DATABASE_ROOT,
      customersDir: CUSTOMERS_DIR,
      projectsDir: PROJECTS_DIR
    });
  } catch (error) {
    console.error('Error updating database path:', error);
    res.status(500).json({ error: 'Failed to update database path' });
  }
});

// Technology Settings API
const TECH_SETTINGS_FILE = 'technology-settings.json';

app.get('/api/settings/technology', async (req, res) => {
  try {
    const techSettingsPath = path.join(DATABASE_ROOT, TECH_SETTINGS_FILE);
    const data = await fs.readFile(techSettingsPath, 'utf-8');
    const settings = JSON.parse(data);
    res.json(settings);
  } catch (error) {
    // If file doesn't exist, return empty structure
    res.json({
      solutionAreas: [],
      technologies: {}
    });
  }
});

app.post('/api/settings/technology', async (req, res) => {
  try {
    const { solutionAreas, technologies } = req.body;
    
    const techSettingsPath = path.join(DATABASE_ROOT, TECH_SETTINGS_FILE);
    const settings = {
      solutionAreas,
      technologies,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(techSettingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    console.log('💾 Technology settings saved');
    
    res.json({ success: true, ...settings });
  } catch (error) {
    console.error('Error saving technology settings:', error);
    res.status(500).json({ error: 'Failed to save technology settings' });
  }
});

// Initialize server
async function startServer() {
  await loadConfig();
  await ensureDirectories();
  
  // Check if database is already configured
  isConfigured = await checkIfConfigured();
  console.log(`🔧 Database configured: ${isConfigured}`);
  console.log(`🎭 Demo mode: ${isDemoMode ? 'enabled' : 'disabled'}`);
  
  app.listen(PORT, () => {
    console.log(`🚀 CSA Tracker API server running on http://localhost:${PORT}`);
    console.log(`📁 Database location: ${DATABASE_ROOT}`);
  });
}

startServer();
