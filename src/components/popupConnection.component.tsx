import BoyIcon from "@mui/icons-material/Boy";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Popup from "reactjs-popup";
import { useCookies } from "react-cookie";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { LangueContext } from "../context/langues.context";
import Francais from "../lang/fr.json";

//inspirer du code trouver sur cette page: https://www.dhiwise.com/post/a-step-by-step-guide-to-retrieving-input-values-in-react
export default function PopupConnection() {
  const { langue} = useContext(LangueContext);
  const [messageErreurCourriel, setMessageCourriel] = useState("");
  const [messageErreurMDP, setMessageMDP] = useState("");
  const [_, setCookie] = useCookies(["jeton"]);
  const intl = useIntl();
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error";
  } | null>(null);
  //regex trouver à: https://www.tutorialspoint.com/regex-in-reactjs
  const regexCourriel = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );
  const [formData, setFormData] = useState({
    courriel: "",
    mdp: "",
  });

  const messages = defineMessages({
    sansValeur: {
      id: "erreur.sansValeur",
      defaultMessage: "Une valeur doit etre entré",
      description:
        "Un message d'erreur lancer si l'utilisateur laisse un champ vide",
    },
    mdpCourt: {
      id: "erreur.mdpCourt",
      defaultMessage: "Le mot de passe contient un minimum de 3 charactères",
      description:
        "Un message d'erreur lancer si l'utilisateur met moins de 3 charactère dans le champs de mot de passe",
    },
    mauvaisCourriel: {
      id: "erreur.mauvaisCourriel",
      defaultMessage: "Un courriel doit etre entré dans ce champs",
      description:
        "Un message d'erreur lancer si l'utilisateur ne met pas un courriel dans le champs de courriel",
    },
    reussi: {
      id: "connection.reussi",
      defaultMessage: "Vous êtes connecté",
      description: "Un message indiquant que l'utilisateur ces bien connecté",
    },
    echec: {
      id: "connection.echec",
      defaultMessage: "Le mot de passe et le courriel ne corespondent pas",
      description:
        "Un message indiquant que l'utilisateur n'a pas reussi à se connecter",
    },
  });

  function Connection(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (formData.courriel.length == 0) {
      setMessageCourriel(intl.formatMessage(messages.sansValeur));
    } else if (!regexCourriel.test(formData.courriel)) {
      setMessageCourriel(intl.formatMessage(messages.mauvaisCourriel));
    } else {
      setMessageCourriel("");
    }
    if (formData.mdp.length < 3) {
      setMessageMDP(intl.formatMessage(messages.mdpCourt));
    } else {
      setMessageMDP("");
    }

    if (messageErreurCourriel == "" && messageErreurMDP == "") {
      axios
        .post("https://apidev3-1.onrender.com/api/Jeton", {
          userlogin: {
            courriel: formData.courriel,
            motDePasse: formData.mdp,
          },
        })
        .then((response) => {
          setCookie("jeton", response.data.token);
          setMessage({
            text: intl.formatMessage(messages.reussi),
            severity: "success",
          });
        })
        .catch((response) => {
          if (response.status == 404) {
            setMessage({
              text: intl.formatMessage(messages.echec),
              severity: "error",
            });
          }
        });
    }
  }

  function HandleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  return (
    <>
      <Popup
        trigger={
          <Button sx={{ minHeight: 50, minWidth: 10, color: "#f0f8ff" }}>
            <BoyIcon />
            <Typography>
              <FormattedMessage
                id="bouton.connection"
                defaultMessage="Se connecter"
              />
            </Typography>
          </Button>
        }
        position="bottom left"
        offsetX={langue==Francais?-200:-300}
        offsetY={10}
        closeOnDocumentClick
      >
        <Box
          sx={{
            backgroundColor: "#2f4f4f",
            height: 180,
            width: 350,
            borderRadius: 2,
          }}
        >
          <form method="post" onSubmit={Connection}>
            <fieldset style={{ height: 155 }}>
              <legend style={{ fontSize: 15, alignItems: "center" }}>
                <FormattedMessage
                  id="formulaire.connection.titre"
                  defaultMessage="Connection"
                />
              </legend>
              <Box sx={{ textAlign: "right" }}>
                <Box>
                  <label htmlFor="courriel" style={{ paddingRight: 10 }}>
                    <FormattedMessage
                      id="formulaire.connection.courriel"
                      defaultMessage="Courriel:"
                    />
                  </label>
                  <input
                    type="text"
                    id="courriel"
                    name="courriel"
                    style={{ backgroundColor: "#2f4f4f" }}
                    onChange={HandleChange}
                  />
                  <Box sx={{ color: "red", fontSize: 12 }}>
                    {messageErreurCourriel}
                  </Box>
                </Box>
                <Box>
                  <label htmlFor="mdp" style={{ paddingRight: 10 }}>
                    <FormattedMessage
                      id="formulaire.connection.mdp"
                      defaultMessage="Mot de passe:"
                    />
                  </label>
                  <input
                    type="password"
                    id="mdp"
                    name="mdp"
                    style={{ backgroundColor: "#2f4f4f" }}
                    onChange={HandleChange}
                  />
                  <Box sx={{ color: "red", fontSize: 12 }}>
                    {messageErreurMDP}
                  </Box>
                </Box>
              </Box>
              <Box>
                <Button
                  type="submit"
                  sx={{
                    backgroundColor: "#708090",
                    borderRadius: 2,
                    color: "white",
                    marginTop: 2,
                    marginLeft: 12,
                  }}
                >
                  <FormattedMessage
                    id="bouton.connection"
                    defaultMessage="Se connecter"
                  />
                </Button>
              </Box>
            </fieldset>
          </form>
        </Box>
      </Popup>
      {message && (
        <Snackbar open autoHideDuration={6000} onClose={() => setMessage(null)}>
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
