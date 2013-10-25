// functional model
// ----------------------------------------------------------
// START: constants
WIDTH = 75;
HEIGHT = 50;
POINT_SIZE = 10;
TURN_MILLIS = 75;
WIN_LENGTH = 5;
DIRS = {
    37: [-1,  0], // VK_LEFT
    38: [ 0, -1], // VK_UP
    39: [ 1,  0], // VK_RIGHT
    40: [ 0,  1]  // VK_DOWN
};
// END: constants

// START: board math
function addPoints() {
    return _.map(_.zip.apply(_, arguments), function(element) {
        return _.reduce(element, function(memo, value) {
            return memo + value;
        }, 0);
    });
}

function pointToScreenRect(pt) {
    return _.map([pt[0], pt[1], 1, 1], function(element) {
        return element * POINT_SIZE;
    });
}
// END: board math

// START: apple
function createApple() {
    return {
        location: [_.random(WIDTH), _.random(HEIGHT)],
        type: 'apple',
        color: 'rgb(210, 50, 90)'
    };
}
// END: apple

// START: snake
function createSnake() {
    return {
        body: [[1, 1]],
        dir: [1, 0],
        type: 'snake',
        color: 'rgb(15, 160, 70)'
    };
}
// END: snake

// START: move
function move(snake, grow) {
    var body = snake['body'];
    var dir = snake['dir'];
    snake['body'] = [addPoints(_.first(body), dir)].concat(grow ? body : _.initial(body));
    return snake;
}
// END: move

// START: turn
function turn(snake, newdir) {
    snake['dir'] = newdir;
    return snake;
}
// END: turn

// START: win?
function isWin(snake) {
    return snake['body'].length >= WIN_LENGTH;
}
// END: win?

// START: lose?
function isHeadOverlapsBody(snake) {
    var head = _.first(snake['body']);
    var body = _.rest(snake['body']);
    return 0 < _.where(body, head).length;
}

var isLose = isHeadOverlapsBody;
// END: lose?

// START: eats?
function isEats(snake, apple) {
    return _.isEqual(_.first(snake['body']), apple['location']);
}
// END: eats?

// ----------------------------------------------------------
// mutable model
// ----------------------------------------------------------
var Snake;
var Apple;

// START: update-positions
function updatePositions() {
    if (isEats(Snake, Apple)) {
        Apple = createApple();
        Snake = move(Snake, 'grow');
    } else {
        Snake = move(Snake);
    }
}
// END: update-positions

// START: update-direction
function updateDirection(newdir) {
    Snake = turn(Snake, newdir);
}
// END: update-direction

// START: reset-game
function resetGame() {
    Apple = createApple();
    Snake = createSnake();
}
// END: reset-game

// ----------------------------------------------------------
// gui
// ----------------------------------------------------------
// START: fill-point
function fillPoint(context, pt, color) {
    context.fillStyle = color;
    context.beginPath();
    context.fillRect.apply(context, pointToScreenRect(pt));
}
// END: fill-point

// START: paint
function paint(context, object) {
    switch (object['type']) {
        case 'apple':
            fillPoint(context, object['location'], object['color']);
            break;
        case 'snake':
            _.each(object['body'], function(element) {
                fillPoint(context, element, object['color']);
            });
            break;
    }
}
// END: paint

// START: game-panel
function gamePanel(canvas) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, (WIDTH + 1) * POINT_SIZE, (HEIGHT + 1) * POINT_SIZE);
    paint(context, Apple);
    paint(context, Snake);
    updatePositions();
    if (isWin(Snake)) {
        alert('You win!');
        resetGame();
    }
    if (isLose(Snake)) {
        alert('You lose!');
        resetGame();
    }
}
// END: game-panel

// START: game
function game() {
    Snake = createSnake();
    Apple = createApple();
    var canvas = document.getElementById('canvas');
    canvas.width = (WIDTH + 1) * POINT_SIZE;
    canvas.height = (HEIGHT + 1) * POINT_SIZE;
    document.addEventListener('keydown', function(e) {
        updateDirection(DIRS[e.keyCode]);
    }, true);
    window.setInterval(function() {
        gamePanel(canvas);
    }, TURN_MILLIS);
}
// END: game

game();
