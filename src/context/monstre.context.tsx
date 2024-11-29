import React, { useState } from 'react';


export type MonstreContextType = {
  monstreActuel: string;
  setMonstreActuel: (monstreActuel: string) => void;
};


export const MonstreContext = React.createContext<MonstreContextType>({
  monstreActuel: "",
  setMonstreActuel: () => {},
});

export default function MonstreProvider(props: any) {
  const [monstreActuel, setMonstreActuel] = useState("");

  const values = {
    monstreActuel,
    setMonstreActuel
  };
  return (
    <MonstreContext.Provider value={values}>
      {props.children}
    </MonstreContext.Provider>
  );
}