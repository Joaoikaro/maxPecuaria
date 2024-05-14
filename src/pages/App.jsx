import { Route, Router } from 'react-router-dom';
import '../App.css';
import LoginPage from './Login';
import Main from './Main'
import Empresas from './Empresas';

function App() {
  return (
      <Router>
        <Route path='/' exact component={LoginPage}/>
        <Route path='/empresas' component={Empresas}	/>
        <Route path="/main" component={Main} />
      </Router>
  )
}

export default App
