// Llenar el array departamentos con llamada ajax
let departamentos = [];
$(() => {
  $.getJSON("data/deptos.json", (respuesta) => {
    departamentos = respuesta;
  });
});
let listaFiltrada6 = [];

//guardar en el storage
function guardar() {
  let emailIngresado = document.getElementById("email").value;
  let nombreIngresado = document.getElementById("nombre").value;
  if (emailIngresado == "" || nombreIngresado == "") {
    alert("Debes completar ambos campos");
  } else if (emailIngresado != "" && nombreIngresado != "") {
    localStorage.setItem("nombre", document.getElementById("nombre").value);
    localStorage.setItem("email", document.getElementById("email").value);
    localStorage.setItem("recibir", document.getElementById("tick").checked);
    //recibir informacion del storage
    if (JSON.parse(localStorage.getItem("recibir"))) {
      let infoName = localStorage.getItem("nombre");
      $("#felicitaciones").empty();
      $("#felicitaciones").append(`
              <h3 class="text-center"> Te has suscrito ${infoName}</h3>
              <p class ="text-center"> En breve estaras recibiendo nuestras novedades</p>`);
    }
  }
}
document.getElementById("enviar").addEventListener("click", guardar);

// ----------------------------------------------------------------------------------------
// Generacion de salida por DOM
function generarSalida(elemento) {
  for (const each of elemento) {
    $("#mainContent").append(`
                <div class="containerItem border border-dark mb-3">
                  <div class="containerImage">
                    <img class="image" src=${each.foto} alt ="${each.id}" width="450px" height:"250px">
                  </div>
                  <div class="d-flex flex-column containerInfo">
                    <div class="d-flex justify-content-around">
                      <span class="h3">$${each.precio}</span>
                      <h5 class="h3">Depto en ${each.ubicacion}</h5>
                    </div>
                    <div class="d-flex justify-content-around">
                      <p class="">${each.ambiente} amb</p>
                      <p class="">${each.superficie}m<sup>2</sup></p>
                      <p class="">${each.antiguedad} años</p>
                    </div>
                    <div class="d-block">
                      <p class="">Tipo de anunciante: ${each.anunciante}</p>
                    </div>
                    <div>
                      <button id="depto${each.id}" value="${each.id}" data-toggle="modal" data-target="#exampleModal" class="btn btn-danger contactar">Contactar</button> 
                    </div>
                  </div>
                </div>`);
    let id = each.id;
    $("#depto" + id).click(seleccionarDepto);
  }
  animacion();
}

//Animar salida
function animacion() {
  $("#mainContent").hide().slideDown(1000);
}

//------------------------------------------------------------------------------------------

// Boton Ver Todos
function verTodos() {
  $("#mainContent").empty();
  generarSalida(departamentos);
  listaFiltrada6 = departamentos;
}
$("#verTodos").click(verTodos);

//-----------------------------------------------------------------------------
// Seleccionar depto con boton contactar

function seleccionarDepto() {
  let value = this.value;
  let found = departamentos.find((element) => element.id == value);
  $("#notificacion").append(`
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Contactar al Dueño</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="nombreUsuario" class="col-form-label">Nombre:</label>
              <input type="text" class="form-control" id="nombreUsuario">
            </div>
            <div class="form-group">
              <label for="emailUsuario" class="col-form-label">E-mail:</label>
              <input type="email" class="form-control" id="emailUsuario">
            </div>
            <div class="form-group">
              <label for="mensajeTexto" class="col-form-label">Mensaje:</label>
              <textarea class="form-control" id="mensajeTexto" rows="5">Hola, quisiera recibir mas informacion sobre el departamento ubicado en ${found.ubicacion} de ${found.ambiente} ambientes. Muchas gracias.</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" id="enviarMensaje" data-toggle="modal" data-target="#exampleModalCenter">Enviar Mensaje</button>
        </div>
      </div>
    </div>
  </div>
  `);
  $("#enviarMensaje").click(mensajeEnviado);
}

function mensajeEnviado() {
  if ($("#nombreUsuario").val() === "" || $("#emailUsuario").val() === "") {
    alert("Debes completar ambos campos");
    $("#enviarMensaje").removeAttr("data-dismiss");
  } else if ($("#nombreUsuario").val() != "" && $("#emailUsuario").val() != "") {
    $("#notificacion").append(`
          <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Mensaje Enviado</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>En breve recibiras una respuesta del propietario</p>
                </div>
              </div>
            </div>
          </div>
          `);
    $("#enviarMensaje").attr("data-dismiss", "modal");
  }
}

//Filtros----------------------------------------------------------------------------------

// Filtrar por Ubicacion
function filtrarUbicacion() {
  let inputs = $(".ubicacion");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }
  let listaUbicacion = departamentos.filter((x) =>
    checkboxsChecked.includes(x.ubicacion)
  );
  $("#mainContent").empty();
  generarSalida(listaUbicacion);
  listaFiltrada6 = listaUbicacion;
}
$("#btnAplicar1").on("click", filtrarUbicacion);

//Filtrar por Ambientes
function filtrarAmbientes() {
  let inputs = $(".ambiente");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }
  let listaAmbiente = departamentos.filter((x) =>
    checkboxsChecked.includes(x.ambiente)
  );
  $("#mainContent").empty();
  generarSalida(listaAmbiente);
  listaFiltrada6 = listaAmbiente;
}
$("#btnAplicar2").on("click", filtrarAmbientes);

// Filtrar por Superficie
function compararSuperficie(valor, id) {
  if (id.includes("supe1")) {
    return valor <= 40;
  } else if (id.includes("supe2")) {
    return valor > 40 && valor <= 60;
  } else if (id.includes("supe3")) {
    return valor > 60;
  }
}
function filtrarSuperficie() {
  let inputs = $(".superficie");
  let checkboxsChecked = [];
  for (const input of inputs) {
    if (input.checked) {
      checkboxsChecked.push(input.id);
    }
  }
  let listaSuperficie = departamentos.filter((x) =>
    compararSuperficie(x.superficie, checkboxsChecked)
  );
  $("#mainContent").empty();
  generarSalida(listaSuperficie);
  listaFiltrada6 = listaSuperficie;
}
$("#btnAplicar3").on("click", filtrarSuperficie);

// Filtrar por Antiguedad
function compararAntiguedad(valor, id) {
  if (id.includes("anti1")) {
    return valor == "0";
  } else if (id.includes("anti2")) {
    return valor <= 15 && valor > 1;
  } else if (id.includes("anti3")) {
    return valor <= 40 && valor > 15;
  } else if (id.includes("anti4")) {
    return valor <= 60 && valor > 40;
  } else if (id.includes("anti5")) {
    return valor > 60;
  }
}
function filtrarAntiguedad() {
  let inputs = $(".antiguedad");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }
  let listaAntiguedad = departamentos.filter((x) =>
    compararAntiguedad(x.antiguedad, checkboxsChecked)
  );
  $("#mainContent").empty();
  generarSalida(listaAntiguedad);
  listaFiltrada6 = listaAntiguedad;
}
$("#btnAplicar4").on("click", filtrarAntiguedad);

// Filtrar por Precio
function compararPrecio(valor, id) {
  if (id.includes("prec1")) {
    return valor <= 20000;
  } else if (id.includes("prec2")) {
    return valor <= 30000 && valor > 20000;
  } else if (id.includes("prec3")) {
    return valor <= 40000 && valor > 30000;
  } else if (id.includes("prec4")) {
    return valor > 40000;
  }
}

function filtrarPrecio() {
  let inputs = $(".precio");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }
  let listaPrecio = departamentos.filter((x) =>
    compararPrecio(x.precio, checkboxsChecked)
  );
  $("#mainContent").empty();
  generarSalida(listaPrecio);
  listaFiltrada6 = listaPrecio;
}
$("#btnAplicar5").on("click", filtrarPrecio);

// Filtrar por Anunciante
function filtrarAnunciante() {
  let inputs = $(".anunciante");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }
  let listaAnunciante = departamentos.filter((x) =>
    checkboxsChecked.includes(x.anunciante)
  );
  $("#mainContent").empty();
  generarSalida(listaAnunciante);
  listaFiltrada6 = listaAnunciante;
}
$("#btnAplicar6").on("click", filtrarAnunciante);

//filtrar TODOS! -------------------------------------------------------------

function aplicarTodos() {
  let inputs = $("input");
  let checkboxsChecked = [];
  for (const elementoHTML of inputs) {
    if (elementoHTML.checked) {
      checkboxsChecked.push(elementoHTML.id);
    }
  }

  //ubicacion

  let listaFiltrada1 = departamentos.filter((x) =>
    checkboxsChecked.includes(x.ubicacion)
  );

  // Ambientes

  let listaFiltrada2 = [];
  if (listaFiltrada1.length == "0") {
    listaFiltrada2 = departamentos.filter((x) =>
      checkboxsChecked.includes(x.ambiente)
    );
  } else if (listaFiltrada1.length != "0") {
    listaFiltrada2 = listaFiltrada1.filter((x) =>
      checkboxsChecked.includes(x.ambiente)
    );
  }
  if (!$(".ambiente").is(":checked")) {
    listaFiltrada2 = listaFiltrada1;
  }

  //Superficie

  let listaFiltrada3 = [];
  if (listaFiltrada1.length == "0" && listaFiltrada2.length == "0") {
    listaFiltrada3 = departamentos.filter((x) =>
      compararSuperficie(x.superficie, checkboxsChecked)
    );
  } else if (listaFiltrada1.length != "0" && listaFiltrada2.length == "0") {
    listaFiltrada3 = listaFiltrada1.filter((x) =>
      compararSuperficie(x.superficie, checkboxsChecked)
    );
  } else if (
    (listaFiltrada1.length == "0" && listaFiltrada2.length != "0") ||
    (listaFiltrada1.length != "0" && listaFiltrada2.length != "0")
  ) {
    listaFiltrada3 = listaFiltrada2.filter((x) =>
      compararSuperficie(x.superficie, checkboxsChecked)
    );
  }
  if (!$(".superficie").is(":checked")) {
    listaFiltrada3 = listaFiltrada2;
  }

  //Antiguedad

  let listaFiltrada4 = [];
  if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0"
  ) {
    listaFiltrada4 = departamentos.filter((x) =>
      compararAntiguedad(x.antiguedad, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0"
  ) {
    listaFiltrada4 = listaFiltrada1.filter((x) =>
      compararAntiguedad(x.antiguedad, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0"
  ) {
    listaFiltrada4 = listaFiltrada2.filter((x) =>
      compararAntiguedad(x.antiguedad, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0"
  ) {
    listaFiltrada4 = listaFiltrada2.filter((x) =>
      compararAntiguedad(x.antiguedad, checkboxsChecked)
    );
  } else if (
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0")
  ) {
    listaFiltrada4 = listaFiltrada3.filter((x) =>
      compararAntiguedad(x.antiguedad, checkboxsChecked)
    );
  }
  if (!$(".antiguedad").is(":checked")) {
    listaFiltrada4 = listaFiltrada3;
  }

  //Precio

  let listaFiltrada5 = [];
  if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = departamentos.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada3.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada2.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada3.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada1.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada3.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada2.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0"
  ) {
    listaFiltrada5 = listaFiltrada3.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  } else if (
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0")
  ) {
    listaFiltrada5 = listaFiltrada4.filter((x) =>
      compararPrecio(x.precio, checkboxsChecked)
    );
  }
  if (!$(".precio").is(":checked")) {
    listaFiltrada5 = listaFiltrada4;
  }

  // Anunciante

  // let listaFiltrada6 = [];
  if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = departamentos.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada3.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada2.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada3.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada1.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada3.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada2.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length == "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada3.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length == "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length == "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length == "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    listaFiltrada1.length != "0" &&
    listaFiltrada2.length != "0" &&
    listaFiltrada3.length != "0" &&
    listaFiltrada4.length != "0" &&
    listaFiltrada5.length == "0"
  ) {
    listaFiltrada6 = listaFiltrada4.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  } else if (
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length == "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length == "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length == "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length == "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0") ||
    (listaFiltrada1.length != "0" &&
      listaFiltrada2.length != "0" &&
      listaFiltrada3.length != "0" &&
      listaFiltrada4.length != "0" &&
      listaFiltrada5.length != "0")
  ) {
    listaFiltrada6 = listaFiltrada5.filter((x) =>
      checkboxsChecked.includes(x.anunciante)
    );
  }
  if (!$(".anunciante").is(":checked")) {
    listaFiltrada6 = listaFiltrada5;
  }

  //renderizar
  $("#mainContent").empty();
  generarSalida(listaFiltrada6);

  if (listaFiltrada6.length == 0) {
    $("#mainContent").append(
      `<h2>No existen departamentos con las características solicitadas</h2>`
    );
  }
  return listaFiltrada6;
}
$("#btnAplicarTodos").on("click", aplicarTodos);

//----------------------------------------------------------------------------------------
//Ordenar


function ordenarUbicacion() {
  $("#mainContent").empty();
  generarSalida(
    listaFiltrada6.sort((a, b) => a.ubicacion.localeCompare(b.ubicacion))
    );
}
$("#porUbic").on("click", ordenarUbicacion);


function ordenarPrecio() {
  $("#mainContent").empty();
  generarSalida(listaFiltrada6.sort((a, b) => b.precio - a.precio));
}
$("#porPrec").on("click", ordenarPrecio);

function ordenarAmbiente() {
  $("#mainContent").empty();
  generarSalida(listaFiltrada6.sort((a, b) => a.ambiente - b.ambiente));
}
$("#porAmbi").on("click", ordenarAmbiente);

function ordenarSuperficie() {
  $("#mainContent").empty();
  generarSalida(listaFiltrada6.sort((a, b) => a.superficie - b.superficie));
}
$("#porSupe").on("click", ordenarSuperficie);
