/* eslint-disable no-unused-vars */
const baseUrl = "https://gerentemax.somee.com/";

export default {
   loginEndpoint: baseUrl + 'Tenant/Account/Sistemas/AuthSistemas',
   postTokenGerenteMax:  baseUrl + 'Tenant/Account/AuthLogin',
   getListarUsuarios:  baseUrl + 'Account/Usuarios/ListarUsuarios',
   postInserirUsuarios:  baseUrl + 'Account/Usuarios/InserirUsuarios',
   getListarPessoas:  baseUrl + 'Core/Pessoas/ListarPessoas',
   putAtualizarPessoas:  baseUrl + "Account/Usuarios/AtualizarUsuarios",
   deleteExcluirPessoas:  baseUrl + 'Core/Pessoas/ExcluirPessoas',
 }