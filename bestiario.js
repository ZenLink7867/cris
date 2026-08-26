let listaCriaturas = [];

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getClasseElemento(elementoStr) {
    const el = normalizarTexto(elementoStr);
    if (el.includes("sangue")) return "sangue";
    if (el.includes("morte")) return "morte";
    if (el.includes("energia")) return "energia";
    if (el.includes("conhecimento")) return "conhecimento";
    if (el.includes("medo")) return "medo";
    return "";
}

function toggleFiltros() {
    const painel = document.getElementById("painel-filtros");
    if (painel) painel.classList.toggle("active");
}

/* --- CARREGAMENTO DO BANCO --- */
function carregarBestiario() {
    const grid = document.getElementById("grid-bestiario");
    if (!grid) return;

    db.collection("bestiario").get().then((querySnapshot) => {
        listaCriaturas = [];
        querySnapshot.forEach((doc) => {
            listaCriaturas.push({ id: doc.id, ...doc.data() });
        });
        renderizarGrid(listaCriaturas);
    }).catch((error) => {
        console.error("Erro ao carregar criaturas: ", error);
        grid.innerHTML = "<p style='color: #ff3333;'>Erro ao conectar ao banco de dados.</p>";
    });
}

/* --- RENDERIZAÇÃO DA GRID --- */
function renderizarGrid(criaturas) {
    const grid = document.getElementById("grid-bestiario");
    if (!grid) return;
    
    grid.innerHTML = "";

    if (criaturas.length === 0) {
        grid.innerHTML = "<p style='color: #7baf92; grid-column: 1/-1;'>Nenhuma entidade encontrada.</p>";
        return;
    }

    criaturas.forEach(c => {
        const card = document.createElement("div");
        card.className = "creature-card";
        card.onclick = () => abrirModal(c);

        const imgHtml = c.imagem 
            ? `<img src="${c.imagem}" class="creature-img" alt="${c.nome}">` 
            : `<div class="creature-img" style="display:flex;align-items:center;justify-content:center;color:#444;">SEM IMAGEM</div>`;

        const elementoValor = c.elementos || c.elemento || 'Desconhecido';
        const tamanhoValor = c.tamanho || 'Médio';
        const classeCor = getClasseElemento(elementoValor);

        card.innerHTML = `
            ${imgHtml}
            <div class="creature-info">
                <div class="creature-name">${c.nome}</div>
                <div class="creature-tags">
                    <span class="tag tag-elemento ${classeCor}">${elementoValor}</span>
                    <span class="tag">${tamanhoValor}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Captura os valores marcados por categoria usando `data-filtro`
function getValoresMarcados(nomeFiltro) {
    const checkboxes = document.querySelectorAll(`.filtro-grupo[data-filtro="${nomeFiltro}"] input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(cb => normalizarTexto(cb.value));
}

/* --- FILTRO DE MÚLTIPLA SELEÇÃO --- */
function filtrarBestiario() {
    const busca = normalizarTexto(document.getElementById("search-creature")?.value);

    const elementosSel = getValoresMarcados('elementos');
    const perigosSel = getValoresMarcados('perigo');
    const tiposSel = getValoresMarcados('tipo');
    const tamanhosSel = getValoresMarcados('tamanho');

    const filtrados = listaCriaturas.filter(c => {
        const nomeNorm = normalizarTexto(c.nome);
        const descNorm = normalizarTexto(c.descricao);
        const elemNorm = normalizarTexto(c.elementos || c.elemento);
        const tamanhoNorm = normalizarTexto(c.tamanho);
        const perigoNorm = normalizarTexto(c.perigo);
        const tipoNorm = normalizarTexto(c['tipo-de-ser'] || c.tipo);

        // Busca Geral
        const conteudoCompleto = `${nomeNorm} ${descNorm} ${elemNorm} ${tamanhoNorm} ${perigoNorm} ${tipoNorm}`;
        const bateBusca = busca === "" || conteudoCompleto.includes(busca);

        // Filtros Multi-seleção
        const bateElemento = elementosSel.length === 0 || elementosSel.some(el => elemNorm.includes(el));
        const batePerigo = perigosSel.length === 0 || perigosSel.some(p => perigoNorm.includes(p));
        const bateTipo = tiposSel.length === 0 || tiposSel.some(t => tipoNorm.includes(t));
        const bateTamanho = tamanhosSel.length === 0 || tamanhosSel.some(tam => tamanhoNorm.includes(tam));

        return bateBusca && bateElemento && batePerigo && bateTipo && bateTamanho;
    });

    renderizarGrid(filtrados);
}

/* --- MODAL DE DETALHES --- */
function abrirModal(criatura) {
    document.getElementById("modal-nome").innerText = criatura.nome;
    document.getElementById("modal-descricao").innerText = criatura.descricao || "Sem dados de arquivo registrados.";
    
    const elementoValor = criatura.elementos || criatura.elemento || 'N/A';
    const perigoValor = criatura.perigo || 'N/A';
    const tipoValor = criatura['tipo-de-ser'] || criatura.tipo || 'Criatura';
    const classeCor = getClasseElemento(elementoValor);

    const tagsContainer = document.getElementById("modal-tags");
    tagsContainer.innerHTML = `
        <span class="tag tag-elemento ${classeCor}">${elementoValor}</span>
        <span class="tag">TAMANHO: ${criatura.tamanho || 'N/A'}</span>
        <span class="tag">PERIGO: ${perigoValor}</span>
        <span class="tag">${tipoValor}</span>
    `;

    const imgElement = document.getElementById("modal-img");
    if (criatura.imagem) {
        imgElement.src = criatura.imagem;
        imgElement.style.display = "block";
    } else {
        imgElement.style.display = "none";
    }

    document.getElementById("modal-criatura").classList.add("active");
}

function fecharModal() {
    document.getElementById("modal-criatura").classList.remove("active");
}

// Carrega imediatamente ao abrir/recarregar a página
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", carregarBestiario);
} else {
    carregarBestiario();
}