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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função de Login do Terminal
function fazerLogin() {
  const usuarioInput = document.getElementById("agente").value.trim();
  const senhaInput = document.getElementById("senha").value;

  if (!usuarioInput || !senhaInput) {
    alert("ERRO: Preencha o código de agente e a senha!");
    return;
  }

  // Mascara o e-mail por trás dos panos usando o seu e-mail + id do agente
  const emailCompleto = `zensites7867+${usuarioInput}@gmail.com`;

  auth.signInWithEmailAndPassword(emailCompleto, senhaInput)
    .then((userCredential) => {
      alert("ACESSO CONCEDIDO: Bem-vindo ao Terminal, Agente " + usuarioInput.toUpperCase());
      // No futuro, aqui redirecionamos para a página interna (ex: painel.html)
    })
    .catch((error) => {
      console.error(error);
      alert("ACESSO NEGADO: Credenciais inválidas ou agente não cadastrado.");
    });
}
