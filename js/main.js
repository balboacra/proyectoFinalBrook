// Constantes y variables

const URL = '../json/objetos.json'
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const contadorCarrito = document.getElementById('contador-carrito');
const confirmarCompra = document.getElementById('confirmar-compra');
const producto = document.getElementById('filtro-estilo');
let carrito = {}

// Eventos

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        renderCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

confirmarCompra.addEventListener('click', e => {
    if (templateCarrito.querySelector("th").textContent = ``) {
        Swal.fire({
            title: 'Necesitas comprar algo',
            text: 'Sin cerveza el mundo es triste',
            imageUrl: '../img/Brindis-cerveza.jpg',
            imageAlt: 'Cervezas',
        })
    } else {
        Swal.fire({
            title: 'Redireccionando',
            text: 'Estás a un paso de ser feliz!',
            imageUrl: '../img/Brindis-cerveza.jpg',
            imageAlt: 'Cervezas',
        })
    }
})

// Fetch

const fetchData = async () => {
    try {
        const res = await fetch(URL)
        const data = await res.json()
        renderCards(data)
    } catch (err) {
        console.log(err);
    }
}


// Mostrar Productos

const renderCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h3').textContent = producto.pack
        templateCard.querySelector('h4').textContent = producto.estilo
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        Toastify({
            text: "Has agregado un producto al carrito",
            duration: 2000,
            style: {
                background: "linear-gradient(to right, #F2A01E , #C15901)",
            },
        }).showToast();
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        pack: objeto.querySelector('h3').textContent,
        estilo: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1,
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    renderCarrito()
}

// Mostrar Carrito

const renderCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.estilo
        templateCarrito.querySelectorAll('td')[0].textContent = producto.pack
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    renderFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}


// Footer del carrito

const renderFooter = () => {
    footer.innerText = ``

    const sumaCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const sumaPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = sumaCantidad
    templateFooter.querySelector('span').textContent = sumaPrecio

    contadorCarrito.innerText = sumaCantidad

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    // Vaciado de carrito

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        Swal.fire({
            title: 'Está seguro que desea vaciar su carrito?',
            text: "No puede revertir esta acción!",
            icon: 'Advertencia',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, vaciarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado!',
                    'Su carrito esta vacío!',
                    'Vaciado con éxito!',
                )
                renderCarrito()
            }
        })
    })
}

// Aumentar y disminuir cantidades en carrito

const btnAccion = e => {
    console.log(e.target);
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        renderCarrito()
        Toastify({
            text: "Has agregado un producto al carrito",
            duration: 2000,
            style: {
                background: "linear-gradient(to right, #F2A01E , #C15901)",
            },
        }).showToast();
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        renderCarrito()
        Toastify({
            text: "Has eliminado un producto del carrito",
            duration: 2000,
            style: {
                background: "linear-gradient(to right, #721414, #000000)",
            },
        }).showToast();
    }
    e.stopPropagation()
}


