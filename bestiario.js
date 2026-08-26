const db = firebase.firestore();
let listaCriaturas = [];

// Normaliza textos para ignorar acentos e caixa alta/baixa
function normalizarTexto(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Associa a cor do badge ao elemento do Ordem Paranormal
function getClasseElemento(elementoStr) {
    const el = normalizarTexto(elementoStr);
    if (el.includes("sangue")) return "sangue";
    if (el.includes("morte")) return "morte";
    if (el.includes("energia")) return "energia";
    if (el.includes("conhecimento")) return "conhecimento";
    if (el.includes("medo")) return "medo";
    return "";
}

// Alterna os filtros avançados
function toggleFiltros() {
    const painel = document.getElementById("painel-filtros");
    if (painel) painel.classList.toggle("active");
}

/* --- CARREGAMENTO DO BANCO --- */
function carregarBestiario() {
    db.collection("bestiario").get().then((querySnapshot) => {
        listaCriaturas = [];
        querySnapshot.forEach((doc) => {
            listaCriaturas.push({ id: doc.id, ...doc.data() });
        });
        renderizarGrid(listaCriaturas);
    }).catch((error) => {
        console.error("Erro ao carregar criaturas: ", error);
        document.getElementById("grid-bestiario").innerHTML = "<p style='color: var(--accent-red);'>Erro ao conectar ao banco de dados.</p>";
    });
}

/* --- RENDERIZAÇÃO --- */
function renderizarGrid(criaturas) {
    const grid = document.getElementById("grid-bestiario");
    if (!grid) return;
    
    grid.innerHTML = "";

    if (criaturas.length === 0) {
        grid.innerHTML = "<p style='color: var(--text-secondary); grid-column: 1/-1;'>Nenhuma entidade encontrada.</p>";
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

/* --- FILTRO GLOBAL --- */
function filtrarBestiario() {
    const busca = normalizarTexto(document.getElementById("search-creature")?.value);
    const elementoFiltro = document.getElementById("filter-elemento")?.value || "todos";
    const tamanhoFiltro = document.getElementById("filter-tamanho")?.value || "todos";

    const filtrados = listaCriaturas.filter(c => {
        const conteudoCompleto = normalizarTexto(`
            ${c.nome || ''} 
            ${c.descricao || ''} 
            ${c.elementos || c.elemento || ''} 
            ${c.tamanho || ''} 
            ${c.perigo || ''} 
            ${c['tipo-de-ser'] || ''}
        `);

        const bateBusca = busca === "" || conteudoCompleto.includes(busca);

        const elementoValor = c.elementos || c.elemento || "";
        const bateElemento = elementoFiltro === "todos" || normalizarTexto(elementoValor).includes(normalizarTexto(elementoFiltro));
        const bateTamanho = tamanhoFiltro === "todos" || c.tamanho === tamanhoFiltro;

        return bateBusca && bateElemento && bateTamanho;
    });

    renderizarGrid(filtrados);
}

/* --- MODAL --- */
function abrirModal(criatura) {
    document.getElementById("modal-nome").innerText = criatura.nome;
    document.getElementById("modal-descricao").innerText = criatura.descricao || "Sem dados de arquivo registrados.";
    
    const elementoValor = criatura.elementos || criatura.elemento || 'N/A';
    const perigoValor = criatura.perigo || 'N/A';
    const tipoValor = criatura['tipo-de-ser'] || 'Criatura';
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