import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Expense, Operation } from '@/types';
import { currentUser as mockUser, expenses as mockExpenses, operations as mockOperations } from '@/mocks/data';

interface AppContextValue {
  user: User;
  expenses: Expense[];
  operations: Operation[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  isLoading: boolean;
}

export const [AppProvider, useApp] = createContextHook<AppContextValue>(() => {
  const [user] = useState<User>(mockUser);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [operations] = useState<Operation[]>(mockOperations);
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

  return {
    user,
    expenses,
    operations,
    addExpense,
    updateExpense,
    isLoading,
  };
});
