import axios from "axios";

const apiUser = axios.create({
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
},
   baseURL: "http://gerentemax.somee.com/Tenant/Account/Sistemas/AuthSistemas"
});

const apiClient = axios.create({
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
},
   baseURL: "https://apimaxbackup.somee.com/Tenant/Account/AuthLogin",
});

export { apiUser, apiClient };