const API_URL = "http://localhost:5500/api/cursos";
 
const formulario = document.querySelector("#formCursos"); 
const nombre = document.querySelector("#nombre"); 
const categoria = document.querySelector("#categoria"); 
const duracion = document.querySelector("#duracion"); 
const cuposdisponibles = document.querySelector("#cuposdisponibles"); 
const listado = document.querySelector("#listadoCursos"); 
const activo = document.querySelector("#activo");
const mensaje = document.querySelector("#mensaje"); 
const btnCargar = document.querySelector("#btnCargar"); 
const btnTodas = document.querySelector("#btnTodas"); 
const btnActivos = document.querySelector("#btnActivos"); 
const btnNoActivos = document.querySelector("#btnNoActivos"); 
const btnBuscarID = document.querySelector("#btnBuscarID");
 

let cursosActuales = []; 
 
async function cargarCursos() { 
  try { 
    const respuesta = await fetch(API_URL); 
 
    if (!respuesta.ok) { 
      throw new Error("Error al obtener cursos."); 
    } 
 
    const cursos = await respuesta.json(); 
    cursosActuales = cursos; 
    mostrarCursos(cursosActuales); 
 
  } catch (error) { 
    mensaje.textContent = "No se pudo conectar con la API."; 
    mensaje.className = "error"; 
    console.error(error); 
  } 
} 
 
function mostrarCursos(cursos) { 
  listado.innerHTML = ""; 
 
  if (cursos.length === 0) { 
    listado.innerHTML = `<p class="sin-resultados">No hay cursos para 
mostrar.</p>`; 
    return; 
  } 
 
  cursos.forEach(curso => { 
    const textoActivo = curso.activo ? "Activo" : "Inactivo"; 
    const claseActivo = curso.activo ? "activo" : "inactivo"; 
 
    listado.innerHTML += ` 
      <div class="tarjeta"> 
        <h3>${curso.nombre}</h3> 
        <p><strong>Categoría:</strong> ${curso.categoria}</p> 
        <p><strong>Duración:</strong> ${curso.duracion} horas</p> 
        <p><strong>Cupos disponibles:</strong> ${curso.cuposdisponibles}</p> 
        <p class="${claseActivo}">${textoActivo}</p> 
      </div> 
    `; 
  }); 
} 
 
function mostrarTodas() { 
  mostrarCursos(cursosActuales); 
  mensaje.textContent = "Mostrando todos los cursos."; 
  mensaje.className = "ok"; 
} 
 
function mostrarActivos() { 
  const cursosActivos = cursosActuales.filter(curso => 
curso.activo); 
  mostrarCursos(cursosActivos); 
  mensaje.textContent = "Mostrando cursos activos."; 
  mensaje.className = "ok"; 
} 
 
function mostrarNoActivos() { 
  const cursosNoActivos = cursosActuales.filter(curso => 
!curso.activo); 
  mostrarCursos(cursosNoActivos); 
  mensaje.textContent = "Mostrando cursos inactivos."; 
  mensaje.className = "ok"; 
} 
 
async function guardarCurso(evento) { 
  evento.preventDefault(); 
 
  const nuevocurso = { 
    nombre: nombre.value.trim(), 
    categoria: categoria.value.trim(), 
    duracion: parseInt(duracion.value), 
    cuposdisponibles: parseInt(cuposdisponibles.value), 
    activo: activo.value === "true" 
  }; 
 
  if (nuevocurso.nombre === "" || nuevocurso.categoria === "" || 
nuevocurso.duracion === NaN || nuevocurso.cuposdisponibles === NaN) { 
    mensaje.textContent = "Debe completar todos los datos correctamente."; 
    mensaje.className = "error"; 
    return; 
  } 
 
  try { 
    const respuesta = await fetch(API_URL, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(nuevocurso) 
    }); 
 
    if (!respuesta.ok) { 
      throw new Error("Error al guardar"); 
    } 
 
    mensaje.textContent = "Curso guardado correctamente."; 
    mensaje.className = "ok"; 
    formulario.reset(); 
    cargarCursos(); 
 
  } catch (error) { 
    mensaje.textContent = "Error al guardar el curso."; 
    mensaje.className = "error"; 
    console.error(error); 
  } 
} 
async function buscarCursoPorID() {
    const id = document.querySelector("#inputBuscarID").value.trim();
    if (id === "") {
        mensaje.textContent = "Debe ingresar un ID para buscar.";
        mensaje.className = "error";
        return;
    }
}

async function eliminarCurso(id) { 
  try { 
    const respuesta = await fetch(`${API_URL}/${id}`, { method: "DELETE" 
}); 
 
    if (!respuesta.ok) { 
      throw new Error("Error al eliminar"); 
    } 
 
    mensaje.textContent = "Curso eliminado correctamente."; 
    mensaje.className = "ok"; 
    cargarCursos(); 
 
  } catch (error) { 
    mensaje.textContent = "Error al eliminar el curso."; 
    mensaje.className = "error"; 
  } 
} 

formulario.addEventListener("submit", guardarCurso); 
btnCargar.addEventListener("click", cargarCursos); 
btnTodas.addEventListener("click", mostrarTodas); 
btnActivos.addEventListener("click", mostrarActivos); 
btnNoActivos.addEventListener("click", mostrarNoActivos); 
btnBuscarID.addEventListener("click", buscarCursoPorID);
cargarCursos();
