import "./App.css";
import PagePrincipale from "./components/pagePrincipale.component";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageMonstre from "./components/pageMonstre.component";
import FormulaireAjout from "./components/formulaire.component";
import PopupConnection from "./components/popupConnection.component";
import { useContext } from "react";
import { MonstreContext } from "./context/monstre.context";
import FormulaireModifier from "./components/modifier.component";
import FormulaireRechercheNom from "./components/rechercheNom.component";
import FormulaireRecherchePuissance from "./components/recherchePuissance.component";
import { useCookies } from "react-cookie";
import { LangueContext } from "./context/langues.context";
import { FormattedMessage, IntlProvider } from "react-intl";
import Francais from "./lang/fr.json";
import Anglais from "./lang/en.json";
function App() {
  const { monstreActuel } = useContext(MonstreContext);
  const [cookies, _, removeCookie] = useCookies(["jeton"]);
  const { langue, setLangue } = useContext(LangueContext);
  const { locale, setLocal } = useContext(LangueContext);
  function Deconnecter() {
    removeCookie("jeton");
  }
  function changerLangue(): void {
    if (langue == Francais) {
      setLangue(Anglais);
      setLocal("en");
    } else {
      setLangue(Francais);
      setLocal("fr");
    }
  }

  return (
    <>
      <IntlProvider locale={locale} messages={langue}>
        <BrowserRouter>
          <AppBar position="fixed">
            <Toolbar>
              {langue == Francais ? (
                <IconButton onClick={changerLangue} sx={{ ml: "auto" }}>
                  <FormattedMessage id="langue.anglais" defaultMessage="An" />
                </IconButton>
              ) : (
                <IconButton onClick={changerLangue} sx={{ ml: "auto" }}>
                  <FormattedMessage id="langue.francais" defaultMessage="Fr" />
                </IconButton>
              )}

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <FormattedMessage
                  id="site.titre"
                  defaultMessage="Les Monstres de DnD"
                />
              </Typography>
              {cookies.jeton == null ? (
                <PopupConnection />
              ) : (
                <Button
                  sx={{ minHeight: 50, minWidth: 10, color: "#f0f8ff" }}
                  onClick={() => Deconnecter()}
                >
                  <FormattedMessage id="bouton.deconnection" defaultMessage="Déconnection" />
                  
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route index element={<PagePrincipale />} />
            <Route
              path="/pageMonstre"
              element={<PageMonstre id={monstreActuel} />}
            />
            <Route
              path="/formulaireModifier"
              element={<FormulaireModifier id={monstreActuel} />}
            />
            <Route path="/formulaireAjout" element={<FormulaireAjout />} />
            <Route path="/rechercheNom" element={<FormulaireRechercheNom />} />
            <Route
              path="/recherchePuissance"
              element={<FormulaireRecherchePuissance />}
            />
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </>
  );
}

export default App;
