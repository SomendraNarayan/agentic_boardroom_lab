
export type Sector = 'Banking' | 'Healthcare' | 'Logistics' | 'Public Service' | 'Retail';

export interface HiddenVariables {
  performance: number;
  coordination: number;
  auditability: number;
  interoperability: number;
  vendorDependency: number;
  compliance: number;
  trust: number;
  workforceStrain: number;
  flexibility: number;
  recoverability: number;
}

export interface Resources {
  budget: number; // 0-100
  politicalCapital: number; // 0-100
  timeRemaining: number; // Rounds
}

export interface Stakeholder {
  id: string;
  name: string;
  sentiment: number; // 0-100
  description: string;
}

export interface Competitor {
  id: string;
  name: string;
  strategy: 'Aggressive' | 'Balanced' | 'Conservative';
  marketShare: number;
  performance: number;
  trust: number;
  description: string;
}

export interface CSuiteRole {
  id: string;
  name: string;
  title: string;
  priority: keyof HiddenVariables;
  description: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  active: boolean;
  costToActivate: number;
  impactPerTurn: Partial<HiddenVariables>;
}

export interface SystemEffect {
  id: string;
  name: string;
  description: string;
  condition: (state: GameState) => boolean;
  impact: Partial<HiddenVariables>;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  cost?: Partial<Resources>;
  impact: Partial<HiddenVariables>;
  stakeholderImpact?: Record<string, number>;
  responses: {
    roleId: string;
    message: string;
  }[];
  flagsSet?: string[];
  policyToActivate?: string;
  delayedScenarioId?: string;
  delayRounds?: number;
  governanceInsight?: string;
}

export interface Scenario {
  id: string;
  title: string;
  brief: string;
  options: DecisionOption[];
  signal?: string;
  phase: 'Setup' | 'Scaling' | 'Crisis' | 'Reckoning';
  condition?: (state: GameState) => boolean;
  isTriggered?: boolean;
  aiAdvice?: string;
  stakeholderOpinions?: {
    stakeholderId: string;
    opinion: string;
  }[];
  cSuiteOpinions?: {
    roleId: string;
    opinion: string;
  }[];
  links?: {
    label: string;
    url: string;
  }[];
}

export interface Crisis {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  impactPerTurn: Partial<HiddenVariables>;
  resourceImpactPerTurn?: Partial<Resources>;
  duration: number; // Rounds remaining
  resolutionScenarioId?: string;
}

export interface QuarterlyUpdate {
  round: number;
  operationalUpdate: string;
  governanceUpdate: string;
  techPulse: {
    title: string;
    description: string;
  }[];
}

export interface GameState {
  currentRound: number;
  variables: HiddenVariables;
  resources: Resources;
  stakeholders: Stakeholder[];
  competitors: Competitor[];
  activePolicies: Policy[];
  activeEffects: SystemEffect[];
  history: {
    roundId: number;
    decisionId: string;
    scenarioId: string;
    scenarioTitle: string;
    decisionLabel: string;
  }[];
  delayedScenarios: {
    scenarioId: string;
    roundsRemaining: number;
  }[];
  flags: string[];
  sector: Sector;
  isGameOver: boolean;
  currentScenarios: Scenario[];
  pendingDecisions: Record<string, string>; // scenarioId -> optionId
  scenarioQueue: Scenario[];
  logs: string[];
  marketShare: number;
  totalScore: number;
  activeCrises: Crisis[];
  previousVariables?: HiddenVariables;
  roundSummaries: {
    roundId: number;
    variables: HiddenVariables;
    resources: Resources;
    marketShare: number;
    totalScore: number;
    activeCrises: string[];
    activePolicies: string[];
  }[];
}

export const INITIAL_VARIABLES: HiddenVariables = {
  performance: 50,
  coordination: 50,
  auditability: 50,
  interoperability: 50,
  vendorDependency: 20,
  compliance: 50,
  trust: 60,
  workforceStrain: 30,
  flexibility: 50,
  recoverability: 50,
};

export const INITIAL_RESOURCES: Resources = {
  budget: 100,
  politicalCapital: 100,
  timeRemaining: 12,
};

export const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  { id: 'board', name: 'The Board', sentiment: 60, description: 'Focuses on ROI and market position.' },
  { id: 'regulators', name: 'Regulators', sentiment: 50, description: 'Focuses on compliance and safety.' },
  { id: 'workforce', name: 'Workforce', sentiment: 60, description: 'Focuses on job security and meaning.' },
  { id: 'vendors', name: 'Vendors', sentiment: 70, description: 'Focuses on lock-in and revenue.' },
];

export const CS_ROLES: CSuiteRole[] = [
  { id: 'ceo', name: 'Elena Vance', title: 'CEO', priority: 'performance', description: 'Growth at all costs.' },
  { id: 'cio', name: 'Marcus Thorne', title: 'CIO', priority: 'interoperability', description: 'Technical sovereignty.' },
  { id: 'coo', name: 'Sarah Chen', title: 'COO', priority: 'coordination', description: 'Operational efficiency.' },
  { id: 'cfo', name: 'David Miller', title: 'CFO', priority: 'performance', description: 'Fiscal discipline.' },
  { id: 'legal', name: 'Aria Novak', title: 'General Counsel', priority: 'compliance', description: 'Risk mitigation.' },
  { id: 'hr', name: 'James Wilson', title: 'CHRO', priority: 'workforceStrain', description: 'Human capital.' },
];
