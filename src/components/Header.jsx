/* eslint-disable no-unused-vars */
import { GiHamburgerMenu } from "react-icons/gi";
import PersonIcon from "@mui/icons-material/Person";
import { useState, useEffect } from "react";
import "../styles/Header.css";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";

const currentDateHeaderCaverna = new Date().toISOString();
const currentDateHeader = format(currentDateHeaderCaverna, "dd/MM/yyy");

const Header = () => {
  const [clienteNome, setClienteNome] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const Autenticacao = localStorage.getItem("Autenticacao");

    if (Autenticacao == "1") {
      setClienteNome(localStorage.getItem("Nome"));
    } else {
      // Se não houver nome de usuário no localStorage, redireciona para a tela de login
      navigate("/");
    }
  }, [navigate]);

  const abrirMenus = () => {
    const sidebar = $(".Sidebar");

    if (sidebar.is(":visible")) {
      sidebar.stop().fadeOut(100);
    } else {
      sidebar.stop().fadeIn(300);
    }
  };

  return (
    <header>
      <div className="container-header">
        <GiHamburgerMenu
          color="#343434ac"
          className="menu"
          onClick={abrirMenus}
        />

        <div className="containerAtualizacao">
          <Typography level="title-lg">
            Ultima atualização: {currentDateHeader}
          </Typography>
        </div>

        {/* <div className="container-search">
          <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar"
                inputProps={{ 'aria-label': 'search' }}
              />
              
            </Search>
        </div> */}

        <div className="container-user">
          <div className="user-info">
            <PersonIcon className="user-icon" />
            <span>Olá, {clienteNome}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
