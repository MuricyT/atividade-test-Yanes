let clientes = [];
let pets = [];
let produtos = [];
let carrinho = [];


let clienteVipAtivo = false;

// CLIENTE

function criarCliente() {
  let nome = clienteNome.value.trim();
  let email = clienteEmail.value.trim();
  let vip = clienteVip.checked;

  if (nome === "") {
    alert("Nome inválido");
    return;
  }

  if (!email.includes("@")) {
    alert("Email inválido");
    return;
  }

  clientes.push({ nome, email, vip });
  if (vip) {
    clienteVipAtivo = true;
  }
  clienteNome.value = "";
  clienteEmail.value = "";
  clienteVip.checked = false;

  renderClientes();
}

function renderClientes() {
  listaClientes.innerHTML = "";

  clientes.forEach((c) => {
    let li = document.createElement("li");
    li.innerText = c.nome + " - " + c.email + (c.vip ? " ⭐VIP" : "");
    listaClientes.appendChild(li);
  });
}

// PET

function cadastrarPet() {
  let nome = petNome.value.trim();
  let tipo = petTipo.value.trim();
  let idade = parseInt(petIdade.value);

  if (nome === "") {
    alert("Pet precisa de nome");
    return;
  }

  if (tipo === "") {
    alert("Pet precisa de tipo");
    return;
  }

  if (isNaN(idade) || idade < 0) {
    alert("Idade inválida");
    return;
  }

  pets.push({ nome, tipo, idade });

  petNome.value = "";
  petTipo.value = "";
  petIdade.value = "";

  renderPets();
}

function renderPets() {
  listaPets.innerHTML = "";

  pets.forEach((p) => {
    let li = document.createElement("li");
    li.innerText = p.nome + " (" + p.tipo + ") - " + p.idade + " anos";
    listaPets.appendChild(li);
  });
}

// PRODUTOS

function criarProduto() {
  let nome = produtoNome.value.trim();
  let preco = parseFloat(produtoPreco.value);

  if (nome === "") {
    alert("Produto precisa de nome");
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Preço inválido");
    return;
  }

  produtos.push({ nome, preco });

  produtoNome.value = "";
  produtoPreco.value = "";

  renderProdutos();
}

function renderProdutos() {
  listaProdutos.innerHTML = "";
  produtoSelect.innerHTML = "";

  produtos.forEach((p, i) => {
    let li = document.createElement("li");
    li.innerText = p.nome + " - R$ " + p.preco.toFixed(2);
    listaProdutos.appendChild(li);

    let op = document.createElement("option");
    op.value = i;
    op.innerText = p.nome + " - R$ " + p.preco.toFixed(2);
    produtoSelect.appendChild(op);
  });
}

// CARRINHO

function adicionarCarrinho() {
  if (produtos.length === 0) {
    alert("Nenhum produto cadastrado");
    return;
  }

  let index = produtoSelect.value;
  let p = produtos[index];

  if (!p) {
    alert("Selecione um produto");
    return;
  }

  carrinho.push(p);

  renderCarrinho();
}

function removerCarrinho() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  let index = produtoSelect.value;
  let p = produtos[index];

  if (!p) {
    alert("Selecione um produto");
    return;
  }

  let pos = carrinho.indexOf(p);

  if (pos === -1) {
    alert("Produto não está no carrinho");
    return;
  }

  carrinho.splice(pos, 1);

  renderCarrinho();
}

function renderCarrinho() {
  listaCarrinho.innerHTML = "";

  carrinho.forEach((p) => {
    let li = document.createElement("li");
    li.innerText = p.nome + " - R$ " + p.preco.toFixed(2);
    listaCarrinho.appendChild(li);
  });

  calcularTotal();
}

// TOTAL

function calcularTotal() {
  let total = 0;

  carrinho.forEach((p) => {
    total += p.preco;
  });

  if (clienteVipAtivo) {
    total *= 0.85;
  } else if (total > 100) {
    total *= 0.9;
  }

  total = total.toFixed(2);

  document.getElementById("total").innerText = total;

  return total;
}

// FINALIZAR

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  alert("Compra finalizada: R$ " + calcularTotal());

  carrinho = [];
  clienteVipAtivo = false;

  renderCarrinho();
}

// CARROSSEL

let slideIndex = 0;

function nextSlide() {
  slideIndex++;
  updateSlide();
}

function prevSlide() {
  slideIndex--;
  updateSlide();
}

function updateSlide() {
  const slides = document.querySelector(".slides");
  const total = document.querySelectorAll(".slide").length;

  if (slideIndex >= total) slideIndex = 0;
  if (slideIndex < 0) slideIndex = total - 1;

  slides.style.transform = "translateX(-" + slideIndex * 100 + "%)";
}

setInterval(nextSlide, 4000);
