/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { BarChart } from "@mui/x-charts/BarChart";
import ReactApexCharts from "react-apexcharts";
import axios from "axios";
import { useEffect, useState } from "react";
import DataGlobal from "./globalData";
import { YAxis } from "recharts";
import { format } from "date-fns";

export default function QuantidadeChart(props) {
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy/MM/01");
  const currentDateFormatted = format(currentDate, "yyyy/MM/dd");
  const [graficosQuantidade, setGraficosQuantidade] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
  } = DataGlobal();

  console.log("props", props);
  console.log(
    "Props do Get",
    "DataInicial:",
    props.dataInicio,
    "DataFinal:",
    props.dataFim,
    "IdTipoAgrupamento:",
    props.IdTipoAgrupamento,
    "TipoContrato:",
    props.tipoContratoGrafico,
    " TipoAgrupamento:",
    props.TipoAgrupamentoPessoaProduto
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const data = {
      DataInicial: props.dataInicio,
      DataFinal: props.dataFim,
      IdTipoAgrupamento: props.IdTipoAgrupamento,
      TipoContrato: props.tipoContratoGrafico,
      TipoAgrupamento: props.TipoAgrupamentoPessoaProduto,
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
        setLoading(false);
        setGraficosQuantidade(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    props.tipoAgrupamentoGrafico,
    props.tipoContratoGrafico,
    props.IdTipoAgrupamento,
    props.dataFim,
    props.dataInicio,
    props.TipoAgrupamentoPessoaProduto,
  ]);
  console.log(graficosQuantidade);

  // ! TOTAL CARREGADOS !
  const GraficoCarregado = graficosQuantidade.map((item) => {
    return item.QtdeTotalCarregad;
  });

  const BarCarregado = GraficoCarregado.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const somaTotalCarregado = GraficoCarregado.reduce((total, currentValue) => {
    return total + currentValue;
  }, 0);

  // ! TOTAL CONTRATATOS !
  const GraficoContrato = graficosQuantidade
    .map((item) => {
      return item.QtdeTotalContrato ? item.QtdeTotalContrato : null;
    })
    .filter((value) => value !== null);

  const BarContrato = GraficoContrato.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  // ! TOTAL PAGAMENTOS !
  const GraficoPagamento = graficosQuantidade
    .map((item) => {
      return item.QtdeTotalPagtos ? item.QtdeTotalPagtos : null;
    })
    .filter((value) => value !== null);

  const BarPagamento = GraficoPagamento.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  // ! TOTAL SALDO !
  const GraficoSaldo = graficosQuantidade
    .map((item) => {
      return item.QtdeTotalSaldo ? item.QtdeTotalSaldo : null;
    })
    .filter((value) => value !== null);

  const BarSaldoTotal = GraficoSaldo.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  const xAxisData = graficosQuantidade
    .map((item) => {
      if (props.TipoAgrupamentoPessoaProduto === "PESSOA") {
        return item.Pessoa !== null ? item.Pessoa : null;
      } else {
        return item.Produto !== null ? item.Produto : null;
      }
    })
    .filter((value) => value !== null);

  const dadosOrganizados = graficosQuantidade.map((item, index) => {
    if (item.VlTotalSaldo === null && index > 0) {
      return { ...item, Produto: null };
    }
    return item;
  });

  const handleSubmitChart = (event) => {
    event.preventDefault();
  };

  console.log(props.esconder);

  ///////////////////////////////////
  // Configurações do gráfico
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: xAxisData,
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return (
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
              .format(value)
              .replace("R$", "") + "kg"
          );
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    colors: ["#feb900", "#55cc00", "#ab52df", "#61b6ef"],
    yaxis: {
      labels: {
        formatter: function (value) {
          return (
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
              .format(value)
              .replace("R$", "") + "kg"
          );
        },
      },
    },
  };
  ///////////////////////////////////

  const formaSaldo = (saldo) => {
    return parseFloat(saldo).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div
      className="GraficoValor"
      style={{
        width: props.esconder == 2 ? "50%" : "100%",
        minWidth: "50%",
        maxWidth: "100%",
        display: props.esconder == 2 ? "none" : "",
      }}
    >
      <h3
        style={{
          width: "100%",
          textAlign: "center",
          color: "#afafafcf",
          fontWeight: "500",
        }}
      >
        Quantidade
      </h3>
      <ReactApexCharts
        options={options}
        series={[
          {
            name: "Contrato",
            data: BarContrato,
          },
          {
            name: "Carregado",
            data: BarCarregado,
          },
          {
            name: "Pagamentos",
            data: BarPagamento,
          },
          {
            name: "Saldo",
            data: BarSaldoTotal,
          },
        ]}
        type="bar"
        height={280}
      />
    </div>
  );
}
