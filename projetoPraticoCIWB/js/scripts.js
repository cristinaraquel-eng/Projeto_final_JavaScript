window.onload = principal; // quando a pag terminar de carregar, chama a funcao principal

let pontuacao; // pontuacao acumulada do jogador
let tamanhoFonte = 16; // tamanho da fonte em pixels no padrao de 16px
let temaEscuro = false; // false=tema claro e true=tema escuro

// inicio das funcoes==========================================================================

function principal() {
  // formulario pra identifiaccao
  let form = document.getElementById("form1");
  form.noValidate = true; // desativa as mensagens automaticas do navegador
  form.onsubmit = validarDados;  // botão "Jogar" chama a validacao

  // botoes de pedra, papel e tesoura pro usuario escolher
  document.getElementById("btnPedra").onclick = jogarPedra;
  document.getElementById("btnPapel").onclick = jogarPapel;
  document.getElementById("btnTesoura").onclick = jogarTesoura;

  // botao para trocar de jogador
  document.getElementById("btnNovoJogador").onclick = novoJogador;

  // alterar o tamanho da fonte
  document.getElementById("btnAumentarFonte").onclick = aumentarFonte;
  document.getElementById("btnDiminuirFonte").onclick = diminuirFonte;
  document.getElementById("btnTema").onclick = alternarTema;

  carregarDados();
}

// validacao de dados ===========================================================================
function carregarDados() {
  // getItem recupera o valor salvoe se nao tiver nada salvo ele retorna null
  let nomeSalvo = localStorage.getItem("nome");

  // a pontuacao vai ser salva como texto, por isso o parseInt para fazer o texto virar num e
  // se nn tiver pontos salvos ele comeca com 0
  pontuacao = parseInt(localStorage.getItem("pontuacao")) || 0;

  if (nomeSalvo != null) {
    mostrarJogo(nomeSalvo); // se existe um jogador salvo com aquele nome vai direto para a partida
  }
  else {
    mostrarIdentificacao(); // se nn tiver ngm salvo so chama o form de identificacao
  }
}

function salvarPontuacao() {
  localStorage.setItem("pontuacao", pontuacao); // o localstorage chama o setitem que armazena a chave-par no localStorage
}

function novoJogador() {
  localStorage.removeItem("nome"); // apaga os dados setados abaixo do jogador atual
  localStorage.removeItem("pontuacao");
  pontuacao = 0;
  document.getElementById("nome").value = "";
  document.getElementById("resultado").innerHTML = "";
  mostrarIdentificacao();
}

// validacao do form=========================================================================================
function validarDados() {
  let form = document.getElementById("form1");
  let elementos = form.elements; // lista dos campos do formulário

  // string vazia limpa mensagens de erro anteriores
  // e faz o campo voltar a ser considerado válido
  for (let i = 0; i < elementos.length; i++) {
    elementos[i].setCustomValidity("");
  }

  validarNome(); // define a mensagem de erro personalizada se precisar

  // reportValidity mostra a mensagem do campo errado e retorna true se tudo estiver valido
  if (form.reportValidity() == true) {
    let nome = document.getElementById("nome").value;
    localStorage.setItem("nome", nome); // salva o nome do jogador
    salvarPontuacao();                  // salva a pontuacao inicial
    mostrarJogo(nome);
  }

  return false; // para nao submeter o formulario/nn carregar a pagina
}

function validarNome() {
  let campoNome = document.getElementById("nome");
  let padrao = /^[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]{3,}(\s[a-zA-ZáàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]+)*$/;

  // funcao test retorna true se o texto segue o padrao definido na regex
  if (padrao.test(campoNome.value) == false) {
    campoNome.setCustomValidity("O nome deve ter apenas letras e no mínimo 3 letras na primeira palavra");
  }
}

function mostrarIdentificacao() {
  // style.display = "none"; --> esconde o elemento "block" mostra
  document.getElementById("identificacao").style.display = "block";
  document.getElementById("jogo").style.display = "none";
}

// jogo funcionando =================================================================================

function mostrarJogo(nome) {
  document.getElementById("identificacao").style.display = "none";
  document.getElementById("jogo").style.display = "block";

  // exibe o nome e a pontuação do jogador durante a partida
  document.getElementById("nomeJogador").innerHTML = nome;
  document.getElementById("pontuacao").innerHTML = pontuacao;
}

// cada botao chama sua propria funcao e todas usam a jogar mudando so a escolha
function jogarPedra() {
  jogar("pedra");
}

function jogarPapel() {
  jogar("papel");
}

function jogarTesoura() {
  jogar("tesoura");
}

function jogar(escolhaJogador) {
  let escolhaComputador = sortearJogada();
  let resultado = verificarResultado(escolhaJogador, escolhaComputador);

  atualizarPontuacao(resultado);

  // mostra na tela o que cada um escolheu e o resultado
  document.getElementById("resultado").innerHTML =
    "Você escolheu " + escolhaJogador +
    " e o computador escolheu " + escolhaComputador +
    ". Resultado: " + resultado + "!";
}

function sortearJogada() {
  // vetor com as 3 opcoes--> pos 0, 1, 2
  let opcoes = ["pedra", "papel", "tesoura"];
  let indice = gerarNumero(0, 2); // sorteia uma posicao do vetor
  return opcoes[indice]; // retorna o vetor de opcoes com o indice referente ao que foi escolhido
}

function gerarNumero(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min; // formula pra geral numero aleatorio
}

// parte da pontuacao ============================================================================

function verificarResultado(jogador, computador) { // regras de empate e desempate
  if (jogador == computador) {
    return "empate";
  }
  else if ((jogador == "pedra" && computador == "tesoura") || // opcoes onde o usuario ganha
           (jogador == "tesoura" && computador == "papel") ||
           (jogador == "papel" && computador == "pedra")) {
    return "vitória"; // vitoria do jogados
  }
  else {
    return "derrota"; // se todas as opcoes sao fakes o computador que ganhou
  }
}

function atualizarPontuacao(resultado) { // vitoria --> 3 empate --> 1, se perder e 0
  if (resultado == "vitória") {
    pontuacao = pontuacao + 3;
  }
  else if (resultado == "empate") {
    pontuacao = pontuacao + 1;
  }

  salvarPontuacao(); // guarda a nova pontuacao no localStorage
  document.getElementById("pontuacao").innerHTML = pontuacao;
}

// parte de acessibilidade====================================================================================

function aumentarFonte() {
  if (tamanhoFonte < 32) { // limite maximo para nn quebrar a pag
    tamanhoFonte = tamanhoFonte + 2;
    aplicarFonte();
  }
}

function diminuirFonte() {
  if (tamanhoFonte > 10) { // limite min para manter a leitura
    tamanhoFonte = tamanhoFonte - 2;
    aplicarFonte();
  }
}

function aplicarFonte() {
  document.body.style.fontSize = tamanhoFonte + "px"; // altera o estilo direto pelo JS

  // botoes e campos nn herdam a fonte do body ent usa querySelectorAll para alterar todos eles tbm
  let campos = document.querySelectorAll("button, input");
  for (let i = 0; i < campos.length; i++) {
    campos[i].style.fontSize = tamanhoFonte + "px";
  }
}

function alternarTema() {
  if (temaEscuro == false) {
    // muda para o tema escuro
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    temaEscuro = true;
  }
  else { // volta para o tema claro
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    temaEscuro = false;
  }
}
