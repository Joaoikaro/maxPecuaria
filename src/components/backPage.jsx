/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import "../styles/ListarUsuarios.css";
import { Box } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import Logo from "../images/Logo-home.png";

function BackPage() {
  const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down("lg")]: {
      padding: "20px",
    },
  }));

  const LoginIllustration = styled("img")(({ theme }) => ({
    maxWidth: "100%",
    height: "auto",
  }));

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw", 
        height: "90vh",
      }}
    >
      <LoginIllustrationWrapper>
        <LoginIllustration draggable="false" alt="login-illustration" src={Logo} />
      </LoginIllustrationWrapper>
    </Box>
  );
}

export default BackPage;
