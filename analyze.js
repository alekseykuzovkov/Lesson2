var argv = require('minimist')(process.argv.slice(2));
var _ = require('underscore');
var fs = require('fs');

if (_.has(argv, 'log')) {
	var filename = argv['log'];
	fs.exists(filename, function(exists) {
		if (!exists) {
			console.log(filename+" does not exist");
			return;
		}

		fs.readFile(filename, function(err, data) {
			if (err) throw err;
			
			var logdata = data.toString().split("\n");
			//pop нужен потому, что последняя строка в логе пустая
			logdata.pop();

			var wins = 0, losses = 0, maxWinStreak = 0, maxLoseStreak = 0, currentStreak = -1, currentStreakCount = 0;
			_.each(logdata, function(num) {
				var result = parseInt(num);

				//currentStreak указывает, что мы считаем: проигрыши или выигрыши подряд
				if (currentStreak!==result) {
					if (currentStreak===0) {
						if(maxLoseStreak<currentStreakCount) maxLoseStreak = currentStreakCount;
					}
					else if (currentStreak===1) {
						if(maxWinStreak<currentStreakCount) maxWinStreak = currentStreakCount;
					}

					currentStreak = result;
					currentStreakCount = 1;
				}
				else {
					currentStreakCount++;
				}

				if (result===0) {
					losses++;
				}
				else {
					wins++;
				}
			});

			console.log("wins total: "+wins);
			console.log("losses total: "+losses);
			console.log("win/lose ratio: "+(wins/losses).toFixed(2));
			console.log("max win streak: "+maxWinStreak);
			console.log("max lose streak: "+maxLoseStreak);
		}) 
	});
}
else {
	console.log("'node analyze.js --log <filename>' to analyze log");
}