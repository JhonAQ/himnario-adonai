import { createContext, useContext, useState } from 'react';

const TabBarContext = createContext();

export function TabBarProvider({ children }) {
  const [hideBar, setHideBar] = useState(false);

  return (
    <TabBarContext.Provider value={{ hideBar, setHideBar }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  return useContext(TabBarContext);
}
