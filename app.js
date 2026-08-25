// Substitua este bloco abaixo com as SUAS chaves do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBfukV0ZEwlm1CUwJm4Ty2EO-can25Wiks",
    authDomain: "zencris-aop.firebaseapp.com",
    projectId: "zencris-aop",
    storageBucket: "zencris-aop.firebasestorage.app",
    messagingSenderId: "457190166756",
    appId: "1:457190166756:web:1bec461a8897ab0d989cf1"
  };

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Função de Login do Terminal C.R.I.S.
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

  // Feedback visual no terminal
  msgStatus.style.color = "#00ff66";
  msgStatus.innerText = "DESCRIPTOGRAFANDO CREDENCIAIS...";
  btn.disabled = true;

  // Mascara o e-mail por trás dos panos
  const emailCompleto = `crisordem+${usuarioInput}@gmail.com`;

  auth.signInWithEmailAndPassword(emailCompleto, senhaInput)
    .then((userCredential) => {
      msgStatus.style.color = "#00ff66";
      msgStatus.innerText = "ACESSO CONCEDIDO. CARREGANDO BANCO DE DADOS...";
      
      // Salva o nome do agente para exibir no painel
      localStorage.setItem("agente_cod", usuarioInput.toUpperCase());

      // Redireciona para o painel em 1.5 segundos
      setTimeout(() => {
        window.location.href = "painel.html";
      }, 1500);
    })
    .catch((error) => {
      console.error(error);
      msgStatus.style.color = "#ff3333";
      msgStatus.innerText = "ACESSO NEGADO: Credenciais inválidas.";
      btn.disabled = false;
    });
}
