import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, deleteDoc, onSnapshot, getDocs} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBy3CeoNVuro57QCQ7WL9Vw2pzOWBajpYc",
    authDomain: "appcontrolegastos-723c6.firebaseapp.com",
    projectId: "appcontrolegastos-723c6",
    storageBucket: "appcontrolegastos-723c6.appspot.com",
    messagingSenderId: "356737549891",
    appId: "1:356737549891:web:bc9190c4b8a5448a9ab6f6",
    measurementId: "G-QRYLZD386C"
};
  
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const documentGastos = collection(db, 'gastos');

const form = document.querySelector('#form');
let saldoPositivo = 0;
let saldoNegativo = 0;
let saldoAtual = 0;

function imprimirSaldoPositivoOuNegativoNaTela(money, saldo) {
    money.textContent = `R$ ${saldo.toFixed(2)}`;
};

function imprimirBalancoTotalNaTela(saldoAtual) {
    balance.textContent = `R$ ${(saldoAtual).toFixed(2)}`;
};


function apagarTransacao(event) {
    const elementoClicado = event.target;
    const deletar = elementoClicado.dataset.deletar

    if (deletar) {
        const itemTransacao = document.querySelector(`[data-nome="${deletar}"]`);
        const idItemTransacao = itemTransacao.dataset.nome;
        const valorItemTransacao = itemTransacao.dataset.valor;

        saldoAtual -= valorItemTransacao;
        imprimirBalancoTotalNaTela(saldoAtual);
        deleteDoc(doc(db, 'gastos', idItemTransacao));

        if (valorItemTransacao < 0) {
            saldoNegativo -= valorItemTransacao
            imprimirSaldoPositivoOuNegativoNaTela(moneyMinus, saldoNegativo);
        }

        if (valorItemTransacao > 0) {
            saldoPositivo -= valorItemTransacao
            imprimirSaldoPositivoOuNegativoNaTela(moneyPlus, saldoPositivo);
        }
        
    };
};

function addTransacoesContainer(nomeTransacao, valorTansacao) {
    const valorPositivo = valorTansacao > 0;
    const valorNegativo = valorTansacao < 0;
    const classeMinusPlus = valorNegativo ? 'minus' : 'plus';

    if (valorPositivo) {
        saldoPositivo += valorTansacao;
        
        imprimirSaldoPositivoOuNegativoNaTela(moneyPlus, saldoPositivo);
    };

    if (valorNegativo) {
        saldoNegativo += valorTansacao;
        
        imprimirSaldoPositivoOuNegativoNaTela(moneyMinus, saldoNegativo);
    };

    saldoAtual = saldoPositivo + saldoNegativo;
    imprimirBalancoTotalNaTela(saldoAtual);
};

onSnapshot(documentGastos, querySnapshot => {
    const listaGastos = querySnapshot.docs.reduce((acc, doc) => {
        const { nomeTransacao, valorTansacao } = doc.data();

        acc += `<li class="" data-nome="${doc.id}" data-valor="${valorTansacao}">
          ${nomeTransacao.toUpperCase()} <span>R$ ${valorTansacao.toFixed(2)}</span>
          <button class="delete-btn" data-deletar="${doc.id}">x</button>
        </li>`;

        return acc
    }, '');

    transactions.innerHTML = listaGastos
});

getDocs(collection(db, 'gastos'))
    .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
            const { nomeTransacao, valorTansacao } = doc.data();

            addTransacoesContainer(nomeTransacao, valorTansacao);
        })
    })
    .catch(console.log);

function adicionarTransacao(event) {
    event.preventDefault();
    
    if (text.value && amount.value) {
        const nomeTransacao = text.value;
        const valorTansacao = Number(amount.value);

        addDoc(documentGastos, {
            nomeTransacao,
            valorTansacao
        })

        addTransacoesContainer(nomeTransacao, valorTansacao);
    } else {
        alert('É necessário adicionar o nome e também o valor da transação.');
    };

    form.reset();
    text.focus();
};

form.addEventListener('submit', adicionarTransacao);
transactions.addEventListener('click', apagarTransacao);