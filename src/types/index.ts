export interface Stakeholder {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

export interface Customer {
  crc53_customerid: string;
  crc53_name: string;
  crc53_keystakeholders?: Stakeholder[]; // Multiple stakeholders
  crc53_primarytechfocus?: TechnologyType;
  createdon?: string;
  modifiedon?: string;
}

export enum TechnologyType {
  // AI Business Solutions
  M365Copilot = 100000000,
  CopilotStudio = 100000001,
  PowerPlatformGov = 100000038,
  PowerApps = 100000003,
  PowerAutomate = 100000004,
  PowerBI = 100000008,
  PowerPages = 100000009,
  Dataverse = 100000006,
  Dynamics365Sales = 100000010,
  Dynamics365CustomerService = 100000011,
  Dynamics365Finance = 100000012,
  Dynamics365Marketing = 100000013,
  Dynamics365FieldService = 100000014,
  Windows11 = 100000015,
  Intune = 100000016,
  Windows365 = 100000017,
  AzureVirtualDesktop = 100000018,
  DefenderForEndpoint = 100000019,
  
  // Cloud & AI Platforms
  AzureVMs = 100000020,
  AzureVMware = 100000021,
  AzureArc = 100000022,
  AzureKubernetes = 100000023,
  AzureAppService = 100000024,
  AzureContainerApps = 100000025,
  AzureFunctions = 100000026,
  AzureSQL = 100000027,
  AzureCosmosDB = 100000028,
  MicrosoftFabric = 100000029,
  AzureFoundry = 100000002,
  GitHub = 100000030,
  AzureDevOps = 100000031,
  
  // Security
  DefenderXDR = 100000032,
  Sentinel = 100000033,
  Purview = 100000034,
  EntraID = 100000035,
  DefenderForCloud = 100000036,
  SecurityCopilot = 100000037,
  
  // General
  Governance = 100000005,
  Other = 100000007,
}

export const TechnologyTypeLabels: Record<TechnologyType, string> = {
  // AI Business Solutions
  [TechnologyType.M365Copilot]: 'M365 Copilot',
  [TechnologyType.CopilotStudio]: 'Copilot Studio',
    [TechnologyType.PowerPlatformGov]: 'Power Platform Governance',
  [TechnologyType.PowerApps]: 'Power Apps',
  [TechnologyType.PowerAutomate]: 'Power Automate',
  [TechnologyType.PowerBI]: 'Power BI',
  [TechnologyType.PowerPages]: 'Power Pages',
  [TechnologyType.Dataverse]: 'Dataverse',
  [TechnologyType.Dynamics365Sales]: 'Dynamics 365 Sales',
  [TechnologyType.Dynamics365CustomerService]: 'Dynamics 365 Customer Service',
  [TechnologyType.Dynamics365Finance]: 'Dynamics 365 Finance',
  [TechnologyType.Dynamics365Marketing]: 'Dynamics 365 Marketing',
  [TechnologyType.Dynamics365FieldService]: 'Dynamics 365 Field Service',
  [TechnologyType.Windows11]: 'Windows 11',
  [TechnologyType.Intune]: 'Intune',
  [TechnologyType.Windows365]: 'Windows 365',
  [TechnologyType.AzureVirtualDesktop]: 'Azure Virtual Desktop',
  [TechnologyType.DefenderForEndpoint]: 'Defender for Endpoint',
  
  // Cloud & AI Platforms
  [TechnologyType.AzureVMs]: 'Azure VMs',
  [TechnologyType.AzureVMware]: 'Azure VMware Solution',
  [TechnologyType.AzureArc]: 'Azure Arc',
  [TechnologyType.AzureKubernetes]: 'Azure Kubernetes (AKS)',
  [TechnologyType.AzureAppService]: 'Azure App Service',
  [TechnologyType.AzureContainerApps]: 'Azure Container Apps',
  [TechnologyType.AzureFunctions]: 'Azure Functions',
  [TechnologyType.AzureSQL]: 'Azure SQL',
  [TechnologyType.AzureCosmosDB]: 'Azure Cosmos DB',
  [TechnologyType.MicrosoftFabric]: 'Microsoft Fabric',
  [TechnologyType.AzureFoundry]: 'Azure AI Foundry',
  [TechnologyType.GitHub]: 'GitHub',
  [TechnologyType.AzureDevOps]: 'Azure DevOps',
  
  // Security
  [TechnologyType.DefenderXDR]: 'Defender XDR',
  [TechnologyType.Sentinel]: 'Sentinel',
  [TechnologyType.Purview]: 'Purview',
  [TechnologyType.EntraID]: 'Entra ID',
  [TechnologyType.DefenderForCloud]: 'Defender for Cloud',
  [TechnologyType.SecurityCopilot]: 'Security Copilot',
  
  // General
  [TechnologyType.Governance]: 'Governance',
  [TechnologyType.Other]: 'Other',
};

export enum SolutionArea {
  AIBusinessSolutions = 'ai-business',
  CloudAIPlatforms = 'cloud-ai',
  Security = 'security',
}

export const SolutionAreaLabels: Record<SolutionArea, string> = {
  [SolutionArea.AIBusinessSolutions]: 'AI Business Solutions',
  [SolutionArea.CloudAIPlatforms]: 'Cloud & AI Platforms',
  [SolutionArea.Security]: 'Security',
};

export const SolutionAreaTechnologies: Record<SolutionArea, TechnologyType[]> = {
  [SolutionArea.AIBusinessSolutions]: [
    TechnologyType.M365Copilot,
    TechnologyType.CopilotStudio,
    TechnologyType.PowerPlatformGov,
    TechnologyType.PowerApps,
    TechnologyType.PowerAutomate,
    TechnologyType.PowerBI,
    TechnologyType.PowerPages,
    TechnologyType.Dataverse,
    TechnologyType.Dynamics365Sales,
    TechnologyType.Dynamics365CustomerService,
    TechnologyType.Dynamics365Finance,
    TechnologyType.Dynamics365Marketing,
    TechnologyType.Dynamics365FieldService,
    TechnologyType.Windows11,
    TechnologyType.Intune,
    TechnologyType.Windows365,
    TechnologyType.AzureVirtualDesktop,
    TechnologyType.DefenderForEndpoint,
  ],
  [SolutionArea.CloudAIPlatforms]: [
    TechnologyType.AzureVMs,
    TechnologyType.AzureVMware,
    TechnologyType.AzureArc,
    TechnologyType.AzureKubernetes,
    TechnologyType.AzureAppService,
    TechnologyType.AzureContainerApps,
    TechnologyType.AzureFunctions,
    TechnologyType.AzureSQL,
    TechnologyType.AzureCosmosDB,
    TechnologyType.MicrosoftFabric,
    TechnologyType.AzureFoundry,
    TechnologyType.GitHub,
    TechnologyType.AzureDevOps,
    TechnologyType.DefenderForCloud,
  ],
  [SolutionArea.Security]: [
    TechnologyType.DefenderXDR,
    TechnologyType.Sentinel,
    TechnologyType.Purview,
    TechnologyType.EntraID,
    TechnologyType.DefenderForCloud,
    TechnologyType.SecurityCopilot,
  ],
};

export interface Note {
  id: string;
  content: string;
  timestamp: string;
}

export interface Project {
  crc53_projectid: string;
  crc53_name: string;
  crc53_primarystakeholder?: string; // Selected from customer's key stakeholders
  crc53_description?: string;
  crc53_notes?: Note[]; // Journal-style notes
  crc53_estimatedduedate?: string;
  crc53_primarytechnology?: TechnologyType;
  crc53_status?: ProjectStatus;
  crc53_estimatedusage?: string;
  crc53_hasintent?: boolean;
  crc53_hasbuyin?: boolean;
  _crc53_customerid_value?: string;
  'crc53_customerid@odata.bind'?: string;
  crc53_customerid?: Customer;
  createdon?: string;
  modifiedon?: string;
}

export enum ProjectStatus {
  Backlog = 100000000,
  InProgress = 100000001,
  Blocked = 100000002,
  Delayed = 100000003,
  Completed = 100000004,
}

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Backlog]: 'Backlog',
  [ProjectStatus.InProgress]: 'In Progress',
  [ProjectStatus.Blocked]: 'Blocked',
  [ProjectStatus.Delayed]: 'Delayed',
  [ProjectStatus.Completed]: 'Completed',
};

export const ProjectStatusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.Backlog]: 'bg-gray-500',
  [ProjectStatus.InProgress]: 'bg-blue-500',
  [ProjectStatus.Blocked]: 'bg-red-500',
  [ProjectStatus.Delayed]: 'bg-yellow-500',
  [ProjectStatus.Completed]: 'bg-green-500',
};
