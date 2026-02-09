// ===== USUARIO SIMULADO =====
const usuarioAdmin = {
  user: "admin",
  pass: "1234"
};

// ===== DATOS DEL SISTEMA =====
let saldo = JSON.parse(localStorage.getItem("saldo")) || 500;
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// ===== ELEMENTOS =====
const loginPanel = document.getElementById("loginPanel");
const sistemaPanel = document.getElementById("sistemaPanel");
const saldoEl = document.getElementById("saldo");
const historialEl = document.getElementById("historial");
const historialBox = document.getElementById("historialBox");
const formRecarga = document.getElementById("formRecarga");

// BOTONES
const btnLogin = document.getElementById("btnLogin");
const btnSaldo = document.getElementById("btnSaldo");
const btnRecarga = document.getElementById("btnRecarga");
const btnAgregarSaldo = document.getElementById("btnAgregarSaldo");
const btnHistorial = document.getElementById("btnHistorial");
const btnSalir = document.getElementById("btnSalir");
const btnConfirmar = document.getElementById("confirmar");
const btnCancelar = document.getElementById("cancelar");

// ===== PLANES DESDE JSON SIMULADO =====
fetch("planes.json")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("monto");
    data.forEach(plan => {
      const option = document.createElement("option");
      option.value = plan.monto;
      option.textContent = `$${plan.monto} + Bonus $${plan.bonus}`;
      select.appendChild(option);
    });
  });

// ===== FUNCIONES =====
function actualizarSaldo() {
  saldoEl.textContent = "$" + saldo.toFixed(2);
  localStorage.setItem("saldo", JSON.stringify(saldo));
}

function guardarHistorial() {
  localStorage.setItem("historial", JSON.stringify(historial));
}

function validarNumero(numero) {
  return /^\d{10}$/.test(numero);
}

// ===== LOGIN =====
btnLogin.addEventListener("click", () => {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;

  if (u === usuarioAdmin.user && p === usuarioAdmin.pass) {
    loginPanel.classList.add("d-none");
    sistemaPanel.classList.remove("d-none");
    actualizarSaldo();
  } else {
    Swal.fire("Error", "Credenciales incorrectas", "error");
  }
});

// ===== AGREGAR SALDO =====
btnAgregarSaldo.addEventListener("click", () => {
  Swal.fire({
    title: "Agregar saldo",
    input: "number",
    inputLabel: "Monto a ingresar",
    showCancelButton: true
  }).then(result => {
    if (result.isConfirmed) {
      saldo += parseInt(result.value);
      historial.push({
        tipo: "Ingreso",
        monto: result.value,
        numero: "-",
        fecha: new Date().toLocaleString()
      });
      guardarHistorial();
      actualizarSaldo();
      Swal.fire("Listo", "Saldo agregado", "success");
    }
  });
});

// ===== RECARGA =====
btnRecarga.addEventListener("click", () => {
  formRecarga.classList.remove("d-none");
});

btnCancelar.addEventListener("click", () => {
  formRecarga.classList.add("d-none");
});

btnConfirmar.addEventListener("click", () => {
  const monto = parseInt(document.getElementById("monto").value);
  const numero = document.getElementById("numero").value.trim();

  if (!validarNumero(numero)) {
    Swal.fire("Error", "Número inválido", "error");
    return;
  }

  if (saldo < monto) {
    Swal.fire("Error", "Saldo insuficiente", "error");
    return;
  }

  saldo -= monto;

  historial.push({
    tipo: "Recarga",
    monto,
    numero,
    fecha: new Date().toLocaleString()
  });

  guardarHistorial();
  actualizarSaldo();
  formRecarga.classList.add("d-none");

  Swal.fire("Éxito", "Recarga realizada", "success");
});

// ===== HISTORIAL =====
btnHistorial.addEventListener("click", () => {
  historialBox.classList.remove("d-none");
  historialEl.innerHTML = "";

  historial.forEach(h => {
    historialEl.innerHTML += `
      <tr>
        <td>${h.fecha}</td>
        <td>${h.tipo}</td>
        <td>$${h.monto}</td>
        <td>${h.numero}</td>
      </tr>
    `;
  });
});

// ===== SALIR =====
btnSalir.addEventListener("click", () => location.reload());
