var ali = ali || {};

ali.webcounters = {
	is_loaded: false,
	site_token: null,
	page_referer: null,
	counters_queue: null,

	init: function(){

	},

	load: function(psite_token, preferer){
		this.site_token = psite_token;
		this.page_referer = preferer;
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){
			console.log('webcounter deny');
			return;
		}

		console.log('webcounter registered for ', psite_token, ' from ', preferer);
		
		try{
			net.id3.webcounters.register_counters({
				data:{
					counters: [
						// access
						{site_token:psite_token, group_name: 'access', keyname: 'views', keyname_description: 'Vues', keyname_description_en: 'Views'},
						{site_token:psite_token, group_name: 'access', keyname: 'visitors', keyname_description: 'Visiteurs', keyname_description_en: 'Visitors'},
						// interactions
						{site_token:psite_token, group_name: 'interactions', keyname: 'sidebar', keyname_description: 'Clique sur la barre latérale', keyname_description_en: 'Sidebar clicked'},
						{site_token:psite_token, group_name: 'interactions', keyname: 'favorites', keyname_description: 'Ajouts aux favoris', keyname_description_en: 'Added to favorites'},
						{site_token:psite_token, group_name: 'interactions', keyname: 'calcultator', keyname_description: 'Prix calculés', keyname_description_en: 'Prices calculated'},
						{site_token:psite_token, group_name: 'interactions', keyname: 'mutation_calc', keyname_description: 'Taxes de mutation calculées', keyname_description_en: 'Mutation taxes calculated'},
						// forms
						{site_token:psite_token, group_name: 'forms', keyname: 'realestate_alert', keyname_description: 'Alertes immobilière', keyname_description_en: 'Real estate alerts'},
						{site_token:psite_token, group_name: 'forms', keyname: 'evaluation_request', keyname_description: 'Demandes d\'évaluation', keyname_description_en: 'Evaluation request'},
						{site_token:psite_token, group_name: 'forms', keyname: 'footer_contact', keyname_description: 'Formulaire de contact (pied de page)', keyname_description_en: 'Contact form (footer)'},
						{site_token:psite_token, group_name: 'forms', keyname: 'contact', keyname_description: 'Formulaire de contact', keyname_description_en: 'Contact form'},
					]
				}
			});
		}
		catch(e){
			return;
		}
		this.is_loaded = true;

		if(this.counters_queue!=null){
			for(var i=0;i<this.counters_queue.length;i++){
				this.counters_queue[i].site_token = this.site_token;
			}

			console.log(this.counters_queue);
			net.id3.webcounters.inc_counters({
				data: {
					counters: this.counters_queue
				}
			});
		}
	},

	add_counters_to_queue: function(counters){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }
		if(this.counters_queue == null){
			this.counters_queue = [];
		}

		for(var i=0;i<counters.length;i++){
			this.counters_queue.push(counters[i]);
		}

	},

	add_view: function(){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		var lCounters = [];
		lCounters.push({site_token:this.site_token, keyname: 'views', track_item_id: 'SITE' });

		// check for returning user
		if(!localStorage["returning_visitor"]){
			localStorage["returning_visitor"] = true;
			lCounters.push({site_token:this.site_token, keyname:'visitors', track_item_id: 'SITE'});
		}
		
		if(!this.is_loaded){
			this.add_counters_to_queue(lCounters);
		}
		else{
			try{
				net.id3.webcounters.inc_counters({
					data: {
						counters: lCounters
					}
				});
			}
			catch(e){}
		}
		
	},

	add_listing_view: function(listing_id){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		var lCounters = [];
		lCounters.push({site_token:this.site_token, keyname: 'views', track_item_id: listing_id });

		// check for returning user
		if(!localStorage["returning_visitor." + listing_id]){
			localStorage["returning_visitor." + listing_id] = true;
			lCounters.push({site_token:this.site_token, keyname:'visitors', track_item_id: listing_id});
		}

		if(!this.is_loaded){
			this.add_counters_to_queue(lCounters);
		}
		else{
			try{
				net.id3.webcounters.inc_counters({
					data: {
						counters: lCounters
					}
				});
			}
			catch(e){}
		}
	},

	add_project_view: function(post_id){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		var lCounters = [];
		post_id = 'prj_' + post_id;

		lCounters.push({site_token:this.site_token, keyname: 'views', track_item_id: post_id });

		// check for returning user
		if(!localStorage["returning_visitor." + post_id]){
			localStorage["returning_visitor." + post_id] = true;
			lCounters.push({site_token:this.site_token, keyname:'visitors', track_item_id: post_id});
		}

		if(!this.is_loaded){
			this.add_counters_to_queue(lCounters);
		}
		else{
			try{
				net.id3.webcounters.inc_counters({
					data: {
						counters: lCounters
					}
				});
			}
			catch(e){}
		}
	},

	/*
	increments interaction processing counter
	valide interaction_name = sidebar, favorites, calcultator, mutation_calc
	*/
	add_interaction: function(interaction_name, listing_id){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		var lCounters = [];
		lCounters.push({site_token:this.site_token, keyname: interaction_name, track_item_id: listing_id });

		if(!this.is_loaded){
			this.add_counters_to_queue(lCounters);
		}
		else{
			try{
				net.id3.webcounters.inc_counters({
					data: {
						counters: lCounters
					}
				});
			}
			catch(e){}
		}
	},

	/*
	increments form processing counter
	valide form_name = realestate_alert, evaluation_request, footer_contact, contact
	*/
	add_form_process: function(form_name){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		var lCounters = [];
		lCounters.push({site_token:this.site_token, keyname: form_name, track_item_id: 'SITE' });

		if(!this.is_loaded){
			this.add_counters_to_queue(lCounters);
		}
		else{
			try{
				net.id3.webcounters.inc_counters({
					data: {
						counters: lCounters
					}
				});
			}
			catch(e){}
		}
	},

	add_referer: function(listing_id){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		if(this.site_token==null){
			this.site_token = window.location.host;
		}

		try{
			net.id3.webcounters.ref_counter({
				data: {
					site_token: this.site_token,
	        		referer_url: this.page_referer,
	        		listing_id: listing_id
				}
			});
		}
		catch(e){}
	},

	get_site_resume: function(callback){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		if(this.site_token==null){
			this.site_token = window.location.host;
		}

		try{
			net.id3.webcounters.get_site_resume({
				data:{
					site_token: this.site_token
				},
				success: callback
			});
		}
		catch(e){}
	},

	get_track_item_resume: function(listing_id, callback){
		if(typeof cmplz_has_consent == 'function' && !cmplz_has_consent('statistics')){ return; }

		if(this.site_token==null){
			this.site_token = window.location.host;
		}
		
		try{
			net.id3.webcounters.get_track_item_resume({
				data:{
					site_token: this.site_token,
					id: listing_id
				},
				success: callback
			});
		}
		catch(e){}
	},

	z:null
}