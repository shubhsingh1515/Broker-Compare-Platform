import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [selectedBrokers, setSelectedBrokers] = useState(() => {
    const saved = localStorage.getItem('compare_brokers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compare_brokers', JSON.stringify(selectedBrokers));
  }, [selectedBrokers]);

  const addToCompare = (broker) => {
    if (selectedBrokers.some(b => b._id === broker._id || b.slug === broker.slug)) {
      return false; // Already added
    }
    if (selectedBrokers.length >= 3) {
      alert('You can compare up to 3 brokers side-by-side.');
      return false;
    }
    setSelectedBrokers(prev => [...prev, broker]);
    return true;
  };

  const removeFromCompare = (brokerId) => {
    setSelectedBrokers(prev => prev.filter(b => b._id !== brokerId && b.slug !== brokerId));
  };

  const clearCompare = () => {
    setSelectedBrokers([]);
  };

  const isSelected = (brokerId) => {
    return selectedBrokers.some(b => b._id === brokerId || b.slug === brokerId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedBrokers,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isSelected
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
