import { Alert, Button, Card, Container, Grid, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MonstreContext } from "../context/monstre.context";
import { IMonstre } from '../model/IMonstre.model';
import { useCookies } from "react-cookie";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

export default function FormulaireRecherchePuissance() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['jeton']);
  const { setMonstreActuel } = useContext(MonstreContext);
  const intl = useIntl();
  const [puissance, setPuissance] = useState(-1);
  const [messageErreur, setMessageErreur] = useState("");
  const tableauVide: IMonstre[] = [];
  const [monstres, setMonstres] = useState(tableauVide);
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error";
  } | null>(null);

  const messages = defineMessages({
    puissanceInvalide: {
      id: "erreur.puissanceInvalide",
      defaultMessage: "Il n'y a pas de monstre avec cette puissance.",
      description:
        "Un message d'erreur lancer si l'utilisateur entre une puissance contenu par aucun monstre",
    },
    puissanceNegative: {
      id: "erreur.puissanceNegative",
      defaultMessage: "Vous devez donner une puissance de 0 ou plus.",
      description:
        "Un message d'erreur lancer si l'utilisateur entre une puissance negative",
    },
    aucuneConnectionPuissance: {
      id: "erreur.aucuneConnectionPuissance",
      defaultMessage: "Vous devez être connecter pour afficher les monstres.",
      description:
        "Un message d'erreur lancer si l'utilisateur n'est pas connecté'",
    },
    aucuneConnection: {
      id: "erreur.aucuneConnection",
      defaultMessage: "Vous devez être connecter pour faire une recherche.",
      description:
        "Un message d'erreur lancer si l'utilisateur n'est pas connecté'",
    },
  });

  function OuvrirMonstre(monstre: IMonstre) {
    if (cookies.jeton != "") {
      setMonstreActuel(monstre._id);
      navigate("/pageMonstre");
    } else {
      setMessage({
        text: intl.formatMessage(messages.aucuneConnectionPuissance),
        severity: "error",
      });
    }
  }

  function Recherche(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setMonstres(tableauVide);
    setMessageErreur("");
    
    if (cookies.jeton != null) {
      axios.defaults.headers.common = { Authorization: `bearer ${cookies.jeton}` };
      if (puissance >= 0) {
        axios
          .get(`https://apidev3-1.onrender.com/api/Monstres/puissance/${puissance}`)
          .then((response) => {
            setMonstres(response.data.monstre)
            console.log(monstres)
          })
          .catch(() => {
            setMessageErreur(intl.formatMessage(messages.puissanceInvalide));
          });
      } else {
        setMessageErreur(intl.formatMessage(messages.puissanceNegative));
      }
    } else {
      setMessageErreur(intl.formatMessage(messages.aucuneConnection));
    }
  }

  return (
    <>
      <form method="post" onSubmit={Recherche}>
        <fieldset>
          <legend style={{ fontSize: 28, padding: 10, alignItems: "center" }}>
          <FormattedMessage id="formulaire.recherchePuissance.titre" defaultMessage="Recherche par puissance" />
          </legend>
          <div style={{ textAlign: "right" }}>
            <div>
              <label htmlFor="nom" style={{ paddingRight: 10, fontSize: 25 }}>
              <FormattedMessage id="formulaire.nom" defaultMessage="Nom: " />
              </label>
              <input
                type="number"
                id="nom"
                name="nom"
                style={{ backgroundColor: "#2f4f4f", fontSize: 25 }}
                onChange={(event) => setPuissance(Number(event.target.value))}
              />
            </div>
          </div>
        </fieldset>
        <Button
          sx={{
            backgroundColor: "#800000",
            borderRadius: 2,
            color: "white",
            marginTop: 2,
            marginLeft: 2,
          }}
          onClick={() => navigate(-1)}
        >
          <FormattedMessage id="bouton.annuler" defaultMessage="Annuler" />
        </Button>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#2e8b57",
            borderRadius: 2,
            color: "white",
            marginTop: 2,
            marginLeft: 2,
          }}
        >
          <FormattedMessage id="bouton.rechercher" defaultMessage="Rechercher" />
        </Button>
      </form>

      <Container sx={{ color: "red" }}>{messageErreur}</Container>

          {monstres.length>0?
          <Container sx={{marginTop:10}}>
            <Grid
          container
          spacing={1}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          {monstres &&
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
          </Container>
          :""}
          {message && (
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
}
