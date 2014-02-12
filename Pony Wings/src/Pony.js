var pony = {};
pony.image = new Image(800,600);

pony.init = function(){
	pony.coord = new Object();
	pony.initial = new Object(); pony.initial.vel = new Object();
	pony.vel = new Object();
	pony.coord.x = -10;
	pony.coord.y = -201;
	pony.initial.vel.x = 1.9*parseFloat(document.getElementById("GameSpeed").innerHTML)*0.01;
	pony.initial.vel.y = -0.9;//*parseFloat (document.getElementById("ChuteSpeed").innerHTML); // TODO: mettre ailleurs, là c'est plutôt la gravité
	pony.vel.x = pony.initial.vel.x; pony.vel.y = pony.initial.vel.y;
	pony.rotation = 0;
	pony.width = pony.height = 200;
	pony.frame = 0;
	
	pony.touchGround = true;
	pony.touchGround2 = true;
	pony.touchGround3 = false;
	pony.keyDown = false;
	
	// Nouveaux Bonus (NdV):
	pony.turbos = 10;
	pony.chronos = 10;
	pony.parachutes = 10;
	pony.synchDataM2V ();
	
	pony.parachuteMode = false;
	pony.turboMode = false;
	pony.turboPower = 0;
}
pony.startMoving = false;

pony.synchDataM2V = function () {
	document.getElementById ("turboCount").innerHTML  = pony.turbos;
	document.getElementById ("chronoCount").innerHTML = pony.chronos;
	document.getElementById ("parachuteCount").innerHTML = pony.parachutes;
	if (pony.chronos <= 1){
		document.querySelector ("#chronoButtonLabel").innerHTML = "Chrono";
	} else {
		document.querySelector ("#chronoButtonLabel").innerHTML = "Chronos";	
	} if (pony.parachutes <= 1){
		document.querySelector ("#parachuteButtonLabel").innerHTML = "Parachute";
	} else {
		document.querySelector ("#parachuteButtonLabel").innerHTML = "Parachutes";	
	} if (pony.turbos <= 1){
		document.querySelector ("#turboButtonLabel").innerHTML = "Turbo";
	} else {
		document.querySelector ("#turboButtonLabel").innerHTML = "Turbos";	
	} document.getElementById ("turboCountMM").innerHTML  = pony.turbos;
	document.getElementById ("chronoCountMM").innerHTML = pony.chronos;
	document.getElementById ("parachuteCountMM").innerHTML = pony.parachutes;
}

pony.useChrono = function () {
	if (pony.chronos > 0) {
		HUD.timer += 0.1;
		if (HUD.timer > 1.0){
			HUD.timer = 1.0;
		} pony.chronos -= 1;	
		pony.synchDataM2V ();
	} 
}

pony.useParachute  = function () {
	if (pony.parachutes > 0) {
		pony.parachuteMode  = true;
		pony.parachutes -= 1;
		pony.synchDataM2V ();
	}
}


pony.useTurbo  = function () {
	if (pony.turbos > 0) {
		pony.turboMode  = true;
		pony.turboPower += 50;	
		pony.turbos -= 1;
		pony.synchDataM2V ();
	}
}

pony.draw = function()
{
	// TRANSFORM
	ctx.save();
	ctx.translate(0,pony.coord.y);
	ctx.rotate(pony.rotation);
	if(HUD.timer>0){
		if(pony.touchGround2){
			if(pony.keyDown){
				ctx.drawImage( pony.image, 202, Math.floor(pony.frame)*200+2,196,196, 
								-200/2, -200+20, 200, 200);
			}else{
				ctx.drawImage( pony.image, 2, Math.floor(pony.frame)*200+2,196,196,
								 -200/2, -200+20, 200, 200);
			}
		}else{
			if(HUD.timer>0 && pony.keyDown){
				ctx.drawImage( pony.image, 602, Math.floor(pony.frame)*200+2,196,196,
								 -200/2, -200+20, 200, 200);
			}else{
				ctx.drawImage( pony.image, 402, Math.floor(pony.frame)*200+2,196,196,
								-200/2, -200+20, 200, 200);
			}
		}
	}else{
		if(!pony.touchGround3){
			if(pony.touchGround2){
				pony.touchGround3 = true;
				PWG.shake = 100;
			}
		}
		if(pony.touchGround3){
			ctx.drawImage( pony.image, 800, Math.floor(pony.frame)*200,200,200, 
							-200/2, -200+20, 200, 200);
		}else{
			ctx.drawImage( pony.image, 400, Math.floor(pony.frame)*200,200,200,
								-200/2, -200+20, 200, 200);
		}
	}
	// RESTORE
	ctx.restore();
}

pony.enterFrame = function()
{
	// KEY
	pony.keyDown = kCont.down;
	//if(!pony.startMoving){
		//pony.startMoving = pony.keyDown; // NdVianney : permet de commencer le jeu en touchant l'écran
		/*
		// Play music if not mobile and upon starting game // Commented by Me
		if(pony.keyDown){
			if( !gameIsMobile && music.paused ){
				//music.currentTime = 0;
				menu.toggleAudio();
			}
		}
		*/
	//}
	
	// FRAME
	pony.frame += (2+pony.vel.x)/60;
	if(pony.keyDown){
		pony.frame += 0.2;
	}
	pony.frame %= 3;
	
	if(pony.startMoving){
		
		//Begin: Prise en compte du bonus Turbo (NdV):
		if (pony.turboMode) {
			pony.turboPower -= 1;
			if (pony.turboPower <= 0){
				pony.turboMode  = false;
				pony.turboPower = 0;
			}
		}//End.
		
		// Velocity Addition
		if(HUD.timer<=0){
			pony.vel.x*=0.98;
		}
		if(HUD.timer>0 && pony.keyDown){
			if(pony.touchGround2){
				if(pony.vel.y>0){
					pony.vel.y += 0.3; 
					//pony.vel.x += 0.05; 
				}else{
					//pony.vel.y -= 0.05; 
					pony.vel.x += 0.2; 
					//pony.vel.x += 0.1; //Should just be pushing fwd
				}
			}else{
				pony.vel.y += 0.25;
			}
		}else{
			if(HUD.timer>0 && pony.touchGround2){
				if(pony.vel.y<0 && pony.vel.x<3){
					pony.vel.x += 0.05;
				}
			}
			if(HUD.timer<=0 && !pony.touchGround2){
				pony.vel.y+=0.2;
			}
			pony.vel.y += 0.08;
		}
		
		// Move coords
		// AVEC LE TURBO:
		pony.coord.x += pony.vel.x + pony.turboPower;
		var terrY = terrain.funct(pony.coord.x);
		if(pony.touchGround3){
			pony.coord.y += terrY;
		}else{
			pony.coord.y += pony.vel.y;
		}	
		// Terrain Update
		
		terrain.updateX(pony.coord.x);
		
		// Correct coords
		/*pony.touchGround = (   ( pony.vel.y>0 && pony.coord.y>terrY-2 )
	                       || ( pony.vel.y<0 && pony.coord.y>terrY-0.5 )
	                       );*/
	 	//pony.touchGround3 = pony.coord.y>terrY-100;
	 	pony.touchGround2 = pony.coord.y>terrY-5;
	 	pony.touchGround = pony.coord.y>terrY;
		if(pony.touchGround)
		{
			pony.coord.y = terrY;
			// Slope & Projection
			var terrSlope = terrain.functDiff(pony.coord.x);
			var terrLength = Math.sqrt(1*1+terrSlope*terrSlope);
			var dotProduct = pony.vel.x*1 + pony.vel.y*terrSlope;
			dotProduct = dotProduct/terrLength;
			pony.vel.x = dotProduct/Math.sqrt(1+terrSlope*terrSlope);
			if(pony.vel.x<0.1){
				pony.vel.x=0.1;
			}
			pony.vel.y = pony.vel.x*terrSlope;
			pony.vel.x*=0.995;
			pony.vel.y*=0.995;
		}else{
			//pony.coord.y += pony.vel.y;
		}
		
		pony.rotation = Math.atan2(pony.vel.y,pony.vel.x + pony.turboPower);
		if(pony.rotation>Math.PI*0.3){
			pony.rotation*=3;
			pony.rotation+=Math.PI*0.3;
			pony.rotation*=0.25;
		}
	
	}
}


pony.buyMoney = function (n) {
	ourCAStore.buyMoney(n);
}

pony.buyChrono = function (n)
{
	pony.chronos += n;
	pony.synchDataM2V ();
}

pony.buyParachute = function (n)
{
	pony.parachutes += n;
	pony.synchDataM2V ();
}


pony.buyTurbo = function (n)
{
	pony.turbos += n;
	pony.synchDataM2V ();
}
