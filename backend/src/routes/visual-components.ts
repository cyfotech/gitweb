import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ---------------------------------------------------------------------------
// Supported component names and their storage key mappings
// ---------------------------------------------------------------------------
const COMPONENT_MAP: Record<string, string> = {
  'tax-intelligence':       'visual_tax_intelligence',
  'production-dashboard':   'visual_production_dashboard',
  'execution-map':          'visual_execution_map',
  'service-workflow':       'visual_service_workflow',
};

// Default data for each component (used when no data exists yet)
const DEFAULT_CONFIGS: Record<string, unknown> = {
  'tax-intelligence': {
    title: 'Tax intelligence',
    subtitle: 'Trusted financial expertise',
    icon: '$',
    percentageChange: '+18.6%',
    backgroundImage: '',
    backgroundOpacity: 0.6,
    chartBars: [
      { id: 'bar1', label: 'Q1', value: 45, color: '#22b887', enabled: true },
      { id: 'bar2', label: 'Q2', value: 62, color: '#22b887', enabled: true },
      { id: 'bar3', label: 'Q3', value: 58, color: '#22b887', enabled: true },
      { id: 'bar4', label: 'Q4', value: 71, color: '#22b887', enabled: true },
      { id: 'bar5', label: 'Q5', value: 68, color: '#22b887', enabled: true },
      { id: 'bar6', label: 'Q6', value: 85, color: '#39c7c0', enabled: true },
      { id: 'bar7', label: 'Q7', value: 92, color: '#39c7c0', enabled: true },
    ],
    floatingCards: [
      { id: 'card1', title: 'CPA / EA', description: 'Expert talent', icon: '⭐', badge: '', position: 'left', rotation: -8, enabled: true },
      { id: 'card2', title: 'Compliance', description: 'Reviewed & verified', icon: '🛡️', badge: '', position: 'right', rotation: 5, enabled: true },
    ],
    trustIndicator: { text: 'Trusted financial expertise', enabled: true },
    coinIcon: '$',
    coinText: 'Financial',
  },

  'production-dashboard': {
    firmWorkflowLabel: 'Firm workflow',
    operationsLabel: 'OPERATIONS OVERVIEW',
    title: 'Production dashboard',
    backgroundImage: '',
    statsCards: [
      { id: 's1', label: 'Returns in review', value: '128', change: '+12.8%', status: '', icon: '📋', enabled: true },
      { id: 's2', label: 'Ready for delivery', value: '94', change: '', status: 'On track', icon: '✅', enabled: true },
    ],
    chartTitle: 'Weekly throughput',
    chartPeriod: 'Last 7 days',
    chartData: [
      { day: 'Mon', value1: 30, value2: 20 },
      { day: 'Tue', value1: 45, value2: 28 },
      { day: 'Wed', value1: 42, value2: 35 },
      { day: 'Thu', value1: 60, value2: 40 },
      { day: 'Fri', value1: 55, value2: 50 },
      { day: 'Sat', value1: 70, value2: 55 },
      { day: 'Sun', value1: 85, value2: 65 },
    ],
    statusCards: [
      { id: 'sc1', title: 'Two-tier review', description: 'Quality checkpoint', icon: '🔄', enabled: true },
      { id: 'sc2', title: 'Capacity optimized', description: 'Production ready', icon: '⚡', enabled: true },
      { id: 'sc3', title: 'Diagnostic review enabled', description: '', icon: '🔬', enabled: true },
    ],
    updatedLabel: 'Updated just now',
    builtForLabel: 'Built for professional firms',
  },

  'execution-map': {
    title: 'EXECUTION MAP',
    autoPlay: true,
    autoPlayInterval: 4000,
    infiniteLoop: true,
    circleSize: 280,
    stages: [
      {
        id: 'st1', number: 1, phase: '01', title: 'Initial Assessment',
        category: 'Family Tax Planning',
        description: 'Comprehensive review of household tax situation and goals.',
        checkpointTitle: 'Assessment Report', checkpointDescription: 'Complete financial picture',
        icon: '📋', status: 'complete', duration: '1-2 weeks', order: 1,
      },
      {
        id: 'st2', number: 2, phase: '02', title: 'Strategy Development',
        category: 'Family Tax Planning',
        description: 'Build customized multi-year tax strategy for the family.',
        checkpointTitle: 'Strategy Memo', checkpointDescription: 'Tailored tax roadmap',
        icon: '🎯', status: 'complete', duration: '1 week', order: 2,
      },
      {
        id: 'st3', number: 3, phase: '03', title: 'Implementation',
        category: 'Family Tax Planning',
        description: 'Execute tax strategies across all household accounts.',
        checkpointTitle: 'Implementation Log', checkpointDescription: 'Executed strategies',
        icon: '⚙️', status: 'complete', duration: '2-3 weeks', order: 3,
      },
      {
        id: 'st4', number: 4, phase: '04', title: 'Annual Review & Adjustment',
        category: 'Family Tax Planning',
        description: 'Recalibrate strategies annually as children reach milestone ages or tax codes change.',
        checkpointTitle: 'Annual Strategy Memo', checkpointDescription: 'Yearly recalibration',
        icon: '🔄', status: 'current', duration: '3-5 yr', order: 4,
      },
    ],
  },

  'service-workflow': {
    services: {},
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveKeys(component: string): { publishedKey: string; draftKey: string; historyKey: string } | null {
  const base = COMPONENT_MAP[component];
  if (!base) return null;
  return {
    publishedKey: base,
    draftKey:     `${base}_draft`,
    historyKey:   `${base}_history`,
  };
}

async function getSettingValue(key: string): Promise<unknown | null> {
  const record = await prisma.globalsetting.findUnique({ where: { key } });
  return record ? record.value : null;
}

async function upsertSettingValue(key: string, value: unknown, category = 'visual-components'): Promise<void> {
  await prisma.globalsetting.upsert({
    where: { key },
    update: { value: value as any, category },
    create: { id: uuidv4(), key, value: value as any, category },
  });
}

// ---------------------------------------------------------------------------
// GET /api/v1/visual-components/:component
// Returns the published config (or default if none saved yet)
// ---------------------------------------------------------------------------
router.get('/:component', async (req, res: Response) => {
  const keys = resolveKeys(req.params.component);
  if (!keys) {
    return res.status(404).json({ error: `Unknown component: ${req.params.component}` });
  }

  try {
    const published = await getSettingValue(keys.publishedKey);
    const data = published ?? DEFAULT_CONFIGS[req.params.component] ?? {};
    return res.json({ component: req.params.component, config: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch component config' });
  }
});

// ---------------------------------------------------------------------------
// PUT /api/v1/visual-components/:component
// Save/update draft config (auth required)
// ---------------------------------------------------------------------------
router.put('/:component', authenticate, async (req: AuthRequest, res: Response) => {
  const keys = resolveKeys(req.params.component);
  if (!keys) {
    return res.status(404).json({ error: `Unknown component: ${req.params.component}` });
  }

  try {
    const { config } = req.body;
    if (config === undefined || config === null) {
      return res.status(400).json({ error: 'config is required in request body' });
    }

    await upsertSettingValue(keys.draftKey, config);
    return res.json({ success: true, component: req.params.component, draft: config });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save draft config' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/v1/visual-components/:component/publish
// Publish draft → published, archive current published into history (max 5)
// (auth required)
// ---------------------------------------------------------------------------
router.post('/:component/publish', authenticate, async (req: AuthRequest, res: Response) => {
  const keys = resolveKeys(req.params.component);
  if (!keys) {
    return res.status(404).json({ error: `Unknown component: ${req.params.component}` });
  }

  try {
    // Determine what to publish: body.config overrides draft if provided
    let configToPublish: unknown;
    if (req.body && req.body.config !== undefined) {
      configToPublish = req.body.config;
    } else {
      const draft = await getSettingValue(keys.draftKey);
      if (draft === null) {
        return res.status(400).json({ error: 'No draft found to publish. Save a draft first or provide config in body.' });
      }
      configToPublish = draft;
    }

    // Archive current published version into history (keep last 5)
    const currentPublished = await getSettingValue(keys.publishedKey);
    if (currentPublished !== null) {
      const rawHistory = await getSettingValue(keys.historyKey);
      const history: unknown[] = Array.isArray(rawHistory) ? rawHistory : [];
      history.unshift({
        revisionId: uuidv4(),
        timestamp: new Date().toISOString(),
        config: currentPublished,
      });
      // Keep only the latest 5 revisions
      const trimmed = history.slice(0, 5);
      await upsertSettingValue(keys.historyKey, trimmed);
    }

    // Write as published
    await upsertSettingValue(keys.publishedKey, configToPublish);

    return res.json({ success: true, component: req.params.component, published: configToPublish });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to publish component config' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/v1/visual-components/:component/history
// Returns the last 5 revisions
// ---------------------------------------------------------------------------
router.get('/:component/history', authenticate, async (req: AuthRequest, res: Response) => {
  const keys = resolveKeys(req.params.component);
  if (!keys) {
    return res.status(404).json({ error: `Unknown component: ${req.params.component}` });
  }

  try {
    const rawHistory = await getSettingValue(keys.historyKey);
    const history = Array.isArray(rawHistory) ? rawHistory : [];
    return res.json({ component: req.params.component, history });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch history' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/v1/visual-components/:component/restore/:revisionId
// Restore a specific revision as the current published config
// (auth required)
// ---------------------------------------------------------------------------
router.post('/:component/restore/:revisionId', authenticate, async (req: AuthRequest, res: Response) => {
  const keys = resolveKeys(req.params.component);
  if (!keys) {
    return res.status(404).json({ error: `Unknown component: ${req.params.component}` });
  }

  const { revisionId } = req.params;

  try {
    const rawHistory = await getSettingValue(keys.historyKey);
    const history: Array<{ revisionId: string; timestamp: string; config: unknown }> =
      Array.isArray(rawHistory) ? rawHistory as any : [];

    const revision = history.find(r => r.revisionId === revisionId);
    if (!revision) {
      return res.status(404).json({ error: `Revision ${revisionId} not found` });
    }

    // Archive current published before restoring
    const currentPublished = await getSettingValue(keys.publishedKey);
    if (currentPublished !== null) {
      history.unshift({
        revisionId: uuidv4(),
        timestamp: new Date().toISOString(),
        config: currentPublished,
      });
      await upsertSettingValue(keys.historyKey, history.slice(0, 5));
    }

    // Restore
    await upsertSettingValue(keys.publishedKey, revision.config);

    return res.json({
      success: true,
      component: req.params.component,
      restored: revisionId,
      config: revision.config,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to restore revision' });
  }
});

export default router;
