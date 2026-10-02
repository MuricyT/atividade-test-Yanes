let clientes = [];
let pets = [];
let produtos = [];
let carrinho = [];

let clienteVipAtivo = false;
let clienteSelecionadoIndex = -1;
let modoRemoverAtivo = false;

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

  clienteNome.value = "";
  clienteEmail.value = "";
  clienteVip.checked = false;

  renderClientes();
}

function selecionarClienteAtivo() {
  let select = document.getElementById("clienteSelect");
  let index = select.value;

  if (index === "" || index === undefined) {
    clienteVipAtivo = false;
    clienteSelecionadoIndex = -1;
  } else {
    clienteSelecionadoIndex = parseInt(index);
    let c = clientes[clienteSelecionadoIndex];
    clienteVipAtivo = c ? c.vip : false;
  }

  calcularTotal();
}

function renderClientes() {
  listaClientes.innerHTML = "";
  let clienteSelect = document.getElementById("clienteSelect");
  if (clienteSelect)
    clienteSelect.innerHTML =
      "<option value=''>-- Selecione um Cliente --</option>";

  clientes.forEach((c, i) => {
    let li = document.createElement("li");
    li.innerText = c.nome + " - " + c.email + (c.vip ? " VIP" : "");
    listaClientes.appendChild(li);

    if (clienteSelect) {
      let op = document.createElement("option");
      op.value = i;
      op.innerText = c.nome + " - " + c.email + (c.vip ? " (VIP)" : "");
      if (i === clienteSelecionadoIndex) {
        op.selected = true;
      }
      clienteSelect.appendChild(op);
    }
  });

  selecionarClienteAtivo();
}

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

function toggleModoRemover() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  modoRemoverAtivo = !modoRemoverAtivo;
  let btnConfirmar = document.getElementById("btnConfirmarRemover");
  if (btnConfirmar) {
    btnConfirmar.style.display = modoRemoverAtivo ? "inline-block" : "none";
  }
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

function confirmarRemocao() {
  let checkboxes = document.querySelectorAll(".chk-remover:checked");

  if (checkboxes.length === 0) {
    alert("Selecione ao menos um produto para remover");
    return;
  }

  let nomesParaRemover = Array.from(checkboxes).map((chk) => chk.dataset.nome);

  carrinho = carrinho.filter((p) => !nomesParaRemover.includes(p.nome));

  modoRemoverAtivo = false;
  let btnConfirmar = document.getElementById("btnConfirmarRemover");
  if (btnConfirmar) btnConfirmar.style.display = "none";

  renderCarrinho();
}

function renderCarrinho() {
  listaCarrinho.innerHTML = "";

  let mapaAgrupado = {};
  carrinho.forEach((p) => {
    if (!mapaAgrupado[p.nome]) {
      mapaAgrupado[p.nome] = { produto: p, qtd: 0 };
    }
    mapaAgrupado[p.nome].qtd++;
  });

  Object.values(mapaAgrupado).forEach((item) => {
    let li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "8px";

    if (modoRemoverAtivo) {
      let chk = document.createElement("input");
      chk.type = "checkbox";
      chk.className = "chk-remover";
      chk.dataset.nome = item.produto.nome;
      li.appendChild(chk);
    }

    let textSpan = document.createElement("span");
    textSpan.innerText =
      item.produto.nome +
      " - R$ " +
      item.produto.preco.toFixed(2) +
      " (x" +
      item.qtd +
      ")";
    li.appendChild(textSpan);

    listaCarrinho.appendChild(li);
  });

  calcularTotal();
}

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

  let elemTotal = document.getElementById("total");
  if (elemTotal) elemTotal.innerText = total;

  return total;
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  alert("Compra finalizada: R$ " + calcularTotal());

  carrinho = [];
  modoRemoverAtivo = false;

  let btnConfirmar = document.getElementById("btnConfirmarRemover");
  if (btnConfirmar) btnConfirmar.style.display = "none";

  renderCarrinho();
}

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

  if (!slides) return;

  if (slideIndex >= total) slideIndex = 0;
  if (slideIndex < 0) slideIndex = total - 1;

  slides.style.transform = "translateX(-" + slideIndex * 100 + "%)";
}

setInterval(nextSlide, 4000);

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    clientes,
    pets,
    produtos,
    carrinho,
    get clienteVipAtivo() {
      return clienteVipAtivo;
    },
    set clienteVipAtivo(val) {
      clienteVipAtivo = val;
    },
    criarCliente,
    renderClientes,
    selecionarClienteAtivo,
    cadastrarPet,
    renderPets,
    criarProduto,
    renderProdutos,
    adicionarCarrinho,
    removerCarrinho,
    toggleModoRemover,
    confirmarRemocao,
    renderCarrinho,
    calcularTotal,
    finalizarCompra,
    nextSlide,
    prevSlide,
    updateSlide,
  };
}
