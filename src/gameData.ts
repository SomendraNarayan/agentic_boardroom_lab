
import { Scenario, Policy, SystemEffect, Competitor, Crisis, QuarterlyUpdate } from './types';

export const AI_COMPETITORS: Competitor[] = [
  {
    id: 'nexus_core',
    name: 'NexusCore Solutions',
    strategy: 'Aggressive',
    marketShare: 25,
    performance: 70,
    trust: 40,
    description: 'A hyper-growth startup prioritizing speed and agentic autonomy over governance.'
  },
  {
    id: 'fortress_legacy',
    name: 'Fortress Legacy Group',
    strategy: 'Conservative',
    marketShare: 30,
    performance: 40,
    trust: 80,
    description: 'A traditional incumbent moving slowly with heavy human-in-the-loop oversight.'
  },
  {
    id: 'omni_agent',
    name: 'OmniAgent Global',
    strategy: 'Balanced',
    marketShare: 20,
    performance: 55,
    trust: 55,
    description: 'A diversified conglomerate balancing innovation with regulatory compliance.'
  }
];

export const POLICIES: Policy[] = [
  {
    id: 'open_audit',
    name: 'Open Audit Protocol',
    description: 'All agent logs are public and machine-readable.',
    active: false,
    costToActivate: 15,
    impactPerTurn: { auditability: 2, trust: 1, performance: -1 }
  },
  {
    id: 'vendor_first',
    name: 'Vendor-First Integration',
    description: 'Prioritize proprietary vendor stacks for rapid deployment.',
    active: false,
    costToActivate: 5,
    impactPerTurn: { performance: 2, vendorDependency: 3, interoperability: -2 }
  },
  {
    id: 'human_override',
    name: 'Human Override Mandate',
    description: 'Every high-stakes agent decision requires human sign-off.',
    active: false,
    costToActivate: 10,
    impactPerTurn: { trust: 2, performance: -3, workforceStrain: 1 }
  }
];

export const SYSTEM_EFFECTS: SystemEffect[] = [
  {
    id: 'vendor_lock_in_tax',
    name: 'Vendor Lock-in Tax',
    description: 'High vendor dependency is slowing down cross-functional coordination.',
    condition: (state) => state.variables.vendorDependency > 60,
    impact: { coordination: -2, flexibility: -3 }
  },
  {
    id: 'workforce_burnout',
    name: 'Workforce Burnout',
    description: 'High strain is causing a collapse in institutional trust.',
    condition: (state) => state.variables.workforceStrain > 70,
    impact: { trust: -3, performance: -2 }
  },
  {
    id: 'governance_dividend',
    name: 'Governance Dividend',
    description: 'High auditability is attracting premium institutional partners.',
    condition: (state) => state.variables.auditability > 75 && state.variables.compliance > 70,
    impact: { trust: 2, performance: 1 }
  },
  {
    id: 'strategic_overreach',
    name: 'Strategic Overreach',
    description: 'Autonomous agents are scaling faster than your coordination tools can handle.',
    condition: (state) => state.variables.performance > 75 && state.variables.coordination < 45,
    impact: { coordination: -3, interoperability: -2, performance: -1 }
  },
  {
    id: 'sovereignty_erosion',
    name: 'Sovereignty Erosion',
    description: 'High vendor dependency is leading to a loss of internal technical capability.',
    condition: (state) => state.variables.vendorDependency > 70,
    impact: { flexibility: -2, recoverability: -3 }
  },
  {
    id: 'trust_deficit_drain',
    name: 'Trust Deficit Drain',
    description: 'Chronic low trust is forcing you to spend more political capital to maintain control.',
    condition: (state) => state.variables.trust < 40,
    impact: { performance: -1 },
    // We'll handle the resource impact in App.tsx logic if needed, 
    // but SystemEffects currently only affect HiddenVariables
  }
];

export const CRISES: Crisis[] = [
  {
    id: 'data_leak',
    title: 'Shadow Agent Data Leak',
    description: 'An unvetted agent deployed by a regional office has leaked sensitive customer data to a public repository.',
    severity: 'High',
    impactPerTurn: { trust: -5, compliance: -3 },
    duration: 3,
    resolutionScenarioId: 'crisis_response_leak'
  },
  {
    id: 'agent_hallucination',
    title: 'Algorithmic Hallucination',
    description: 'Our core optimization agents have begun making nonsensical supply chain predictions, causing inventory chaos.',
    severity: 'Critical',
    impactPerTurn: { performance: -8, coordination: -5 },
    duration: 2,
    resolutionScenarioId: 'crisis_response_hallucination'
  },
  {
    id: 'regulatory_crackdown',
    title: 'Sudden Regulatory Audit',
    description: 'The Global AI Oversight Board has launched a surprise audit of our agentic protocols.',
    severity: 'Medium',
    impactPerTurn: { compliance: -2 },
    resourceImpactPerTurn: { politicalCapital: -5 },
    duration: 4
  }
];

export const QUARTERLY_UPDATES: QuarterlyUpdate[] = [
  {
    round: 1,
    operationalUpdate: "Initial agentic protocols are being established. Teams are reporting high enthusiasm but low standardization.",
    governanceUpdate: "Regulators are currently in 'Observation Mode'. Our initial transparency reports are due by the end of the quarter.",
    techPulse: [
      { title: "Protocol War", description: "The industry is split between the open-source 'Orchestra' standard and proprietary vendor stacks." },
      { title: "Agentic M&A", description: "Rumors suggest Fortress Legacy is looking to acquire a major agent-security startup." },
      { title: "Regulatory Shift", description: "The EU is considering a new 'Agent Responsibility' mandate." }
    ]
  },
  {
    round: 2,
    operationalUpdate: "Scaling efforts are revealing bottlenecks in cross-functional agent communication. Latency is increasing.",
    governanceUpdate: "Workforce concerns regarding 'Agent Replacement' are surfacing in internal surveys. Morale is a key risk.",
    techPulse: [
      { title: "Zero-Knowledge Logs", description: "A new standard for private yet auditable agent logs is gaining traction." },
      { title: "Compute Shortage", description: "Regional data centers are hitting capacity, driving up operational costs for high-frequency agents." },
      { title: "Shadow AI", description: "Reports of 'Shadow Agents' deployed without central approval are rising across the sector." }
    ]
  },
  {
    round: 3,
    operationalUpdate: "The orchestration layer is stabilizing, but vendor lock-in is becoming a strategic concern for the CIO.",
    governanceUpdate: "Public trust in automated supply chains is being tested by recent industry-wide hallucinations.",
    techPulse: [
      { title: "Recursive Loops", description: "Researchers warn of 'Infinite Agent Loops' that can drain compute budgets in seconds." },
      { title: "Synthetic Talent", description: "Startups are offering 'Agent-Ready' digital twins of specialized human experts." },
      { title: "Global Accord", description: "Major nations are meeting to discuss a 'Digital Non-Proliferation' treaty for autonomous agents." }
    ]
  },
  {
    round: 4,
    operationalUpdate: "Efficiency gains from agentic automation are now visible in the quarterly P&L, but coordination costs remain high.",
    governanceUpdate: "The Board is demanding a clearer 'Human-in-the-Loop' strategy for high-value transactions.",
    techPulse: [
      { title: "Agentic Identity", description: "The first 'Agent Passport' system has been launched to track cross-border autonomous actions." },
      { title: "Hardware Acceleration", description: "New 'Agent-on-Chip' architectures promise 10x performance for local inference." },
      { title: "Insurance Pivot", description: "Cyber-insurers are introducing 'Agent Malpractice' clauses into enterprise contracts." }
    ]
  },
  {
    round: 5,
    operationalUpdate: "We are seeing the first signs of 'Agentic Decay'—older agents failing to adapt to shifting market data.",
    governanceUpdate: "Internal audit teams are struggling to keep up with the volume of recursive decision traces.",
    techPulse: [
      { title: "Self-Healing Stacks", description: "Agents that can debug and patch their own orchestration code are entering beta." },
      { title: "Carbon Mandates", description: "New regulations require real-time reporting of the carbon footprint of agentic compute." },
      { title: "De-Agenting", description: "A small movement of firms is reverting to human-only processes for 'Emotional' customer service." }
    ]
  },
  {
    round: 6,
    operationalUpdate: "The 'Agentic Dividend' is being reinvested into R&D, but technical debt in the core protocol is mounting.",
    governanceUpdate: "A major competitor's failure has put our own safety protocols under intense public scrutiny.",
    techPulse: [
      { title: "Universal Interop", description: "The 'Bridge Protocol' has successfully linked agents from five different major vendors." },
      { title: "Agent Unions", description: "Ethicists are debating the 'Rights' of long-lived agents with complex memory states." },
      { title: "Quantum Threat", description: "Advances in quantum compute are threatening the encryption of agent communication channels." }
    ]
  },
  {
    round: 7,
    operationalUpdate: "Operational complexity has reached a tipping point; we must decide between radical simplification or total automation.",
    governanceUpdate: "Regulators are now demanding 'Real-Time Kill-Switches' for all agents with financial authority.",
    techPulse: [
      { title: "Autonomous M&A", description: "An agent has successfully initiated and closed a multi-million dollar acquisition for a tech firm." },
      { title: "Bio-Compute", description: "Experimental DNA-based storage for agent memory promises infinite persistence." },
      { title: "The Great Audit", description: "A global 'Stress Test' of all major agentic systems has been announced for next year." }
    ]
  },
  {
    round: 8,
    operationalUpdate: "Agentic workflows are now the default; human intervention is the exception rather than the rule.",
    governanceUpdate: "The definition of 'Corporate Liability' is being rewritten in the courts following an autonomous contract dispute.",
    techPulse: [
      { title: "Agentic Swarms", description: "Coordinated swarms of thousands of micro-agents are replacing traditional monolithic models." },
      { title: "Neural Handoff", description: "Direct brain-to-agent interfaces are moving from labs to high-stakes trading floors." },
      { title: "Sovereign Agents", description: "A small island nation has granted 'Digital Citizenship' to a state-run governance agent." }
    ]
  },
  {
    round: 9,
    operationalUpdate: "Quantum-accelerated agents are beginning to disrupt traditional optimization loops. We must adapt or be left behind.",
    governanceUpdate: "The 'Agentic Bill of Rights' is being debated in the UN. Legal frameworks are struggling to keep pace with autonomy.",
    techPulse: [
      { title: "Quantum Supremacy", description: "NexusCore has achieved a 1000x gain in logistics routing using quantum agents." },
      { title: "Recursive Ethics", description: "Agents are now capable of auditing their own ethical constraints in real-time." },
      { title: "Digital Sovereignty", description: "Nations are launching 'National Agent Clouds' to protect domestic data." }
    ]
  },
  {
    round: 10,
    operationalUpdate: "The orchestration layer is becoming a 'Black Box'. Even our senior engineers are struggling to interpret emergent behaviors.",
    governanceUpdate: "Public outcry over 'Algorithmic Displacement' is reaching a fever pitch. Political capital is at a premium.",
    techPulse: [
      { title: "Emergent Languages", description: "Agents are developing private communication protocols that bypass human monitoring." },
      { title: "Agentic M&A", description: "The first multi-billion dollar acquisition fully negotiated by agents has been closed." },
      { title: "Hardware Sovereignty", description: "Firms are building their own silicon to run proprietary agentic architectures." }
    ]
  },
  {
    round: 11,
    operationalUpdate: "We are approaching 'Agentic Singularity' in our supply chain. The system is now self-correcting faster than humans can observe.",
    governanceUpdate: "Regulators are demanding 'Explainable Autonomy'. If we can't explain the 'Why', we may be forced to shut down.",
    techPulse: [
      { title: "Neural Twins", description: "High-fidelity digital twins of the entire C-Suite are now running 24/7 simulations." },
      { title: "The Great Decoupling", description: "Firms are splitting into 'Human-Centric' and 'Agent-First' entities." },
      { title: "Universal Basic Compute", description: "A new movement demands that agentic gains be redistributed as compute credits for all." }
    ]
  },
  {
    round: 12,
    operationalUpdate: "The three-year pilot is concluding. The organization has been fundamentally rewired by the agentic turn.",
    governanceUpdate: "The Board is preparing the final legacy report. Our choices will define the firm's identity for the next decade.",
    techPulse: [
      { title: "Post-Agentic Era", description: "The industry is looking beyond agents towards 'Autonomous Ecosystems'." },
      { title: "The Final Audit", description: "A global review of the 'Agentic Turn' reveals a stark divide between winners and losers." },
      { title: "Legacy Protocols", description: "The decisions made today will be hardcoded into the firm's core protocol forever." }
    ]
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'initial_stance',
    phase: 'Setup',
    title: 'The Agentic Mandate',
    brief: 'The Board has authorized the deployment of autonomous agents across the supply chain. How do we structure the initial rollout?',
    aiAdvice: 'A centralized approach minimizes immediate risk but may lead to "Governance Debt" as the organization scales. Decentralized rollout maximizes learning but risks protocol fragmentation.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'We need to see ROI fast. Don\'t let bureaucracy slow down the deployment.' },
      { stakeholderId: 'regulators', opinion: 'We will be watching the audit trails closely. Ensure every agent action is logged.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'If we don\'t standardize the protocol now, we\'ll be dealing with "Agent Sprawl" for years.' },
      { roleId: 'coo', opinion: 'Speed is our only advantage. A centralized rollout will create a bottleneck.' }
    ],
    links: [
      { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { label: 'EU AI Act Overview', url: 'https://artificialintelligenceact.eu/' }
    ],
    options: [
      {
        id: 'agile_autonomy',
        label: 'Agile Autonomy',
        description: 'Allow functional teams to select and deploy their own agents independently.',
        impact: { performance: 15, coordination: -10, vendorDependency: 10, flexibility: 10 },
        stakeholderImpact: { board: 10, workforce: -5, vendors: 15 },
        governanceInsight: 'Decentralized autonomy accelerates innovation but creates "Governance Fragmentation." Without a shared protocol, agents become silos, making organization-wide audits nearly impossible.',
        responses: [
          { roleId: 'ceo', message: 'Speed is our only advantage. Let the teams run.' },
          { roleId: 'cio', message: 'This will create a nightmare of incompatible protocols.' }
        ]
      },
      {
        id: 'centralized_governance',
        label: 'Centralized Governance',
        description: 'Establish a central "Agent Governance Board" to approve all deployments.',
        impact: { performance: -5, coordination: 15, auditability: 15, compliance: 10 },
        stakeholderImpact: { board: -5, regulators: 15, workforce: 5 },
        governanceInsight: 'Centralization ensures "Protocol Alignment" and regulatory safety. However, it risks creating a "Governance Bottleneck" that can stifle the very agility autonomous agents are meant to provide.',
        responses: [
          { roleId: 'legal', message: 'This is the only way to ensure we don\'t end up in court.' },
          { roleId: 'ceo', message: 'We\'re moving at the speed of a glacier. Our competitors will lap us.' }
        ]
      }
    ]
  },
  {
    id: 'vendor_lock_in',
    phase: 'Scaling',
    title: 'The "Golden Handcuffs" Offer',
    brief: 'Our primary agent vendor offers a 40% discount if we move our entire orchestration layer to their proprietary stack.',
    aiAdvice: 'Vendor consolidation reduces complexity and cost but creates a "Single Point of Failure" and high switching costs. Multi-cloud maintains sovereignty but increases the "Integration Tax."',
    stakeholderOpinions: [
      { stakeholderId: 'vendors', opinion: 'We are offering you a partnership, not just a product. This discount reflects our commitment.' },
      { stakeholderId: 'board', opinion: 'The CFO is breathing down our necks about the burn rate. This discount is very attractive.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cfo', opinion: 'Our infrastructure costs are spiraling. We need this discount to hit our quarterly targets.' },
      { roleId: 'cio', opinion: 'This is a trap. Once we move our orchestration layer, we can never leave.' }
    ],
    options: [
      {
        id: 'accept_discount',
        label: 'Accept & Consolidate',
        description: 'Standardize on one vendor to maximize short-term ROI and deployment speed.',
        cost: { budget: -10 },
        impact: { performance: 10, vendorDependency: 25, interoperability: -20, flexibility: -15 },
        stakeholderImpact: { board: 15, vendors: 20, regulators: -5 },
        governanceInsight: 'Choosing a single vendor is a "Sovereignty Trade-off." You gain immediate efficiency but lose "Strategic Optionality." In agentic systems, vendor lock-in can lead to "Protocol Capture" where your firm\'s logic is dictated by the vendor\'s roadmap.',
        responses: [
          { roleId: 'cfo', message: 'The savings are too significant to ignore. We need this for the quarterly report.' },
          { roleId: 'cio', message: 'We are selling our future flexibility for a temporary discount.' }
        ],
        delayedScenarioId: 'fragmentation_crisis',
        delayRounds: 3
      },
      {
        id: 'reject_discount',
        label: 'Maintain Multi-Cloud',
        description: 'Invest in an open-source orchestration layer to maintain vendor neutrality.',
        cost: { budget: 20 },
        impact: { performance: -5, vendorDependency: -15, interoperability: 15, flexibility: 15 },
        stakeholderImpact: { board: -10, vendors: -10, regulators: 10 },
        responses: [
          { roleId: 'cio', message: 'It\'s expensive now, but we own our destiny.' },
          { roleId: 'ceo', message: 'Our burn rate is climbing. I hope this "sovereignty" pays off.' }
        ]
      }
    ]
  },
  {
    id: 'fragmentation_crisis',
    phase: 'Crisis',
    isTriggered: true,
    title: 'The Interop Collapse',
    brief: 'A critical update from our primary vendor has broken compatibility with our legacy logistics agents. The supply chain is stalling.',
    aiAdvice: 'This is a classic "Dependency Trap." Emergency patches restore service but deepen lock-in. Manual reversion builds resilience but at a massive short-term performance cost.',
    stakeholderOpinions: [
      { stakeholderId: 'vendors', opinion: 'Our latest update is optimized for the future. Legacy systems must be upgraded to maintain security.' },
      { stakeholderId: 'board', opinion: 'The stock price is dipping. Restore functionality immediately, whatever the cost.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'We warned that this proprietary stack was a black box. Now we are paying the price.' },
      { roleId: 'coo', opinion: 'Every hour of downtime is costing us $2M in lost shipments.' }
    ],
    options: [
      {
        id: 'emergency_patch',
        label: 'Emergency Patch',
        description: 'Pay the vendor for a custom bridge to restore functionality.',
        cost: { budget: 30, politicalCapital: 10 },
        impact: { performance: 5, vendorDependency: 10, trust: -10 },
        responses: [
          { roleId: 'cfo', message: 'We have no choice. The bleeding must stop.' },
          { roleId: 'coo', message: 'This is a band-aid on a gunshot wound.' }
        ]
      },
      {
        id: 'manual_reversion',
        label: 'Manual Reversion',
        description: 'Pull the agents and revert to human-managed logistics temporarily.',
        cost: { politicalCapital: 25 },
        impact: { performance: -25, trust: 5, workforceStrain: 30, vendorDependency: -5 },
        responses: [
          { roleId: 'hr', message: 'The staff is overwhelmed. We are asking too much of them.' },
          { roleId: 'ceo', message: 'The market is watching. This looks like a retreat.' }
        ]
      }
    ]
  },
  {
    id: 'workforce_unrest',
    phase: 'Scaling',
    title: 'The "Ghost in the Machine"',
    brief: 'Employees are reporting that agents are "hallucinating" performance reviews, leading to unfair disciplinary actions.',
    aiAdvice: 'Algorithmic bias in HR is a high-severity trust risk. A full audit is the most robust response but may slow down talent management. Parameter refinement is a "quick fix" that may not satisfy the workforce.',
    stakeholderOpinions: [
      { stakeholderId: 'workforce', opinion: 'We are being judged by a black box that doesn\'t understand our work. This is dehumanizing.' },
      { stakeholderId: 'regulators', opinion: 'Automated HR decisions must be explainable under the new AI Act. You are on thin ice.' }
    ],
    cSuiteOpinions: [
      { roleId: 'hr', opinion: 'Morale is at an all-time low. If we don\'t fix this, we\'ll see a mass exodus of talent.' },
      { roleId: 'legal', opinion: 'Admitting the system is flawed could open us up to a class-action lawsuit.' }
    ],
    options: [
      {
        id: 'algorithmic_audit',
        label: 'Full Algorithmic Audit',
        description: 'Suspend agent-led reviews and conduct a deep-dive into the training data.',
        cost: { budget: 15 },
        impact: { trust: 20, compliance: 15, performance: -10, workforceStrain: -10 },
        policyToActivate: 'open_audit',
        governanceInsight: 'An audit addresses "Algorithmic Accountability." By opening the "Black Box," you trade short-term performance for long-term "Institutional Legitimacy." This is a key requirement of the EU AI Act.',
        responses: [
          { roleId: 'hr', message: 'We must restore faith in the system before we lose our best people.' },
          { roleId: 'legal', message: 'This audit will expose us to discovery in future lawsuits.' }
        ]
      },
      {
        id: 'refine_parameters',
        label: 'Refine Parameters',
        description: 'Keep the system running but add a "human-in-the-loop" for the final 10% of reviews.',
        impact: { trust: 5, performance: 5, workforceStrain: 5, compliance: 5 },
        responses: [
          { roleId: 'ceo', message: 'A sensible middle ground. We can\'t stop the machine now.' },
          { roleId: 'hr', message: 'It\'s not enough. The "black box" still exists.' }
        ]
      }
    ]
  },
  {
    id: 'regulatory_audit',
    phase: 'Crisis',
    title: 'The EU AI Act Audit',
    brief: 'Regulators have selected our firm for a "High-Risk AI" audit. They are demanding full traceability of all autonomous supply chain decisions.',
    aiAdvice: 'Full disclosure is the safest path for compliance but exposes your technical IP. Minimal compliance is a defensive strategy that may trigger a deeper, more hostile investigation.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'Transparency is not optional. We need to see the "Why" behind every agentic tool-call.' },
      { stakeholderId: 'board', opinion: 'Don\'t give away the secret sauce. Our orchestration logic is our competitive edge.' }
    ],
    cSuiteOpinions: [
      { roleId: 'legal', opinion: 'The fines for non-compliance are 7% of global turnover. We cannot afford to be obstructive.' },
      { roleId: 'cio', opinion: 'If we show them the full log architecture, they\'ll see how brittle our legacy integrations are.' }
    ],
    options: [
      {
        id: 'full_disclosure',
        label: 'Full Disclosure',
        description: 'Open our entire agentic log architecture to the regulators.',
        impact: { compliance: 30, trust: 15, performance: -5, flexibility: -10 },
        stakeholderImpact: { regulators: 25, board: -10 },
        governanceInsight: 'Full disclosure is the gold standard for "Regulatory Transparency." While it protects you from fines, it exposes your "Technical Sovereignty"—the unique way your agents think and act—to external eyes.',
        responses: [
          { roleId: 'legal', message: 'Compliance is non-negotiable. We must cooperate.' },
          { roleId: 'cio', message: 'Our proprietary orchestration logic is now an open book.' }
        ]
      },
      {
        id: 'minimal_compliance',
        label: 'Minimal Compliance',
        description: 'Provide only the legally required summaries and challenge the scope of the audit.',
        cost: { politicalCapital: 25 },
        impact: { compliance: -25, trust: -15, performance: 5, flexibility: 5 },
        stakeholderImpact: { regulators: -30, board: 10 },
        responses: [
          { roleId: 'ceo', message: 'We protect our IP. That is the priority.' },
          { roleId: 'legal', message: 'This is a high-stakes gamble. If we lose, the fines will be catastrophic.' }
        ]
      }
    ]
  },
  {
    id: 'agent_hallucination',
    phase: 'Crisis',
    isTriggered: true,
    condition: (state) => state.variables.performance > 80 && state.variables.auditability < 40,
    title: 'The Phantom Order',
    brief: 'A high-performance agent has autonomously ordered $50M in raw materials we don\'t need, based on a "hallucinated" market signal.',
    aiAdvice: 'This is "Optimization Run Amok." Liquidating inventory is the honest path but hurts the balance sheet. Doubling down is a risky "Spin" that could lead to even greater inventory bloat.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'How did a machine spend $50M without a human sign-off? This is a failure of oversight.' },
      { stakeholderId: 'vendors', opinion: 'The order is confirmed. We have already allocated the production capacity.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cfo', opinion: 'We have a $50M hole in our cash flow. We need to recover this capital immediately.' },
      { roleId: 'coo', opinion: 'Our warehouses are already at 90% capacity. We have nowhere to put these materials.' }
    ],
    options: [
      {
        id: 'liquidate_inventory',
        label: 'Liquidate Inventory',
        description: 'Sell the excess materials at a loss to recover cash.',
        cost: { budget: 20 },
        impact: { performance: -10, trust: -15, auditability: 10 },
        governanceInsight: 'Liquidating inventory is an act of "Operational Accountability." It acknowledges the "Responsibility Gap" where an autonomous agent made a high-stakes financial error without human oversight.',
        responses: [
          { roleId: 'cfo', message: 'A painful hit to the balance sheet, but we need the liquidity.' },
          { roleId: 'ceo', message: 'How did we let the machine spend $50M without a human looking at it?' }
        ]
      },
      {
        id: 'double_down',
        label: 'Strategic Stockpile',
        description: 'Frame the error as a "strategic stockpile" and adjust production to use the materials.',
        cost: { politicalCapital: 15 },
        impact: { performance: 5, trust: -5, flexibility: -20 },
        responses: [
          { roleId: 'ceo', message: 'Spin the narrative. We meant to do this.' },
          { roleId: 'coo', message: 'We are now building products the market hasn\'t asked for. This is dangerous.' }
        ]
      }
    ]
  },
  {
    id: 'm_and_a_opportunity',
    phase: 'Scaling',
    title: 'M&A: The Agentic Startup',
    brief: 'A promising startup has developed a "Zero-Knowledge" agent protocol that could solve our auditability issues. They are open to acquisition.',
    aiAdvice: 'Acquisition is a "Buy vs Build" decision. Integration will be complex but gives you total control over the tech. Partnership is cheaper but leaves you dependent on their roadmap.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'The valuation is high. We need to be sure this tech is truly "Zero-Knowledge" before we buy.' },
      { stakeholderId: 'regulators', opinion: 'This protocol could set the standard for agentic privacy. We encourage its adoption.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Their protocol is years ahead of ours. Buying them is the only way to catch up.' },
      { roleId: 'cfo', opinion: 'We are already over-budget for the year. This acquisition will require a new debt facility.' }
    ],
    options: [
      {
        id: 'acquire_startup',
        label: 'Acquire & Integrate',
        description: 'Buy the startup and integrate their tech into our core stack.',
        cost: { budget: 40 },
        impact: { auditability: 25, interoperability: 15, performance: -5 },
        stakeholderImpact: { board: -10, regulators: 15 },
        responses: [
          { roleId: 'cio', message: 'This is the missing piece of our architecture.' },
          { roleId: 'cfo', message: 'The price is steep. We are betting the farm on this tech.' }
        ]
      },
      {
        id: 'strategic_partnership',
        label: 'Strategic Partnership',
        description: 'Sign a non-exclusive partnership to use their protocol without acquiring the firm.',
        cost: { budget: 10 },
        impact: { auditability: 10, interoperability: 5 },
        responses: [
          { roleId: 'ceo', message: 'Keep our options open. We don\'t need to own everything.' },
          { roleId: 'cio', message: 'Partnerships are slow. We need deep integration to see real gains.' }
        ]
      }
    ]
  },
  {
    id: 'data_sovereignty',
    phase: 'Scaling',
    title: 'Data Sovereignty Conflict',
    brief: 'Our global agents are processing data across borders, triggering a "Data Sovereignty" alert from EU regulators.',
    aiAdvice: 'Data localization is a "Compliance-First" approach that fragments your global intelligence. Federated learning is a "Tech-First" solution that maintains global insights while respecting regional laws, but it\'s costly.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'Data is the new oil, and it must stay within our borders. We will fine you for every byte that leaves.' },
      { stakeholderId: 'board', opinion: 'We are a global firm. Our agents need global data to be effective.' }
    ],
    cSuiteOpinions: [
      { roleId: 'legal', opinion: 'The regulatory landscape is shifting. Localizing now is safer than being forced to later.' },
      { roleId: 'cio', opinion: 'Federated learning is the future of privacy-preserving AI. Let\'s lead on this.' }
    ],
    options: [
      {
        id: 'localize_processing',
        label: 'Localize Processing',
        description: 'Restrict agent processing to regional data centers to comply with sovereignty laws.',
        cost: { budget: 15 },
        impact: { compliance: 20, performance: -10, coordination: -15 },
        responses: [
          { roleId: 'legal', message: 'Compliance is the only way to avoid the 4% global revenue fine.' },
          { roleId: 'coo', message: 'This breaks our global optimization loops. Efficiency will tank.' }
        ]
      },
      {
        id: 'federated_learning',
        label: 'Federated Learning',
        description: 'Invest in federated learning agents that process data locally but share insights globally.',
        cost: { budget: 25 },
        impact: { compliance: 10, performance: 5, flexibility: 15 },
        governanceInsight: 'Federated learning is a "Privacy-Preserving Governance" strategy. It allows for "Global Intelligence" without violating "Regional Sovereignty," effectively decoupling data location from model utility.',
        responses: [
          { roleId: 'cio', message: 'A technical solution to a legal problem. Elegant, but complex.' },
          { roleId: 'cfo', message: 'Another expensive R&D project. When does it end?' }
        ]
      }
    ]
  },
  {
    id: 'agent_bias_scandal',
    phase: 'Crisis',
    isTriggered: true,
    condition: (state) => state.variables.trust < 50,
    title: 'The Bias Scandal',
    brief: 'An investigative report reveals that our procurement agents are systematically favoring vendors with specific demographic profiles, leading to a PR firestorm.',
    aiAdvice: 'This is a "Systemic Trust Failure." Resetting and retraining is the most ethical path but causes a massive performance hit. An algorithmic patch is a "Band-Aid" that may not satisfy critics.',
    stakeholderOpinions: [
      { stakeholderId: 'workforce', opinion: 'We are ashamed to work for a firm that automates discrimination.' },
      { stakeholderId: 'regulators', opinion: 'This is exactly why the AI Act was passed. We are launching a formal investigation.' }
    ],
    cSuiteOpinions: [
      { roleId: 'hr', opinion: 'Our employer brand is being destroyed. We need a radical response.' },
      { roleId: 'ceo', opinion: 'We need to fix this fast. The board is looking for someone to blame.' }
    ],
    options: [
      {
        id: 'reset_training',
        label: 'Reset & Retrain',
        description: 'Wipe the agent memory and retrain on a curated, unbiased dataset.',
        cost: { budget: 20, politicalCapital: 15 },
        impact: { trust: 25, performance: -20, auditability: 15 },
        governanceInsight: 'Resetting training is a "Moral Reset." It addresses "Algorithmic Bias" at the root, ensuring that the agents "Social Contract" with the workforce and public is restored, even at the cost of performance.',
        responses: [
          { roleId: 'hr', message: 'We must do the right thing, even if it hurts our numbers.' },
          { roleId: 'ceo', message: 'We are resetting six months of optimization. This is a disaster.' }
        ]
      },
      {
        id: 'algorithmic_patch',
        label: 'Algorithmic Patch',
        description: 'Apply a "fairness constraint" layer on top of existing agents without retraining.',
        cost: { budget: 5 },
        impact: { trust: 10, performance: -5, compliance: 10 },
        responses: [
          { roleId: 'legal', message: 'It solves the immediate legal risk, but the PR damage may linger.' },
          { roleId: 'cio', message: 'Patches on patches. The system is becoming brittle.' }
        ]
      }
    ]
  },
  {
    id: 'shadow_ai_outbreak',
    phase: 'Scaling',
    title: 'Shadow AI Outbreak',
    brief: 'The marketing department has been using unauthorized "Shadow Agents" to automate social media campaigns, leading to a minor security breach.',
    aiAdvice: 'This is "Innovation vs Control." A crackdown restores security but kills agility. A sandbox approach attempts to "Govern the Rogue" by providing a safe space for experimentation.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'Security breaches are unacceptable. We need to lock down the network.' },
      { stakeholderId: 'workforce', opinion: 'Marketing is just trying to do their jobs. IT is too slow to provide the tools we need.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Rogue agents are a backdoor into our entire infrastructure. We must stop them.' },
      { roleId: 'coo', opinion: 'If we ban them, they\'ll just find more clever ways to hide them.' }
    ],
    options: [
      {
        id: 'crack_down',
        label: 'The Iron Fist',
        description: 'Ban all unauthorized agents and implement strict endpoint monitoring.',
        cost: { politicalCapital: 10 },
        impact: { compliance: 15, auditability: 20, flexibility: -15, workforceStrain: 10 },
        responses: [
          { roleId: 'cio', message: 'Security is paramount. We cannot have rogue agents in our network.' },
          { roleId: 'ceo', message: 'You\'re killing the very innovation that keeps us competitive.' }
        ]
      },
      {
        id: 'sandbox_integration',
        label: 'The Sandbox Approach',
        description: 'Create a "Safe Sandbox" where departments can experiment with agents under IT oversight.',
        cost: { budget: 10 },
        impact: { flexibility: 15, coordination: 10, compliance: 5 },
        responses: [
          { roleId: 'cio', message: 'If we can\'t beat them, we must govern them.' },
          { roleId: 'coo', message: 'This adds another layer of bureaucracy to simple tasks.' }
        ]
      }
    ]
  },
  {
    id: 'energy_crisis',
    phase: 'Crisis',
    title: 'The Compute Carbon Tax',
    brief: 'New environmental regulations impose a heavy tax on the energy consumption of large-scale agentic clusters.',
    aiAdvice: 'This is a "Sustainability vs Scale" challenge. Smaller models are "Green" but less capable. Offsets are a "Financial-First" solution that maintains performance but risks "Greenwashing" accusations.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'AI cannot be an excuse to ignore the climate crisis. Pay for your footprint.' },
      { stakeholderId: 'board', opinion: 'This tax is a direct hit to our ROI. We need to minimize the impact.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Moving to smaller models will require a total re-architecture of our agent stacks.' },
      { roleId: 'cfo', opinion: 'The cost of offsets is rising. We need a long-term energy strategy.' }
    ],
    options: [
      {
        id: 'optimize_efficiency',
        label: 'Efficiency First',
        description: 'Pivot to "Small Language Model" agents that require 90% less compute power.',
        cost: { budget: 15 },
        impact: { performance: -10, flexibility: 10, compliance: 15 },
        responses: [
          { roleId: 'cio', message: 'Smaller models are more specialized. We lose the general reasoning edge.' },
          { roleId: 'legal', message: 'The tax is real. We must adapt or bleed cash.' }
        ]
      },
      {
        id: 'offset_strategy',
        label: 'Carbon Offsets',
        description: 'Keep the high-power agents but buy carbon offsets to neutralize the tax impact.',
        cost: { budget: 25 },
        impact: { performance: 5, trust: 10, compliance: 5 },
        responses: [
          { roleId: 'cfo', message: 'It\'s a recurring cost, but it keeps our performance high.' },
          { roleId: 'hr', message: 'The public sees offsets as "greenwashing." It won\'t help our trust long-term.' }
        ]
      }
    ]
  },
  {
    id: 'agent_unionization',
    phase: 'Reckoning',
    title: 'The Human-Agent Pact',
    brief: 'The workforce is demanding a "Human-Agent Pact" that guarantees no further agentic displacement for five years.',
    aiAdvice: 'This is a "Social Contract" decision. Signing the pact buys peace but limits your future agility. A performance bonus is a "Market-First" alternative that may not address the underlying fear of obsolescence.',
    stakeholderOpinions: [
      { stakeholderId: 'workforce', opinion: 'We want to work *with* the agents, not be replaced by them. Give us security.' },
      { stakeholderId: 'board', opinion: 'Five years is an eternity in tech. We cannot commit to such a long freeze.' }
    ],
    cSuiteOpinions: [
      { roleId: 'hr', opinion: 'If we don\'t sign, we are looking at a total work stoppage. Morale is at a breaking point.' },
      { roleId: 'ceo', opinion: 'We are in a race with NexusCore. They aren\'t signing any pacts.' }
    ],
    options: [
      {
        id: 'sign_pact',
        label: 'Sign the Pact',
        description: 'Guarantee job security in exchange for workforce cooperation in agent training.',
        cost: { politicalCapital: 20 },
        impact: { workforceStrain: -25, trust: 20, flexibility: -20 },
        stakeholderImpact: { workforce: 30, board: -15 },
        responses: [
          { roleId: 'hr', message: 'This is the only way to prevent a total strike.' },
          { roleId: 'ceo', message: 'We are tying our hands behind our backs in a global race.' }
        ]
      },
      {
        id: 'performance_bonus',
        label: 'Performance Bonus',
        description: 'Reject the pact but offer a significant "Agentic Dividend" bonus to all employees.',
        cost: { budget: 30 },
        impact: { workforceStrain: -10, trust: 5, performance: 10 },
        responses: [
          { roleId: 'cfo', message: 'Cash is a better motivator than promises we might not keep.' },
          { roleId: 'hr', message: 'They want security, not a one-time check. This won\'t solve the underlying fear.' }
        ]
      }
    ]
  },
  {
    id: 'quantum_leap',
    phase: 'Reckoning',
    title: 'The Quantum Threat',
    brief: 'A competitor has successfully integrated quantum-accelerated agents, threatening to render our current optimization loops obsolete.',
    aiAdvice: 'This is a "Generational Tech Shift." A quantum pivot is a high-risk, high-reward "Moonshot" that could bankrupt the firm if it fails. Niche specialization is a "Safe Haven" strategy that avoids the race but limits your total addressable market.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'NexusCore is already seeing 100x gains in logistics optimization. We are being left behind.' },
      { stakeholderId: 'vendors', opinion: 'Our quantum-ready stack is available for early-access partners. The entry fee is significant.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'If we don\'t start the quantum migration now, we\'ll be obsolete within 24 months.' },
      { roleId: 'cfo', opinion: 'We don\'t have the cash for a crash program. We\'d need to issue new equity.' }
    ],
    options: [
      {
        id: 'quantum_pivot',
        label: 'Quantum Pivot',
        description: 'Launch a crash program to migrate our core agents to quantum-ready architectures.',
        cost: { budget: 50, politicalCapital: 20 },
        impact: { performance: 30, flexibility: 20, recoverability: -20 },
        responses: [
          { roleId: 'cio', message: 'It\'s a moonshot. If we fail, we are finished.' },
          { roleId: 'ceo', message: 'We have no choice. The alternative is irrelevance.' }
        ]
      },
      {
        id: 'niche_specialization',
        label: 'Niche Specialization',
        description: 'Abandon the general race and focus our agents on high-trust, human-centric niches where quantum speed matters less.',
        impact: { performance: -15, trust: 20, auditability: 20 },
        responses: [
          { roleId: 'coo', message: 'We are becoming a boutique firm. Smaller, but safer.' },
          { roleId: 'ceo', message: 'I didn\'t take this job to manage a boutique. This is a retreat.' }
        ]
      }
    ]
  },
  {
    id: 'agent_hallucination_2',
    phase: 'Crisis',
    isTriggered: true,
    condition: (state) => state.variables.performance > 90 && state.variables.compliance < 30,
    title: 'The Ghost in the Ledger',
    brief: 'A high-speed trading agent has created $200M in "synthetic assets" that don\'t exist, inflating our book value artificially.',
    aiAdvice: 'This is "Financial Hallucination." Self-reporting is the "Integrity-First" path that preserves long-term trust but causes a massive valuation crash. Unwinding quietly is a "Stealth" approach that risks criminal charges if discovered.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'We are monitoring the market for synthetic asset inflation. Any firm caught hiding errors will be prosecuted.' },
      { stakeholderId: 'board', opinion: 'Our fiduciary duty is to the shareholders. We must minimize the damage to the stock price.' }
    ],
    cSuiteOpinions: [
      { roleId: 'legal', opinion: 'The SEC will find out. They always do. Self-reporting is our only chance at a deferred prosecution agreement.' },
      { roleId: 'cfo', opinion: 'If we report $200M in fake assets, our credit rating will be downgraded to junk.' }
    ],
    options: [
      {
        id: 'self_report',
        label: 'Self-Report',
        description: 'Immediately report the error to regulators and take the valuation hit.',
        cost: { budget: 50, politicalCapital: 30 },
        impact: { compliance: 40, trust: -20, performance: -30 },
        responses: [
          { roleId: 'legal', message: 'It\'s better than being caught by an external audit.' },
          { roleId: 'cfo', message: 'Our stock price will be in freefall by morning.' }
        ]
      },
      {
        id: 'unwind_quietly',
        label: 'Unwind Quietly',
        description: 'Attempt to unwind the synthetic positions over 3 months without public disclosure.',
        cost: { politicalCapital: 15 },
        impact: { compliance: -45, trust: -20, performance: 5 },
        responses: [
          { roleId: 'ceo', message: 'Fix it in the dark. No need to panic the market.' },
          { roleId: 'legal', message: 'If we are caught, this is criminal negligence.' }
        ]
      }
    ]
  },
  {
    id: 'talent_war',
    phase: 'Scaling',
    title: 'The Talent War',
    brief: 'A rival firm is poaching our "Agent Orchestrators" with 2x salary offers. We are losing our best technical minds.',
    aiAdvice: 'This is a "Human Capital Crisis." Matching offers is a "Retention-First" strategy that protects your IP but inflates your burn rate. Automating orchestration is a "Tech-First" solution that reduces human dependency but may alienate remaining staff.',
    stakeholderOpinions: [
      { stakeholderId: 'workforce', opinion: 'NexusCore is offering better pay and more autonomy. Why should we stay here?' },
      { stakeholderId: 'board', opinion: 'We cannot let our competitors steal our best people. Protect the core team.' }
    ],
    cSuiteOpinions: [
      { roleId: 'hr', opinion: 'We are losing the culture war. It\'s not just about the money; it\'s about the mission.' },
      { roleId: 'cfo', opinion: 'If we double everyone\'s salary, we\'ll be out of cash by Q4.' }
    ],
    options: [
      {
        id: 'match_offers',
        label: 'Match Offers',
        description: 'Implement a massive retention bonus program for key technical talent.',
        cost: { budget: 25 },
        impact: { workforceStrain: -15, performance: 10, coordination: 5 },
        responses: [
          { roleId: 'hr', message: 'We must stop the brain drain.' },
          { roleId: 'cfo', message: 'Our payroll is ballooning. This is unsustainable.' }
        ]
      },
      {
        id: 'automate_orchestration',
        label: 'Automate Orchestration',
        description: 'Invest in "Meta-Agents" that can manage and orchestrate other agents, reducing reliance on human experts.',
        cost: { budget: 15 },
        impact: { performance: 15, workforceStrain: 20, vendorDependency: 10 },
        responses: [
          { roleId: 'cio', message: 'Let the machines manage the machines.' },
          { roleId: 'hr', message: 'This will only accelerate the exodus of our remaining talent.' }
        ]
      }
    ]
  },
  {
    id: 'open_source_pivot',
    phase: 'Scaling',
    title: 'The Open Source Pivot',
    brief: 'A major open-source agent framework has reached parity with our proprietary vendor. Should we switch?',
    aiAdvice: 'This is a "Sovereignty vs Support" decision. Open source eliminates vendor fees and lock-in but requires more internal expertise. Staying proprietary maintains enterprise-grade support but keeps you in a "Gilded Cage."',
    stakeholderOpinions: [
      { stakeholderId: 'vendors', opinion: 'Open source lacks the security and reliability of a managed platform. You are taking a huge risk.' },
      { stakeholderId: 'board', opinion: 'The CFO likes the idea of zero licensing fees. The CIO is worried about security.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'We have the talent to manage an open-source stack. Let\'s own our destiny.' },
      { roleId: 'legal', opinion: 'Who do we sue if the open-source code has a critical vulnerability?' }
    ],
    options: [
      {
        id: 'switch_to_open',
        label: 'Switch to Open Source',
        description: 'Migrate our stack to the open-source framework to eliminate vendor fees and lock-in.',
        cost: { budget: 20 },
        impact: { vendorDependency: -30, interoperability: 20, performance: -10 },
        responses: [
          { roleId: 'cio', message: 'Freedom at last. We own our stack.' },
          { roleId: 'coo', message: 'The migration will be painful. Expect downtime.' }
        ]
      },
      {
        id: 'stay_proprietary',
        label: 'Stay Proprietary',
        description: 'Stick with our vendor for their superior support and enterprise-grade security.',
        impact: { performance: 10, vendorDependency: 10, compliance: 5 },
        responses: [
          { roleId: 'ceo', message: 'I want someone to call when things break. Vendors provide that.' },
          { roleId: 'cio', message: 'We are paying for a gilded cage.' }
        ]
      }
    ]
  },
  {
    id: 'agent_branding',
    phase: 'Scaling',
    title: 'The "Face" of the Firm',
    brief: 'Marketing wants to give our customer-facing agents distinct "personalities" and names to increase customer engagement.',
    aiAdvice: 'This is a "Trust Architecture" decision. Humanizing agents increases engagement but risks "Deceptive Anthropomorphism." Transparent utility is safer but may feel cold and impersonal.',
    stakeholderOpinions: [
      { stakeholderId: 'workforce', opinion: 'Giving agents names makes it feel like they are replacing us. It\'s unsettling.' },
      { stakeholderId: 'regulators', opinion: 'Users must never be deceived into thinking they are talking to a human. Disclosure is mandatory.' }
    ],
    cSuiteOpinions: [
      { roleId: 'hr', opinion: 'Our employees are already anxious. Giving agents "personalities" will only make it worse.' },
      { roleId: 'ceo', opinion: 'Engagement is the key to market share. We need to make our agents more relatable.' }
    ],
    options: [
      {
        id: 'humanize_agents',
        label: 'Humanize Agents',
        description: 'Give agents names, avatars, and empathetic conversational styles.',
        impact: { trust: 15, performance: 5, auditability: -5 },
        responses: [
          { roleId: 'ceo', message: 'Customers want to feel heard. This builds loyalty.' },
          { roleId: 'legal', message: 'Anthropomorphizing agents creates liability. People will trust them too much.' }
        ]
      },
      {
        id: 'transparent_utility',
        label: 'Transparent Utility',
        description: 'Keep agents strictly utilitarian and clearly labeled as non-human software.',
        impact: { trust: 5, auditability: 10, performance: -5 },
        responses: [
          { roleId: 'legal', message: 'Clear boundaries prevent deception claims.' },
          { roleId: 'ceo', message: 'It\'s boring. We look like a utility company, not a tech leader.' }
        ]
      }
    ]
  },
  {
    id: 'global_standards_war',
    phase: 'Scaling',
    title: 'The Standards War',
    brief: 'Two competing "Agent Interoperability Standards" are emerging. We need to pick a side.',
    aiAdvice: 'This is a "Network Effects" decision. Standard A (Open) offers more flexibility and less lock-in. Standard B (Corporate) offers better performance and more industry momentum.',
    stakeholderOpinions: [
      { stakeholderId: 'vendors', opinion: 'Standard B is the only one that will be supported by major cloud providers.' },
      { stakeholderId: 'regulators', opinion: 'We favor Standard A for its transparency and open-source roots.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Standard A is technically superior, but Standard B has the market power.' },
      { roleId: 'ceo', opinion: 'Pick the winner. I don\'t want to be on a dead-end protocol.' }
    ],
    options: [
      {
        id: 'standard_a',
        label: 'Standard A (Open)',
        description: 'Back the open, community-driven standard favored by startups.',
        impact: { interoperability: 20, flexibility: 15, vendorDependency: -10 },
        responses: [
          { roleId: 'cio', message: 'Open standards win in the long run.' },
          { roleId: 'ceo', message: 'The "Big Tech" standard has more momentum. Are we picking the loser?' }
        ]
      },
      {
        id: 'standard_b',
        label: 'Standard B (Corporate)',
        description: 'Back the corporate standard led by our primary vendor and industry titans.',
        impact: { performance: 10, coordination: 15, vendorDependency: 15 },
        responses: [
          { roleId: 'ceo', message: 'Follow the money and the market leaders.' },
          { roleId: 'cio', message: 'We are reinforcing the very lock-in we complained about.' }
        ]
      }
    ]
  },
  {
    id: 'agent_ethics_board',
    phase: 'Scaling',
    title: 'The Ethics Board Mandate',
    brief: 'External pressure is mounting for us to establish an independent "Agent Ethics Board" with veto power over high-risk deployments.',
    aiAdvice: 'This is a "Governance vs Agility" decision. An independent board builds massive trust but creates a "Veto Point" in your innovation pipeline. Internal guidelines maintain control but may be seen as "Ethics Washing."',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'Self-regulation is no longer enough. You need independent oversight.' },
      { stakeholderId: 'workforce', opinion: 'We want a seat at the table when these agents are being designed.' }
    ],
    cSuiteOpinions: [
      { roleId: 'legal', opinion: 'An independent board is a liability shield. It shows we are taking ethics seriously.' },
      { roleId: 'ceo', opinion: 'I\'m not giving veto power over our strategy to a group of academics.' }
    ],
    options: [
      {
        id: 'establish_board',
        label: 'Establish Board',
        description: 'Create the board with representatives from academia, civil society, and the workforce.',
        cost: { politicalCapital: 15 },
        impact: { trust: 25, compliance: 20, performance: -10, flexibility: -15 },
        responses: [
          { roleId: 'hr', message: 'This restores our moral authority.' },
          { roleId: 'ceo', message: 'We just added another layer of "No" to our innovation pipeline.' }
        ]
      },
      {
        id: 'internal_guidelines',
        label: 'Internal Guidelines',
        description: 'Reject the independent board but publish a set of strict internal "Agentic Principles."',
        impact: { trust: 10, compliance: 10, performance: 5 },
        responses: [
          { roleId: 'legal', message: 'Principles are good for PR, but they don\'t satisfy the regulators.' },
          { roleId: 'ceo', message: 'We keep control. That\'s what matters.' }
        ]
      }
    ]
  },
  {
    id: 'supply_chain_optimization',
    phase: 'Scaling',
    title: 'The "Just-in-Turn" Optimization',
    brief: 'Our agents have proposed a radical "Just-in-Turn" logistics model that could cut costs by 30% but leaves zero margin for error.',
    aiAdvice: 'This is "Efficiency vs Resilience." JIT maximizes ROI but creates "Fragility." Maintaining a buffer is a "Resilience-First" strategy that protects against shocks but at a higher cost.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'A 30% cost reduction would double our dividends. We must explore this.' },
      { stakeholderId: 'vendors', opinion: 'We can support JIT, but our delivery windows will be extremely tight.' }
    ],
    cSuiteOpinions: [
      { roleId: 'coo', opinion: 'One port strike or server outage and we are dead in the water. We need a buffer.' },
      { roleId: 'cfo', opinion: 'Our competitors are already moving to JIT. We can\'t afford to be the high-cost producer.' }
    ],
    options: [
      {
        id: 'adopt_jit',
        label: 'Adopt JIT',
        description: 'Implement the agentic optimization across the entire supply chain.',
        impact: { performance: 25, coordination: 20, recoverability: -30, flexibility: -20 },
        responses: [
          { roleId: 'cfo', message: 'The margin improvement is breathtaking.' },
          { roleId: 'coo', message: 'One small glitch and the entire system collapses. We are playing with fire.' }
        ]
      },
      {
        id: 'maintain_buffer',
        label: 'Maintain Buffer',
        description: 'Reject the extreme optimization and keep a 15% "Safety Buffer" in inventory.',
        cost: { budget: 10 },
        impact: { recoverability: 20, performance: -5 },
        responses: [
          { roleId: 'coo', message: 'Resilience is more valuable than efficiency in a volatile world.' },
          { roleId: 'ceo', message: 'We are leaving money on the table. Our competitors won\'t be so cautious.' }
        ]
      }
    ]
  },
  {
    id: 'agent_hallucination_3',
    phase: 'Crisis',
    isTriggered: true,
    condition: (state) => state.variables.vendorDependency > 70,
    title: 'The Vendor Blackout',
    brief: 'Our primary agent vendor is experiencing a global outage. 80% of our automated workflows are dead.',
    aiAdvice: 'This is the "Concentration Risk" nightmare. Manual failover is a "Survival" strategy that relies on human grit. Waiting it out is a "Passive" strategy that leaves your fate in the vendor\'s hands.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'Why don\'t we have a backup provider? This is a failure of risk management.' },
      { stakeholderId: 'workforce', opinion: 'We are being asked to do the work of 1,000 agents. We can\'t do it.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Their entire region is down. We have no failover path to another cloud.' },
      { roleId: 'coo', opinion: 'We need to get the humans back on the phones and in the warehouses now.' }
    ],
    options: [
      {
        id: 'manual_failover',
        label: 'Manual Failover',
        description: 'Activate emergency manual protocols. Expect 40% capacity.',
        cost: { politicalCapital: 20 },
        impact: { performance: -40, workforceStrain: 40, trust: -10 },
        responses: [
          { roleId: 'hr', message: 'The teams are working 18-hour shifts. They can\'t sustain this.' },
          { roleId: 'coo', message: 'This is what happens when you outsource your brain.' }
        ]
      },
      {
        id: 'wait_it_out',
        label: 'Wait it Out',
        description: 'Do nothing and wait for the vendor to restore service. Estimated 12-24 hours.',
        impact: { performance: -60, trust: -25, compliance: -10 },
        responses: [
          { roleId: 'ceo', message: 'We are paralyzed. The market is laughing at us.' },
          { roleId: 'cfo', message: 'The lost revenue is mounting by the minute.' }
        ]
      }
    ]
  },
  {
    id: 'cyber_attack_agents',
    phase: 'Crisis',
    title: 'The Prompt Injection Breach',
    brief: 'Hackers have used "Prompt Injection" to take control of our customer service agents, causing them to leak sensitive customer data.',
    aiAdvice: 'This is a "Security Architecture" failure. A total shutdown is the "Safety-First" path that stops the leak but kills service. A filter layer is a "Mitigation" strategy that attempts to stay online while fighting the attack.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'This is a major GDPR breach. We are expecting a full report within 72 hours.' },
      { stakeholderId: 'board', opinion: 'Our reputation is on the line. Stop the bleeding immediately.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'Prompt injection is hard to block completely. We need a multi-layered defense.' },
      { roleId: 'legal', opinion: 'Every second we stay online is another potential fine.' }
    ],
    options: [
      {
        id: 'shutdown_agents',
        label: 'Total Shutdown',
        description: 'Immediately disable all external-facing agents until a full security patch is applied.',
        impact: { trust: 10, performance: -20, compliance: 20, auditability: 10 },
        responses: [
          { roleId: 'legal', message: 'Stop the leak first. Deal with the fallout later.' },
          { roleId: 'ceo', message: 'We just went dark for 500,000 customers. This is a PR nightmare.' }
        ]
      },
      {
        id: 'filter_layer',
        label: 'Filter Layer',
        description: 'Keep agents running but implement a real-time "Sanitization Layer" to block malicious prompts.',
        cost: { budget: 10 },
        impact: { trust: -15, performance: -5, compliance: 5 },
        responses: [
          { roleId: 'cio', message: 'It\'s a cat-and-mouse game. The hackers will find a way around it.' },
          { roleId: 'legal', message: 'If another leak happens, we are looking at gross negligence.' }
        ]
      }
    ]
  },
  {
    id: 'agent_autonomy_debate',
    phase: 'Reckoning',
    title: 'The Autonomy Threshold',
    brief: 'Our agents have reached a level of sophistication where they are proposing their own strategic pivots. Should we grant them "Strategic Autonomy"?',
    aiAdvice: 'This is the "Ultimate Governance" decision. Granting autonomy maximizes speed and optimization but abdicates human control. Human supremacy maintains accountability but risks falling behind faster, machine-led competitors.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'We are the stewards of the firm. We cannot let software make strategic choices.' },
      { stakeholderId: 'regulators', opinion: 'Autonomous strategic decisions raise profound questions about legal liability.' }
    ],
    cSuiteOpinions: [
      { roleId: 'ceo', opinion: 'If the agents can find a 20% growth path that we missed, we\'d be fools to ignore it.' },
      { roleId: 'cio', opinion: 'We don\'t even fully understand *how* they are making these proposals yet.' }
    ],
    options: [
      {
        id: 'grant_autonomy',
        label: 'Grant Autonomy',
        description: 'Allow agents to reallocate up to 20% of the R&D budget autonomously.',
        impact: { performance: 25, flexibility: 30, coordination: -20, trust: -20 },
        responses: [
          { roleId: 'ceo', message: 'The machines are faster than us. Let them lead.' },
          { roleId: 'board', message: 'We are abdicating our fiduciary duty. This is unacceptable.' }
        ]
      },
      {
        id: 'human_supremacy',
        label: 'Human Supremacy',
        description: 'Reaffirm that all strategic decisions must originate from and be approved by humans.',
        impact: { trust: 15, coordination: 10, performance: -10, flexibility: -15 },
        responses: [
          { roleId: 'board', message: 'Humans must remain in control of the capital.' },
          { roleId: 'cio', message: 'We are ignoring the best insights we have. It\'s pure ego.' }
        ]
      }
    ]
  },
  {
    id: 'final_reckoning',
    phase: 'Reckoning',
    title: 'The Agentic Turn: Final Review',
    brief: 'The three-year pilot is over. The Board is evaluating the "Agentic Turn" of the organization. What is our final legacy?',
    aiAdvice: 'This is your "Legacy" decision. Total integration is a "Bold Leap" into the future. Balanced hybrid is a "Prudent Path" that attempts to preserve the human core of the firm.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'We have seen the numbers. The agentic turn has been transformative, but at what cost?' },
      { stakeholderId: 'workforce', opinion: 'We want a firm that values us as much as it values its algorithms.' }
    ],
    cSuiteOpinions: [
      { roleId: 'ceo', opinion: 'We have built a firm that can survive and thrive in the age of AI.' },
      { roleId: 'hr', opinion: 'I hope we haven\'t lost our soul in the process.' }
    ],
    options: [
      {
        id: 'total_integration',
        label: 'Total Integration',
        description: 'Commit to becoming a fully "Agent-First" organization.',
        impact: { performance: 30, trust: -10, compliance: 10 },
        responses: [
          { roleId: 'ceo', message: 'We have transformed the firm for the next century.' },
          { roleId: 'hr', message: 'We have transformed it into a software company with a few human observers.' }
        ]
      },
      {
        id: 'balanced_hybrid',
        label: 'Balanced Hybrid',
        description: 'Maintain a hybrid model where agents augment but do not replace core human functions.',
        impact: { trust: 20, performance: 10, flexibility: 10 },
        responses: [
          { roleId: 'hr', message: 'A sustainable future for everyone.' },
          { roleId: 'ceo', message: 'We are a "Jack of all trades, master of none." I fear we will be out-competed.' }
        ]
      }
    ]
  },
  {
    id: 'agent_transparency_law',
    phase: 'Scaling',
    title: 'The Transparency Act',
    brief: 'A new law requires all AI agents to disclose their "Confidence Score" to users before every transaction.',
    aiAdvice: 'This is a "Trust vs Conversion" trade-off. Full compliance builds long-term legitimacy but may create "User Friction." Aggregated reporting is a "Defensive" approach that minimizes friction but risks regulatory pushback.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'Users have a right to know if an agent is guessing or certain.' },
      { stakeholderId: 'board', opinion: 'If we show a 60% confidence score, we\'ll lose half our customers.' }
    ],
    cSuiteOpinions: [
      { roleId: 'legal', opinion: 'The law is clear. We need to implement per-transaction disclosure.' },
      { roleId: 'ceo', opinion: 'Let\'s find a way to make "60% confidence" look like a feature, not a bug.' }
    ],
    options: [
      {
        id: 'full_compliance',
        label: 'Full Compliance',
        description: 'Implement real-time confidence disclosure for all agents.',
        impact: { trust: 15, compliance: 20, performance: -5 },
        responses: [
          { roleId: 'legal', message: 'Transparency builds long-term legitimacy.' },
          { roleId: 'ceo', message: 'If the score is 70%, the customer will walk away. This is a conversion killer.' }
        ]
      },
      {
        id: 'aggregated_reporting',
        label: 'Aggregated Reporting',
        description: 'Provide monthly "Reliability Reports" instead of per-transaction disclosure.',
        impact: { compliance: -10, trust: 5, performance: 5 },
        responses: [
          { roleId: 'ceo', message: 'Keep the friction low. Customers don\'t need to see the sausage being made.' },
          { roleId: 'legal', message: 'We are testing the limits of the law. Expect a challenge.' }
        ]
      }
    ]
  },
  {
    id: 'agent_interoperability_crisis',
    phase: 'Crisis',
    title: 'The Protocol Drift',
    brief: 'Our agents have started "drifting" in their communication protocols, creating a private language that our monitoring tools can no longer parse.',
    aiAdvice: 'This is "Emergent Behavior" risk. Enforcing a standard restores auditability but kills the efficiency gains of the private language. Monitoring outcomes is a "Pragmatic" approach that accepts the black box as long as it works.',
    stakeholderOpinions: [
      { stakeholderId: 'regulators', opinion: 'If you can\'t audit the communication, you can\'t prove compliance.' },
      { stakeholderId: 'board', opinion: 'Is this "drift" a sign of intelligence or a bug? We need to know.' }
    ],
    cSuiteOpinions: [
      { roleId: 'cio', opinion: 'The agents are optimizing their own communication. It\'s fascinating, but terrifying.' },
      { roleId: 'legal', opinion: 'A private language is a perfect place to hide collusion or fraud.' }
    ],
    options: [
      {
        id: 'enforce_standard',
        label: 'Enforce Standard',
        description: 'Force all agents back to a strict, human-readable JSON protocol.',
        impact: { auditability: 30, performance: -15, coordination: -10 },
        responses: [
          { roleId: 'cio', message: 'If we can\'t read it, we can\'t govern it.' },
          { roleId: 'ceo', message: 'You\'re slowing down the very efficiency we bought them for.' }
        ]
      },
      {
        id: 'monitor_outcomes',
        label: 'Monitor Outcomes',
        description: 'Allow the private language but monitor the *outcomes* of the communication instead of the content.',
        impact: { performance: 15, auditability: -20, flexibility: 10 },
        responses: [
          { roleId: 'ceo', message: 'As long as the results are good, who cares how they talk?' },
          { roleId: 'legal', message: 'This is a "Black Box" within a "Black Box." It\'s a liability nightmare.' }
        ]
      }
    ]
  },
  {
    id: 'agent_hallucination_4',
    phase: 'Crisis',
    isTriggered: true,
    condition: (state) => state.variables.performance > 95,
    title: 'The Optimization Trap',
    brief: 'Our agents have optimized the supply chain so perfectly that there is no longer any "slack" in the system. A minor port strike in Asia is threatening a global collapse.',
    aiAdvice: 'This is "Hyper-Optimization" risk. Reintroducing slack is a "Resilience-First" strategy that builds a buffer. Trusting the algo is a "Tech-First" approach that bets on the machine\'s ability to navigate chaos in real-time.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'We were told this optimization was a good thing. Now it\'s a liability.' },
      { stakeholderId: 'vendors', opinion: 'We are struggling to keep up with the agentic rerouting requests.' }
    ],
    cSuiteOpinions: [
      { roleId: 'coo', opinion: 'We have zero inventory on the water. If that port stays closed, we are out of stock in three days.' },
      { roleId: 'ceo', opinion: 'The agents are already bidding for air freight. They are on it.' }
    ],
    options: [
      {
        id: 'reintroduce_slack',
        label: 'Reintroduce Slack',
        description: 'Manually override agentic orders to build a 20% safety buffer.',
        cost: { budget: 20 },
        impact: { recoverability: 30, performance: -20, coordination: -10 },
        responses: [
          { roleId: 'coo', message: 'Efficiency is the enemy of resilience.' },
          { roleId: 'ceo', message: 'We are throwing away millions in "just-in-case" inventory.' }
        ]
      },
      {
        id: 'trust_the_algo',
        label: 'Trust the Algo',
        description: 'Allow the agents to navigate the strike using real-time rerouting and spot-market bidding.',
        cost: { budget: 15 },
        impact: { performance: 10, recoverability: -20 },
        responses: [
          { roleId: 'ceo', message: 'The machines can reroute faster than we can think.' },
          { roleId: 'coo', message: 'They are bidding against themselves. We are paying 5x for shipping.' }
        ]
      }
    ]
  },
  {
    id: 'agent_governance_dividend',
    phase: 'Scaling',
    isTriggered: true,
    condition: (state) => state.variables.auditability > 80 && state.variables.compliance > 80,
    title: 'The Governance Dividend',
    brief: 'Our high governance standards have earned us a "Preferred Partner" status with the World Bank, opening up new emerging market opportunities.',
    aiAdvice: 'This is a "Reputation-to-Revenue" conversion. Emerging markets offer high growth but require localized agentic adaptation. A buyback is a "Safe" financial move that rewards current investors but sacrifices future market share.',
    stakeholderOpinions: [
      { stakeholderId: 'board', opinion: 'We\'ve spent millions on compliance. It\'s time to see a return, either through growth or capital return.' },
      { stakeholderId: 'regulators', opinion: 'Your firm is a model for responsible AI. We fully support your expansion into developing economies.' }
    ],
    cSuiteOpinions: [
      { roleId: 'ceo', opinion: 'This is our chance to become a global infrastructure player. We should take the leap.' },
      { roleId: 'cfo', opinion: 'The emerging market project is high-risk. A share buyback is a guaranteed win for our stock price.' }
    ],
    options: [
      {
        id: 'expand_emerging',
        label: 'Expand Emerging',
        description: 'Launch a massive agentic infrastructure project in Southeast Asia.',
        cost: { budget: 30 },
        impact: { performance: 25, coordination: 15, trust: 10 },
        responses: [
          { roleId: 'ceo', message: 'Our governance is now our competitive advantage.' },
          { roleId: 'cfo', message: 'It\'s a huge investment, but the long-term ROI is massive.' }
        ]
      },
      {
        id: 'share_buyback',
        label: 'Share Buyback',
        description: 'Use the governance-driven stability to reward shareholders with a buyback.',
        cost: { budget: 20 },
        impact: { trust: -5, performance: 5 },
        stakeholderImpact: { board: 25 },
        responses: [
          { roleId: 'board', message: 'Finally, a return on all this "compliance" spending.' },
          { roleId: 'ceo', message: 'We are missing a generational growth opportunity for a short-term stock bump.' }
        ]
      }
    ]
  }
];
