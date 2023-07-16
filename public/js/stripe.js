let stripe;
let elements;
document.addEventListener("DOMContentLoaded", (event) => {
  fetch("/api/carts/stripe-token")
    .then((result) => result.json())
    .then((data) => {
      stripe = Stripe(data.payload);
      elements = stripe.elements();
      card = elements.create("card");
      card.mount("#card-element");
    });
});

const backHome = () => {
  location.href = `/api/products/list`;
};

const purchaseProducts = async (cid) => {

  document.getElementById("msgPanel").innerHTML = "Procesando transacción";

  await fetch(`/api/carts/${cid}/purchaseProducts`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.status === "success") {
        stripe.confirmCardPayment(res.payload.client_secret, {
            payment_method: {
              card: card,
              billing_details: {
                name: res.payload.purchaser,
              },
            },
          })
          .then((result) => {
            if (result.error) {
                document.getElementById("errorPanel").innerHTML = result.error.message;
            } else {
              if (result.paymentIntent.status === "succeeded") {
                confirmPurchase(cid);
              }
            }
          });
      } else {
        document.getElementById("msgPanel").innerHTML = "";
        document.getElementById("errorPanel").innerHTML = res.status;
      }
    })
    .catch((err) => {
      document.getElementById("msgPanel").innerHTML = "";
      document.getElementById("errorPanel").innerHTML = res.status;
    });
};

const confirmPurchase = async (cid) => {
  await fetch(`/api/carts/${cid}/confirmPurchase`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode !== 200) {
        document.getElementById("msgPanel").innerHTML = "";
        document.getElementById("errorPanel").innerHTML = data.message;
      } else {
        document.getElementById("msgPanel").innerHTML = "";
        swal({
          title: "La compra fue realizada con éxito",
          text: "Se envio un mail con el detalle de la transaccion.",
          icon: "success",
        }).then((value) => {
          backHome();
        });
      }
    })
    .catch((err) => {
      console.log("error -> ", err.message);
      document.getElementById("msgPanel").innerHTML = "";
      document.getElementById("errorPanel").innerHTML = err.message;
    });
};
