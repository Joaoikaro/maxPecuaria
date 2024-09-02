import { Route, Router } from 'react-router-dom';
import '../App.css';
import LoginPage from './Login';
import Usuarios from './Usuarios'
import Empresas from './Empresas';
import Inicial from './inicial';

function App() {
  return (
      <Router>
        <Route path='/' exact component={LoginPage}/>
        <Route path='/empresas' component={Empresas}	/>
        <Route path="/main" Component={Inicial} />
        <Route path="/pessoas" component={Usuarios} />
      </Router>
  )
}

export default App
