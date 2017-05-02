		function extractData(letterData, letterName) {
			var cards = [], colorScales, divinatoryMeanings;
			var innerTable = "<table><tr><th id='first'></th><th id='second'></th>";
			$.each( letterData, function( key, value ) {
				if (key == 'img') {
					cards.push(value); //assign either the Major Arcana card or the small cards to cards
				} else if (key == 'courts') { //if there are any court cards, push them on cards, too
					cards.push(value);
				} else if (key == 'colorScales') {
					colorScales = value;
				} else if (key == 'divinatory') {
					divinatoryMeanings = value;
				} else {
					innerTable += ('<tr><td>' + key + ':</td><td>' + value + '</td></tr>');
				}
			});
			innerTable += "</table>";
			if (letterName == "tau") { 
				innerTable += '<div id="bisClicker" data-letter="tauBis"><p>Click to toggle bis values</p></div>'; 								
			}
			if (letterName == "tauBis") { 
				innerTable += '<div id="bisClicker" data-letter="tau"><p>Click to toggle bis values</p></div>'; 								
			}
			if (letterName == "shin") { 
				innerTable += '<div id="bisClicker" data-letter="shinBis"><p>Click to toggle bis values</p></div>'; 								
			}
			if (letterName == "shinBis") { 
				innerTable += '<div id="bisClicker" data-letter="shin"><p>Click to toggle bis values</p></div>'; 								
			}
			return ([innerTable, colorScales, cards, divinatoryMeanings]);
		}
		
		function createOutput(innerTable, colorScales, cards, divinatoryMeanings) {
			clearContent();
			$('#text-output').append(innerTable);
			$('#bisClicker').click(function () {
				var letterName = $(this).data('letter');
				var letterData = qblData[letterName];
				var data = extractData(letterData, letterName);	
				createOutput(data[0], data[1], data[2], data[3]);
			});
			$.each( colorScales, function( scale, hue ) {
				makeColors(scale, hue);
			});
			if (cards.length == 2) { // combination small cards and court cards
				displayCards (cards[0], cards[1], divinatoryMeanings);
			} else if (cards.length == 1) { // single card or array of small cards
				displayCards (cards[0], divinatoryMeanings);
			}
		}
		
		function makeColors (scale, hue) {
			$('#colors').css({'background': 'white'});
			/*$('.circle').css({'border':'3px solid black'});*/
			$('.circle').css({'display':'block'})
			var circleID = "#" + scale;
			if (Array.isArray(hue)) { //see if there's more than one color //
				$(circleID).css({ 'background': hue[0]}); // if gradient not supported, just display the first color
				// try gradients for various browsers
				var newGradient = '-moz-linear-gradient(right,' + hue + ')';
				$(circleID).css({ 'background': newGradient});
				newGradient = '-o-linear-gradient(right,' + hue + ')';
				$(circleID).css({ 'background': newGradient});
				newGradient = 'linear-gradient(right,' + hue + ')';
				$(circleID).css({ 'background': newGradient});
				newGradient = '-webkit-linear-gradient(right,' + hue + ')';
				$(circleID).css({ 'background': newGradient});
				if (hue[hue.length - 1] == "quartered") {
					console.log("hi");
					drawQuartered();
				}
			} else {
				$(circleID).css({"background": hue});
			}
			
		}
		
		function clearContent () {
			$('#text-output').html('');
			$('#tarot-card').html('');
			$('#tarot-card img').prop('title', '');
			$('#tarot-card').prop('title', '');
			$('.circle').css({'background':'#ffffff'});
			clearCanvas();
			$('#clicker').html('');
			$("#clicker").off("click");
		}
		
		function parseMeaning(cardMeanings) { //assign appropriate meanings to cards 
			$.each(cardMeanings, function (key, value) {
				if (key == 'major') {
					$('#tarot-card img').prop('title', value);
				} else if (key == 'courts') {
					var courtCardsMeanings = value;
					$.each(courtCardsMeanings, function (index, card) {
						var courtCardID = "#court" + index;
						$(courtCardID).prop('title', card);
					});
				} else if (key == 'smalls') {
					var smallCardsMeanings = value;
					$.each(smallCardsMeanings, function (index, card) {
						var smallCardID = "#small" + index;
						$(smallCardID).prop('title', card);
					});
				}
			})
		}
		
		function displayCards (arg1,arg2,divinatoryMeanings) { //assign cards to the #tarot-card div and assign meanings to the cards as titles
			if (arguments.length == 2) { //then it's either Major Arcana or just Small Cards
				if (Array.isArray(arg1)) { // must be an array of Small Cards
					$.each( arg1, function(index, image) {	
						var smallID = "'small" + index + "'";
						var imgSource = "<img src='" + image + "' style='width:50%; float:left;' id=" + smallID + ">"; //assign each a unique id for parseMeaning to reference
						$('#tarot-card').append(imgSource);
					});
					parseMeaning(arg2); //arg2 is holding div meanings
				} else { // it's just a Major Arcana card, so display it
					var imgSource = "<img src='" + arg1 + "'>";
					$('#tarot-card').html(imgSource);
					parseMeaning(arg2); //arg2 is holding div meanings
				}
			} else { //it's both small cards and court cards, so we need a toggle
				displaySmallsWithToggle (arg1,arg2,divinatoryMeanings);
			}
		}
		
		function displaySmallsWithToggle (smalls, courts, divinatoryMeanings) {
			$('#tarot-card').html('');
			$.each(smalls, function(index,image) {
				var smallID = "'small" + index + "'";
				var imgSource = "<img src='" + image + "' style='width:50%; float:left;' id=" + smallID + ">"; //assign each a unique id for parseMeaning to reference
				$('#tarot-card').append(imgSource);
				$('#clicker').html('<a href="javascript:;">Display court cards</a>');
			})
			parseMeaning(divinatoryMeanings);
			$('#clicker').click(function () {
				displayCourtsWithToggle(smalls,courts,divinatoryMeanings);
			})
		}
		
		function displayCourtsWithToggle (smalls,courts,divinatoryMeanings) {
			$('#tarot-card').html('');
			$.each(courts, function(index,image) {
				var courtID = "'court" + index + "'";
				var imgSource = "<img src='" + image + "' style='width:50%; float:left;' id=" + courtID + ">"; //assign each a unique id for parseMeaning to reference
				$('#tarot-card').append(imgSource);
				$('#clicker').html('<a href="javascript:;">Display small cards</a>');
			})
			parseMeaning(divinatoryMeanings);
			$('#clicker').click(function () {
				displaySmallsWithToggle(smalls,courts,divinatoryMeanings);
			})
		}
		
		function drawQuartered () {
			var canvas = document.getElementById('canvas');
		
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				ctx.beginPath();
				ctx.arc(45, 45, 45, Math.PI / 4, 3 * Math.PI / 4, false); //bottom quadrant
				ctx.lineTo(45, 45);
				ctx.fillStyle = "black";
				ctx.fill();
				
				ctx.beginPath();
				ctx.arc(45, 45, 45, 3 * Math.PI / 4, 5 * Math.PI / 4, false); // left quadrant
				ctx.lineTo(45, 45);
				ctx.fillStyle = "#80461B";
				ctx.fill();
				
				ctx.beginPath();
				ctx.arc(45, 45, 45, 5 * Math.PI / 4, 7 * Math.PI / 4, false); //top quadrant
				ctx.lineTo(45, 45);
				ctx.fillStyle = "#E4D00A";
				ctx.fill();
				
				ctx.beginPath();
				ctx.arc(45, 45, 45, 7 * Math.PI / 4, Math.PI / 4, false); //right quadrant
				ctx.lineTo(45, 45);
				ctx.fillStyle = "#808000";
				ctx.fill();
			}
		}
		
		function clearCanvas () {
			var canvas = document.getElementById('canvas');
		
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				ctx.globalAlpha = 1;
				ctx.clearRect(0,0,90,90);
			}
		}