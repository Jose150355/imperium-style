import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Home from './pages/Home'
import Hombre from './pages/Hombre'
import Mujer from './pages/Mujer'
import Rebajas from './pages/Rebajas'
import MisApartados from './pages/MisApartados'
import ConfirmarPedido from './pages/ConfirmarPedido'
import MisPedidos from './pages/MisPedidos'
import Profile from './pages/Profile'
import EditarProducto from './pages/EditarProducto'
import RutaPrivada from './components/RutaPrivada'

// Admin
import PedidosAdmin from './pages/PedidosAdmin'
import SubirProducto from './pages/SubirProducto'

// Auth
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hombre" element={<Hombre />} />
        <Route path="/mujer" element={<Mujer />} />
        <Route path="/rebajas" element={<Rebajas />} />

        {/* Rutas protegidas */}
        <Route path="/mis-apartados" element={<RutaPrivada><MisApartados /></RutaPrivada>} />
        <Route path="/confirmar-pedido" element={<RutaPrivada><ConfirmarPedido /></RutaPrivada>} />
        <Route path="/mis-pedidos" element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
        <Route path="/perfil" element={<RutaPrivada><Profile /></RutaPrivada>} />

        {/* Admin */}
        <Route path="/admin/editar/:id" element={<RutaPrivada><EditarProducto /></RutaPrivada>} />
        <Route path="/admin/pedidos" element={<RutaPrivada><PedidosAdmin /></RutaPrivada>} />
        <Route path="/admin/subir" element={<RutaPrivada><SubirProducto /></RutaPrivada>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
