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
        <Route path="/mis-apartados" element={<MisApartados />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin/editar/:id" element={<EditarProducto />} />

        {/* Rutas de administrador */}
        <Route path="/admin/pedidos" element={<PedidosAdmin />} />
        <Route path="/admin/subir" element={<SubirProducto />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
