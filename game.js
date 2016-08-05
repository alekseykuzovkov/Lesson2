var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var colors = require('colors');
var fs = require('fs');

if (_.has(argv, 'log')) {
	var logFile = argv['log'];
	console.log("Using log file: "+logFile);
	//Создать лог файл, если не существует
	fs.exists(logFile, function(exists) {
		if (!exists) {
			fs.writeFile(logFile, "",  function(err) {
				if (!_.isNull(err)) console.log("Error writing file: "+err);
			});
		}
	});
}
else {
	var logFile = false;
	console.log("'node game.js --log <filename>' to enable log");
}

var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout 
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Чтобы бесконечно задавать один и тот же вопрос... 
var askQuestion = function() {
	var correctAnswer = (getRandomInt(0,1)===0 ? 'heads':'tails');

	var checkAnswer = function(answer) {
		if (correctAnswer===answer) {
			console.log(("Yes, it's "+answer).green);
			var win = 1;
		}
		else {
			console.log(("No, it's "+correctAnswer).red);
			var win = 0;
		}

		if(logFile===false) return;

		fs.appendFile(logFile, win+"\n", function(err) {
			if (!_.isNull(err)) console.log("Error appending file: "+err);
		});
	}
	rl.question('Heads or tails? <heads/tails>:', function(answer) {
		if (answer!=='heads' && answer!=='tails') {
			console.log("Please enter 'heads' or 'tails'");
		}
		else {
			checkAnswer(answer);
		}
		askQuestion();
	});
}
askQuestion();

