/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { BarChart } from "@mui/x-charts/BarChart";
import ReactApexCharts from "react-apexcharts";
import axios from "axios";
import { useEffect, useState } from "react";
import DataGlobal from "./globalData";
import { YAxis } from "recharts";

export default function ValorChart(props) {
  const [graficosQuantidade, setGraficosQuantidade] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    tipoAgrupamentoGrafico,
    setTipoAgrupamentoGrafico,
    defaultFinal,
    defaultInicial,
    setTipoContratoGrafico,
    tipoGrafico,
    setTipoGrafico,
  } = DataGlobal();

  console.log("props", props)
  console.log(
    "Props do Get",
    "DataInicial:", props.dataInicio,
      "DataFinal:", props.dataFim,
      "IdTipoAgrupamento:", props.IdTipoAgrupamento,
      "TipoContrato:", props.tipoContratoGrafico,
     " TipoAgrupamento:", props.TipoAgrupamentoPessoaProduto,
  )

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
        console.log("Esse é o response do grafico valores", response.data);
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
    tipoAgrupamentoGrafico,
    setTipoAgrupamentoGrafico,
    defaultFinal,
    defaultInicial,
    setTipoContratoGrafico,
    tipoGrafico,
    setTipoGrafico,
    props.dataInicio,
    props.dataFim,
    props.IdTipoAgrupamento,
    props.tipoContratoGrafico,
    props.TipoAgrupamentoPessoaProduto,
  ]);

  console.log(graficosQuantidade);

  // ! TOTAL CARREGADOS !
  const GraficoCarregado = graficosQuantidade
    .map((item) => {
      return item.VlTotalCarregado !== null ? item.VlTotalCarregado : null;
    })
    .filter((value) => value !== null);

  const BarCarregado = GraficoCarregado.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  // ! TOTAL CONTRATATOS !
  const GraficoContrato = graficosQuantidade
    .map((item) => {
      return item.VlTotalContrato ? item.VlTotalContrato : null;
    })
    .filter((value) => value !== null);

  const BarContrato = GraficoContrato.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  // ! TOTAL PAGAMENTOS !
  const GraficoPagamento = graficosQuantidade
    .map((item) => {
      return item.VlTotalPagtos ? item.VlTotalPagtos : null;
    })
    .filter((value) => value !== null);

  const BarPagamento = GraficoPagamento.reduce((total, currentValue) => {
    return [...total, currentValue];
  }, []);

  // ! TOTAL SALDO !
  const GraficoSaldo = graficosQuantidade
    .map((item) => {
      return item.VlTotalSaldo ? item.VlTotalSaldo : null;
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
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
        },
      } 
    }
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
        width: props.esconder == 1 ? "50%" : "100%",
        minWidth: "50%",
        maxWidth: "100%",
        display: props.esconder == 1 ? "none" : "",
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
        Valores R$
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

      {/* <BarChart
        colors={["#feb900", "#55cc00", "#ab52df", "#61b6ef"]}
        width={props.esconder == 1 ? 0 : props.esconder == 0 ? 820 : 1750}
        height={300}
        series={
          BarContrato.length > 0 && BarCarregado.length > 0
            ? [
                {
                  data: BarContrato,
                  label: "Contratoㅤ",
                  id: "Contrato",
                },
                {
                  data: BarCarregado,
                  label: "Carregadoㅤ",
                  id: "Carregado",
                },
                {
                  data: BarPagamento,
                  label: "Pagamentosㅤ",
                  id: "Pagamentos",
                },
                {
                  data: BarSaldoTotal,
                  label: "Saldoㅤ",
                  id: "Saldo",
                },
              ]
            : []
        }
        xAxis={
          xAxisData.length > 0
            ? [
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]
            : []
        }
      ></BarChart> */}
    </div>
  );
}
