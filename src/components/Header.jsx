/* eslint-disable no-unused-vars */
import { GiHamburgerMenu } from "react-icons/gi";
import PersonIcon from "@mui/icons-material/Person";
import { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { format } from "date-fns";

const currentDateHeaderCaverna = new Date().toISOString();
const currentDateHeader = format(currentDateHeaderCaverna, "dd/MM/yyy");

const Header = () => {
  const [clienteNome, setClienteNome] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao == "1") {
      setClienteNome(localStorage.getItem("Nome"));
    } else {
      // Se não houver nome de usuário no localStorage, redireciona para a tela de login
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="container-header">
        <GiHamburgerMenu
          color="#343434ac"
          className="menu"
          onClick={() => setOpen(!open)}
        />

        <div className="container-user">
          <div className="user-info">
            <PersonIcon className="user-icon" />
            <span>Olá, {clienteNome}</span>
          </div>
        </div>
      </div>

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
};

export default Header;
