import { Button, Card, Container } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useCookies } from "react-cookie";
import { FormattedMessage } from "react-intl";
//inspirer du code trouver sur cette page: https://www.dhiwise.com/post/a-step-by-step-guide-to-retrieving-input-values-in-react

export default function FormulaireAjout() {
  const [cookies] = useCookies(["jeton"]);
  const navigate = useNavigate();
  const [messageErreur, setMessageErreur] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    CA: -1,
    armureNaturel: false,
    vie: -1,
    vitesse: -1,
    puissance: -1,
    force: -1,
    dexterite: -1,
    constitution: -1,
    intelligence: -1,
    sagesse: -1,
    charisme: -1,
  });

  axios.defaults.headers.common = { Authorization: `bearer ${cookies.jeton}` };
  function HandleChange(event: ChangeEvent<HTMLInputElement>): void {
    let name: any;
    let value: any;
    if (event.target.value == "on") {
      name = "armureNaturel";
      if (formData.armureNaturel) {
        value = false;
      } else {
        value = true;
      }
    } else {
      name = event.target.name;
      value = event.target.value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  let messageErreurTemp = "";
  function Ajouter(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    messageErreurTemp = "";
    setMessageErreur("");
    console.log(formData);
    if (formData.nom.length < 1) {
      messageErreurTemp += "Le nom doit comporter au moins un charactère.\r\n";
    }
    if (formData.CA < 0) {
      messageErreurTemp += "La classe d'armure doit avoir un minimum de 0.\r\n";
    }
    if (formData.vie < 0) {
      messageErreurTemp += "La vie doit avoir un minimum de 0.\r\n";
    }
    if (formData.vitesse < 0) {
      messageErreurTemp += "La vitesse doit avoir un minimum de 0.\r\n";
    }
    if (formData.puissance < 0) {
      messageErreurTemp += "La puissance doit avoir un minimum de 0.\r\n";
    }
    if (formData.force < 0) {
      messageErreurTemp += "La force doit avoir un minimum de 0.\r\n";
    }
    if (formData.dexterite < 0) {
      messageErreurTemp += "La dextérité doit avoir un minimum de 0.\r\n";
    }
    if (formData.constitution < 0) {
      messageErreurTemp += "La constitution doit avoir un minimum de 0.\r\n";
    }
    if (formData.intelligence < 0) {
      messageErreurTemp += "L'intelligence doit avoir un minimum de 0.\r\n";
    }
    if (formData.sagesse < 0) {
      messageErreurTemp += "La sagesse doit avoir un minimum de 0.\r\n";
    }
    if (formData.charisme < 0) {
      messageErreurTemp += "Le charisme doit avoir un minimum de 0.\r\n";
    }
    setMessageErreur(messageErreurTemp);
    if (messageErreurTemp == "") {
      console.log(moment().format("YYYY-MM-DD"));
      axios
        .post("https://apidev3-1.onrender.com/api/Monstres", {
          monstre: {
            nom: formData.nom,
            CA: formData.CA,
            armureNaturel: formData.armureNaturel,
            vie: formData.vie,
            vitesse: formData.vitesse,
            ajout: new Date(Date.now()),
            stats: [
              formData.force,
              formData.dexterite,
              formData.constitution,
              formData.intelligence,
              formData.sagesse,
              formData.charisme,
            ],
            puissance: formData.puissance,
          },
        })
        .then(() => {
          navigate(-1);
        })
        .catch((response) => {
          if (response.status == 401) {
            setMessageErreur(
              " Vous devez être connecté pour créer un monstre "
            );
          }
          console.log(response);
        });
    }

    messageErreurTemp = "";
  }

  return (
    <Container sx={{ width: 400 }}>
      <Card sx={{ backgroundColor: "#bdb76b", width: "100%", padding: 1 }}>
        <form method="post" onSubmit={Ajouter}>
          <fieldset>
            <legend style={{ fontSize: 28, padding: 10, alignItems: "center" }}>
              <FormattedMessage
                id="formulaire.ajout.titre"
                defaultMessage="Créer un monstre"
              />
            </legend>
            <div style={{ textAlign: "right" }}>
              <Container>
                <label htmlFor="nom" style={{ paddingRight: 10 }}>
                  <FormattedMessage id="formulaire.nom" defaultMessage="Nom:" />
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  style={{ backgroundColor: "#2f4f4f" }}
                  onChange={HandleChange}
                />
              </Container>
              <Container>
                <label htmlFor="CA" style={{ paddingRight: 10 }}>
                  <FormattedMessage id="formulaire.CA" defaultMessage="CA:" />
                </label>
                <input
                  type="number"
                  id="CA"
                  name="CA"
                  style={{ backgroundColor: "#2f4f4f" }}
                  onChange={HandleChange}
                />
              </Container>
              <Container>
                <label htmlFor="armureNaturel" style={{ paddingRight: 10 }}>
                  <FormattedMessage
                    id="formulaire.AN"
                    defaultMessage="Armure Naturel:"
                  />
                </label>
                <input
                  type="checkbox"
                  id="armureNaturel"
                  name="armureNaturel"
                  onChange={HandleChange}
                />
              </Container>
              <Container>
                <label htmlFor="vie" style={{ paddingRight: 10 }}>
                  <FormattedMessage id="formulaire.vie" defaultMessage="Vie:" />
                </label>
                <input
                  type="number"
                  id="vie"
                  name="vie"
                  style={{ backgroundColor: "#2f4f4f" }}
                  onChange={HandleChange}
                />
              </Container>
              <Container>
                <label htmlFor="vitesse" style={{ paddingRight: 10 }}>
                  <FormattedMessage
                    id="formulaire.vitesse"
                    defaultMessage="Vitesse:"
                  />
                </label>
                <input
                  type="number"
                  id="vitesse"
                  name="vitesse"
                  style={{ backgroundColor: "#2f4f4f" }}
                  onChange={HandleChange}
                />
              </Container>
              <Container>
                <label htmlFor="puissance" style={{ paddingRight: 10 }}>
                  <FormattedMessage
                    id="formulaire.puissance"
                    defaultMessage="Puissance:"
                  />
                </label>
                <input
                  type="number"
                  id="puissance"
                  name="puissance"
                  style={{ backgroundColor: "#2f4f4f" }}
                  onChange={HandleChange}
                />
              </Container>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="force" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.for" defaultMessage="For" />
                </label>
                <label htmlFor="dexterite" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.dex" defaultMessage="Dex" />
                </label>
                <label htmlFor="constitution" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.con" defaultMessage="Con" />
                </label>
                <label htmlFor="intelligence" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.int" defaultMessage="Int" />
                </label>
                <label htmlFor="sagesse" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.sag" defaultMessage="Sag" />
                </label>
                <label htmlFor="charisme" style={{ padding: 12 }}>
                  <FormattedMessage id="formulaire.cha" defaultMessage="Cha" />
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="number"
                  id="force"
                  name="force"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
                <input
                  type="number"
                  id="dexterite"
                  name="dexterite"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
                <input
                  type="number"
                  id="constitution"
                  name="constitution"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
                <input
                  type="number"
                  id="intelligence"
                  name="intelligence"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
                <input
                  type="number"
                  id="sagesse"
                  name="sagesse"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
                <input
                  type="number"
                  id="charisme"
                  name="charisme"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={HandleChange}
                />
              </div>
            </div>
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
              <FormattedMessage id="bouton.creer" defaultMessage="Créer" />
            </Button>
          </fieldset>
        </form>
      </Card>
      <div style={{ color: "red" }}>{messageErreur}</div>
    </Container>
  );
}
