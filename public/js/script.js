// document.querySelector('.btn-pago-mp').addEventListener('click', async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch('/create-order', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         // enviar datos si hiciera falta
//         email: document.getElementById("email").textContent,
//         nombre: document.getElementById("nombre").textContent,
//         fecha: document.getElementById("fecha").textContent,
//         hora: document.getElementById("hora").textContent
//       }),
//     });
//     const data = await response.json();
//     // redirigir a MP:
//     window.location.href = data.init_point;
//   } catch (error) {
//     console.error(error);
//   }
// });