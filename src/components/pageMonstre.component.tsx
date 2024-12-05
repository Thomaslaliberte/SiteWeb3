import axios from "axios";
import { useEffect, useState } from "react";
import { IMonstre } from "../model/IMonstre.model";
import { Alert, Button, Card, Container, Grid, Snackbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FormattedDate, FormattedMessage } from "react-intl";

interface PageMonstreProp {
  id: string;
}

//component pour afficher les informations d'un monstre
export default function PageMonstre(props: PageMonstreProp) {
  const navigate = useNavigate();
  const [cookies] = useCookies(['jeton']);
  const [message, setMessage] = useState<{
    text: string;
    severity: "success" | "error";
  } | null>(null);
  const monstreVide: IMonstre = {
    _id: "",
    nom: "",
    CA: 0,
    armureNaturel: false,
    vie: 0,
    vitesse: 0,
    ajout: new Date(Date.now()),
    stats: [],
    puissance: 0,
  };
  const [monstre, setMonstre] = useState(monstreVide);

  axios.defaults.headers.common = { Authorization: `bearer ${cookies.jeton}` };
  let index = 0;
  useEffect(() => {
    axios
      .get(`https://apidev3-1.onrender.com/api/Monstres/id/${props.id}`)
      .then((response) => {
        setMonstre(response.data.monstre);
      });
  });

  //supprime le monstre 
  function Supprimer() {
      axios
        .delete(`https://apidev3-1.onrender.com/api/Monstres/${props.id}`)
        .then(() => {
          navigate(-1);
        })
        .catch(() => {
            setMessage({
              text: "Une erreur est survenu lors de la suppression",
              severity: "error",
            });
          
        });
  }

  if (monstre == monstreVide) {
    return <Typography variant="h3"><FormattedMessage id="chargement" defaultMessage="Chargement..." /></Typography>;
  } else {
    return (
      <>
        <Card sx={{ backgroundColor: "#bdb76b" }}>
          <Typography variant="h4">{monstre.nom}</Typography>
          <Container sx={{ margin: 2 }}>
            <Typography sx={{ textAlign: "left", paddingLeft: "10%" }}>
            <FormattedMessage id="formulaire.CA" defaultMessage="CA:" /> {monstre.CA}{" "}
              {monstre.armureNaturel ? "(Armure Naturel)" : ""}
            </Typography>
            <Typography sx={{ textAlign: "left", paddingLeft: "10%" }}>
              {" "}
              <FormattedMessage id="formulaire.vie" defaultMessage="Vie:" /> {monstre.vie}
            </Typography>
            <Typography sx={{ textAlign: "left", paddingLeft: "10%" }}>
              {" "}
              <FormattedMessage
                    id="formulaire.vitesse"
                    defaultMessage="Vitesse:"
                  /> {monstre.vitesse}
            </Typography>
          </Container>

          <Container sx={{ paddingLeft: 10, paddingRight: 10 }}>
            <Grid container spacing={1} sx={{ justifyContent: "center" }}>
              {//affiche toute les stats du tableau stats
              monstre.stats &&
                monstre.stats.map((stat) => {
                  return (
                    <Card
                      key={index++}
                      sx={{
                        minHeight: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#bdb76b",
                        color: "#2f4f4f",
                        fontSize: 24,
                        fontWeight: "bold",
                        width: 60,
                        margin: 2,
                        border: "dotted",
                      }}
                    >
                      <div>
                        <div>
                          <Typography sx={{ padding: 2, fontSize: 10 }}>
                            {index == 0
                              ? <FormattedMessage id="formulaire.for" defaultMessage="For" />
                              : index == 1
                              ? <FormattedMessage id="formulaire.dex" defaultMessage="Dex" />
                              : index == 2
                              ? <FormattedMessage id="formulaire.con" defaultMessage="Con" />
                              : index == 3
                              ? <FormattedMessage id="formulaire.int" defaultMessage="Int" />
                              : index == 4
                              ? <FormattedMessage id="formulaire.sag" defaultMessage="Sag" />
                              : <FormattedMessage id="formulaire.cha" defaultMessage="Cha" />}
                          </Typography>
                        </div>

                        {stat}
                      </div>
                    </Card>
                  );
                })}
            </Grid>
          </Container>
          <Container sx={{ margin: 2 }}>
            <Typography sx={{ textAlign: "left", paddingLeft: "10%" }}>
              {" "}
              <FormattedMessage
                    id="formulaire.puissance"
                    defaultMessage="Puissance:"
                  /> {monstre.puissance}
            </Typography>
            <Typography sx={{ textAlign: "left", paddingLeft: "10%" }}>
              {" "}
              <FormattedMessage
                    id="formulaire.date"
                    defaultMessage="Date d'ajout:"
                  /> <FormattedDate
                  value={monstre.ajout.toString().split("T")[0]}
                  year="numeric"
                  month="long"
                  day="2-digit"
              />
            </Typography>
          </Container>
          <Button
            sx={{
              backgroundColor: "#eee8aa",
              borderRadius: 2,
              color: "black",
              marginTop: 2,
              margin: 1,
            }}
            onClick={()=>navigate(-1)}
          >
            <FormattedMessage id="bouton.retour" defaultMessage="Retour" />
          </Button>
          <Button
            sx={{
              backgroundColor: "#eee8aa",
              borderRadius: 2,
              color: "black",
              marginTop: 2,
              margin: 1,
            }}
            onClick={() => Supprimer()}
          >
            <FormattedMessage id="bouton.supprimer" defaultMessage="Supprimer" />
          </Button>
          <Button
            sx={{
              backgroundColor: "#eee8aa",
              borderRadius: 2,
              color: "black",
              marginTop: 2,
              margin: 1,
            }}
            onClick={()=>navigate('/formulaireModifier')}
          >
            <FormattedMessage id="bouton.modifier" defaultMessage="Modifier" />
          </Button>
        </Card>
        {//affiche un message d'erreur ou de réussite
        message && (
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
}
