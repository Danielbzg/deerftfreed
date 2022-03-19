/* Índice
1. Constructores y arrays principales
2. DOM principal
3. Función para cambiar los productos de color
4. Agregar productos al carrito y que se registren en el storage
    4.1. Botón Suma del carrito
    4.2. Botón Resta del carrito
    4.3. Cálculo "Precio Total" del carrito
5. Desplegable del botón descripción
6. Construcción del carrito y que se puedan agregar los productos
7. Funciones del botón de pago
    7.1. Pago erróneo para cuando no hay productos añadidos
    7.2. Pago realizado para cuando hay productos añadidos
    7.3. Llamada a las funciones de pago dependiendo de cómo esté el carrito
8. Hover de los botones
9. Función para controlar cuantos productos hay en la cesta
10. Función para el cálculo total del precio de los productos que hay en el carrito
*/

/*1. Constructores y arrays principales*/
const camisetas = document.getElementById("cuerpo");
let carrito = [];

//En esta array defino los tipos de camisetas que uso//
const arrayColores = ["azul", "gris", "morada", "rosa", "verde", "naranja", "rayadanegra", "rayadablanca", "rayadarosa", "rayadaamarilla", "rayadamorada", "rayadaroja", "polorojo", "poloazul", "poloverde", "pologris", "polomostaza", "pololimon", "polomorado", "polorosa"];

const URL_Camisetas = "https://danielbzg.github.io/deerftfreed/JSON/registro.json";

const precioTotal = document.getElementById("total");

const cesta = {} /* { producto = cantidad, 10 = 1, 9 = 2 } */

/*2. DOM principal*/
$.get(URL_Camisetas, function (respuesta, estado) {
  if (estado === 'success') {
    let data = respuesta;
    for (let elemento of data) {
      /*Crear las tarjetas de cada producto con sus identificadores, nombre, id, precio y personalizarle cada botón*/
      camisetas.innerHTML += `<div class="producto${elemento.id}">
    <h2 class="estiloNombre">${elemento.nombre}</h2>
    <img class="camiseta" id="camiseta${elemento.id}" src="./src/img/camiseta${elemento.color[0]}.png" alt="">
    <div class="orgEleccion">
        <div>
        <input type="radio" id="${elemento.color[0]}" class="${elemento.color[0]}" name="estilo${elemento.id}" value="${elemento.id}" checked><label for="${elemento.color[0]}">${elemento.color[0]}</label>
        </div>
        <div>
        <input type="radio" id="${elemento.color[1]}" class="${elemento.color[1]}" name="estilo${elemento.id}" value="${elemento.id}"><label for="${elemento.color[1]}">${elemento.color[1]}</label>
        </div>
</div>
<button id="descripcion${elemento.descripcion}">descripción</button>
<p class="oculto${elemento.descripcion}">Producto de manga corta y de color ${elemento.color[0]} o ${elemento.color[1]}</p>
<button id="agregar${elemento.numero}">Agregar</button>`;
    }

/*3. Función para cambiar los productos de color*/
    function cambiarImagen(imagen, idProducto) {
      const elemento = document.getElementById("camiseta" + idProducto);
      elemento.src = imagen;
    }

    //Cambiar color de las camisetas//
    for (let c = 0; c < arrayColores.length; c++) {
      const color = arrayColores[c];
      let tipo = document.getElementsByClassName(color.toLocaleLowerCase());
      for (const elemento of tipo) {
        elemento.addEventListener("click", () => {
          cambiarImagen("./src/img/camiseta" + color + ".png", elemento.value);

        });
      }
    }

    const mensajeCarrito = document.getElementById("MensajeCarrito");

/*4. Agregar productos al carrito y que se registren en el storage*/
    for (let elemento of data) {

      let boton = $("#agregarproducto" + (elemento.id));
      boton.on('click', () => {
        //Con cada click en el botón agregar haremos varias cosas
        if (cesta[elemento.id] == null) {
          cesta[elemento.id] = 1

          //Primero cambiamos el mensaje de "Cesta vacía" por los nombres de cada apartado de los productos que agreguemos al carrito
          mensajeCarrito.innerHTML = '<div class="orgTitulosCarrito"><div>Producto</div><div>Precio</div><div>Cantidad</div><div>Total</div></div>'


          console.log($("#agregarproducto" + (elemento.id)));

          //Segundo agregamos cada producto recogiendo el valor concreto de cada elemento guardado en el JSON
          $("#carrito").append(`<div id="carritoProducto${elemento.id}" class="orgProductorCarrito"><div class="elementoCarrito">
          ${elemento.nombre}</div>
          <div class="elementoCarrito">${elemento.precio}€</div>
          <div class="elementoCarrito">
            <button id="sumatorioNeg${elemento.id}">-</button>
            <p id="value${elemento.id}" class="pruebaCantidad${elemento.id}">1</p>
            <button id="sumatorioPos${elemento.id}">+</button>
          </div>
          <div class="elementoCarrito">
            <p id="totalValue${elemento.id}">${elemento.precio}€</p>
          </div>
          </div>`);

          /*4.1. Botón Suma del carrito
          Creación de suma con cada click en el botón + de cada producto añadido al carrito*/
          let botonSuma = $("#sumatorioPos" + (elemento.id));
          botonSuma.on('click', () => {
            cesta[elemento.id] = cesta[elemento.id] + 1
            let element = document.getElementById("value" + elemento.id);
            element.innerHTML = parseInt(element.innerHTML) + 1
            document.getElementById("totalValue" + elemento.id).innerHTML = (elemento.precio * cesta[elemento.id]) + "€";
            calcTotalPrice(data); //Utilizamos la función para recalcular el valor total de la cesta
          });

          /*4.2. Botón Resta del carrito
          Creación de la resta para que con con cada click en el botón - de cada producto añadido al carrito reste una unidad, y si la cesta queda vacía que se limpie y vuelva al mensaje inicial*/
          let botonResta = $("#sumatorioNeg" + (elemento.id));
          botonResta.on('click', () => {
            let element = document.getElementById("value" + elemento.id);
            let number = parseInt(element.innerHTML)
            if (number > 1) {
              element.innerHTML = parseInt(element.innerHTML) - 1
              cesta[elemento.id] = cesta[elemento.id] - 1
              document.getElementById("totalValue" + elemento.id).innerHTML = (elemento.precio * cesta[elemento.id]) + "€";
            } else {
              cesta[elemento.id] = null
              document.getElementById("carritoProducto" + elemento.id).remove();
              if (!hasOtherProducts()) {
                console.log("Has vaciado la cesta");
                mensajeCarrito.innerHTML = '<div id="MensajeCarrito">¡La cesta está vacía!</div>';
              }
            }
            calcTotalPrice(data); //Volvemos a utilizar la función para recalcular el valor total de la cesta
          });

          //Definimos el producto para alojarlo en el storage
          let producto = {
            id: elemento.id,
            nombre: elemento.nombre,
            precio: elemento.precio
          }
          carrito.push(producto);
          console.log(carrito);
          localStorage.setItem('carrito', JSON.stringify(carrito))
        } else { /*4.3. Cálculo "Precio Total" del carrito
        Cálculo de la suma total de la cesta comprobando el valor numérico del apartado total de cada elemento añadido y lo reflejamos en el apartado "Precio Total" */
          cesta[elemento.id] = cesta[elemento.id] + 1
          document.getElementById("totalValue" + elemento.id).innerHTML = (elemento.precio * cesta[elemento.id]) + "€";
          let element = document.getElementById("value" + elemento.id);
          element.innerHTML = parseInt(element.innerHTML) + 1
        }
        calcTotalPrice(data); //Volvemos a utilizar la función para recalcular el valor total de la cesta


      });

/*5. Desplegable del botón descripción*/
      $("#descripcion" + (elemento.descripcion)).click(() => {
        $("p.oculto" + (elemento.descripcion)).toggle("1s");
      });

    };

  };

});

/*6. Construcción del carrito y que se puedan agregar los productos */
const creacionCarrito = document.getElementById("compras");

creacionCarrito.innerHTML += `
<div id="orgCarro">
  <div class="zonaCarrito">
    <h2>Carrito de compra</h2>
    <div id="carrito">
      <div id="MensajeCarrito">¡La cesta está vacía!</div>
    </div>
  </div>
  <div class="orgTotalYpago">
    <div class="estiloTotal">
      <div>Precio Total</div>
      <div id="total">No hay productos</div>
    </div>
    <button id="botonPago">Pagar</button>
  </div>
</div>`;

/*7. Funciones del botón de pago */
function pagoRealizado() {//7.1. Pago erróneo para cuando no hay productos añadidos. Este es para cuando hay productos en la cesta
  swal({
    title: "Pago realizado con éxito",
    text: "Muchas gracias por confiar y comprar con nosotros",
    icon: "success",
  });
}

function pagoErroneo() {//7.2. Pago realizado para cuando hay productos añadidos. Este para cuando no hay productos en la cesta
  swal({
    title: "No se pudo realizar el pago",
    text: "No hay productos en la cesta",
    icon: "error",
  });
}

let botonPagar = $("#botonPago");
botonPagar.on('click', () => { //7.3. Llamada a las funciones de pago dependiendo de cómo esté el carrito
  if (!hasOtherProducts()) {
    pagoErroneo();
  }
  else {
    pagoRealizado();
  }
});


$(() => {

  /*8. Hover de los botones */
  $("button").hover(
    function () {
      $(this).addClass("brillibrilli");
    },
    function () {
      $(this).removeClass("brillibrilli");
    }
  );

});

/*9. Función para controlar cuantos productos hay en la cesta */
function hasOtherProducts() {
  for (let producto in cesta) {
    if (cesta[producto] != null && cesta[producto] > 0) {
      return true;
    }
  }
  return false;
}

/*10. Función para el cálculo total del precio de los productos que hay en el carrito*/
function calcTotalPrice(data) {
  let total = 0;
  for (let producto in cesta) {
    total = total + (data[producto - 1].precio * cesta[producto])
  }
  document.getElementById("total").innerHTML = total + "€"
}







