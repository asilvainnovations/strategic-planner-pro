import { v4 as uuidv4 } from 'uuid';

export interface SWOTItem {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  content: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface StrategicOption {
  id: string;
  name: string;
  description: string;
  category: 'SO' | 'ST' | 'WO' | 'WT'; // SWOT combinations
  relatedStrengths: string[];
  relatedWeaknesses: string[];
  relatedOpportunities: string[];
  relatedThreats: string[];
  feasibility: number; // 1-10
  impact: number; // 1-10
  priority: 'high' | 'medium' | 'low';
  status: 'proposed' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  notes?: string;
}

export interface KPI {
  id: string;
  objectiveId: string;
  name: string;
  description: string;
  target: string;
  current: string;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'on-track' | 'at-risk' | 'off-track' | 'achieved';
  owner?: string;
  dataPoints: Array<{
    date: string;
    value: number;
    notes?: string;
  }>;
}

export interface BSCObjective {
  id: string;
  perspective: 'financial' | 'customer' | 'internal' | 'learning';
  name: string;
  description: string;
  strategicOptionIds: string[];
  kpis: KPI[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  owner?: string;
  startDate?: string;
  targetDate?: string;
}

export interface PAP {
  id: string;
  objectiveId: string;
  name: string;
  description: string;
  activities: Array<{
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
    progress: number;
    assignedTo?: string;
    dependencies?: string[];
  }>;
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  resources: Array<{
    id: string;
    type: 'human' | 'financial' | 'material' | 'technological';
    name: string;
    quantity: string;
    notes?: string;
  }>;
  risks: Array<{
    id: string;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  status: 'planning' | 'approved' | 'in-progress' | 'completed' | 'on-hold';
}

export interface StrategicPlan {
  id: string;
  name: string;
  description: string;
  organization: string;
  timeframe: {
    start: string;
    end: string;
  };
  vision: string;
  mission: string;
  values: string[];
  swotItems: SWOTItem[];
  strategicOptions: StrategicOption[];
  objectives: BSCObjective[];
  paps: PAP[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export const generateId = (): string => uuidv4();

const STORAGE_KEY = 'strategic-planner-pro';

export const loadFromStorage = (): { plans: StrategicPlan[]; currentPlanId: string | null } => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return { plans: [], currentPlanId: null };
};

export const saveToStorage = (plans: StrategicPlan[], currentPlanId: string | null): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plans, currentPlanId }));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const createEmptyPlan = (data: Partial<StrategicPlan> = {}): StrategicPlan => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: data.name || 'New Strategic Plan',
    description: data.description || '',
    organization: data.organization || '',
    timeframe: data.timeframe || {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    vision: data.vision || '',
    mission: data.mission || '',
    values: data.values || [],
    swotItems: [],
    strategicOptions: [],
    objectives: [],
    paps: [],
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    ...data,
  };
};

export const createSamplePlan = (): StrategicPlan => {
  const planId = generateId();
  const now = new Date().toISOString();

  const swotItems: SWOTItem[] = [
    {
      id: generateId(),
      type: 'strength',
      content: 'Strong brand reputation and customer loyalty',
      category: 'Market Position',
      priority: 'high',
    },
    {
      id: generateId(),
      type: 'strength',
      content: 'Experienced leadership team with deep industry knowledge',
      category: 'Human Resources',
      priority: 'high',
    },
    {
      id: generateId(),
      type: 'weakness',
      content: 'Limited digital transformation capabilities',
      category: 'Technology',
      priority: 'high',
    },
    {
      id: generateId(),
      type: 'opportunity',
      content: 'Growing demand for sustainable and eco-friendly products',
      category: 'Market Trends',
      priority: 'high',
    },
    {
      id: generateId(),
      type: 'threat',
      content: 'Increasing competition from new market entrants',
      category: 'Competitive Landscape',
      priority: 'medium',
    },
  ];

  const strategicOptions: StrategicOption[] = [
    {
      id: generateId(),
      name: 'Digital Transformation Initiative',
      description: 'Accelerate digital capabilities to improve customer experience and operational efficiency',
      category: 'SO',
      relatedStrengths: [swotItems[0].id, swotItems[1].id],
      relatedWeaknesses: [swotItems[2].id],
      relatedOpportunities: [],
      relatedThreats: [],
      feasibility: 8,
      impact: 9,
      priority: 'high',
      status: 'approved',
    },
  ];

  const objectives: BSCObjective[] = [
    {
      id: generateId(),
      perspective: 'financial',
      name: 'Increase Revenue Growth',
      description: 'Achieve 15% year-over-year revenue growth through market expansion and new product lines',
      strategicOptionIds: [strategicOptions[0].id],
      kpis: [
        {
          id: generateId(),
          objectiveId: '',
          name: 'Revenue Growth Rate',
          description: 'Year-over-year revenue growth percentage',
          target: '15%',
          current: '8%',
          unit: '%',
          frequency: 'quarterly',
          status: 'at-risk',
          dataPoints: [],
        },
      ],
      status: 'in-progress',
      startDate: '2025-01-01',
      targetDate: '2025-12-31',
    },
    {
      id: generateId(),
      perspective: 'customer',
      name: 'Enhance Customer Satisfaction',
      description: 'Improve customer satisfaction scores through better service and product quality',
      strategicOptionIds: [strategicOptions[0].id],
      kpis: [
        {
          id: generateId(),
          objectiveId: '',
          name: 'Net Promoter Score',
          description: 'Customer loyalty and satisfaction metric',
          target: '70',
          current: '58',
          unit: 'score',
          frequency: 'monthly',
          status: 'on-track',
          dataPoints: [],
        },
      ],
      status: 'in-progress',
      startDate: '2025-01-01',
      targetDate: '2025-12-31',
    },
  ];

  objectives[0].kpis[0].objectiveId = objectives[0].id;
  objectives[1].kpis[0].objectiveId = objectives[1].id;

  return {
    id: planId,
    name: 'Sample Strategic Plan 2025-2027',
    description: 'Three-year strategic plan for organizational growth and digital transformation',
    organization: 'Sample Organization',
    timeframe: {
      start: '2025-01-01',
      end: '2027-12-31',
    },
    vision: 'To be the leading provider of innovative solutions in our industry',
    mission: 'We deliver exceptional value to our customers through innovation, quality, and outstanding service',
    values: ['Innovation', 'Integrity', 'Customer Focus', 'Excellence', 'Sustainability'],
    swotItems,
    strategicOptions,
    objectives,
    paps: [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
};
