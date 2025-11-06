import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=12')
        const results = await Promise.all(
          data.results.map(async (poke) => {
            const res = await axios.get(poke.url)
            return {
              name: res.data.name,
              image: res.data.sprites.front_default,
              type: res.data.types[0].type.name,
              height: res.data.height
            }
          })
        )
        setPokemons(results)
      } catch (error) {
        console.error('Error al obtener datos', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const Home = () => (
    <div>
      <section
        className="text-center text-light p-5 mb-4 rounded-4"
        style={{
          background: 'linear-gradient(135deg, #dc3545, #ffc107)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <h1 className="display-4 fw-bold">PokeApp</h1>
        <p className="lead">
          Descubre el mundo Pokémon con información actualizada desde la API pública.
        </p>
      </section>

      <div className="container mt-4">
        <h2 className="text-center text-danger mb-4">Pokémon destacados</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2">Cargando...</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            {pokemons.slice(0, 6).map((p, index) => (
              <div key={index} className="col-6 col-md-2 mb-4">
                <div className="card text-center border-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-img-top mx-auto"
                    style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                  />
                  <div className="card-body p-2">
                    <p className="card-title fw-semibold text-capitalize">{p.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const Entities = () => (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">Lista de Pokémon</h2>
      <div className="row">
        {pokemons.map((p, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div className="card h-100 text-center shadow-sm">
              <img src={p.image} alt={p.name} className="card-img-top p-3" />
              <div className="card-body">
                <h5 className="card-title text-capitalize">{p.name}</h5>
                <p className="card-text mb-1">
                  <strong>Tipo:</strong> {p.type}
                </p>
                <p className="card-text">
                  <strong>Altura:</strong> {p.height}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm rounded-3 p-3">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          PokeApp
        </Link>
        <div>
          <Link className="btn btn-outline-primary mx-2" to="/">
            Inicio
          </Link>
          <Link className="btn btn-outline-success" to="/entities">
            Pokémon
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entities" element={<Entities />} />
      </Routes>
    </div>
  )
}

export default App
