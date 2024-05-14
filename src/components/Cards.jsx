/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import axios from "axios";

const Cards = (props) => {
  const [agrupamentoNome, setAgrupamentoNome] = useState();
  const [agrupamentoDados, setAgrupamentoDados] = useState();

  //Card de Clientes a Receber
  const [clientesReceber, setClientesReceber] = useState();

  //Card de Clientes com Saldo
  const [ClienteSaldo, setClienteSaldo] = useState();

  //Card de Fornecedores a Pagar
  const [FornecedoresPagar, setFornecedoresPagar] = useState();

  //card de Adiantamento de Fornecedores
  const [FornecedoresAdiantamento, setFornecedoresAdiantamento] = useState();

  /!Essa função formata os numero em valor de Real, tipo (324.756,00)!/;
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
        // setLoading(false);
        setAgrupamentoNome(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        // setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("agrupamentoNome", agrupamentoNome);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const data = {
      DataInicial: props.DataInicial,
      DataFinal: props.DataFinal,
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
        // setLoading(false);
        setAgrupamentoDados(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        // setLoading(false);
      });
    // .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.DataInicial, props.DataFinal]);

  console.log("agrupamentoDados", agrupamentoDados);

  // const Verdade = ({ agrupamento, agrupamentoDados }) => {
  //   const vlTotalSaldo = agrupamento.find(
  //     (item) => item.IdTipoAgrupamento === agrupamentoDados.IdTipoAgrupamento
  //   )?.VlTotalSaldo;

  //   return (
  //     <div>
  //       O valor total do saldo é:{" "}
  //       {vlTotalSaldo}
  //     </div>
  //   );
  // };

  return (
    <Grid container spacing={2} marginTop={1} paddingLeft={2}>
      {agrupamentoDados &&
        agrupamentoDados.map((agrupamento, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
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
              }}
            >
              <Button style={{ width: "100%", height: "100%" }}>
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
