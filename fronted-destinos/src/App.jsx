import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [destinos, setDestinos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [descripcion, setDescripcion] = useState(""); // 👈 Volvemos a agregar la descripción

  const API = 
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/destinos";

  const cargarDestinos = async () => {
    try {
      const respuesta = await fetch(API);
      const datos = await respuesta.json();
      setDestinos(datos);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  const agregarDestino = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          departamento,
          descripcion // 👈 Enviamos la descripción al backend
        })
      });

      if (!respuesta.ok) throw new Error("No se pudo agregar el destino");

      setNombre("");
      setDepartamento("");
      setDescripcion(""); // Limpiamos el campo
      cargarDestinos();
    } catch (error) {
      alert(error.message);
    }
  };

  const eliminarDestino = async (id) => {
    if (!window.confirm("¿Deseas eliminar este destino?")) return;
    try {
      const respuesta = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!respuesta.ok) throw new Error("No se pudo eliminar");
      cargarDestinos();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="contenedor">
      <header>
        <h1>🇨🇴 Explora Colombia</h1>
        <p>Descubre los mejores destinos turísticos</p>
      </header>

      <section className="tarjeta formulario">
        <h2>Agregar nuevo destino</h2>
        <p className="subtitulo-form">Completa los datos para añadir un lugar.</p>

        <form onSubmit={agregarDestino}>
          <input
            type="text"
            placeholder="Nombre del destino"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            required
          />
          
          {/* 👈 Agregamos el textarea de nuevo */}
          <textarea
            placeholder="Descripción del lugar (Opcional)..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          ></textarea>

          <button type="submit" className="btn-principal">
            Agregar destino
          </button>
        </form>
      </section>

      <section className="tarjeta lista">
        <h2>Destinos disponibles</h2>
        {destinos.length === 0 && (
          <p className="mensaje-vacio">No hay destinos agregados aún.</p>
        )}

        {destinos.map((destino) => (
          <article className="destino" key={destino.id}>
            
            <div className="destino-info">
              <div className="destino-header">
                <h3>{destino.nombre}</h3>
                <p>📍 {destino.departamento}</p>
              </div>
              
              {/* 👈 Mostramos la descripción SOLO si existe y no está vacía */}
              {destino.descripcion && destino.descripcion.trim() !== "" && (
                <p className="destino-desc">{destino.descripcion}</p>
              )}
            </div>

            <button
              className="btn-eliminar"
              onClick={() => eliminarDestino(destino.id)}
              title="Eliminar destino"
            >
              🗑️
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;