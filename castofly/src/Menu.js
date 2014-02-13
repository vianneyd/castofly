var menu = {};

menu.init = function(){
	menu.isPaused = false;
	menu.isGameOver = false;
	menu.isInBoutique = false;
	document.getElementById("screen").style.display = "none";
	document.getElementById("pause").style.display = "block";
	document.getElementById("gameover").style.display = "none";
}

menu.play = function(){
	if(!menu.isGameOver){
		if(menu.isPaused){
			document.getElementById("screen").style.display = "none";
			document.getElementById('instructions').style.display='block';
			PWG.playGame();
		}
		menu.isPaused = false;
	}
	document.getElementById("bpause").className = "hud_button";
}
menu.pause = function(){
	if(!menu.isGameOver && !menu.isInBoutique){
		if(!menu.isPaused){
			document.getElementById("screen").style.display = "block";
			document.getElementById('instructions').style.display='none';
			PWG.pauseGame();
		}
		menu.isPaused = true;
	}
	document.getElementById("bpause").className = "hud_button toggle";
}
menu.togglePause = function(){
	if(menu.isGameOver){
		PWG.pauseGame();PWG.init();PWG.startTheGame();
	} else if (!menu.isInBoutique) {
		if(menu.isPaused){
			menu.play();
		}else{
			menu.pause();
		}
	}
}
menu.toggleAudio = function(){
	if(PWG.musicLoaded){
		if(music.paused){
			music.play();
			document.getElementById("bmusic").className = "hud_button";
		}else{
			music.pause();
			document.getElementById("bmusic").className = "hud_button toggle";
		}
	}else if(gameIsMobile){
		music.src = music_source;
		music.addEventListener('canplaythrough', function(){
			PWG.musicLoaded = true;
		}, false);
		music.load();
		music.play();
		musicLoopInit();
		document.getElementById("bmusic").className = "hud_button";
	}
}
menu.gameover = function(){
	menu.isGameOver = true;
	document.getElementById("screen").style.display = "block";
	document.getElementById("gameover").style.display = "block";
	document.getElementById("pause").style.display = "none";
	PWG.pauseGame();
	HUD.printStats();
}

menu.toggleBoutique = function(){
	if(menu.isGameOver){
		PWG.pauseGame(); PWG.init(); PWG.startTheGame();
	}else{
		if(menu.isInBoutique){
			menu.exitBoutique();
		}else{
			menu.enterBoutique();
		}
	}
}

menu.enterBoutique = function(){
	if(!menu.isGameOver){
		if(!menu.isInBoutique){
			if (menu.isPaused){
				menu.isPaused = false;
				document.getElementById("screen").style.display = "none";
			}
			document.getElementById("boutique").style.display = "block";
			//document.getElementById("screen").style.display = "block";
			document.getElementById('instructions').style.display='none';
			PWG.pauseGame();
		}
		menu.isInBoutique = true;
	}
	document.getElementById("bboutique").className = "hud_button toggle";
}


menu.exitBoutique = function(){
	if(!menu.isGameOver){
		if(menu.isInBoutique){
			document.getElementById("boutique").style.display = "none";
			//document.getElementById("screen").style.display = "none";
			document.getElementById('instructions').style.display='block';
			PWG.playGame();
		}
		menu.isInBoutique = false;
	}
	document.getElementById("bboutique").className = "hud_button";
}

menu.showOptionMenu = function () {
	document.getElementById("MainMenu").style.display = "none";
	document.getElementById('OptionMenu').style.display = 'block';
}

menu.exitFromOptionMenu = function () {
	document.getElementById("MainMenu").style.display = 'block';
	document.getElementById('OptionMenu').style.display = "none";
}

menu.toggleLanguage = function () {
	switch (document.getElementById("OptionMenuLanguageName").innerHTML){
		case "Français":
			document.getElementById("OptionMenuLanguageName").innerHTML = "English";
			break;
		case "English":
			document.getElementById("OptionMenuLanguageName").innerHTML = "Français";
			break;
		default:
			break;
	}
}

menu.toggleGameSpeed = function(){
	var speed = parseInt(document.getElementById("GameSpeed").innerHTML);
	if (speed >= 400) {
		speed = 50;
	} else {
		speed = speed + 25;
	}
	document.getElementById("GameSpeed").innerHTML = speed;
}
