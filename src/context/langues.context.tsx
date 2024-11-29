import React, { useState } from 'react';
import Francais from '../lang/fr.json';

export type LangueContextType = {
    langue: any;
    locale: string;
    setLangue: (langue: any) => void;
    setLocal: (languelocal: string) => void;
  };

  export const LangueContext = React.createContext<LangueContextType>({
    langue: Francais,
    locale: "fr",
    setLangue: () => {},
    setLocal: () => {},
  });

  export default function LangueProvider(props: any) {
    const [langue, setLangue] = useState(Francais);
    const [locale, setLocal] = useState("fr");
    const values = {
      langue,
      locale,
      setLangue,
      setLocal
    };

    return (
      <LangueContext.Provider value={values}>
        {props.children}
      </LangueContext.Provider>
    );
  }