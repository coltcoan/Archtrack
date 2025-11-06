import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Default technology configuration from the types file
const defaultSolutionAreas = [
  { id: 'ai-business', label: 'AI Business Solutions' },
  { id: 'cloud-ai', label: 'Cloud & AI Platforms' },
  { id: 'security', label: 'Security' },
];

const defaultTechnologies: Record<string, any[]> = {
  'ai-business': [
    { id: 100000000, label: 'M365 Copilot', solutionArea: 'ai-business' },
    { id: 100000001, label: 'Copilot Studio', solutionArea: 'ai-business' },
    { id: 100000038, label: 'Power Platform Gov', solutionArea: 'ai-business' },
    { id: 100000003, label: 'Power Apps', solutionArea: 'ai-business' },
    { id: 100000004, label: 'Power Automate', solutionArea: 'ai-business' },
    { id: 100000008, label: 'Power BI', solutionArea: 'ai-business' },
    { id: 100000009, label: 'Power Pages', solutionArea: 'ai-business' },
    { id: 100000006, label: 'Dataverse', solutionArea: 'ai-business' },
    { id: 100000010, label: 'Dynamics 365 Sales', solutionArea: 'ai-business' },
    { id: 100000011, label: 'Dynamics 365 Customer Service', solutionArea: 'ai-business' },
    { id: 100000012, label: 'Dynamics 365 Finance', solutionArea: 'ai-business' },
    { id: 100000013, label: 'Dynamics 365 Marketing', solutionArea: 'ai-business' },
    { id: 100000014, label: 'Dynamics 365 Field Service', solutionArea: 'ai-business' },
    { id: 100000015, label: 'Windows 11', solutionArea: 'ai-business' },
    { id: 100000016, label: 'Intune', solutionArea: 'ai-business' },
    { id: 100000017, label: 'Windows 365', solutionArea: 'ai-business' },
    { id: 100000018, label: 'Azure Virtual Desktop', solutionArea: 'ai-business' },
    { id: 100000019, label: 'Defender for Endpoint', solutionArea: 'ai-business' },
  ],
  'cloud-ai': [
    { id: 100000020, label: 'Azure VMs', solutionArea: 'cloud-ai' },
    { id: 100000021, label: 'Azure VMware', solutionArea: 'cloud-ai' },
    { id: 100000022, label: 'Azure Arc', solutionArea: 'cloud-ai' },
    { id: 100000023, label: 'Azure Kubernetes', solutionArea: 'cloud-ai' },
    { id: 100000024, label: 'Azure App Service', solutionArea: 'cloud-ai' },
    { id: 100000025, label: 'Azure Container Apps', solutionArea: 'cloud-ai' },
    { id: 100000026, label: 'Azure Functions', solutionArea: 'cloud-ai' },
    { id: 100000027, label: 'Azure SQL', solutionArea: 'cloud-ai' },
    { id: 100000028, label: 'Azure Cosmos DB', solutionArea: 'cloud-ai' },
    { id: 100000029, label: 'Microsoft Fabric', solutionArea: 'cloud-ai' },
    { id: 100000030, label: 'Azure Foundry', solutionArea: 'cloud-ai' },
    { id: 100000031, label: 'GitHub', solutionArea: 'cloud-ai' },
    { id: 100000032, label: 'Azure DevOps', solutionArea: 'cloud-ai' },
    { id: 100000005, label: 'Defender for Cloud', solutionArea: 'cloud-ai' },
  ],
  'security': [
    { id: 100000033, label: 'Defender XDR', solutionArea: 'security' },
    { id: 100000034, label: 'Sentinel', solutionArea: 'security' },
    { id: 100000035, label: 'Purview', solutionArea: 'security' },
    { id: 100000036, label: 'Entra ID', solutionArea: 'security' },
    { id: 100000005, label: 'Defender for Cloud', solutionArea: 'security' },
    { id: 100000037, label: 'Security Copilot', solutionArea: 'security' },
  ],
};

async function migrateTechSettings() {
  try {
    // Read database path from settings
    const DATABASE_ROOT = path.join(
      os.homedir(),
      'Library',
      'CloudStorage',
      'OneDrive-Microsoft',
      'CSA Tracker Database'
    );

    // Try to read existing settings to get custom database path
    try {
      const settingsPath = path.join(DATABASE_ROOT, 'settings.json');
      const settingsData = await fs.readFile(settingsPath, 'utf-8');
      const settings = JSON.parse(settingsData);
      console.log('📋 Found existing settings at:', settingsPath);
    } catch (error) {
      console.log('⚠️  No existing settings found, using default path');
    }

    const techSettingsPath = path.join(DATABASE_ROOT, 'technology-settings.json');

    // Check if file already exists
    try {
      await fs.access(techSettingsPath);
      console.log('✓ Technology settings file already exists at:', techSettingsPath);
      console.log('  No migration needed.');
      return;
    } catch (error) {
      // File doesn't exist, create it
    }

    const settings = {
      solutionAreas: defaultSolutionAreas,
      technologies: defaultTechnologies,
      updatedAt: new Date().toISOString(),
      migratedAt: new Date().toISOString(),
    };

    await fs.writeFile(techSettingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    console.log('✅ Technology settings migrated successfully to:', techSettingsPath);
    console.log(`   Created ${defaultSolutionAreas.length} solution areas`);
    console.log(`   Created ${Object.values(defaultTechnologies).flat().length} technologies`);
  } catch (error) {
    console.error('❌ Error migrating technology settings:', error);
    process.exit(1);
  }
}

migrateTechSettings();
