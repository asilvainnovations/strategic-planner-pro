import { useState, useEffect, useCallback } from 'react';
import {
  StrategicPlan,
  SWOTItem,
  StrategicOption,
  BSCObjective,
  KPI,
  PAP,
  loadFromStorage,
  saveToStorage,
  createEmptyPlan,
  createSamplePlan,
  generateId,
} from '@/lib/strategicPlanStore';

export const useStrategicPlan = () => {
  const [plans, setPlans] = useState<StrategicPlan[]>([]);
  const [currentPlan, setCurrentPlanState] = useState<StrategicPlan | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const { plans: storedPlans, currentPlanId } = loadFromStorage();
    if (storedPlans.length > 0) {
      setPlans(storedPlans);
      if (currentPlanId) {
        const plan = storedPlans.find((p) => p.id === currentPlanId);
        setCurrentPlanState(plan || null);
      }
    } else {
      // Create sample plan for demonstration
      const samplePlan = createSamplePlan();
      setPlans([samplePlan]);
      setCurrentPlanState(samplePlan);
      saveToStorage([samplePlan], samplePlan.id);
    }
    setIsLoading(false);
  }, []);

  // Save to storage whenever plans change
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(plans, currentPlan?.id || null);
    }
  }, [plans, currentPlan, isLoading]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setCurrentPlan = useCallback((planId: string | null) => {
    if (planId) {
      const plan = plans.find((p) => p.id === planId);
      setCurrentPlanState(plan || null);
    } else {
      setCurrentPlanState(null);
    }
  }, [plans]);

  const createPlan = useCallback((data: Partial<StrategicPlan> = {}) => {
    const newPlan = createEmptyPlan(data);
    setPlans((prev) => [...prev, newPlan]);
    setCurrentPlanState(newPlan);
    return newPlan;
  }, []);

  const updatePlan = useCallback((updates: Partial<StrategicPlan>) => {
    if (!currentPlan) return;
    const updatedPlan = { ...currentPlan, ...updates, updatedAt: new Date().toISOString() };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    if (currentPlan?.id === planId) {
      setCurrentPlanState(null);
    }
  }, [currentPlan]);

  // SWOT Operations
  const addSWOTItem = useCallback((item: Omit<SWOTItem, 'id'>) => {
    if (!currentPlan) return;
    const newItem = { ...item, id: generateId() };
    const updatedPlan = {
      ...currentPlan,
      swotItems: [...currentPlan.swotItems, newItem],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const updateSWOTItem = useCallback((id: string, updates: Partial<SWOTItem>) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      swotItems: currentPlan.swotItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const removeSWOTItem = useCallback((id: string) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      swotItems: currentPlan.swotItems.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const bulkAddSWOTItems = useCallback((items: Omit<SWOTItem, 'id'>[]) => {
    if (!currentPlan) return;
    const newItems = items.map((item) => ({ ...item, id: generateId() }));
    const updatedPlan = {
      ...currentPlan,
      swotItems: [...currentPlan.swotItems, ...newItems],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  // Strategic Options Operations
  const addStrategicOption = useCallback((option: Omit<StrategicOption, 'id'>) => {
    if (!currentPlan) return;
    const newOption = { ...option, id: generateId() };
    const updatedPlan = {
      ...currentPlan,
      strategicOptions: [...currentPlan.strategicOptions, newOption],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const updateStrategicOption = useCallback((id: string, updates: Partial<StrategicOption>) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      strategicOptions: currentPlan.strategicOptions.map((opt) =>
        opt.id === id ? { ...opt, ...updates } : opt
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const removeStrategicOption = useCallback((id: string) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      strategicOptions: currentPlan.strategicOptions.filter((opt) => opt.id !== id),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const bulkAddStrategicOptions = useCallback((options: Omit<StrategicOption, 'id'>[]) => {
    if (!currentPlan) return;
    const newOptions = options.map((opt) => ({ ...opt, id: generateId() }));
    const updatedPlan = {
      ...currentPlan,
      strategicOptions: [...currentPlan.strategicOptions, ...newOptions],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  // Objective Operations
  const addObjective = useCallback((objective: Omit<BSCObjective, 'id' | 'kpis'>) => {
    if (!currentPlan) return;
    const newObjective = { ...objective, id: generateId(), kpis: [] };
    const updatedPlan = {
      ...currentPlan,
      objectives: [...currentPlan.objectives, newObjective],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const updateObjective = useCallback((id: string, updates: Partial<BSCObjective>) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      objectives: currentPlan.objectives.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const removeObjective = useCallback((id: string) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      objectives: currentPlan.objectives.filter((obj) => obj.id !== id),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  // KPI Operations
  const addKPI = useCallback((objectiveId: string, kpi: Omit<KPI, 'id' | 'objectiveId'>) => {
    if (!currentPlan) return;
    const newKPI = { ...kpi, id: generateId(), objectiveId };
    const updatedPlan = {
      ...currentPlan,
      objectives: currentPlan.objectives.map((obj) =>
        obj.id === objectiveId ? { ...obj, kpis: [...obj.kpis, newKPI] } : obj
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const updateKPI = useCallback((objectiveId: string, kpiId: string, updates: Partial<KPI>) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      objectives: currentPlan.objectives.map((obj) =>
        obj.id === objectiveId
          ? { ...obj, kpis: obj.kpis.map((kpi) => (kpi.id === kpiId ? { ...kpi, ...updates } : kpi)) }
          : obj
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const removeKPI = useCallback((objectiveId: string, kpiId: string) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      objectives: currentPlan.objectives.map((obj) =>
        obj.id === objectiveId
          ? { ...obj, kpis: obj.kpis.filter((kpi) => kpi.id !== kpiId) }
          : obj
      ),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  // PAP Operations
  const addPAP = useCallback((pap: Omit<PAP, 'id'>) => {
    if (!currentPlan) return;
    const newPAP = { ...pap, id: generateId() };
    const updatedPlan = {
      ...currentPlan,
      paps: [...currentPlan.paps, newPAP],
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const updatePAP = useCallback((id: string, updates: Partial<PAP>) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      paps: currentPlan.paps.map((pap) => (pap.id === id ? { ...pap, ...updates } : pap)),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  const removePAP = useCallback((id: string) => {
    if (!currentPlan) return;
    const updatedPlan = {
      ...currentPlan,
      paps: currentPlan.paps.filter((pap) => pap.id !== id),
      updatedAt: new Date().toISOString(),
    };
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setCurrentPlanState(updatedPlan);
  }, [currentPlan]);

  return {
    plans,
    currentPlan,
    activeView,
    isOnline,
    lastSynced,
    isLoading,
    setActiveView,
    setLastSynced,
    setCurrentPlan,
    createPlan,
    updatePlan,
    deletePlan,
    addSWOTItem,
    updateSWOTItem,
    removeSWOTItem,
    bulkAddSWOTItems,
    addStrategicOption,
    updateStrategicOption,
    removeStrategicOption,
    bulkAddStrategicOptions,
    addObjective,
    updateObjective,
    removeObjective,
    addKPI,
    updateKPI,
    removeKPI,
    addPAP,
    updatePAP,
    removePAP,
  };
};
