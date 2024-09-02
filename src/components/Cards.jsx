/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import DataGlobal from "./globalData";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const Cards = (props) => {
  const { DataInicial, DataFinal, onCardClick } = props;
  const [agrupamentoNome, setAgrupamentoNome] = useState();
  const [agrupamentoDados, setAgrupamentoDados] = useState();
  const { loading, setLoading } = DataGlobal();
  const [selectedButton, setSelectedButton] = useState(null);

  // Função para formatar números em valor monetário brasileiro
  const formaSaldo = (saldo) => {
    return parseFloat(saldo).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const url = `https://www.gerentemax.somee.com/Dashboard/Contratos/ListarContratos_TipoAgrup`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAgrupamentoNome(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const data = {
      DataInicial: DataInicial,
      DataFinal: DataFinal,
      IdTipoAgrupamento: null,
      TipoContrato: null,
      TipoAgrupamento: "ID",
    };

    const url = `https://www.gerentemax.somee.com/Dashboard/Contratos/ListarPorPeriodoAgrupado`;

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Log dos cards", response.data);
        setAgrupamentoDados(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  }, [DataInicial, DataFinal]);

  const handleButtonClick = (index, agrupamentoId, TipoContratoCard) => {
    setLoading(true);
  
    if (selectedButton === index) {
      setSelectedButton(null); // Deseleciona o card
      onCardClick(null, TipoContratoCard); // Passa null para o id
    } else {
      setSelectedButton(index); // Seleciona o card
      onCardClick(agrupamentoId, TipoContratoCard); // Passa o id normalmente
    }
  
    console.log("🚀 ~ handleButtonClick ~ agrupamentoId:", agrupamentoId);
    console.log("🚀 ~ handleButtonClick ~ TipoContratoCard:", TipoContratoCard);
  };
  

  return (
    <Grid container spacing={2} marginTop={1} paddingLeft={2} height={"100%"} maxHeight={'140px'}>
      {agrupamentoDados &&
        agrupamentoDados.map((agrupamento, index) => (
          <Grid key={index} item xs={12} sm={6} md={3} style={{ height: "100%", maxHeight: "130px", paddingTop: "0px"}}>
            <Card
              style={{
                borderBottom:
                  agrupamento.IdTipoAgrupamento === 1
                    ? "2px solid #61b6ef"
                    : agrupamento.IdTipoAgrupamento === 2
                    ? "3px solid #FF4C51"
                    : agrupamento.IdTipoAgrupamento === 3
                    ? "3px solid #FF4C51"
                    : "3px solid #61b6ef",
                backgroundColor:
                  selectedButton === index
                    ? agrupamento.IdTipoAgrupamento === 1 ||
                      agrupamento.IdTipoAgrupamento === 4
                      ? "#f1f8ff"
                      : agrupamento.IdTipoAgrupamento === 2 ||
                        agrupamento.IdTipoAgrupamento === 3
                      ? "#ffe5e5"
                      : "#e8e8e8"
                    : "#ffffff",
                height: "100%",
                maxHeight: "130px",
                width: "100%",
                transition: "all 0.3s ease",
                padding: "0px",
              }}
            >
              <Button
                style={{
                  width: "100%",
                  height: "100%",
                  color: "white",
                  margin: "0",
                  padding: "10px",
                }}
                onClick={() =>
                  handleButtonClick(
                    index,
                    agrupamento.IdTipoAgrupamento,
                    agrupamento.TipoContrato
                  )
                }
              >
                <CardContent
                  style={{ width: "100%", textAlign: "left", height: "100%" }}
                >
                  <Typography color="#00000080" textTransform={"initial"}>
                    {agrupamento.IdTipoAgrupamento === 1
                      ? "Clientes a Receber"
                      : agrupamento.IdTipoAgrupamento === 2
                      ? "Clientes Com Saldo"
                      : agrupamento.IdTipoAgrupamento === 3
                      ? "Fornecedores a Pagar"
                      : "Adiantamento Fornecedores"}
                  </Typography>

                  <Typography
                    variant="h5"
                    style={{
                      color:
                        agrupamento.IdTipoAgrupamento === 1
                          ? "#61b6ef"
                          : agrupamento.IdTipoAgrupamento === 2
                          ? "#FF4C51"
                          : agrupamento.IdTipoAgrupamento === 3
                          ? "#FF4C51"
                          : "#61b6ef",
                    }}
                  >
                    {agrupamento.IdTipoAgrupamento === 1
                      ? formaSaldo(agrupamento.VlTotalSaldo).replace("-", "")
                      : agrupamento.IdTipoAgrupamento === 2
                      ? "-" +
                        formaSaldo(agrupamento.VlTotalSaldo).replace("-", "")
                      : agrupamento.IdTipoAgrupamento === 3
                      ? "-" +
                        formaSaldo(agrupamento.VlTotalSaldo).replace("-", "")
                      : formaSaldo(agrupamento.VlTotalSaldo).replace("-", "")}
                  </Typography>
                  <Typography color="#00000080" textTransform={"initial"}>
                    {agrupamento.Quantidade} Contratos
                  </Typography>
                </CardContent>
              </Button>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default Cards;
