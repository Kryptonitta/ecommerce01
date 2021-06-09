//Referencias
const carrito = document.getElementById("carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const listaCursos = document.getElementById("lista-cursos");
let articulosCarrito = [];

//LLAMADAS A EVENTOS
cargarEventListeners();

//EVENTOS
function cargarEventListeners() {
	//-->Agregar producto
	listaCursos.addEventListener("click", agregarCurso);
	//-->Eliminar curso
	carrito.addEventListener("click", eliminarCurso);
	//Muestra los cursos del Local Storage
	document.addEventListener("DOMContentLoaded", () => {
		articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

		carritoHTML();
	});
	//-->Vaciar carrito
	vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
}

//FUNCIONES
//-->Agregar curso
function agregarCurso(e) {
	e.preventDefault(); //para evitar la accion de recargar la página, ya que no tenemos un link a donde nos lleve
	if (e.target.classList.contains("btn-agregar-carrito")) {
		//para prevenir event bubbling
		const cursoSeleccionado = e.target.parentElement.parentElement;
		leerDatosCurso(cursoSeleccionado);
	}
}

//-->Eliminar curso
function eliminarCurso(e) {
	if (e.target.classList.contains("borrar-curso")) {
		const cursoId = e.target.getAttribute("data-id");

		//Elimina del array articulos carrito el curso
		articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

		carritoHTML();
	}
}

//-->Vaciar carrito
function vaciarCarrito() {
	//reseteo el array
	articulosCarrito = [];
	//llamo a la funcion de eliminar el html
	limpiarHTML();
}

//-->Mostrar datos del curso
function leerDatosCurso(curso) {
	console.log(curso);

	//creo el objeto del curso actual
	const infoCurso = {
		imagen: curso.querySelector("img").src,
		titulo: curso.querySelector("h4").textContent,
		precio: curso.querySelector(".precio span").textContent,
		id: curso.querySelector("a").getAttribute("data-id"),
		cantidad: 1, //arranca siempre en 1
	};

	//Contador de cursos duplicados
	const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
	if (existe) {
		//Actualiza cantidad
		const cursos = articulosCarrito.map((curso) => {
			if (curso.id === infoCurso.id) {
				curso.cantidad++;
				return curso; //retorna el objeto actualizado
			} else {
				return curso; //retorna el objeto nuevo
			}
		});
		articulosCarrito = [...cursos];
	} else {
		//Agregando elementos al carrito - Con spread operator
		articulosCarrito = [...articulosCarrito, infoCurso];
	}

	console.log(articulosCarrito); //test interno

	//llamada a la funcion que agrega los productos
	carritoHTML();
}

//-->Reiniciando el carrito (para no duplicar productos)
function limpiarHTML() {
	//forma lenta de limpiar
	// contenedorCarrito.innerHTML = "";

	//forma rapida/optima
	while (contenedorCarrito.firstChild) {
		contenedorCarrito.removeChild(contenedorCarrito.firstChild);
	}
}

//-->Create html
function carritoHTML() {
	//Limpiando el html
	limpiarHTML();

	//Recorriendo el carrito y generando el html
	articulosCarrito.forEach((curso) => {
		const {imagen, titulo, precio, cantidad, id} = curso; //datos que traigo del objeto
		console.log(curso);
		const row = document.createElement("tr");
		row.innerHTML = `
        <td>
            <img src="${imagen}" width="100%">
        </td>
        <td>
            ${titulo}
        </td>
        <td>
            ${precio}
        </td>
        <td>
            ${cantidad}
        </td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}">X</a>
        </td>
        `;

		//Agregando el HTML del carrito en el body
		contenedorCarrito.appendChild(row);
	});

	//Agregar el carrito al storage
	sincronizarStorage();
}

function sincronizarStorage() {
	localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}
