'use strict';

import { accounts } from "./accounts.js";

const usernameInput = document.querySelector('.input-user');
const passwordInput = document.querySelector('.input-password');
const transferToInput = document.querySelector('.form-transfer__to');
const transferAmountInput = document.querySelector('.form-transfer__amount');
const requestAmountInput = document.querySelector('.form-request__amount');
const switchUsernameInput = document.querySelector('.form-switch__user');
const switchPasswordInput = document.querySelector('.form-switch__pass');

const loginButton = document.querySelector('.btn-login');
const sortButton = document.querySelector('.btn-sort');
const transferButton = document.querySelector('.btn-transfer');
const requestButton = document.querySelector('.btn-request');
const switchButton = document.querySelector('.btn-switch');

const incorrectLabel = document.querySelector('.incorrect');
const welcomeLabel = document.querySelector('.welcome span');
const balanceLabel = document.querySelector('.balance__value');
const balanceDateLabel = document.querySelector('.balance__date');
const balanceDateSpan = document.querySelector('.balance__date span');
const logoutTimerSpan = document.querySelector('.logout span');
const summaryInLabel = document.querySelector('.summary--in');
const summaryOutLabel = document.querySelector('.summary--out');
const summaryIntLabel = document.querySelector('.summary--int');

const navbarContainer = document.querySelector('nav');
const loginContainer = document.querySelector('.login');
const appContainer = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = `${now.getMinutes()}`.padStart(2, 0);
balanceDateSpan.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

class App {
    currentAccount;
    sorted = false;

    constructor() {
        loginButton.addEventListener('click', this.appLogin.bind(this));
        transferButton.addEventListener('click', this.transferMoney.bind(this));
        requestButton.addEventListener('click', this.requestLoan.bind(this));
        switchButton.addEventListener('click', this.switchAccount.bind(this));
        sortButton.addEventListener('click', this.sortMovements.bind(this));
    }

    appLogin(e) {
        e.preventDefault();

        this.currentAccount = accounts.find(acc => acc.username === usernameInput.value);

        if (usernameInput.value !== this.currentAccount?.username || passwordInput.value !== this.currentAccount?.password) {
            incorrectLabel.style.opacity = 1;
        }

        if (this.currentAccount?.password === passwordInput.value) {
            this.updateUI(this.currentAccount);
        }

        this.logOutTimer();
    }

    displayApp(acc) {
        navbarContainer.style.opacity = 1;
        loginContainer.style.display = 'none';
        appContainer.style.display = 'grid';
        welcomeLabel.innerHTML = `${acc.owner.split(' ')[0]}!`;
    }

    displayMovements(acc, sort = false) {
        movementsContainer.innerHTML = '';
    
        const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

        movs.forEach(function(mov, i) {
            const type = mov > 0 ? 'deposit' : 'withdraw';

            const date = new Date(acc.movementsDates[i]);
            const day = `${date.getDate()}`.padStart(2, 0);
            const month = `${date.getMonth() + 1}`.padStart(2, 0);
            const year = date.getFullYear();
            const displayDate = `${day}/${month}/${year}`;

            const html = `
            <div class="movements-row">
                    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                    <div class="movements__date">${displayDate}</div>
                    <div class="movements__value">${mov.toFixed(2)} €</div>
            </div>`;
    
            movementsContainer.insertAdjacentHTML('afterbegin', html);
        });
    }

    displayBalance(acc) {
        acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
        balanceLabel.innerHTML = `${acc.balance.toFixed(2)} €`;
    }

    displaySummary(acc) {
        const income = acc.movements
            .filter(mov => mov > 0)
            .reduce((acc, mov) => acc + mov, 0);
        summaryInLabel.innerHTML = `${income.toFixed(2)} €`;

        const outcome = acc.movements
            .filter(mov => mov < 0)
            .reduce((acc, mov) => acc + mov, 0);
        summaryOutLabel.innerHTML = `${Math.abs(outcome).toFixed(2)} €`;

        const interest = acc.movements
            .filter(mov => mov > 0)
            .map(deposit => (deposit * 1.2) / 100)
            .filter((int, i, arr) => {
                return int >= 1;
            })
            .reduce((acc, int) => acc + int, 0);
        summaryIntLabel.innerHTML = `${interest.toFixed(2)} €`;
    }

    updateUI(acc) {
        this.displayApp(acc);
        
        this.displayMovements(acc);
        
        this.displayBalance(acc);

        this.displaySummary(acc);          
    }

    transferMoney(e) {
        e.preventDefault();
        
        const transferToAccount = accounts.find(acc => acc.username === transferToInput.value);
        const transferAmount = Number(transferAmountInput.value);

        if (transferAmount > 0 && transferToAccount && this.currentAccount.balance >= transferAmount && transferToAccount.username !== this.currentAccount.username) {
            this.currentAccount.movements.push(-transferAmount);
            transferToAccount.movements.push(transferAmount);

            this.currentAccount.movementsDates.push(new Date().toISOString());
            transferToAccount.movementsDates.push(new Date().toISOString());

            this.updateUI(this.currentAccount);
            
            transferToInput.value = transferAmountInput.value = '';
        }
    }

    requestLoan(e) {
        e.preventDefault();

        const loanAmount = Number(requestAmountInput.value);

        if (loanAmount > 0 && this.currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
            this.currentAccount.movements.push(loanAmount);

            requestAmountInput.value = '';
            
            this.currentAccount.movementsDates.push(new Date().toISOString());

            this.updateUI(this.currentAccount);
        }
    }

    switchAccount(e) {
        e.preventDefault();

        const switchToAccount = accounts.find(acc => acc.username === switchUsernameInput.value);

        if (switchToAccount && this.currentAccount.username !== switchToAccount.username) {

            if (switchToAccount.username === switchUsernameInput.value && switchToAccount.password === switchPasswordInput.value) {
                this.updateUI(switchToAccount);

                this.currentAccount = switchToAccount;

                switchUsernameInput.value = switchPasswordInput.value = '';
            }
        }
    }

    sortMovements() {
        this.displayMovements(this.currentAccount, !this.sorted);
        this.sorted = !this.sorted;
    }

    logOutTimer() {
        const tick = function () {
            const min = String(Math.trunc(time / 60)).padStart(2, 0);
            const sec = String(time % 60).padStart(2, 0);

            logoutTimerSpan.textContent = `${min}:${sec}`

            if (time === 0) {
                clearInterval(timer);
                navbarContainer.style.opacity = 0;
                loginContainer.style.display = 'flex';
                appContainer.style.display = 'none';
                usernameInput.value = passwordInput.value = '';
            }

            time--;
        }

        let time = 300;

        tick();
        const timer = setInterval(tick, 1000);
    }
}

const app = new App();