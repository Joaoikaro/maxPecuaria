/* eslint-disable no-unused-vars */
// useDataGlobal.js
import { useState } from "react";
import { format } from "date-fns";

const useDataGlobal = () => {
  const currentDate = new Date().toISOString();
  const dataMesInicio = format(currentDate, "yyyy/01/01");
  const currentDateFormatted = format(currentDate, "yyyy/MM/dd");
  const dataMesInicioDefault = format(currentDate, "yyyy-01-01");
  const currentDateFormattedDefault = format(currentDate, "yyyy-MM-dd");
  const [DataInicial, setStartDate] = useState(dataMesInicio);
  const [DataFinal, setEndDate] = useState(currentDateFormatted);
  const [tipo, setTipo] = useState("Mes");
  
  const [defaultInicial, setDefaulticial] = useState(
    dataMesInicioDefault.toString()
  );

  const [defaultFinal, setDefaultFinal] = useState(
    currentDateFormattedDefault.toString()
  );
  const [dataInicialGrafico, setDataInicialGrafico] = useState(dataMesInicio);
  const [dataFinalGrafico, setDataFinalGrafico] =
    useState(currentDateFormatted);

  const [checked, setChecked] = useState(false);
  const [TipoAgrupamentoPessoaProduto, setTipoAgrupamentoGrafico] =
    useState("PRODUTO");
  //idTipoContratp
  const [tipoContratoGrafico, setTipoContratoGrafico] = useState(1);
  //idTipoAgrupamento
  const [tipoGrafico, setTipoGrafico] = useState(null);

  return {
    DataInicial,
    DataFinal,
    setStartDate,
    setEndDate,
    tipo,
    setTipo,
    defaultInicial,
    defaultFinal,
    setDefaulticial,
    setDefaultFinal,
    checked,
    setChecked,
    dataInicialGrafico,
    setDataInicialGrafico,
    dataFinalGrafico,
    setDataFinalGrafico,
    TipoAgrupamentoPessoaProduto,
    setTipoAgrupamentoGrafico,
    tipoContratoGrafico,
    setTipoContratoGrafico,
    tipoGrafico,
    setTipoGrafico,
  };
};

export default useDataGlobal;
