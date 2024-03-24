async function pedirDatosAlBackend() {
    try {
        const resp = await fetch("../datos.json")
        const info = await resp.json()
        principal(info)
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            width: '',
            text: 'Algo salió mal, error: ' + error,
            icon: 'error',
            backdrop: 'rgba(0,0,123,0.4)',
            confirmButtonText: 'Aceptar'

        })
    }
}

pedirDatosAlBackend()

function principal(productos) {
    let input = document.getElementById("input")
    let inputPrecioMenor = document.getElementById("precioMenor")
    let inputPrecioMayor = document.getElementById("precioMayor")
    let categorias = obtenerDiferentesCategorias(productos)
    let ver = []
    ver[0] = document.getElementById("Procesadores-Ryzen")
    ver[1] = document.getElementById("Procesadores-Intel")
    ver[2] = document.getElementById("Memoria-Ram")
    ver[3] = document.getElementById("HDD")
    let mostrarCarrito = document.getElementById("carrito")
    mostrarCarrito.addEventListener("click", () => renderizarCarrito(productos))
    let botonBuscar = document.getElementById("botonBuscar")
    botonBuscar.addEventListener("click", () => filtrarTarjetas(input, inputPrecioMenor, inputPrecioMayor, productos))
    ver[0].addEventListener("click", () => mostrarProductosSeleccionado(productos, ver[0]))
    ver[1].addEventListener("click", () => mostrarProductosSeleccionado(productos, ver[1]))
    ver[2].addEventListener("click", () => mostrarProductosSeleccionado(productos, ver[2]))
    ver[3].addEventListener("click", () => mostrarProductosSeleccionado(productos, ver[3]))
}

function obtenerDiferentesCategorias(productos) {
    let categorias = []
    productos.forEach(producto => {
        if (!categorias.includes(producto.categoria)) {
            categorias.push(producto.categoria)
        }
    })
    return categorias
}

function obtenerProductosPorCategoria(productos, ver) {
    let productoPorCategoria = []
    productos.forEach(producto => {
        if (ver != undefined) {
            if (producto.categoria == ver.id) {
                productoPorCategoria.push(producto)
            }
        }
        else {
            productoPorCategoria.push(producto)
        }
    })
    return productoPorCategoria
}

function mostrarProductosSeleccionado(productos, ver) {
    let contenedor = document.getElementById("Productos")
    contenedor.innerHTML = ""
    obtenerProductosPorCategoria(productos, ver).forEach(({ nombre, precio, stock, id, url }) => {
        let tarjetaProd = document.createElement("div")
        tarjetaProd.className = "card"
        tarjetaProd.style = "width: 18rem; padding: 20px"

        tarjetaProd.innerHTML = `
            <img src="${url}" class="card-img-top" style="width: 90%; height: 90%;" alt="...">
            <div class="card-body">
                <h5 class="card-title text-center">${nombre}</h5>
                <h4 class="text-center">Precio: ${precio}</h4>
                <p class="text-center">Quedan ${stock} unidades</p>
                <a href="#" class="btn btn-primary container" id="${id}">Agregar</a>
            </div>
        `
        contenedor.append(tarjetaProd)
        let botonAgregarAlCarrito = document.getElementById(id)
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarAlCarrito(e, productos))
    })
}

function agregarAlCarrito(e, productos) {
    let carrito = obtenerCarrito()
    let idBotonProducto = Number(e.target.id)
    let productoBuscado = productos.find(({ id }) => id === idBotonProducto)
    let { id, nombre, precio, stock, url } = productoBuscado
    let productoEnCarrito = carrito.find(({ id }) => id === idBotonProducto)

    if (stock > 0) {
        if (productoEnCarrito) {
            if (stock > productoEnCarrito.unidades) {
                productoEnCarrito.unidades++
                productoEnCarrito.subtotal = productoEnCarrito.precioUnitario * productoEnCarrito.unidades
                lanzarTostada()
            }
            if (productoEnCarrito.unidades == productoBuscado.stock) {
                Swal.fire({
                    title: 'Error!',
                    width: '',
                    text: 'No quedan más unidades de este producto',
                    icon: 'warning',
                    backdrop: 'rgba(0,0,123,0.4)',
                    confirmButtonText: 'Aceptar'
                })
            }
        } else {
            lanzarTostada()
            carrito.push({
                id: id,
                nombre: nombre,
                precioUnitario: precio,
                unidades: 1,
                subtotal: precio,
                url: url
            })
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }

}
function lanzarTostada() {
    Toastify({
        text: "Prodcuto agregado",
        duration: 3000,
        gravity: "bottom",
        style: {
            background: "linear-gradient(to right, #5a5bf3, #91e7d9 )",
        }
    }).showToast();
}
function renderizarCarrito(productos) {
    let carrito = obtenerCarrito()
    let btnComprar = document.getElementById("filtrado")
    btnComprar.innerHTML = ""

    btnComprar.innerHTML = `
        <button id="botonVaciar" class="btn btn-primary"> Vaciar Carrito </button>
        <button id="botonComprar" class="btn btn-primary"> COMPRAR </button>
    `
    let vaciarCarrito = document.getElementById("botonVaciar")
    vaciarCarrito.addEventListener("click", funcionVaciarCarrito)
    let finalizarCompra = document.getElementById("botonComprar")
    finalizarCompra.addEventListener("click", () => finalizarCompras(productos))

    let contenedor = document.getElementById("Productos")
    contenedor.innerHTML = ""
    
    carrito.forEach(({ nombre, subtotal, unidades, id, url }) => {
        if (unidades != 0) {
            let tarjetaProd = document.createElement("div")
            tarjetaProd.className = "card"
            tarjetaProd.style = "width: 18rem; padding: 20px"

            tarjetaProd.innerHTML = `
            <img src="${url}" class="card-img-top" style="width: 90%; height: 90%;" alt="...">
            <div class="card-body">
                <h5 class="card-title text-center">${nombre}</h5>
                <h4 class="text-center">Precio: ${subtotal}</h4>
                <p class="text-center">Reservaste ${unidades} unidades</p>
                <a href="#" class="btn btn-primary container" id="${id}">Quitar 1 unidad</a>
            </div>
        `
            contenedor.append(tarjetaProd)
            let botonQuitarAlCarrito = document.getElementById(id)
            botonQuitarAlCarrito.addEventListener("click", quitarAlCarrito)
        }
    })

    if (contenedor.innerHTML == "") {
        contenedor.innerHTML = `
            <h5 class="card-title text-center">Su carrito esta vacio</h5>
            <p class="text-center">Para seguir eligiendo nuestros productos, navegar entre las diferentes categorias</p>
        `
    }
}
function funcionVaciarCarrito() {
    localStorage.removeItem("carrito")
    renderizarCarrito()
}
function finalizarCompras() {
    let carrito = obtenerCarrito()
    let total = 0
    let items = ""
    carrito.forEach(({ nombre, subtotal, unidades }) => {
        if (unidades != 0) {
            total = total + subtotal
            items = items + nombre + ' x' + unidades + '\n'

            Swal.fire({
                title: items,
                text: "TOTAL: " + total,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Finalizar Compra"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Compra Realizada",
                        width: 400,
                        icon: "success",
                        padding: "3em",
                        color: "#716add",
                        backdrop: `
                        rgba(0,0,123,0.4)
                        url("/images/nyan-cat.gif")
                        left top
                        no-repeat
                    `
                    });
                    localStorage.removeItem("carrito")
                    renderizarCarrito()
                }
            });
        }
    })
}

function quitarAlCarrito(e) {
    let carrito = obtenerCarrito()
    let idBotonProducto = Number(e.target.id)
    let productoEnCarrito = carrito.find(({ id }) => id === idBotonProducto)
    if ((e.target.id == productoEnCarrito.id) & (productoEnCarrito.unidades > 0)) {
        productoEnCarrito.unidades--
        productoEnCarrito.subtotal = productoEnCarrito.subtotal - productoEnCarrito.precioUnitario
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    renderizarCarrito()
}

function obtenerCarrito() {
    return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
}

function filtrarTarjetas(inputNombre, inputPrecioMenor, inputPrecioMayor, productos) {
    let productosFiltrados
    if (inputNombre.value && (!inputPrecioMenor.value && !inputPrecioMayor.value)) {
        productosFiltrados = productos.filter(producto => producto.nombre.toUpperCase().includes(inputNombre.value.toUpperCase()))
    } else if (!inputNombre.value && (inputPrecioMenor.value && inputPrecioMayor.value)) {
        productosFiltrados = productos.filter(producto => producto.precio >= Number(inputPrecioMenor.value) && producto.precio <= Number(inputPrecioMayor.value))
    } else if (inputNombre.value && inputPrecioMenor.value && inputPrecioMayor.value) {
        productosFiltrados = productos.filter(producto => producto.nombre.toUpperCase().includes(inputNombre.value.toUpperCase()) && producto.precio >= Number(inputPrecioMenor.value) && producto.precio <= Number(inputPrecioMayor.value))
    }
    mostrarProductosSeleccionado(productosFiltrados)
}