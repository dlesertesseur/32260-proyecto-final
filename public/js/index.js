const inspectCart = async (id) => {
  location.href = `/api/carts/${id}`;
};

const removeProductsCart = async (id) => {
  await fetch(`/api/carts/${id}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
};

const addProductToCart = async (cid, pid) => {
  await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("addProductToCart -> ", data);
      if (data?.status && data?.status !== "created") {
        location.assign(`/api/carts/error/1`);
      } else {
        location.assign(`/api/carts/${cid}`);
      }
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

const removeProductCart = async (cid, pid) => {
  await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
};

const toGithubLogin = () => {
  location.replace("/api/sessions/github");
};

const toRegister = () => {
  location.replace("/api/auth/register");
};

const logout = () => {
  location.replace("/api/auth/logout");
};

const toLogin = () => {
  location.replace("/api/auth/login");
};

const toResetPassword = () => {
  location.replace("/api/auth/resetpassword");
};

const toBack = () => {
  history.back();
};

const createCart = async (uid) => {
  await fetch(`/api/users/addCart/${uid}`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
};

const changeRole = async (uid) => {
  await fetch(`/api/users/premium/${uid}`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("changeRole data -> ", data);
      if (data.status === "error") {
        location.assign(`/api/users/${uid}/uploadedDocuments`);
      } else {
        location.reload();
      }
    })
    .catch((err) => {
      console.log("changeRole err -> ", err);
    });
};

const purchase = async (cid) => {
  await fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    });
};

const deleteUser = async (uid) => {

  console.log("deleteUser urll -> ", `/api/users/${uid}`);


  await fetch(`/api/users/${uid}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      location.reload();
    })
    .catch((err) => {
      console.log("deleteUser err -> ", err);
    });
};

const uploadDocumentsPage = () => {
  location.assign("/api/users/documents");
};
