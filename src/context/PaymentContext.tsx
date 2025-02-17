import React, { createContext, useContext, useState } from 'react';

interface PaymentContextType {
    balanceAmontValue: number;
    setBalanceAmontValue: (amount: number) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [balanceAmontValue, setBalanceAmontValue] = useState(0);

  return (
    <PaymentContext.Provider value={{ balanceAmontValue, setBalanceAmontValue }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};