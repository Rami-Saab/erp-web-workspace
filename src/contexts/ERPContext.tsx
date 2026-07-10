import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Role = 'admin' | 'sales' | 'warehouse' | 'finance';
type Currency = 'SAR' | 'USD' | 'EUR';

interface ERPContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  warehouse: string;
  setWarehouse: (w: string) => void;
  role: Role;
  setRole: (r: Role) => void;
  formatCurrency: (amount: number) => string;
}

const ERPContext = createContext<ERPContextValue | undefined>(undefined);

const currencyLocales: Record<Currency, string> = {
  SAR: 'ar-SA',
  USD: 'en-US',
  EUR: 'de-DE',
};

export function ERPProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [warehouse, setWarehouse] = useState('Riyadh DC');
  const [role, setRole] = useState<Role>('admin');

  const formatCurrency = useCallback((amount: number): string => {
    const locale = currencyLocales[currency];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, [currency]);

  const value: ERPContextValue = {
    currency,
    setCurrency,
    warehouse,
    setWarehouse,
    role,
    setRole,
    formatCurrency,
  };

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
}

export function useERPContext(): ERPContextValue {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error('useERPContext must be used within an ERPProvider');
  }
  return context;
}
