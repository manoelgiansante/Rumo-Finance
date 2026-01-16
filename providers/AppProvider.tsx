import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Expense, Operation, Revenue, Client, Contract, PurchaseOrder, TeamMember, Farm, Asset, StockItem, BankAccount, Category, MonthClosing } from '@/types';
import { currentUser as mockUser, expenses as mockExpenses, operations as mockOperations } from '@/mocks/data';

interface AppContextValue {
  user: User;
  expenses: Expense[];
  operations: Operation[];
  revenues: Revenue[];
  clients: Client[];
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  teamMembers: TeamMember[];
  farms: Farm[];
  assets: Asset[];
  stockItems: StockItem[];
  bankAccounts: BankAccount[];
  categories: Category[];
  monthClosings: MonthClosing[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  addRevenue: (revenue: Revenue) => void;
  updateRevenue: (id: string, updates: Partial<Revenue>) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addContract: (contract: Contract) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  addFarm: (farm: Farm) => void;
  updateFarm: (id: string, updates: Partial<Farm>) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  isLoading: boolean;
}

export const [AppProvider, useApp] = createContextHook<AppContextValue>(() => {
  const [user] = useState<User>(mockUser);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [operations] = useState<Operation[]>(mockOperations);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stockItems] = useState<StockItem[]>([]);
  const [bankAccounts] = useState<BankAccount[]>([]);
  const [categories] = useState<Category[]>([]);
  const [monthClosings] = useState<MonthClosing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsed = JSON.parse(storedExpenses);
        const expensesWithDates = parsed.map((exp: Expense) => ({
          ...exp,
          date: new Date(exp.date),
          dueDate: new Date(exp.dueDate),
          competence: new Date(exp.competence),
          createdAt: new Date(exp.createdAt),
          approvedAt: exp.approvedAt ? new Date(exp.approvedAt) : undefined,
          paidAt: exp.paidAt ? new Date(exp.paidAt) : undefined,
        }));
        setExpenses(expensesWithDates);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expense: Expense) => {
    const updated = [...expenses, expense];
    setExpenses(updated);
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving expense:', error);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    setExpenses(updated);
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating expense:', error);
    }
  };

  const addRevenue = async (revenue: Revenue) => {
    const updated = [...revenues, revenue];
    setRevenues(updated);
    try {
      await AsyncStorage.setItem('revenues', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving revenue:', error);
    }
  };

  const updateRevenue = async (id: string, updates: Partial<Revenue>) => {
    const updated = revenues.map(rev => 
      rev.id === id ? { ...rev, ...updates } : rev
    );
    setRevenues(updated);
    try {
      await AsyncStorage.setItem('revenues', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating revenue:', error);
    }
  };

  const addClient = async (client: Client) => {
    const updated = [...clients, client];
    setClients(updated);
    try {
      await AsyncStorage.setItem('clients', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving client:', error);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const updated = clients.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    setClients(updated);
    try {
      await AsyncStorage.setItem('clients', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating client:', error);
    }
  };

  const addContract = async (contract: Contract) => {
    const updated = [...contracts, contract];
    setContracts(updated);
    try {
      await AsyncStorage.setItem('contracts', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving contract:', error);
    }
  };

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    const updated = contracts.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    setContracts(updated);
    try {
      await AsyncStorage.setItem('contracts', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating contract:', error);
    }
  };

  const addPurchaseOrder = async (po: PurchaseOrder) => {
    const updated = [...purchaseOrders, po];
    setPurchaseOrders(updated);
    try {
      await AsyncStorage.setItem('purchaseOrders', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving purchase order:', error);
    }
  };

  const updatePurchaseOrder = async (id: string, updates: Partial<PurchaseOrder>) => {
    const updated = purchaseOrders.map(po => 
      po.id === id ? { ...po, ...updates } : po
    );
    setPurchaseOrders(updated);
    try {
      await AsyncStorage.setItem('purchaseOrders', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating purchase order:', error);
    }
  };

  const addTeamMember = async (member: TeamMember) => {
    const updated = [...teamMembers, member];
    setTeamMembers(updated);
    try {
      await AsyncStorage.setItem('teamMembers', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving team member:', error);
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    const updated = teamMembers.map(m => 
      m.id === id ? { ...m, ...updates } : m
    );
    setTeamMembers(updated);
    try {
      await AsyncStorage.setItem('teamMembers', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating team member:', error);
    }
  };

  const addFarm = async (farm: Farm) => {
    const updated = [...farms, farm];
    setFarms(updated);
    try {
      await AsyncStorage.setItem('farms', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving farm:', error);
    }
  };

  const updateFarm = async (id: string, updates: Partial<Farm>) => {
    const updated = farms.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    setFarms(updated);
    try {
      await AsyncStorage.setItem('farms', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating farm:', error);
    }
  };

  const addAsset = async (asset: Asset) => {
    const updated = [...assets, asset];
    setAssets(updated);
    try {
      await AsyncStorage.setItem('assets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving asset:', error);
    }
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    const updated = assets.map(a => 
      a.id === id ? { ...a, ...updates } : a
    );
    setAssets(updated);
    try {
      await AsyncStorage.setItem('assets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating asset:', error);
    }
  };

  return {
    user,
    expenses,
    operations,
    revenues,
    clients,
    contracts,
    purchaseOrders,
    teamMembers,
    farms,
    assets,
    stockItems,
    bankAccounts,
    categories,
    monthClosings,
    addExpense,
    updateExpense,
    addRevenue,
    updateRevenue,
    addClient,
    updateClient,
    addContract,
    updateContract,
    addPurchaseOrder,
    updatePurchaseOrder,
    addTeamMember,
    updateTeamMember,
    addFarm,
    updateFarm,
    addAsset,
    updateAsset,
    isLoading,
  };
});
