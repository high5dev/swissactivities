import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';

const InternalLinksContext = React.createContext(null);

export const InternalLinksProvider = ({ internalLinks, children }) => {
  return <InternalLinksContext.Provider value={internalLinks}>{children}</InternalLinksContext.Provider>
}

export const useInternalLinksContext = () => useContext(InternalLinksContext);
