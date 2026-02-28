import { Operation, Expense, Supplier, User, MonthlyResult } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Usuário',
  email: 'usuario@rumofinance.app',
  role: 'admin',
  operations: [],
};

export const operations: Operation[] = [];

export const suppliers: Supplier[] = [];

export const expenses: Expense[] = [];

export const monthlyResults: MonthlyResult[] = [];
