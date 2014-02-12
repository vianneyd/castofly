/**
 * 
 * Contient des variables globales pour ce fichier. 
 * 
 **/
ourCAStore = {
    caStore:null,
    CONSUMER_KEY: "https://www.creditagricolestore.fr/castore-oauth/resources/1/oauth/consumer/4e3837f1549e4704b9dca604d396e872",
    CONSUMER_SECRET: "9075a183a60c415f9f677a74b0bb35a8",
    BAMs: null,
    BAM:null,
    emitter: null,
    recipient: null,
    thune: 100,
    CHUTE_PRICE: 10,
    CHRONO_PRICE: 30, 
    TURBO_PRICE: 20,
};

/**
 * 
 * Méthode pour acheter des ressources ingame en effectuant un virement d'un de ses comptes à un autre (compte courant vers placement)
 * 
 */
ourCAStore.buyMoney = function (n) {
    console.log ("Début de la méthode d'achat de ressource ingame.");
    //document.cookie = "";
    //console.log ("Suppression de tous les cookies.");
    //step 1: création d'une structure de donnée pour la comm entre l'app et le CAStore: 
	if (ourCAStore.caStore == null){
		ourCAStore.caStore = new CAStore(
            ourCAStore.CONSUMER_KEY, 
            ourCAStore.CONSUMER_SECRET, 
            'http://localhost.fr:8081/callback_url.html',  /* Callback url */
            'http://localhost.fr:8080/'                    /* Proxy server address */ ); 
	} //document.getElementById("CAStoreScreenContainer").display = "block"; // NdV: à priori pas besoin, jQuery.show/hide do all the work.
	
    //step 2: authentification de l'user de l'app:
    ourCAStore.caStore.init (
        document.getElementById("CAStoreScreen")        /* Container for authentication iframe */, 
        function (err, caStore){
            if (err){
                return console.log('Error initializing CAStore comm object.', err);
            } $("#CAStoreScreenContainer").hide();
            //$("#authScreen").hide ();
            ourCAStore.buyMoney3 (n);
        }
    );
}

ourCAStore.buyMoney3 = function (n) {
    //step 3: Récupération des comptes BAMs
    if (ourCAStore.BAMs == null){
        ourCAStore.caStore.session.GET('comptesBAM', function (err, response){
            if (err){
                return console.log('Error getting BAM from CAStore', err);
            } ourCAStore.BAMs = response.data.compteBAMDTOs;
            ourCAStore.buyMoney4 (n);
        });
    } else {
        ourCAStore.buyMoney4 (n);
    }
}
    
    
ourCAStore.buyMoney4 = function (n) {
    ourCAStore.BAM = ourCAStore.BAMs[0];
	//step 4: Récupération des comptes bénéficiaires de virement:
    var onBeneficiairesObtained = function (err, response){
        if (err){
            return console.log('Error getting Beneficiaires from CAStore', err);
        } ourCAStore.Beneficiaires = [];
        for(var i in response.data.compteBeneficiaireDTOs){
            ourCAStore.Beneficiaires.push (response.data.compteBeneficiaireDTOs[i].id);
        } ourCAStore.buyMoney5 (n);
    }; ourCAStore.caStore.session.GET('comptesBAM/'+ourCAStore.BAM.id+'/comptesBeneficiaires', onBeneficiairesObtained);
}
    

ourCAStore.buyMoney5 = function (n) {    
    var x = n*5;
    //step 5: Récupération des comptes  émetteurs de virement
    var onEmetteursObtained = function (err, response){
        if (err){
            return console.log('Error getting Emetteurs from CAStore', err);
        } ourCAStore.Emetteurs = [];
        for(var i in response.data.compteEmetteurDTOs){
            ourCAStore.Emetteurs.push (response.data.compteEmetteurDTOs[i].id);
        } ourCAStore.buyMoney6 (n);       
    }; ourCAStore.caStore.session.GET('comptesBAM/'+ourCAStore.BAM.id+'/comptesEmetteurs', onEmetteursObtained);
}


ourCAStore.buyMoney6 = function (n) {
    //step 6: Saisie des paramètres de virements dans l'application (l'user choisit à qui l'argent doit être viré)
    if (ourCAStore.Emetteurs.length < 1) {
        return console.log ("Erreur il n'y pas de compte qui peut émettre de virements.");
    } else { 
        if (ourCAStore.Beneficiaires.length < 1) {
            return console.log ("Erreur il n'y pas de compte qui peut recevoir de virements.");        
        } else {
            var goBroke = false;
            for(var e in ourCAStore.Emetteurs){ 
                for(var b in ourCAStore.Beneficiaires){
                    ourCAStore.emitter = ourCAStore.Emetteurs[e];  
                    ourCAStore.recipient = ourCAStore.Beneficiaires[b];
                    if (ourCAStore.emitter != ourCAStore.recipient){
                        goBroke = true;
                        break;
                    } 
                } if (goBroke) {break;}
            }
            if (!goBroke){
                return console.log ("Erreur pour faire un virement il faut au moins 2 comptes.");
            }
        }
    } ourCAStore.buyMoney7 (n);
}


ourCAStore.buyMoney7 = function (n) {
    $("#CAStoreScreenContainer").show(); 
    ourCAStore.caStore.getTransferIFrame ({
            BAMId: ourCAStore.BAM.id,
            emitterId: ourCAStore.emitter,
            receiverId: ourCAStore.recipient,
            title: 'Test transfer - ' + new Date().toLocaleString(),
            amount: n
        },
        $("#CAStoreScreenContainer")[0],
        function(err, iframe){
            console.log('Transfer iframe:', iframe);
            // TODO: checker dans la iframe si le virement a réussi ... ce n'est pas ICI qu'il faut le faire: il faut ajouter une fonction dans la iframe.
            console.log('Le virement a réussi? no pas encore là on a juste le formulaire de validation ...');
            ourCAStore.thune += n; // TODO: ce n'est pas ici qu'il faut ajouter la thune, pour le moment c'est un hack pour que la démo fonctionne.
            //setTimeout (function(){$("#CAStoreScreenContainer").hide()}, 10000); //Todo: ne va pas comme ça!! pas ici qu'il faut le faire.
        });
}
    
   
