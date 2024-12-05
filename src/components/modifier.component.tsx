import { Button, Card, Container } from "@mui/material";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FormattedMessage } from "react-intl";

interface FormulaireModifierProp {
  id: string;
}
//component pour modifier un monstre
export default function FormulaireModifier(props: FormulaireModifierProp) {
  const navigate = useNavigate();
  const [messageErreur, setMessageErreur] = useState("");
  const [cookies] = useCookies(["jeton"]);

  const [_, setId] = useState("");
  const [nom, setNom] = useState("");
  const [CA, setCA] = useState("");
  const [vie, setVie] = useState("");
  const [armureNaturel, setArmureNaturel] = useState(false);
  const [vitesse, setVitesse] = useState("");
  const [ajout, setAjout] = useState(Date);
  const [force, setForce] = useState("");
  const [dex, setDex] = useState("");
  const [con, setCon] = useState("");
  const [intel, setIntel] = useState("");
  const [sag, setSag] = useState("");
  const [cha, setCha] = useState("");
  const [puissance, setPuissance] = useState("");

  axios.defaults.headers.common = { Authorization: `bearer ${cookies.jeton}` };

  //assigne les données du monstre à modifier
  useEffect(() => {
    axios
      .get(`https://apidev3-1.onrender.com/api/Monstres/id/${props.id}`)
      .then((response) => {
        console.log(response.data);
        setId(response.data.monstre._id);
        setNom(response.data.monstre.nom);
        setCA(response.data.monstre.CA.toString());
        setVie(response.data.monstre.vie.toString());
        setVitesse(response.data.monstre.vitesse.toString());
        setArmureNaturel(response.data.monstre.armureNaturel);
        setAjout(response.data.monstre.ajout);
        let tableauTemp: number[] = response.data.monstre.stats;
        setForce(tableauTemp[0].toString());
        setDex(tableauTemp[1].toString());
        setCon(tableauTemp[2].toString());
        setIntel(tableauTemp[3].toString());
        setSag(tableauTemp[4].toString());
        setCha(tableauTemp[5].toString());
        setPuissance(response.data.monstre.puissance.toString());
      });
  }, []);

  //Vérifie que les valeurs du monstre respecte les normes puis change le monstre dans la BD
  function Modifier(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    let messageErreurTemp = "";
    setMessageErreur("");
    if (nom.length < 1) {
      messageErreurTemp += "Le nom doit comporter au moins un charactère.\r\n";
    }
    if (Number(CA) < 0) {
      messageErreurTemp += "La classe d'armure doit avoir un minimum de 0.\r\n";
    }
    if (Number(vie) < 0) {
      messageErreurTemp += "La vie doit avoir un minimum de 0.\r\n";
    }
    if (Number(vitesse) < 0) {
      messageErreurTemp += "La vitesse doit avoir un minimum de 0.\r\n";
    }
    if (Number(puissance) < 0) {
      messageErreurTemp += "La puissance doit avoir un minimum de 0.\r\n";
    }
    if (Number(force) < 0) {
      messageErreurTemp += "La force doit avoir un minimum de 0.\r\n";
    }
    if (Number(dex) < 0) {
      messageErreurTemp += "La dextérité doit avoir un minimum de 0.\r\n";
    }
    if (Number(con) < 0) {
      messageErreurTemp += "La constitution doit avoir un minimum de 0.\r\n";
    }
    if (Number(intel) < 0) {
      messageErreurTemp += "L'intelligence doit avoir un minimum de 0.\r\n";
    }
    if (Number(sag) < 0) {
      messageErreurTemp += "La sagesse doit avoir un minimum de 0.\r\n";
    }
    if (Number(cha) < 0) {
      messageErreurTemp += "Le charisme doit avoir un minimum de 0.\r\n";
    }
    setMessageErreur(messageErreurTemp);
    if (messageErreurTemp == "") {
      axios
        .put("https://apidev3-1.onrender.com/api/Monstres", {
          monstre: {
            _id: props.id,
            nom: nom,
            CA: Number(CA),
            armureNaturel: armureNaturel,
            vie: Number(vie),
            vitesse: Number(vitesse),
            ajout: ajout.split("T")[0],
            stats: [
              Number(force),
              Number(dex),
              Number(con),
              Number(intel),
              Number(sag),
              Number(cha),
            ],
            puissance: Number(puissance),
          },
        })
        .then(() => {
          navigate(-1);
        })
        .catch((response) => {
          if (response.status == 401) {
            setMessageErreur(
              " Vous devez être connecté pour modifier un monstre "
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
        <form method="post" onSubmit={Modifier}>
          <fieldset>
            <legend style={{ fontSize: 28, padding: 10, alignItems: "center" }}>
              <FormattedMessage
                id="formulaire.modifier.titre"
                defaultMessage="Modifier un monstre"
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
                  onChange={(event) => setNom(event.target.value)}
                  value={nom}
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
                  onChange={(event) => setCA(event.target.value)}
                  value={CA}
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
                  onChange={(event) => setArmureNaturel(event.target.checked)}
                  checked={armureNaturel}
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
                  onChange={(event) => setVie(event.target.value)}
                  value={vie}
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
                  onChange={(event) => setVitesse(event.target.value)}
                  value={vitesse}
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
                  onChange={(event) => setPuissance(event.target.value)}
                  value={puissance}
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
                  onChange={(event) => setForce(event.target.value)}
                  value={force}
                />
                <input
                  type="number"
                  id="dexterite"
                  name="dexterite"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={(event) => setDex(event.target.value)}
                  value={dex}
                />
                <input
                  type="number"
                  id="constitution"
                  name="constitution"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={(event) => setCon(event.target.value)}
                  defaultValue={con}
                />
                <input
                  type="number"
                  id="intelligence"
                  name="intelligence"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={(event) => setIntel(event.target.value)}
                  defaultValue={intel}
                />
                <input
                  type="number"
                  id="sagesse"
                  name="sagesse"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={(event) => setSag(event.target.value)}
                  defaultValue={sag}
                />
                <input
                  type="number"
                  id="charisme"
                  name="charisme"
                  style={{ backgroundColor: "#2f4f4f", width: 28, margin: 8 }}
                  onChange={(event) => setCha(event.target.value)}
                  defaultValue={cha}
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
              <FormattedMessage id="bouton.modifier" defaultMessage="Modifier" />
            </Button>
          </fieldset>
        </form>
      </Card>
      <div style={{ color: "red" }}>{messageErreur}</div>
    </Container>
  );
}
