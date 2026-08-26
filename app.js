// Substitua este bloco abaixo com as SUAS chaves do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfukV0ZEwlm1CUwJm4Ty2EO-can25Wiks",
    authDomain: "zencris-aop.firebaseapp.com",
    projectId: "zencris-aop",
    storageBucket: "zencris-aop.firebasestorage.app",
    messagingSenderId: "457190166756",
    appId: "1:457190166756:web:1bec461a8897ab0d989cf1"
  };

// Inicialização do Firebase (evita re-inicialização duplicada)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ----------------------------------------------------
// 1. AUTENTICAÇÃO E SESSÃO
// ----------------------------------------------------

// Controla o estado de autenticação em todas as páginas
auth.onAuthStateChanged((user) => {
    const isLoginPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    if (user) {
        // Se estiver logado e na tela de login, manda para o painel
        if (isLoginPage) {
            window.location.href = "painel.html";
            return;
        }

        // Atualiza a interface do painel com as credenciais do Agente
        const cod = localStorage.getItem("agente_cod") || "DESCONHECIDO";
        const elNomeAgente = document.getElementById("nome-agente");
        const elCardAgente = document.getElementById("card-agente-nome");

        if (elNomeAgente) elNomeAgente.innerText = cod;
        if (elCardAgente) elCardAgente.innerText = "AGENTE " + cod;

    } else {
        // Se NÃO estiver logado e NÃO estiver na tela de login, redireciona para o login
        if (!isLoginPage) {
            window.location.href = "index.html";
        }
    }
});

// Realiza o login (chamado na tela index.html)
function fazerLogin() {
    const usuarioInput = document.getElementById("agente").value.trim();
    const senhaInput = document.getElementById("senha").value;
    const msgStatus = document.getElementById("msg-status");
    const btn = document.getElementById("btn-acessar");

    if (!usuarioInput || !senhaInput) {
        msgStatus.style.color = "#ff4444";
        msgStatus.innerText = "ERRO: Informe agente e senha!";
        return;
    }

    msgStatus.style.color = "#00ff66";
    msgStatus.innerText = "DESCRIPTOGRAFANDO CREDENCIAIS...";
    btn.disabled = true;

    const emailCompleto = `zensites7867+${usuarioInput}@gmail.com`;

    auth.signInWithEmailAndPassword(emailCompleto, senhaInput)
        .then(() => {
            msgStatus.style.color = "#00ff66";
            msgStatus.innerText = "ACESSO CONCEDIDO. CARREGANDO BANCO DE DADOS...";
            localStorage.setItem("agente_cod", usuarioInput.toUpperCase());
            
            setTimeout(() => {
                window.location.href = "painel.html";
            }, 1200);
        })
        .catch((error) => {
            console.error(error);
            msgStatus.style.color = "#ff3333";
            msgStatus.innerText = "ACESSO NEGADO: Credenciais inválidas.";
            btn.disabled = false;
        });
}

// Realiza o logout
function fazerLogout() {
    auth.signOut().then(() => {
        localStorage.removeItem("agente_cod");
        window.location.href = "index.html";
    }).catch((err) => {
        console.error("Erro ao encerrar sessão: ", err);
    });
}

// ----------------------------------------------------
// 2. NAVEGAÇÃO ENTRE ABAS DO PAINEL
// ----------------------------------------------------
function trocarAba(abaId, elementoBotao) {
    document.querySelectorAll('.tab-content').forEach(aba => aba.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const tabAlvo = document.getElementById(abaId);
    if (tabAlvo) tabAlvo.classList.add('active');
    if (elementoBotao) elementoBotao.classList.add('active');

    // Inicialização condicional por aba (desacoplado)
    if (abaId === 'bestiario' && typeof carregarBestiario === 'function') {
        if (typeof listaCriaturas !== 'undefined' && listaCriaturas.length === 0) {
            carregarBestiario();
        }
    }
}