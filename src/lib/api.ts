import { Project, Customer } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const projects = await response.json();
      
      // Hydrate customer data
      const customers = await customersApi.getAll();
      return projects.map((project: any) => ({
        ...project,
        crc53_customerid: customers.find(c => c.crc53_customerid === project._crc53_customerid_value)
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      if (!response.ok) throw new Error('Project not found');
      const project = await response.json();
      
      // Hydrate customer data
      if (project._crc53_customerid_value) {
        const customer = await customersApi.getById(project._crc53_customerid_value);
        project.crc53_customerid = customer;
      }
      
      return project;
    } catch (error) {
      throw new Error('Project not found');
    }
  },

  create: async (data: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    } catch (error) {
      throw new Error('Failed to create project');
    }
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return response.json();
    } catch (error) {
      throw new Error('Failed to update project');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
    } catch (error) {
      throw new Error('Failed to delete project');
    }
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Customer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (!response.ok) throw new Error('Customer not found');
      return response.json();
    } catch (error) {
      throw new Error('Customer not found');
    }
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      return response.json();
    } catch (error) {
      throw new Error('Failed to create customer');
    }
  },

  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return response.json();
    } catch (error) {
      throw new Error('Failed to update customer');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');
    } catch (error) {
      throw new Error('Failed to delete customer');
    }
  },
};
