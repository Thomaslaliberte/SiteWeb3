import { Button, Container } from "@mui/material";
import axios from "axios";
import { FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MonstreContext } from "../context/monstre.context";
import { useCookies } from "react-cookie";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

//component cherchant un monstre ayant le nom entré par l'utilisateur
export default function FormulaireRechercheNom() {
  const navigate = useNavigate();
  const intl = useIntl();
  const { setMonstreActuel } = useContext(MonstreContext);
  const [cookies] = useCookies(['jeton']);
  const [monstre, setMonstre] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  //sert à l'internationalisation du texte dans des variables
  const messages = defineMessages({
    nomInvalide: {
      id: "erreur.nomInvalide",
      defaultMessage: "Aucun monstre ne possede ce nom.",
      description:
        "Un message d'erreur lancer si l'utilisateur entre un nom inconnu",
    },
    nomVide: {
      id: "erreur.nomVide",
      defaultMessage: "Vous devez écrire un nom.",
      description:
        "Un message d'erreur lancer si l'utilisateur n'entre pas de nom",
    },
    aucuneConnection: {
      id: "erreur.aucuneConnection",
      defaultMessage: "Vous devez être connecter pour faire une recherche.",
      description:
        "Un message d'erreur lancer si l'utilisateur n'est pas connecté'",
    },
  });

  //fait une demande à l'api pour un monstre ayant le nom entré
  function Recherche(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
   
    setMessageErreur("");
    if (cookies.jeton != null) {
      axios.defaults.headers.common = { Authorization: `bearer ${cookies.jeton}` };
      if (monstre.length >= 1) {
        axios
          .get(`https://apidev3-1.onrender.com/api/Monstres/nom/${monstre}`)
          .then((response) => {
            setMonstreActuel(response.data.monstre._id);
            navigate("/pageMonstre");
          })
          .catch(() => {
            setMessageErreur(intl.formatMessage(messages.nomInvalide));
          });
      } else {
        setMessageErreur(intl.formatMessage(messages.nomVide));
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
          <FormattedMessage id="formulaire.rechercheNom.titre" defaultMessage="Recherche par nom" />
          </legend>
          <div style={{ textAlign: "right" }}>
            <div>
              <label htmlFor="nom" style={{ paddingRight: 10, fontSize: 25 }}>
              <FormattedMessage id="formulaire.nom" defaultMessage="Nom: " />
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                style={{ backgroundColor: "#2f4f4f", fontSize: 25 }}
                onChange={(event) => setMonstre(event.target.value)}
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
    </>
  );
}
