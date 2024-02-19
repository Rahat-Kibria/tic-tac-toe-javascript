window.addEventListener("DOMContentLoaded", function () {
    const gameData = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    let editedPlayer = 0;
    let activePlayer = 0;
    let currentRound = 1;
    let gameIsOver = false;

    const players = [
        {
            name: '',
            symbol: 'X'
        },
        {
            name: '',
            symbol: 'O'
        }
    ];

    const editPlayer1BtnElement = document.querySelector("#edit-player-1-btn");
    const editPlayer2BtnElement = document.querySelector("#edit-player-2-btn");
    const playerConfigOverlayElement = document.querySelector("#config-overlay");
    const backdropElement = document.querySelector("#backdrop");
    const cancelConfigBtnElement = document.querySelector("#cancel-config-btn");
    const formElement = document.querySelector("form");
    const errorsOutputElement = document.querySelector("#config-errors");

    const startNewGameBtnElement = document.querySelector("#start-game-btn");
    const gameAreaElement = document.querySelector("#active-game");
    const activePlayerNameElement = document.querySelector("#active-player-name");
    // const gameFieldElements = document.querySelectorAll("#game-board li");
    const gameBoardElement = document.querySelector("#game-board");
    const gameOverElement = document.querySelector("#game-over");


    editPlayer1BtnElement.addEventListener("click", openPlayerConfig);
    editPlayer2BtnElement.addEventListener("click", openPlayerConfig);
    cancelConfigBtnElement.addEventListener("click", closePlayerConfig);
    backdropElement.addEventListener("click", closePlayerConfig);
    formElement.addEventListener("submit", savePlayerConfig);
    startNewGameBtnElement.addEventListener("click", startNewGame);
    // for (const gameFieldElement of gameFieldElements) {
    //     gameFieldElement.addEventListener("click", selectGameField);
    // }
    gameBoardElement.addEventListener("click", selectGameField);

    function openPlayerConfig(event) {
        editedPlayer = +event.target.dataset.playerid;
        // const clickedButton = event.target.dataset['playerid'];
        playerConfigOverlayElement.style.display = "block";
        backdropElement.style.display = "block";
    }

    function closePlayerConfig() {
        playerConfigOverlayElement.style.display = "none";
        backdropElement.style.display = "none";
        formElement.firstElementChild.classList.remove("error");
        errorsOutputElement.textContent = "";
        formElement.firstElementChild.lastElementChild.value = "";
    }

    function savePlayerConfig(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const enteredPlayerName = formData.get("playername").trim();
        //if (enteredPlayerName === "")
        if (!enteredPlayerName) {
            event.target.firstElementChild.classList.add("error");
            errorsOutputElement.textContent = "Please enter a valid name!";
            return;
        }

        const updatedPlayerDataElement = document.querySelector("#player-" + editedPlayer + "-data");
        updatedPlayerDataElement.children[1].textContent = enteredPlayerName;

        players[editedPlayer - 1].name = enteredPlayerName;

        closePlayerConfig();
    }

    function startNewGame() {
        if (players[0].name === '' || players[1].name === '') {
            alert("Please set custom player names for both players.");
            return;
        }
        resetGameStatus();
        gameAreaElement.style.display = "block";
        activePlayerNameElement.textContent = players[activePlayer].name;
    }

    function resetGameStatus() {
        activePlayer = 0;
        currentRound = 1;
        gameIsOver = false;
        gameOverElement.firstElementChild.innerHTML = "You won, <span id=\"winner-name\">PLAYER NAME</span>!";
        gameOverElement.style.display = "none";

        let gameBoardIndex = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameData[i][j] = 0;
                const gameBoardItemElement = gameBoardElement.children[gameBoardIndex];
                gameBoardItemElement.textContent = "";
                gameBoardItemElement.classList.remove("disabled");
                gameBoardIndex++;
            }
        }
    }

    function selectGameField(event) {
        if (event.target.tagName !== "LI" || gameIsOver) {
            return;
        }
        const selectedField = event.target;
        const selectedColumn = selectedField.dataset.col - 1;
        const selectedRow = selectedField.dataset.row - 1;

        if (gameData[selectedRow][selectedColumn] > 0) {
            alert("Please select an empty field.");
            return;
        }

        selectedField.textContent = players[activePlayer].symbol;
        selectedField.classList.add("disabled");

        gameData[selectedRow][selectedColumn] = activePlayer + 1;

        const winnerId = checkForGameOver();
        if (winnerId !== 0) {
            endGame(winnerId);
        }
        currentRound++;

        switchPlayer();
    }

    function switchPlayer() {
        if (activePlayer === 0) {
            activePlayer = 1;
        } else {
            activePlayer = 0;
        }
        activePlayerNameElement.textContent = players[activePlayer].name;
    }

    function checkForGameOver() {
        for (let i = 0; i < 3; i++) {
            if (gameData[i][0] > 0 && gameData[i][0] === gameData[i][1] && gameData[i][1] === gameData[i][2]) {
                return gameData[i][0];
            }
        }
        for (let i = 0; i < 3; i++) {
            if (gameData[0][i] > 0 && gameData[0][i] === gameData[1][i] && gameData[1][i] === gameData[2][i]) {
                return gameData[0][i];
            }
        }
        if (gameData[0][0] > 0 && gameData[0][0] === gameData[1][1] && gameData[1][1] === gameData[2][2]) {
            return gameData[0][0];
        }
        if (gameData[0][2] > 0 && gameData[0][2] === gameData[1][1] && gameData[1][1] === gameData[2][0]) {
            return gameData[0][2];
        }
        if (currentRound === 9) {
            return -1;
        }
        return 0;
    }

    function endGame(winnerId) {
        gameIsOver = true;
        gameOverElement.style.display = "block";
        if (winnerId > 0) {
            const winnerName = players[winnerId - 1].name;
            gameOverElement.firstElementChild.firstElementChild.textContent = winnerName;
        } else {
            gameOverElement.firstElementChild.textContent = "It's a draw";
        }
    }
});