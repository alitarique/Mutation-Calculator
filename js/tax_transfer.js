model = {};
// Last update 2021-02-18
// Base on http://www.calculconversion.com/calcul-taxe-de-bienvenue-mutation.html
//
(function($){
	const $bounds = [
		52800,
		264000
	];



    model.city_list = [
		{code: 'regular', name: 'Regular rates', rates: [0.005,0.01,0.015], bounds : [$bounds[0],$bounds[1],99000000]},
		{code: 'alma', name:'Alma', bounds:[$bounds[0],$bounds[1],505200,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'beaconsfield', name:'Beaconsfield', bounds:[$bounds[0],$bounds[1],517100,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'blainville', name:'Blainville', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.015]},
		{code: 'boisbriand', name:'Boisbriand', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'boucherville', name:'Boucherville', bounds:[$bounds[0],$bounds[1],500000,750000,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'brossard', name:'Brossard', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'candiac', name:'Candiac', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'chambly', name:'Chambly', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.025]},
		{code: 'chateaugay', name:'Châteauguay', bounds:[$bounds[0],$bounds[1],505200,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'cotestluc', name:'Côte Saint-Luc', bounds:[$bounds[0],$bounds[1],1000000,5000000,99000000],rates:[0.005,0.01,0.015,0.025,0.03]},
		{code: 'dollarddesormeaux', name:'Dollard-Des-Ormeaux', bounds:[$bounds[0],$bounds[1],500000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'drummond', name:'Drummondville', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'farnham', name:'Farnham', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.0225]},
		{code: 'gatineau', name:'Gatineau', bounds:[$bounds[0],$bounds[1],1000000,5000000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'granby', name:'Granby', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'kirkland', name:'Kirkland', bounds:[$bounds[0],$bounds[1],500000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'assomp', name:'L\'assomption', bounds:[$bounds[0],$bounds[1],508700,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'laval', name:'Laval', bounds:[$bounds[0],$bounds[1],500000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'levis', name:'Lévis', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'longueil', name:'Longueuil', bounds:[$bounds[0],$bounds[1],527900,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'lorraine', name:'Lorraine', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'magog', name:'Magog', bounds:[$bounds[0],$bounds[1],500000,750000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'mascouche', name:'Mascouche', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'mcmasterville', name:'McMasterville', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'mercier', name:'Mercier', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'mirabel', name:'Mirabel', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.015]},
		{code: 'msthilaire', name:'Mont-Saint-Hilaire', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'mtl', name:'Montréal', bounds:[$bounds[0],$bounds[1],527900,1055800,2041900,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'mtremblant', name:'Mont-Tremblant', bounds:[$bounds[0],$bounds[1],527900,1055800,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'morinheights', name:'Morin-Heights', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.025]},
		{code: 'otterburnpark', name:'Otterburn Park', bounds:[$bounds[0],$bounds[1],500000,750000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'pointeclaire', name:'Pointe-Claire', bounds:[$bounds[0],$bounds[1],500000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025]},
		{code: 'quebec', name:'Québec', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.015]},
		{code: 'repentigny', name:'Repentigny', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'rimouski', name:'Rimouski', bounds:[$bounds[0],$bounds[1],524200,786300,1048500,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'ripon', name:'Ripon', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'rosemere', name:'Rosemère', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'rouynnoranda', name:'Rouyn-Noranda', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.015]},
		{code: 'saguenay', name:'Saguenay', bounds:[$bounds[0],$bounds[1],500000,1000000,99000000],rates:[0.005,0.01,0.015,0.025,0.03]},
		{code: 'steagathe', name:'Sainte-Agathe-des-Monts', bounds:[$bounds[0],$bounds[1],504000,786300,1048500,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'stbruno', name:'Saint-Bruno', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'stcolomban', name:'Saint-Colomban', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'stconstant', name:'Saint-Constant', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'steustache', name:'Saint-Eustache', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.025]},
		{code: 'stgeorge', name:'Saint-George', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'sthyacinthe', name:'Saint-Hyacinthe', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'stjean', name:'Saint-Jean-Sur-Richelieu', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'stjerome', name:'Saint-Jérôme', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'stlambert', name:'Saint-Lambert', bounds:[$bounds[0],$bounds[1],500000,99000000], rates:[0.005,0.01,0.015,0.03]},
		{code: 'stsauveur', name:'Saint-Sauveur', bounds:[$bounds[0],$bounds[1],500000,99000000], rates:[0.005,0.01,0.015,0.03]},
		{code: 'stjulie', name: 'Sainte-Julie', bounds:[$bounds[0],$bounds[1],500000,99000000], rates: [0.005,0.01,0.015 ,0.025]},
		{code: 'stetherese', name:'Sainte-Thérèse', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'sallaberryvalleyfield', name:'Sallaberry-de-Valleyfield', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'shawinigan', name:'Shawinigan', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.015]},
		{code: 'sherbrooke', name:'Sherbrooke', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'soreltracy', name:'Sorel-Tracy', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'terrebonne', name:'Terrebonne', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'troisrivieres', name:'Trois-Rivières', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'valdavid', name:'Val David', bounds:[$bounds[0],$bounds[1],500000,750000,1000000,99000000],rates:[0.005,0.01,0.015,0.02,0.025,0.03]},
		{code: 'valdor', name:'Val D\'or', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.02]},
		{code: 'vaudreuildorion', name:'Vaudreuil-Dorion', bounds:[$bounds[0],$bounds[1],518000,99000000],rates:[0.005,0.01,0.015,0.03]},
		{code: 'victoriaville', name:'Victoriaville', bounds:[$bounds[0],$bounds[1],500000,99000000],rates:[0.005,0.01,0.015,0.03]}
	];

	model.init = function(){}

	model.load = function(){
		var lPropId = $.url().param("pid");
		model.loadCities().then( _ => {
			// $("#purchase_price").kendoNumericTextBox({
			//                       min: 5000,
			//                       max: 10000000,
			//                       step: 1000
			//                   });
			console.log('load', model.city_list);

			$("#btnProcess").click(this.calculsTaxe);

			if($('html').attr('lang')=='fr'){
				model.city_list[0].name = 'Taux régulier';
			}

			model.city_list.forEach(function($e,$i){
				let lNewOption = $('<option>').html($e.name);
				lNewOption.attr('value', $e.code);
				if($i == 0){
					lNewOption.attr('selected',true);
				}

				$("#specified-city").append(lNewOption);
			});

			$("#specified-city").selectmenu();
			

			if(instanceExists("ali.webcounters")){
				if(lPropId==null){
					lPropId = 'SITE';
				}
				ali.webcounters.add_interaction('mutation_calc',lPropId);
			}
		})
	}

	model.loadCities = function(){
		const promise = new Promise( ($resolve, $reject) => {
			fetch('https://api-v1.source.immo/lib/city-tax-transfer.json', {
				method: 'GET'
			}).then( $response => {
				if($response.status == 200){
					return $response.json();
				}
			})
			.then( $json => {
				model.transferTaxCityBoundaries = $json;
				model.city_list = $json.exceptions;
				$resolve();
			})
		})

		return promise;
	}

	model.devise = function(montant) {
        var n = "";
        if (montant < 0) {
		    n = "-";
		    montant =- montant;
		}

	    montant = parseInt(montant * 100);
	    smontant = montant.toString();

	    if (smontant.length == 0) smontant = "000";
	    if (smontant.length == 1) smontant = "00" + smontant;
	    if (smontant.length == 2) smontant = "0" + smontant;

	    return n + smontant.substring(0,smontant.length - 2) + "." +
	    smontant.substring(smontant.length - 2, smontant.length);
	},

    model.getTransferTax = function ($amount, $cityCode) {
		let amount = $amount;
	   
		const $boundaries = model.getTransferTaxBoundaries($cityCode);

		let rates = $boundaries.rates;
		let bounds = $boundaries.bounds;
		let transferTax = 0;
		console.log('getTransferTax', amount, rates, bounds, transferTax);

		for (let i=0; i<rates.length; i++) {
			if(amount <= 0) continue;

			const lRemovedAmount = (i==0) ? Math.min(bounds[i],amount) : Math.min(bounds[i] - bounds[i-1],amount);
			transferTax = transferTax + lRemovedAmount*rates[i];
			amount = amount - lRemovedAmount;
		}

		console.log('getTransferTax/return', transferTax);
		return Math.round(transferTax);
		
	};

	model.getTransferTaxBoundaries = function($cityCode){
		const $boundaries = JSON.parse(JSON.stringify(model.transferTaxCityBoundaries));
		if($boundaries == null) return null;
		
		const defaultBoundaries = $boundaries.general;
		console.log('getTransferTaxBoundaries::defaultBoundaries', defaultBoundaries);
		if($cityCode==null) return defaultBoundaries;

		const lFilteredBoundaries = $boundaries.exceptions.find(function($e){
			if(Array.isArray($cityCode)){
				if(Array.isArray($e.code)){
					return $cityCode.join(',') == $e.code.join(',');
				}
				else{
					return $cityCode.includes($e.code)
				}
			}
			
			if(Array.isArray($e.code)){
				return $e.code.includes($cityCode.toString());
			}
			return $e.code == $cityCode.toString()
		});
		console.log('getTransferTaxBoundaries::lFilteredBoundaries', lFilteredBoundaries);
		if(lFilteredBoundaries == null) return defaultBoundaries;
		
		const lResult = Object.assign({},lFilteredBoundaries);

		lResult.bounds.unshift(...defaultBoundaries.bounds.slice(0,2));
		lResult.rates.unshift(...defaultBoundaries.rates.slice(0,2));
		return lResult;
	}

    model.calculsTaxe = function(){
    	var me = model;

		//var rates = new Array(0.005,0.01,0.015);
        //var bounds = new Array(50000,200000,10000000);
		let lCityCode = $("#specified-city").val();
		let lAmountRaw = $("#purchase_price").val();
		
        let amount = me.devise(parseFloat(lAmountRaw.replace(/ /g,'')));
		
		const taxemutation = model.getTransferTax(amount, lCityCode.split(','));
		
		console.log('calculsTaxe', amount, taxemutation);

		// let lCity = model.city_list.find(function($e) {return $e.code == lCityCode});

		// console.log('City', lCity);
		// let rates = lCity.rates;
		// let bounds = lCity.bounds;
		// let lAmountRaw = $("#purchase_price").val();
		
        // let amount = me.devise(parseFloat(lAmountRaw.replace(/ /g,'')));
        // let taxemutation = 0;
        // for (i=0; i<rates.length; i++) {
		// 	if(amount <= 0) continue;

		// 	const lRemovedAmount = (i==0) ? Math.min(bounds[i],amount) : Math.min(bounds[i] - bounds[i-1],amount);
        //     taxemutation = taxemutation + lRemovedAmount*rates[i];
		// 	amount = amount - lRemovedAmount;
		// 	console.log('step',i,':', lRemovedAmount,'x',rates[i]*100,'% =', lRemovedAmount*rates[i], '(',taxemutation,') still have', amount, '$ to process' )
        // }
        
        me._showStringifyNumber({
        	value:taxemutation,
        	timeout: 1000,
        	elm: '#result .value',
        	format: $('#result .value').attr("data-format")
        });
        //$('#result .value').html(me.devise(taxemutation) + '$');
		addGTMEvent('useTaxTransferCalculator',{tax_value : taxemutation});

        return 1;
     },

     model._showStringifyNumber = function(options){
		$(options.elm).data("iteration_count",32);
		var me = this;
		console.log('_showStringifyNumber', options.value);

		var lLoop = function(){
			var lCount = $(options.elm).data("iteration_count");

			if(lCount <=0){
				$(options.elm).html(String.format(options.format, me._numToString(options.value,options.decimals) ));
			}
			else{
				lNumber = (options.value / lCount);
				$(options.elm).html(String.format(options.format, me._numToString(lNumber,options.decimals) ) );
				$(options.elm).data("iteration_count",lCount-1);

				lIId = window.setTimeout(lLoop,options.timeout/32);
			}
		}

		var lIId = window.setTimeout(lLoop,options.timeout/32);
	},

	model._numToString = function(value,decimals){
		decimals = decimals || 0;
		var lIntPart = Math.round(value).toString();
		var lDecimals = Math.floor((value - Math.floor(value))*Math.pow(10,decimals));

		var lResult = "";

		for(var i=1;i<=lIntPart.length;i++){
			var lChar = lIntPart[lIntPart.length-i];
			lResult = lChar + lResult;
			if(i%3==0){ lResult = " " + lResult;}
		}

		if(lDecimals!=0){
			lResult += "." + lDecimals;
		}
		return lResult
	}

})(jQuery);

model.init();