function obtenerProductos() {
    return [
        { id: 1, nombre: "Ryzen 3", categoria: "Procesadores-Ryzen", stock: 10, precio: 30000, url: "../images/Ryzen3.jpeg" },
        { id: 3, nombre: "Ryzen 5", categoria: "Procesadores-Ryzen", stock: 8, precio: 50000, url: "../images/Ryzen5.jpg" },
        { id: 5, nombre: "Ryzen 7", categoria: "Procesadores-Ryzen", stock: 5, precio: 70000, url: "../images/Ryzen7.jfif" },
        { id: 7, nombre: "Kingston 8gb", categoria: "Memoria-Ram", stock: 10, precio: 8000, url: "../images/Ram8.jpg" },
        { id: 9, nombre: "Kingston 16gb", categoria: "Memoria-Ram", stock: 8, precio: 16000, url: "../images/Ram16.jfif" },
        { id: 11, nombre: "Kingston 32gb", categoria: "Memoria-Ram", stock: 5, precio: 32000, url: "../images/Ram32.jpg" },
        { id: 13, nombre: "Disco Duro 500gb", categoria: "HDD", stock: 10, precio: 5000, url: "../images/HDD500.jfif" },
        { id: 15, nombre: "Disco Duro 1TB", categoria: "HDD", stock: 8, precio: 10000, url: "../images/HDD1TB.jfif" },
        { id: 17, nombre: "Disco Duro 2TB", categoria: "HDD", stock: 5, precio: 20000, url: "../images/HDD2TB.jpeg" },
        { id: 19, nombre: "Intel i3", categoria: "Procesadores-Intel", stock: 10, precio: 30000, url: "../images/Intel3.jfif" },
        { id: 21, nombre: "Intel i5", categoria: "Procesadores-Intel", stock: 8, precio: 50000, url: "../images/Intel5.jpg" },
        { id: 23, nombre: "Intel i7", categoria: "Procesadores-Intel", stock: 5, precio: 70000, url: "../images/Intel7.jpg" }
    ]
}
principal()
function principal() {
    let productos = obtenerProductos()
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
    mostrarCarrito.addEventListener("click", renderizarCarrito)
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
        botonAgregarAlCarrito.addEventListener("click", agregarAlCarrito)
    })
}

function agregarAlCarrito(e) {
    let carrito = obtenerCarrito()
    let idBotonProducto = Number(e.target.id)
    let productoBuscado = obtenerProductos().find(({ id }) => id === idBotonProducto)
    let { id, nombre, precio, stock, url } = productoBuscado
    let productoEnCarrito = carrito.find(({ id }) => id === idBotonProducto)

    if (stock > 0) {
        productoBuscado.stock--
        if (productoEnCarrito) {
            if (stock > productoEnCarrito.unidades) {
                productoEnCarrito.unidades++
                productoEnCarrito.subtotal = productoEnCarrito.precioUnitario * productoEnCarrito.unidades
            }
        } else {
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
    } else {
        alert("No quedan más unidades del producto")
    }
}
function renderizarCarrito() {
    console.log(obtenerCarrito())
    let carrito = obtenerCarrito()
    let btnComprar = document.getElementById("filtrado")
    btnComprar.innerHTML = ""
    btnComprar.innerHTML = `
        <button id="botonComprar" class="btn btn-primary"> COMPRAR </button>
    `
    let finalizarCompra = document.getElementById("botonComprar")
    finalizarCompra.addEventListener("click", finalizarCompras)

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
}

function finalizarCompras() {
    alert("Muchas gracias por su compra")
    localStorage.removeItem("carrito")
    renderizarCarrito()
}

function quitarAlCarrito(e) {
    let carrito = obtenerCarrito()
    let idBotonProducto = Number(e.target.id)
    let productoEnCarrito = carrito.find(({ id }) => id === idBotonProducto)

    if ((e.target.id == productoEnCarrito.id) & (productoEnCarrito.unidades > 0)) {
        productoEnCarrito.unidades--
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
        productosFiltrados = productos.filter(producto => producto.nombre.includes(inputNombre.value))
    } else if (!inputNombre.value && (inputPrecioMenor.value && inputPrecioMayor.value)) {
        productosFiltrados = productos.filter(producto => producto.precio >= Number(inputPrecioMenor.value) && producto.precio <= Number(inputPrecioMayor.value))
    } else if (inputNombre.value && inputPrecioMenor.value && inputPrecioMayor.value) {
        productosFiltrados = productos.filter(producto => producto.nombre.includes(inputNombre.value) && producto.precio >= Number(inputPrecioMenor.value) && producto.precio <= Number(inputPrecioMayor.value))
    }
    mostrarProductosSeleccionado(productosFiltrados)
}