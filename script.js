var app = angular.module("Scavenger_Hunt", ["ngRoute"]);

app.controller('welcome_Controller', ['$scope', function ($scope) {
    $('#hunt1').hide();
    $('#hunt2').hide();
    $('#hunt3').hide();

    var value = Math.floor(Math.random() * 3) + 1;
    var puzzle_image;

    if (value == 1) {
        $('#hunt1').show();
        $('#hunt2').hide();
        $('#hunt3').hide();
    }
    else if (value == 2) {
        $('#hunt1').hide();
        $('#hunt2').show();
        $('#hunt3').hide();
    }
    else if (value == 3) {
        $('#hunt1').hide();
        $('#hunt2').hide();
        $('#hunt3').show();
    };

//IMAGE PUZZLE 
    (function () {
        var Blank, Puzzle, Tile,
            __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

        Puzzle = (function () {
            function Puzzle(images) {
                var i, image, t, x, y, _i, _j, _len, _ref,
                    _this = this;
                this.images = images;
                this.changeImage = __bind(this.changeImage, this);
                this.switchTwo = __bind(this.switchTwo, this);
                this.renderBoard = __bind(this.renderBoard, this);
                this.blankPosition = __bind(this.blankPosition, this);
                this.checkIfWon = __bind(this.checkIfWon, this);
                this.mixup = __bind(this.mixup, this);
                this.places = [];
                this.initialPlaces = [];
                _ref = this.images;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    image = _ref[_i];
                    $('#previews').append('<img src="' + image + '" class="mini"/>');
                }
                this.image = this.images[0];
                $('.mini').bind('click', function (event) {
                    return _this.changeImage(event.target.src);
                });
                for (i = _j = 0; _j <= 7; i = ++_j) {
                    x = Math.floor(i % 3) * 110;
                    y = Math.floor(i / 3) * 110;
                    t = new Tile(i, 110, 110, x, y, this.image);
                    this.places.push(t);
                }
                this.places.push(new Blank(8));
                this.initialPlaces = this.places.slice(0);
                this.mixup();
            }

            Puzzle.prototype.mixup = function () {
                var blankpos, i, randomNum, _i, _results;
                blankpos = 8;
                _results = [];
                for (i = _i = 0; _i <= 10; i = ++_i) {
                    randomNum = Math.floor(Math.random() * 9);
                    this.switchTwo(randomNum, blankpos);
                    _results.push(blankpos = randomNum);
                }
                return _results;
            };

            Puzzle.prototype.checkIfWon = function () {
                var i, _i;
                for (i = _i = 0; _i <= 8; i = ++_i) {
                    if (this.places[i] === this.initialPlaces[i]) {
                        continue;
                    } else {
                        return false;
                    }
                }
                return true;
            };

            Puzzle.prototype.blankPosition = function () {
                var place, pos, _i, _len, _ref;
                _ref = this.places;
                for (pos = _i = 0, _len = _ref.length; _i < _len; pos = ++_i) {
                    place = _ref[pos];
                    if (place["class"] === 'Blank') {
                        return pos;
                    }
                }
            };

            Puzzle.prototype.renderBoard = function () {
                var blank, t, _i, _len, _ref,
                    _this = this;
                blank = this.blankPosition();
                $('#canvas').html('');
                if (this.checkIfWon()) {
                    $('#canvas').append('<span id="windiv"><img src="' + this.image + '"/><div class="banner">Congrats!</div></span>');
                    if(value == 1){
                        $('#help_button').hide();
                        $('#give_up_button').hide();
                        $('#go_to_clue2_button').show();
                    }else if(value == 2){
                        $('#h2_help_button').hide();
                        $('#h2_give_up_button').hide();
                        $('#h2_finish_hunt_button').show();
                    }
                    return $('#windiv').show('slow');
                } else {
                    _ref = this.places;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        t = _ref[_i];
                        t.show(blank);
                    }
                    return $('.clickable').bind('click', function (event) {
                        var toSwitch;
                        toSwitch = parseInt(event.target.id);
                        return _this.switchTwo(toSwitch, _this.blankPosition());
                    });
                }
            };

            Puzzle.prototype.switchTwo = function (pos1, pos2) {
                var x, y;
                x = this.places[pos1];
                y = this.places[pos2];
                this.places[pos2] = x;
                this.places[pos1] = y;
                this.places[pos2].position = pos2;
                return this.renderBoard();
            };

            Puzzle.prototype.changeImage = function (image) {
                var panel, _i, _len, _ref;
                this.image = image;
                _ref = this.places;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    panel = _ref[_i];
                    if (panel["class"] !== 'Blank') {
                        panel.image = image;
                    }
                }
                return this.renderBoard();
            };

            return Puzzle;

        })();

        Tile = (function () {
            function Tile(position, width, height, x, y, image) {
                this.position = position;
                this.width = width;
                this.height = height;
                this.x = x;
                this.y = y;
                this.image = image;
                this["class"] = 'Tile';
            }

            Tile.prototype.show = function (blankPosition) {
                if (this.isAdjacent(blankPosition)) {
                    $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare clickable"></div>');
                } else {
                    $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare"></div>');
                }
                $("#" + this.position).css('background-position', '-' + this.x + 'px -' + this.y + 'px');
                return $("#" + this.position).css('background-image', 'url(' + this.image + ')');
            };

            Tile.prototype.isAdjacent = function (blanksPosition) {
                if (blanksPosition - 1 === this.position && (blanksPosition % 3) > 0 || blanksPosition + 1 === this.position && (blanksPosition % 3) < 2 || blanksPosition + 3 === this.position && (blanksPosition / 3) < 2 || blanksPosition - 3 === this.position && (blanksPosition / 3) > 0) {
                    return true;
                }
                return false;
            };

            Tile.prototype.setImage = function (image) {
                return this.image = image;
            };

            return Tile;

        })();

        Blank = (function () {
            function Blank(position) {
                this.position = position;
                this["class"] = 'Blank';
            }

            Blank.prototype.show = function () {
                return $('#canvas').append('<div class="innerSquare blank"></div>');
            };

            return Blank;

        })();

        $(document).ready(function () {
            var imgs, puzzle;
            if (value == 1) {
                //relative path
                imgs = ['hunt/images/Hunt1Picture.jpg'];
                puzzle = new Puzzle(imgs);
            }
            else if (value == 2) {
                $('#canvas').remove();
                $('.new_canvas').attr('id', 'canvas');
                imgs = ['hunt/images/Hunt2Picture.jpg'];
                puzzle = new Puzzle(imgs);
            } else {
                console.log('3rd picture');
            };
            return puzzle;
        });

    }).call(this);
    //IMAGE PUZZLE 

}]);

app.controller('hunt1_Controller', ['$scope', '$route', function ($scope, $route) {
    $(document).ready(function () {
        $('#q1').show();
        $('#canvas_heading').show();
        $('#help_button').show();
        $('#give_up_button').hide();
        $('#go_to_clue2_button').hide();
        $('#preview').hide();
        $('#q2').hide();
        $('#q3').hide();
        $('#q4').hide();
        $('#q5').hide();
        $('#winner').hide();
    });

    var wrong_answer = function(){
        $('.button').addClass('wrong_answer_shake');
        setInterval(function(){ 
            $('.button').removeClass('wrong_answer_shake');
        }, 1000);
        $scope.q1_answer = '';
        $scope.q2_answer = '';
        $scope.q3_answer = '';
        $scope.q4_answer = '';
        $scope.q5_answer = '';
    }

    //relative paths
    $scope.puzzle_image = 'hunt/images/Hunt1Picture.jpg';
    $scope.hint_icon = 'hunt/images/bulb.ico';
    $scope.grid_image = 'hunt/images/cube-grid.png';

    $scope.go_to_clue2 = function () {
        $('#q1').hide();
        $('#q2').show();
        $('#hint_div').show();
    };

    $scope.help = function () {
        $('#help_button').hide();
        $('#canvas_heading').hide();
        $('#give_up_button').show();
        $('#preview').show();
    };

    $scope.give_up = function() {
        $('#give_up_button').hide();
        $('#go_to_clue2_button').show();
    }

    $scope.is_visible = false;
    $scope.show_hint = function () {
        $scope.is_visible = !$scope.is_visible;
    };

    $scope.go_to_clue3 = function () {
        if ($scope.q2_answer == 'cube') {
            $('#q2').hide();
            $('#q3').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.q3_show_hint = function () {
        $('#q3_hint').show();
    };

    $scope.go_to_clue4 = function () {
        if ($scope.q3_answer == 'train') {
            
            $('#q3').hide();
            $('#q4').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.q4_show_hint = function () {
        $('#q4_hint').show();
    };

    $scope.go_to_clue5 = function () {
        if ($scope.q4_answer == 'zen') {
            
            $('#q4').hide();
            $('#q5').show();
        } else {
            wrong_answer();
        }
    }

    //relative paths
    $scope.phone_image = 'hunt/images/phone.jpg';
    $scope.booth_image = 'hunt/images/booth.jpg';
    
    $scope.finish_hunt = function(){
        if($scope.q5_answer == 'station'){
            
            $('#q5').hide();
            $('#winner').show();
        }else{
            wrong_answer();
        }
    };
}]);

app.controller('hunt2_Controller', ['$scope', function ($scope) {
    $(document).ready(function () {
        $('#h2q1').show();
        $('#h2q2').hide();
        $('#h2q3').hide();
        $('#h2q4').hide();
        $('#h2q5').hide();
        $('#h2winner').hide();
    });

    var wrong_answer = function(){
        $('.button').addClass('wrong_answer_shake');
        setInterval(function(){ 
            $('.button').removeClass('wrong_answer_shake');
        }, 1000);
        $scope.h2q1_answer = '';
        $scope.h2q2_answer = '';
        $scope.h2q3_answer = '';
        $scope.h2q4_answer = '';
    }

    //relative paths
    $scope.h2_puzzle_image = 'hunt/images/Hunt2Picture.jpg';
    $scope.hint_icon = 'hunt/images/bulb.ico';
    $scope.grid_image = 'hunt/images/cube-grid.png';

    $scope.give_up = function () {
        $('#give_up_button').hide();
        $('#finish_hunt_button').show();
    };

    $scope.is_visible = false;
    $scope.h2q1_show_hint = function () {
        $scope.is_visible = !$scope.is_visible;
    };

    $scope.go_to_h2_clue2 = function () {
        if ($scope.h2q1_answer == 'zen') {
            $('#h2q1').hide();
            $('#h2q2').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.go_to_h2_clue3 = function () {
        if ($scope.h2q2_answer == 'cube') {
            $('#h2q2').hide();
            $('#h2q3').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.go_to_h2_clue4 = function () {
        if ($scope.h2q3_answer == 'cyan') {
            $('#h2q3').hide();
            $('#h2q4').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.go_to_h2_clue5 = function () {
        if ($scope.h2q4_answer == 'game') {
            $('#h2q4').hide();
            $('#h2q5').show();
            $('#h2_help_button').show();
            $('#h2_give_up_button').hide();
            $('#h2_finish_hunt_button').hide();
            $('.h2_preview').hide();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    };

    $scope.help = function() {
        $('#h2_canvas_heading').hide();
        $('#h2_help_button').hide();
        $('#h2_give_up_button').show();
        $('.h2_preview').show();
    }

    $scope.give_up = function(){
        $('#h2_give_up_button').hide();
        $('#h2_finish_hunt_button').show();
    }

    $scope.finish_hunt2 = function(){
        $('#h2q5').hide();
        $('#h2winner').show();
    };

    $scope.show_hint = function () {
        $scope.is_visible = !$scope.is_visible;
    };
}]);

app.controller('hunt3_Controller', ['$scope', function ($scope) {
    $(document).ready(function () {
        $('#h3q1').show();
        $('#h3q2').hide();
        $('#h3q3').hide();
        $('#h3q4').hide();
        $('#h3q5').hide();
        $('#h3_winner').hide();
    });

    var wrong_answer = function(){
        $('.button').addClass('wrong_answer_shake');
        setInterval(function(){ 
            $('.button').removeClass('wrong_answer_shake');
        }, 1000);
        $scope.h3q1_answer = '';
        $scope.h3q2_answer = '';
        $scope.h3q3_answer = '';
        $scope.h3q4_answer = '';
        $scope.h3q5_answer = '';
    }

    //relative paths
    $scope.hint_icon = 'hunt/images/bulb.ico';
    $scope.grid_image = 'hunt/images/cube-grid.png';

    $scope.is_visible = false;
    $scope.show_hint = function () {
        $scope.is_visible = !$scope.is_visible;
    };

    $scope.go_to_h3clue2 = function(){
        if ($scope.h3q1_answer == 'vulcan') {
            
            $('#h3q1').hide();
            $('#h3q2').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    }

    $scope.go_to_h3clue3 = function(){
        if ($scope.h3q2_answer == 'cyan') {
            
            $('#h3q2').hide();
            $('#h3q3').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    }

    $scope.go_to_h3clue4 = function(){
        if ($scope.h3q3_answer == 'game') {
            
            $('#h3q3').hide();
            $('#h3q4').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    }

    $scope.go_to_h3clue5 = function(){
        if ($scope.h3q4_answer == 'train') {
            
            $('#h3q4').hide();
            $('#h3q5').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    }

    $scope.finish_hunt3 = function(){
        if ($scope.h3q5_answer == 'zen') {
            
            $('#h3q5').hide();
            $('#h3_winner').show();
            $scope.is_visible = false;
        } else {
            wrong_answer();
        }
    }

}]);