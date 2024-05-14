/* eslint-disable no-unused-vars */
import "../styles/Sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import { BiUserCircle } from "react-icons/bi";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { RequestPageOutlined } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

import {
  Apartment,
  Description,
  LocalShipping,
  PersonPinCircleOutlined,
} from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const [clienteNome, setClienteNome] = useState("");

  useEffect(() => {
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao == "1") {
      setClienteNome("Nome do Cliente");
    } else {
      navigate("/");
    }
  }, [navigate]);

  axios.get("https://apimaxbackup.somee.com/api/Backup/Usuarios");

  const Sair = () => {
    localStorage.clear();
    navigate("/");
  };

  const empresa = () => {
    return navigate("/empresa");
  };

  const fluxo = () => {
    return navigate("/fluxo");
  };

  const contrato = () => {
    return navigate("/contrato");
  };

  const carga = () => {
    return navigate("/cargas");
  };


  return (
    <div className="Sidebar active">
      <div className="sidebar-content">
        <ul>
          <li onClick={empresa}>
            <i>
              <Apartment style={{margin: "0px 3px 0px 13px"}}/>
            </i>
            <a>Empresas</a>
          </li>
          <Accordion
            style={{
              boxShadow: "none",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
              style={{width: "100%", padding: "0px 0px 0px 10px"}}
            >
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                {" "}
                <SpaceDashboardIcon
                  fontSize="small"
                  style={{
                    color: "rgba(52, 52, 52, 0.675)",
                    marginRight: "20px",
                    marginLeft: "4px",
                  }}
                />{" "}
                Dashboard
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <li onClick={fluxo} className="dashboard">
                <i>
                  <AlignHorizontalLeftIcon
                    style={{ color: "rgba(52, 52, 52, 0.675)" }}
                  />
                </i>
                <a>Financeiro</a>
              </li>
              <li onClick={contrato} className="cargas">
                <i>
                  <RequestPageOutlined
                    style={{ color: "rgba(52, 52, 52, 0.675)" }}
                  />
                </i>
                <a>Contratos</a>
              </li>
              <li onClick={carga} className="cargas">
                <i>
                  <LocalShippingIcon
                    style={{ color: "rgba(52, 52, 52, 0.675)" }}
                  />
                </i>
                <a>Cargas</a>
              </li>
            </AccordionDetails>
          </Accordion>
        </ul>
        <div className="container-user">
          <div className="user-info-">
            <BiUserCircle className="user-icon-" />
            <span>{clienteNome}</span>
          </div>
        </div>
        <div className="container-logout">
          <Button
            onClick={Sair}
            variant="contained"
            color="error"
            style={{ width: "100%" }}
          >
            Sair
            <LogoutIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
