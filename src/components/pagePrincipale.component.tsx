import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IMonstre } from "../model/IMonstre.model";
import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MonstreContext } from "../context/monstre.context";
import { useCookies } from "react-cookie";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

//component qui affiche tout les monstres 
export default function PagePrincipale() {
  const tableauVide: IMonstre[] = [];
  const intl = useIntl();
  const [monstres, setTableauMonstre] = useState(tableauVide);
  const [cookies] = useCookies(['jeton']);
  const {setMonstreActuel } = useContext(MonstreContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error";
  } | null>(null);
  useEffect(() => {
    axios
      .get("https://apidev3-1.onrender.com/api/Monstres")
      .then((response) => {
        setTableauMonstre(response.data.monstres);
      });
  }, [monstres]);

  //sert à l'internationalisation du texte dans des variables
  const messages = defineMessages({
    aucuneConnection: {
      id: "erreur.aucuneConnection",
      defaultMessage: "Vous devez être connecter pour faire une recherche.",
      description:
        "Un message d'erreur lancer si l'utilisateur n'est pas connecté'",
    },
  });

  //change de page pour celle servant à ajouter un monstre
  function Ajouter() {
    navigate("/formulaireAjout");
  }

  if (monstres != tableauVide) {
    return (
      <>
        {cookies.jeton ? (
          <Container sx={{paddingTop:8, marginBottom: 15,}}>
            <Button
              sx={{
                backgroundColor: "#2f4f4f",
                borderRadius: 2,
                color: "white",
                margin: 1,
              }}
              onClick={() => navigate('/recherchePuissance')}
            >
              <FormattedMessage id="bouton.recherchePuissance" defaultMessage="Recherche par puissance" />
            </Button>
            <Button
              sx={{
                backgroundColor: "#2f4f4f",
                borderRadius: 2,
                color: "white",
                margin: 1,
              }}
              onClick={() => navigate('/rechercheNom')}
            >
              <FormattedMessage id="bouton.rechercheNom" defaultMessage="Recherche par nom" />
            </Button>
            <Button
              sx={{
                backgroundColor: "#2f4f4f",
                borderRadius: 2,
                color: "white",
                margin: 1,
                
              }}
              onClick={() => Ajouter()}
            >
              <FormattedMessage id="bouton.ajouter" defaultMessage="Ajouter" />
            </Button>
          </Container>
        ) : (
          ""
        )}

        <Grid
          container
          spacing={1}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          {//affiche tout les monstres du tableau de monstres
          monstres &&
            monstres.map((monstre) => {
              return (
                <Card
                  key={monstre._id}
                  sx={{
                    minHeight: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#bdb76b",
                    color: "#2f4f4f",
                    fontSize: 24,
                    fontWeight: "bold",
                    width: 200,
                    margin: 2,
                  }}
                >
                  <div>
                    <Typography sx={{ padding: 2 }}>{monstre.nom}</Typography>
                    <Button
                      onClick={() => OuvrirMonstre(monstre)}
                      sx={{ minHeight: 50, minWidth: 10 }}
                    >
                      <Typography sx={{ color: "#a52a2a" }}>
                      <FormattedMessage id="bouton.information" defaultMessage="Informations" />
                      </Typography>
                    </Button>
                  </div>
                </Card>
              );
            })}
        </Grid>
        {//affiche d'erreur ou de réussite
        message && (
          <Snackbar
            open
            autoHideDuration={6000}
            onClose={() => setMessage(null)}
          >
            <Alert
              onClose={() => setMessage(null)}
              severity={message.severity}
              sx={{ width: "100%" }}
            >
              {message.text}
            </Alert>
          </Snackbar>
        )}
      </>
    );
  } else {
    return <Typography variant="h3"><FormattedMessage id="chargement" defaultMessage="Chargement..." /></Typography>;
  }

  function OuvrirMonstre(monstre: IMonstre) {
    if (cookies.jeton != null) {
      setMonstreActuel(monstre._id);
      navigate("/pageMonstre");
    } else {
      setMessage({
        text: intl.formatMessage(messages.aucuneConnection),
        severity: "error",
      });
    }
  }
}
