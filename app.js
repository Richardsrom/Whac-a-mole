const timeLeft = document.getElementById('time-left');
const score = document.getElementById('score');
const startGame = document.getElementById('btn-start');
const pauseGame = document.getElementById('btn-pause');
const gameReset = document.getElementById('btn-reset');
const gridDisplay = document.querySelector('.gridGame');
const levelDisplay = document.getElementById('level');
const footerStyle = document.querySelector('.container-footer');

const maxSpeed = 400; //Velocidad maxima del mole 

let result = 0;
let hitPosition;
let hitPositionPlant;
let hitPositionFirePlant;
let hitPositionFrostPlant;
let currentTime = 30;
let timerId = null;
let level = 1; // Variable para el nivel actual

let mole = document.createElement('img');
let piranhaPlant = document.createElement('img');
let piranhaFirePlant = document.createElement('img');
let piranhaFrostPlant = document.createElement('img');

//Arrays para almacenar los eventListeners
const squareTargetListeners = [];
const squareTargetPlantListeners = [];
const squareTargetFirePlantListeners = [];
const squareTargetFrostPlantListeners = [];


const levels = [
    [3,3],
    [3,3],
    [3,3],
    [3,4],
    [3,4],
    [4,4],
    [4,4],
    [5,4],
    [5,4],
    [5,4]
]

let currentLevel = 0;

const squares = [];


//~ Aqui creamos el tablero del juego
const createBoardGame = () => {

    squares.length = 0;

    const [rows, cols] = levels[currentLevel]; 

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const div = document.createElement('div');
            div.setAttribute('class', 'square');
            div.classList.add('pipe');
            div.setAttribute('id', `${i}-${j}`);
            gridDisplay.appendChild(div);

            squares.push(div);

        };
    };

    squareTarget();
    squareTargetPlant();
    squareTargetFirePlant();
    squareTargetFrostPlant();
    
};


//* Aqui vamos a obtener el click cada vez que el 'mole' este en un square y sea el mismo.
const squareTarget = () => {
    
    squares.forEach(square => {

        const listener = () => {
            if(square.id == hitPosition) {
                result++;
                score.textContent = result;
                hitPosition = null;
            };
        };
        square.addEventListener('mousedown', listener);
        squareTargetListeners.push({square, listener});
    });
};


//* Aqui vamos a generar un numero random en el que la clase 'mole' se va a mover
const randomSquare = () => {

    mole.src = './images/mole.png';
    mole.setAttribute('class','mole');

    // Limpiamos todas las squares antes de empezar
    squares.forEach(square => square.classList.remove('mole'));

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * squares.length);
    } while (squares[randomIndex].querySelector('.mole') || 
        squares[randomIndex].querySelector('.piranha-plant') || 
        squares[randomIndex].querySelector('.firePiranha-plant') ||
        squares[randomIndex].querySelector('.frostPiranha-plant')
    );

    // Seleccionamos la square correspondiente al índice aleatorio y añadimos la clase 'mole'
    squares[randomIndex].appendChild(mole);
    hitPosition = squares[randomIndex].id;
};




//^ Aqui vamos a generar un numero random en el que la clase 'piranha-plant' se va a mover
const randomSquarePlant = () => {

    piranhaPlant.src = './images/piranha-plant.png';
    piranhaPlant.setAttribute('class','piranha-plant');

    // Limpiamos todas las squares antes de empezar
    squares.forEach(square => square.classList.remove('piranha-plant'));

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * squares.length);
    } while (squares[randomIndex].querySelector('.mole') || 
        squares[randomIndex].querySelector('.piranha-plant') || 
        squares[randomIndex].querySelector('.firePiranha-plant') ||
        squares[randomIndex].querySelector('.frostPiranha-plant')
    );


    // Seleccionamos la square correspondiente al índice aleatorio y añadimos la clase 'piranha-plant'
    squares[randomIndex].appendChild(piranhaPlant);
    hitPositionPlant = squares[randomIndex].id;
};


//^ Aqui vamos a obtener el click cada vez que 'piranha-plant' este en un square y sea el mismo square al que le demos click.
const squareTargetPlant = () => {
    
    squares.forEach(square => {

        const listener = () => {
            if(square.id == hitPositionPlant) {
                clearInterval(countDownTimerId);
                clearInterval(timerId);
                Swal.fire({
                    toast: true,
                    title: 'Game Over',
                    text: `Your final score is ${result} at level ${currentLevel}`,
                    icon: 'error',
                    color: '#fff',
                    background: '#05547e',
                    position: 'center',
                }); 
                removeListeners();
            };
        };

        square.addEventListener('mousedown', listener);
        squareTargetPlantListeners.push({square, listener});
    });
};





//? Aqui vamos a generar un numero random en el que la clase 'firePiranha-plant' se va a mover
const randomSquareFirePlant = () => {

    piranhaFirePlant.src = './images/fire-piranha-plant.png';
    piranhaFirePlant.setAttribute('class', 'firePiranha-plant');

    // Limpiamos todas las squares antes de empezar
    squares.forEach(square => square.classList.remove('firePiranha-plant'));

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * squares.length);
    } while (squares[randomIndex].querySelector('.mole') || 
        squares[randomIndex].querySelector('.piranha-plant') || 
        squares[randomIndex].querySelector('.firePiranha-plant') ||
        squares[randomIndex].querySelector('.frostPiranha-plant')
    );

    // Seleccionamos la square correspondiente al índice aleatorio y añadimos la clase 'piranha-plant'
    squares[randomIndex].appendChild(piranhaFirePlant);
    hitPositionFirePlant = squares[randomIndex].id;
};


//? Aqui vamos a obtener el click cada vez que 'firePiranha-plant' este en un square y sea el mismo square al que le demos click.
const squareTargetFirePlant = () => {
    
    squares.forEach(square => {

        const listener = () => {
            if(square.id == hitPositionFirePlant) {
                clearInterval(countDownTimerId);
                clearInterval(timerId);
                Swal.fire({
                    toast: true,
                    title: '🔥 Game Over 🔥',
                    text: `Your final score is ${result} at level ${currentLevel}`,
                    icon: 'error',
                    color: '#fff',
                    background: '#05547e',
                    position: 'center',
                }); 
                removeListeners();
            };
        };

        square.addEventListener('mousedown', listener);
        squareTargetFirePlantListeners.push({square, listener});
    });
};




//& Aqui vamos a generar un numero random en el que la clase 'frostPiranha-plant' se va a mover
const randomSquareFrostPlant = () => {

    piranhaFrostPlant.src = './images/frost-piranha-plant.png';
    piranhaFrostPlant.setAttribute('class', 'frostPiranha-plant');

    // Limpiamos todas las squares antes de empezar
    squares.forEach(square => square.classList.remove('frostPiranha-plant'));

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * squares.length);
    } while (squares[randomIndex].querySelector('.mole') || 
        squares[randomIndex].querySelector('.piranha-plant') || 
        squares[randomIndex].querySelector('.firePiranha-plant') ||
        squares[randomIndex].querySelector('.frostPiranha-plant')
    );


    // Seleccionamos la square correspondiente al índice aleatorio y añadimos la clase 'piranha-plant'
    squares[randomIndex].appendChild(piranhaFrostPlant);
    hitPositionFrostPlant = squares[randomIndex].id;
};


//& Aqui vamos a obtener el click cada vez que 'frostPiranha-plant' este en un square y sea el mismo square al que le demos click.
const squareTargetFrostPlant = () => {
    
    squares.forEach(square => {

        const listener = () => {
            if(square.id == hitPositionFrostPlant) {
                clearInterval(countDownTimerId);
                clearInterval(timerId);
                Swal.fire({
                    toast: true,
                    title: '🥶 Game Over 🥶',
                    text: `Your final score is ${result} at level ${currentLevel}`,
                    icon: 'error',
                    color: '#fff',
                    background: '#05547e',
                    position: 'center'
                }); 
                removeListeners();
            };
        };

        square.addEventListener('mousedown', listener);
        squareTargetFrostPlantListeners.push({square, listener});
    });
};



//~ Aqui vamos a mover solo el mole para el tutorial.
const moveMole = () => {
    clearInterval(timerId);
    timerId = setInterval(() => {
        randomSquare();
    }, 1000);
};

//~ Aqui vamos a mover a 'mole' y a 'piranha-plant'
const moveEntities = () => {
    clearInterval(timerId);
    const speed = Math.max(maxSpeed, 1200 - (currentLevel * 100));
    timerId = setInterval(() => {
        randomSquare();
        randomSquarePlant();
    }, speed);
};

//~ Aqui vamos a mover a 'mole', a 'piranha-plant' y 'firePirahna-plant'
const moveMoreEntities = () => {
    clearInterval(timerId);
    const speed = Math.max(maxSpeed, 1300 - (currentLevel * 100));
    timerId = setInterval(() => {
        randomSquare();
        randomSquarePlant();
        randomSquareFirePlant();
    }, speed);
};

//~ Aqui vamos a mover a 'mole', a 'piranha-plant' a'firePirahna-plant' y 'frostPiranha-plant' para los ultimos niveles
const moveFinalEntities = () => {
    clearInterval(timerId);
    const speed = Math.max(maxSpeed, 1500 - (currentLevel * 100));
    timerId = setInterval(() => {
        randomSquare();
        randomSquarePlant();
        randomSquareFirePlant();
        randomSquareFrostPlant();
    }, speed);
};

//~ Dependiendo del nivel se moveran 1 o mas piranhas
const entitiesMoving = () => {

    if(currentLevel >= 1 && currentLevel <= 2){
        moveEntities();
    } else if(currentLevel >= 3 && currentLevel <= 5) {
        moveMoreEntities();
    } else if(currentLevel > 5) {
        moveFinalEntities();
    } else {
        moveMole();
    };
};





//* Funcion para eliminar event listeners
const removeListeners = () => {

    squareTargetListeners.forEach(({square, listener}) => {
        square.removeEventListener('mousedown', listener);
    });

    squareTargetPlantListeners.forEach(({square, listener}) => {
        square.removeEventListener('mousedown', listener);
    });

    squareTargetFirePlantListeners.forEach(({square, listener}) => {
        square.removeEventListener('mousedown', listener);
    });

    squareTargetFrostPlantListeners.forEach(({square, listener}) => {
        square.removeEventListener('mousedown', listener);
    });
};

//* Funcion para añadir event listeners
const addListeners = () => {

    squareTargetListeners.forEach(({square, listener}) => {
        square.addEventListener('mousedown', listener);
    });

    squareTargetPlantListeners.forEach(({square, listener}) => {
        square.addEventListener('mousedown', listener);
    });

    squareTargetFirePlantListeners.forEach(({square, listener}) => {
        square.addEventListener('mousedown', listener);
    });

    squareTargetFrostPlantListeners.forEach(({square, listener}) => {
        square.addEventListener('mousedown', listener);
    });
};





//^ Funcion para agregar estilos al grid del juego y al footer
const styleBoard = () => {

    if (currentLevel >= 3 && currentLevel <= 4) {
        gridDisplay.classList.add('gridGame4x4');
    } else if (currentLevel >= 5 && currentLevel <= 6) {
        gridDisplay.classList.add('gridGame5x5');
        footerStyle.classList.add('footer-style');
        gridDisplay.classList.remove('gridGame4x4');
    } else if (currentLevel >= 7) {
        gridDisplay.classList.add('gridGame6x6');
        gridDisplay.classList.remove('gridGame4x4');
        gridDisplay.classList.remove('gridGame5x5');
    }
};


//^ Funcion para detener temporizador y elementos del juego.
const stopMovement = () => {

    //Detener el movimiento de los elementos
    clearInterval(timerId);
    // Detener el temporizador
    clearInterval(countDownTimerId);
}


let levelUpMessageShown = false;

const increaseLevel = () => {

    if (result >= 12 && !levelUpMessageShown) { // Aumenta el nivel cada vez que el jugador alcanza 12 puntos o mas
        levelUpMessageShown = true; // Indica que el mensaje de nivel ya se ha mostrado

        

        if(currentLevel == 0) { 

            stopMovement();
            removeListeners();

            Swal.fire({
                toast: true,
                title: 'Tutorial completed!! 😄',
                icon: 'success',
                color: '#fff',
                background: '#05547e',
            }).then((result) => {

                startNewLevel();
            });
        }
        else if (currentLevel >= 3 && currentLevel <= 5) { 

            stopMovement();
            removeListeners();

            Swal.fire({
                toast: true,
                title: `¡Level ${currentLevel} completed! 😯`,
                icon: 'success',
                color: '#fff',
                background: '#05547e',
            }).then((result) => {

                startNewLevel();
            });
        }
        else if(currentLevel > 5) {

            stopMovement();
            removeListeners();
            
            Swal.fire({
                toast: true,
                title: `¡Level ${currentLevel} completed!🔥 😱`,
                icon: 'success',
                color: '#fff',
                background: '#05547e',
            }).then((result) => {
                startNewLevel();
            });
        }
        else { 
            
            stopMovement();
            removeListeners();
            
            Swal.fire({
                toast: true,
                title: `¡Level ${currentLevel} completed! 👻`,
                icon: 'success',
                color: '#fff',
                background: '#05547e',
            }).then((result) => {
                startNewLevel();
            });
        };
        

        const startNewLevel = () => {

            if(currentLevel < levels.length - 1) {

                currentLevel++;
                levelDisplay.textContent = currentLevel;
                gridDisplay.innerHTML = '';
    
                // Reinicia el temporizador y el marcador
                currentTime = 30;
                score.textContent = 0;
                result = 0;
    
                createBoardGame();
                styleBoard();
    
                // Reinicia el intervalo de cuenta regresiva y mueve el topo con la nueva velocidad
                clearInterval(countDownTimerId);
                clearInterval(timerId);
    
    
                // Reinicia el temporizador de cuenta regresiva
                countDownTimerId = setInterval(() => {
                    countDown();
                    increaseLevel(); // Comprueba si es necesario aumentar de nivel
                }, 1000);
    
                // Restablece levelUpMessageShown a false para que se muestre el mensaje de nivel en el siguiente nivel
                levelUpMessageShown = false;
    
                entitiesMoving();
                
            } else {
                Swal.fire({
                    toast: true,
                    title: '😱 You have completed ALL levels!! 😱',
                    icon: 'success',
                    color: '#fff',
                    background: '#05547e',
                });
                clearInterval(timerId);
                clearInterval(countDownTimerId);
                removeListeners();
            };

        }

    };
};


let countDownTimerId;

const countDown = () => {

    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime == 0) {

        stopMovement();

        if (currentLevel === 0) {

            Swal.fire({
                toast: true,
                title: "Time's Up ⏰ ",
                text: `Your final score is ${result} at Tutorial`,
                icon: 'warning',
                color: '#fff',
                background: '#05547e',
            });
            removeListeners();

        } else {
            Swal.fire({
                toast: true,
                title: "Time's Up ⏰ ",
                text: `Your final score is ${result} at level ${currentLevel}`,
                icon: 'warning',
                color: '#fff',
                background: '#05547e',
            });
            removeListeners();
        }
    };
};


const gameStart = () => {

    startGame.addEventListener('click', () => {

        entitiesMoving();
        addListeners();

        countDownTimerId = setInterval(() => {
            countDown();
            increaseLevel(); // Comprueba si es necesario aumentar de nivel
        }, 1000);
        
    });
};
 
const gamePause = () => {

    pauseGame.addEventListener('click', () => {

        stopMovement();
        
        // Eliminar event listeners de los cuadrados
        removeListeners();
    });
};

const resetGame = () => {

    gameReset.addEventListener('click', () => {

        window.location.reload()

    });
};


createBoardGame();

gameStart();
gamePause();
resetGame();