/*
Javascript object to control shortcodes objects behavior
*/

function ali_archived_map(selector, type){
	var lModel = {};

	(function($){
		var lModel = {
			_man: null,

			_initialize: function(){
				$.ajax({
					url: ajaxurl,
					data: {'action': 'listings_archived_get', 'type': type},
					success: function(response){
						var lList = [];
						
						this._man = mapManager(lModel.mapElm.attr('id'),{
							markerClass: 'sold-marker-icon'
						});

						if(response.length > 0){
							for(var i=0;i<response.length;i++){
								lList.push({
									lat: response[i].lat,
									lng: response[i].lng,
									label: response[i].label
								});
							}
							
							this._man.showMarkers(lList);
						}
						else{
							console.log('no data');
						}
					}

				});
			}
		}


		lModel.mapElm = $(selector).eq(0);
		try{
			lModel._initialize();
		}
		catch(e){console.log('unable to initialize archived map');}

	})(jQuery);
	
	console.log('ali_archived_map called');

	return lModel;

}

function ali_map(selector){
	$ = jQuery;
	
	var lModel = {
		_man: null,

		_initialize: function(){

			var lList = [];
			var me = this;

			if($(selector).data('lng')){
				lList.push({
					lng: $(selector).data('lng'),
					lat: $(selector).data('lat'),
				});
			}
			else if($(selector).find('i.marker').length>0){
	        	var lMarkers = [];
	        	$(selector).find('i.marker').each(function(i,e){
	        		lList.push({
	        			lat: $(e).data('lat'),
	        			lng: $(e).data('lng'),
	        		});
	        	});
	        }

	        console.log(lList);

			this._man = mapManager(lModel.mapElm.attr('id'));
			if(this._man != null){
				this._man.showMarkers(lList);

				if($(selector).data('address') != ''){
					var lAddress = window.atob($(selector).data('address'));
					
					$.ajax({
						url: 'https://maps.googleapis.com/maps/api/geocode/json',
						data: {'address': lAddress},
						success: function(response){
							if(response.status=="OK"){
								var lList = [];
								console.log(response.results);
								lList.push(response.results[0].geometry.location);
								me._man.showMarkers(lList);
							}
						}

					});
				}
			}
		}
	}

	console.log('ali_map called', selector);

	lModel.mapElm = $(selector).eq(0);
	lModel._initialize();

	

	return lModel;
}

function ali_testimonial_carousel($source){
	const $scope = {
		$element: $source,
		current_index: 0,
		timeout: 10,
		timeout_start: null
	};
	
	$scope.init = function(){
		Array.from($scope.$element.querySelectorAll('.nav')).forEach(function($navElm){
			$navElm.addEventListener('click', function($event){
				if($event.target.classList.contains('fa-angle-left')){
					$scope.previous();
				}
				else{
					$scope.next();
				}
			});
		});

		$scope.$element.addEventListener("touchstart", $scope.swipeStart, false);
		$scope.$element.addEventListener("touchmove", $scope.swipeMove, false);
		$scope.$element.addEventListener("touchend", $scope.swipeEnd, false);

		$scope.$testimonials = Array.from($scope.$element.querySelectorAll('.list li'));

		$scope.show(0);
		
		window.setInterval($scope.animLoop,1000 / 15);
	},

	$scope.swipeStart = function($event){
		$scope.initialX = $event.touches[0].clientX;
		$scope.initialY = $event.touches[0].clientY;
		$scope.swipeDirection = null;
	}
	$scope.swipeMove = function($event){
		if ($scope.initialX === null) return;
		if ($scope.initialY === null) return;

		const lCurrentX = $event.touches[0].clientX;
		const lCurrentY = $event.touches[0].clientY;
		const lDiffX = $scope.initialX - lCurrentX;
		const lDiffY = $scope.initialY - lCurrentY;
		
		if (Math.abs(lDiffX) > Math.abs(lDiffY)) {
			// sliding horizontally
			if (lDiffX > 0) {
			  	// swiped left
				console.log("swiped left");
				$scope.swipeDirection = 'left';
			} 
			else {
			  	// swiped right
				console.log("swiped right");
				$scope.swipeDirection = 'right';
			}  
		} 
	}
	$scope.swipeEnd = function($event){
		if($scope.swipeDirection == null) return;

		if($scope.swipeDirection == 'left'){
			$scope.next();
		}
		else{
			$scope.previous();
		}
	}

	$scope.animLoop = function(){
		if($scope.timeout_start != null){
			const lEndsAt = moment($scope.timeout_start).add($scope.timeout,'seconds');
			const lRemainingTime = moment().diff(lEndsAt, 'seconds');
			
			$scope.$element.style.setProperty('--remaining-time', lRemainingTime);
		}
	}

	$scope.engageNext = function(){
		// Adjust time based on testimonials length
		const lText = $scope.$current_testimonial.innerText;
		const lWordCount = lText.match(/\S+/g).length;
		const lTimeout = (lWordCount * 0.25) + 1;
		$scope.timeout = lTimeout;

		$scope.timeout_start = new Date();
		$scope.nextHndl = window.setTimeout(function(){
			$scope.next();
		}, $scope.timeout * 1000);
	},

	$scope.show = function($index){
		if($scope.nextHndl!=null){
			
			window.clearTimeout($scope.nextHndl);
		}
		console.log('ali_testimonial_carousel/show', $index);

		const fnShow = function(){
			$scope.$current_testimonial = $scope.$testimonials[$index];
			$scope.$current_testimonial.addEventListener('transitionend',function(){
				$scope.engageNext();
				//window.clearTimeout($scope.nextHndl);
			},{once:true});
			
			$scope.$element.querySelectorAll('li.show').forEach(function($e){
				$e.classList.remove('show');
			});

			$scope.$current_testimonial.classList.add('show');
			$scope.fixHeight();
		}

		if($scope.$current_testimonial != null){
			$scope.$current_testimonial.addEventListener('transitionend',function(){
				fnShow();
			},{once:true});

			$scope.$current_testimonial.classList.remove('show');
		}
		else{
			fnShow();
		}
	}

	$scope.previous = function(){
		$scope.current_index = ($scope.current_index == 0) ? $scope.$testimonials.length-1 : $scope.current_index-1;
		$scope.show($scope.current_index);

		// $(section).find('.list li').eq(index).hide('fade',function(){
		// 	if(index-1<0){
		// 		index = $(section).find('.list li').length;
		// 	}
		// 	$(section).find('.list li').eq(index-1).show('fade', function(){
		// 		$scope.fixHeight(section);
		// 	});

		// 	$(section).data('current_index', index-1);
		// });

		//$scope.engageNext(section);
	},

	$scope.next = function(){
		$scope.current_index = ($scope.current_index == $scope.$testimonials.length-1) ? 0 : $scope.current_index+1;
		$scope.show($scope.current_index);


		// var index = $scope.current_index;
		// if($scope.nextHndl!=null){
		// 	window.clearTimeout($scope.nextHndl);
		// }

		// $(section).find('.list li').eq(index).hide('fade',function(){
		// 	if(index+1 == $(section).find('.list li').length){
		// 		index = -1;
		// 	}
		// 	$(section).find('.list li').eq(index+1).show('fade', function(){
		// 		$scope.fixHeight(section);
		// 	});
		// 	$(section).data('current_index',index+1);
		   
		// });

		// $scope.engageNext(section);
	},

	$scope.fixHeight = function(){
		if($scope.$current_testimonial == null) return;

		const lCurrentRect = $scope.$current_testimonial.getBoundingClientRect();

		$scope.$element.querySelector('.list').style.height = (lCurrentRect.height + 20) + 'px';

		// var lIndex = $(section).data('current_index');
		// $(section).find('.list').height($(section).find('.list li').eq(lIndex).height() + 20);
	}

	$scope.init();
}

Array.from(document.querySelectorAll('.ali-testimonial-carousel')).forEach(function($elm){
	ali_testimonial_carousel($elm);
});


function ali_local_logic(){
	$scope = {
		list : []
	}

	$scope.init = function(){
		console.log('ali_local_logic/init');
		$scope.loadSDK().then( _ => {
			Array.from(document.querySelectorAll('.ali-local-logic')).forEach(function($elm){
				//$scope.add($elm);
				$scope.addV3($elm);
			});
		})
		
	}

	$scope.loadSDK = function(){
		if(document.querySelector('#ali-local-logic-sdk') != null) return Promise.resolve();

		return new Promise( ($resolve,$reject) => {
			const scriptElm = document.createElement('script');
			scriptElm.src = 'https://sdk.locallogic.co/sdks-js/1.7.1/index.umd.js';
			scriptElm.id = 'ali-local-logic-sdk';
			scriptElm.onload = () => {
				$resolve();
			}

			document.body.append(scriptElm);
		})
		
	}

	$scope.add = function($element){
		$scope.list.push($element);
		const lElmId = 'ali-local-logic-' + $scope.list.length;
		
		const lElmRect = $element.getBoundingClientRect();
		$element.setAttribute('id', lElmId);
		console.log('ali_local_logic/add',lElmRect);
		
		const lOptions = {
            lat: $element.dataset.lat,
			lng: $element.dataset.lng,
			locale: $element.dataset.lang,
			designId: 'll-2019',
			//maxInnerWidth: lElmRect.width
        };

		const contentWidget = new locallogic.LocalContent(lElmId, lOptions);
	}

	$scope.addV3 = function($element){

		$scope.list.push($element);
		const lElmId = 'ali-local-logic-' + $scope.list.length;
		
		const lElmRect = $element.getBoundingClientRect();
		$element.setAttribute('id', lElmId);
		const sdk_v3 = 'V3 7M3hOkvYaSPotXiUDN3RLDHNYyp1jZdR.1b9e5cda-21e1-42f3-a415-a7e98a3504b2';
		//const sdk_prod = '97434c43a4e16186432f69f3045ff0f2b8e13708627ab576442ef8e1b8768a856e4d70ad61c40d5e';

		const ll = LLSDKsJS(sdk_v3, {
            locale: $element.dataset.lang, // Change to either english or french
            appearance: {
              theme: "day",
              // Add any other appearance changes here
               variables: {
            //     "--ll-color-primary": "#fd3958",
            //     "--ll-color-primary-variant1": "#d5405b",
                "--ll-border-radius-small": "8px",
                "--ll-border-radius-medium": "16px",
            //     "--ll-font-family": "Avenir, sans-serif"
               }
            }
          });
          
          // Set the styles of the container
          // With these styles the container will fill the height and width of the #widgetMap
          $element.style.cssText = `
                  height: 640px;
                  width: 100%;
                  display: flex;
                `;

          // Set the lat and lng of the location
          const LAT = $element.dataset.lat;
          const LNG = $element.dataset.lng;
          const lc = ll.create("local-content", $element, {
            lat: LAT,
            lng: LNG,
            cooperativeGestures: false,
            marker: {
              lat: LAT,
              lng: LNG
            }
          });
	}
	
	return $scope;
}

function aliStartLocalLogic(){
	console.log('aliStartLocalLogic')
	const lLocalLogicManager = ali_local_logic();
	//$(document).ready(function(){
		lLocalLogicManager.init();
	//})
	
}

function ali_geo_evaluation($element_id){
	const $scope = {
		current_step: 0,
		$element : document.getElementById($element_id),
		$elm_id : $element_id,
		markers: []
	};

	$scope.init = function(){
		$scope.applyConsent();
		jQuery(document).on("cmplz_enable_category", (consentData) => {
			console.log('cmplz_enable_category::triggered');

			//do something interesting with marketing consent
			$scope.applyConsent();
			// $scope.initMap();
			// $scope.initAutocompleInput();
		});

		window.addEventListener('message', function($event){
			if($event.data.event == 'aliFormManager/form/validated'){
				$scope.updateNavStatus();
			}
		})

		window.setTimeout( _ => {
			// $scope.initMap()
			// $scope.initAutocompleInput();
	
			$scope.initNav();
			$scope.changeStep(0);

			
			document.body.querySelector(`#${$scope.$elm_id}-address-input`).addEventListener('click', ($event) => {
				$scope.initMap();
				$scope.initAutocompleInput();
			})
		},500);

		
	}

	$scope.applyConsent = function(){
		$scope.privacyConsent = false;
		const cookies = document.cookie.split(';').reduce( (c,e) => { const [key,value] = e.split('='); c[key.trim()] = value; return c},{});
		
		if(cookies.cmplz_preferences === 'allow' || cookies.cmplz_marketing === 'allow'){
			$scope.privacyConsent = true;
		}

		console.log('applyConsent',$scope.privacyConsent);
		if($scope.privacyConsent == false){
			$scope.$element.classList.add('consent-deny');
			consentOverlay = document.createElement('div');
			consentOverlay.innerHTML = `<div class="consent-deny-overlay">
				<label class="lang fr">Vous devez accepter la politique de confidentialité pour activer cette fonctionnalité.</label>
				<label class="lang en">You must accept the Privacy Policy to activate this functionality.</label>
			</div>`
			$scope.$element.append(consentOverlay.firstChild);
		}
		else{
			$scope.$element.classList.remove('consent-deny');
		}
		
		
	}

	$scope.initNav = function(){
		const lSteps = Array.from($scope.$element.querySelectorAll('.step'));
		$scope.max_steps = lSteps.length - 1;

		const lTabContainer = $scope.$element.querySelector('.ali-tab-container');
		lSteps.forEach(function($step,$index){
			const lTab = document.createElement('div');
			lTab.classList.add('ali-tab');
			lTab.innerHTML = [
				'<label class="lang fr">Étape ' + ($index + 1) + '</label>',
				'<label class="lang en">Step ' + ($index + 1) + '</label>',
				'<em>' + $step.dataset.title + '</em>',
			].join('');

			lTabContainer.append(lTab);
		});

		const lButtons = Array.from($scope.$element.querySelectorAll('.ali-navigation .button'));
		lButtons.forEach(function($button){
			$button.addEventListener('click', function($event){
				$scope.navButtonClickHandler($event.target);
			})
		});
	}

	$scope.initMap = function(){
		if(typeof(google) == 'undefined') return;

		$scope.map = new google.maps.Map(document.getElementById($scope.$elm_id + "-map"), {
			center: { lat: -33.8688, lng: 151.2195 },
			mapTypeId: "satellite",
			zoom: 18,
			tilt: 45,
			zoomControl: false,
			fullscreenControl: false,
			mapTypeControl: false
		  });
	}

	$scope.initAutocompleInput = function(){
		console.log('initAutoCompleteInput', typeof google);
		if(typeof(google) == 'undefined') return;

		// Create the search box and link it to the UI element.
		const input = document.getElementById($scope.$elm_id + "-address-input");
		$scope.searchBox = new google.maps.places.SearchBox(input);

		$scope.searchBox.addListener("places_changed", $scope.addressInputChanged);
	}

	$scope.changeStep = function($index){
		$scope.current_step = $index;
		$scope.$element.style.setProperty('--current-step',$index);
		$scope.$element.classList.remove('last-step');

		if($index == $scope.max_steps - 1){
			$scope.$element.classList.add('last-step');
		}

		const lTabs = Array.from($scope.$element.querySelectorAll('.ali-tab-container .ali-tab'));
		lTabs.forEach(function($tab){
			$tab.classList.remove('current');
		});
		lTabs[$index].classList.add('current');

		const lStepContainer = $scope.$element.querySelector('.ali-steps-container');
		const lCurrentStep = lStepContainer.querySelectorAll('.step .step-container')[$index];
		const lCurrentStepHeight = lCurrentStep.getBoundingClientRect().height + 20;
		lStepContainer.style.height = lCurrentStepHeight + 'px';
	}

	$scope.addressInputChanged = function(){
		const lPlaces = $scope.searchBox.getPlaces();
		// Bail now if no places was found
		if (lPlaces.length == 0) return;

		const lPlace = lPlaces[0];
		console.log('addressInputChanged', lPlace);

		const lPropertyLocation = {
			lng: lPlace.geometry.location.lng(),
			lat: lPlace.geometry.location.lat(),
			address: lPlace.formatted_address
		}
		const lAddressInput = $scope.$element.querySelector('.aliquando-form #address');
		lAddressInput.value = lPropertyLocation.address;
		
		console.log('addressInputChanged', lPropertyLocation);

		$scope.$element.classList.add('has-address');
		$scope.updateMap(lPlace);
		$scope.changeStep(1);
	}

	$scope.updateNavStatus = function(){
		const lFormElm = $scope.$element.querySelector('.aliquando-form');
		const lFinishButtonElm = $scope.$element.querySelector('.ali-navigation .button-finish');

		if(lFormElm.classList.contains('form-validation-success')){
			lFinishButtonElm.removeAttribute('disabled');
		}
		else{
			lFinishButtonElm.setAttribute('disabled','disabled');
		}
	}

	$scope.updateMap = function($place){
		// clear map of any markers
		$scope.markers.forEach(function($marker){
			$marker.setMap(null);
		});
		const map = $scope.map;
		const icon = {
			url: $place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(25, 25),
		  };

		const lNewMarker = new google.maps.Marker({
			map,
			icon,
			title: $place.name,
			position: $place.geometry.location,
		  });

		$scope.markers = [];
		$scope.markers.push(lNewMarker);

		map.panTo(lNewMarker.getPosition());
	}

	$scope.navButtonClickHandler = function($button){
		if($button.classList.contains('button-previous')){
			$scope.previousStep();
		}
		else if($button.classList.contains('button-next')){
			$scope.nextStep();
		}
		else if($button.classList.contains('button-finish')){
			$scope.sendInformations();
		}
	}

	$scope.previousStep = function(){
		$scope.changeStep(Math.max($scope.current_step-1,0));
	}

	$scope.nextStep = function(){
		console.log('nextStep',$scope.current_step, $scope.max_steps);
		$scope.changeStep(Math.min($scope.current_step+1,$scope.max_steps));
	}

	$scope.sendInformations = function(){
		const lFormElm = $scope.$element.querySelector('.aliquando-form');
		const lFormManager = lFormElm.$formManager;
		console.log('sendInformations', lFormManager);
		$scope.$element.classList.remove('ali-allow-navigation');

		lFormManager.send_data(lFormElm, false).then( function(){	
			$scope.nextStep();
		})
	}

	$scope.init();
}

class ali_animated_counter{
	constructor(element){
		this.$element = element;
		this.$value = parseInt(element.getAttribute('ali-animated-counter'));
		this.$element.innerHTML = '&nbsp;';
		this.animateValue();
	}

	animateValue(){
		let displayedValue = 0;
		const timeout = Math.min(1000 / this.$value, 250);
		const intervalPtr = window.setInterval(_ => {
			this.$element.innerHTML = displayedValue;
			if(displayedValue >= this.$value){
				window.clearInterval(intervalPtr);
			}

			displayedValue++;
		}, timeout);
	}
}
Array.from(document.querySelectorAll('[ali-animated-counter]')).forEach( (e, i) => {
	new ali_animated_counter(e);
});


class AliGReviews extends HTMLElement{
	constructor(){
		super();

		

		this.currentLocale = document.documentElement.lang.substring(0,2);
		this.currentCarouselIndex = 0;
		

		this.loadData();
		this.shows = this.getAttribute('show').split(',');
		this.buttonLabel = this.getAttribute('button-label');
		this.reviewLink = this.getAttribute('review-link');
		this.maxCarouselIndex = this.data.reviews.length - 1;

		if(this.reviewLink == null || this.reviewLink == ''){
			console.log('reviewLink not found');
			if(this.targetInfo.OtherSettings && this.targetInfo.OtherSettings.some(s => s.key == 'reviewLink') ){
				this.reviewLink = this.targetInfo.OtherSettings.find(s => s.key == 'reviewLink').value;
			}
		}

		console.log('AliGReviews',this.shows, this.reviewLink, this.buttonLabel, this.data);

	}

	getlabel(label){
		if(this.currentLocale != 'fr') return label;
		const labels = {
			"From" : "À partir de"
			, "reviews" : "avis"
		}
		if(labels[label] == undefined) return label;
		return labels[label];
	};

	loadData(){
		const dataElm = this.querySelector('ali-data');
		if(dataElm == null) return ;
		this.data = JSON.parse(dataElm.innerText);
		this.targetInfo = this.data.targetInfo.find(t => t.IsDefault) || this.data.targetInfo[0];

		dataElm.remove();
	}

	connectedCallback(){
		const parts = this.getParts();
		const html = `${parts.map(p => p.getHtml()).join('')}`;

		this.innerHTML = html;

		Array.from(this.querySelectorAll('.ali-greviews-nav')).forEach( navElm => {
			navElm.addEventListener('click', (event) => {
				this.navClickHandler(event);
			})
		});

		const listContainer = this.querySelector('.ali-greviews-carousel')
		this.resObs = new ResizeObserver( (entries) => {
			console.log('AliGReviews/RESIZE: reset maxCarouselIndex');
			this.maxCarouselIndex = this.data.reviews.length - 1;
		})

		this.resObs.observe(listContainer);
	}

	getParts(){
		const parts = [];

		if(this.shows.includes('global')) parts.push({getHtml : () => this.getGlobalRatingHtml()});

		if(this.shows.includes('carousel')) parts.push({getHtml : () => this.getCarouselHtml()});
		if(this.shows.includes('grid')) parts.push({getHtml : () => this.getGridHtml()});

		return parts;
	}

	getlabel(label){
		const strings = {
			fr: {
				'reviews' : 'avis'
			}
		}

		if(document.documentElement.lang.includes('fr')){
			if(strings.fr[label] != undefined) return strings.fr[label];
		}

		return label;
	}

	getGlobalRatingHtml(){
		const rating = Math.round(this.data.averageRating * 100) / 100;
		const ratingPct = (rating / 5) * 100;
		const stars = Array.from(Array(5)).map( (e,i) => i);

		const addReviewButtonHtml = this.getSubmitHtml();
		const reviewsLabel = this.getlabel('reviews');
		return `<div class="ali-greviews-header">
			<div class="ali-greviews-global-rating-container">
				<div class="ali-rating">${rating}</div>
				<div class="ali-star-rating" style="--ali-star-rating-pct: ${ratingPct}%" >${stars.map(s => `<i class="fas fa-star"></i>`).join('')}</div>
				<div class="ali-greviews-reviewer-count">${this.data.totalReviewCount} ${reviewsLabel}</div>
			</div>
			${addReviewButtonHtml}
		</div>`;
	}

	getSubmitHtml(){
		if(!this.shows.includes('submit')) return '';
		if(this.reviewLink == '' && this.reviewLink != null) return '';

		return `<div class="ali-greviews-submit-container"><a href="${this.reviewLink}" target="_blank" class="button ali-button">${this.buttonLabel}</a></div>`;
	}

	getCarouselHtml(){
		
		return `<div class="ali-greviews-carousel-container">
			<div class="ali-greviews-nav ali-nav-previous"><i class="fa fa-angle-left"></i></div>
			<div class="ali-greviews-carousel">
				<div class="ali-greviews-list">
					${this.data.reviews.map( r=> {
						const stars = Array.from(Array(5)).map( (e,i) => ({checked: (i<r.starRating)}));

						return `<div class="ali-greviews-item" star-rating="${r.starRating}">
							<div class="ali-greviews-item-avatar"><img src="${r.reviewer.profilePhotoUrl}"></div>
							<div class="ali-greviews-item-name">${r.reviewer.displayName}</div>
							<div class="ali-greviews-star-rating">${stars.map(s => `<i class="fas ${s.checked ? 'active' : ''} fa-star"></i>`).join('')}</div>
							<div class="ali-greviews-comment">${this.getReviewComment(r.comment)}</div>
						</div>`;
					}).join('')}
				</div>
			</div>
			<div class="ali-greviews-nav ali-nav-next"><i class="fa fa-angle-right"></i></div>
		</div>`
	}
	
	getGridHtml(){
		return `<div class="ali-greviews-grid-container">
			<div class="ali-greviews-grid">
				<div class="ali-greviews-list">
					${this.data.reviews.map( r=> {
						const stars = Array.from(Array(5)).map( (e,i) => ({checked: (i<r.starRating)}));

						return `<div class="ali-greviews-item" star-rating="${r.starRating}">
							<div class="ali-greviews-item-avatar"><img src="${r.reviewer.profilePhotoUrl}"></div>
							<div class="ali-greviews-item-name">${r.reviewer.displayName}</div>
							<div class="ali-greviews-star-rating">${stars.map(s => `<i class="fas ${s.checked ? 'active' : ''} fa-star"></i>`).join('')}</div>
							<div class="ali-greviews-comment">${this.getReviewComment(r.comment)}</div>
						</div>`;
					}).join('')}
				</div>
			</div>
		</div>`
	}

	getReviewComment(value){
		if(value == null) return '';
		if(value == undefined) return '';

		const jsonValue = this.textToJSON(value);
		if(jsonValue == null) return '';
		if(jsonValue[this.currentLocale] !== undefined) return jsonValue[this.currentLocale];
		return jsonValue.default;
	}

	navClickHandler(event){
		this.elmRect = this.querySelector('.ali-greviews-item').getBoundingClientRect();
		this.style.setProperty('--offset-element-width', `${this.elmRect.width}px`);
		const item = Array.from(this.querySelectorAll('.ali-greviews-item')).at(-1);
		if(this.isVisible(item, this.querySelector('.ali-greviews-carousel'))){
			this.maxCarouselIndex = Math.min(this.maxCarouselIndex, this.currentCarouselIndex);
			console.log('last item visible');
		}

		if(event.target.classList.contains('ali-nav-previous')){
			this.currentCarouselIndex = this.currentCarouselIndex - 1;
		}
		if(event.target.classList.contains('ali-nav-next')){
			this.currentCarouselIndex = this.currentCarouselIndex + 1;
		}


		this.currentCarouselIndex = Math.min(Math.max(this.currentCarouselIndex,0),  this.maxCarouselIndex);
		this.updateCarouselOffset();
	}

	updateCarouselOffset(){		
		this.style.setProperty('--offset-index', this.currentCarouselIndex);
	}

	textToJSON(text) {
		// Diviser le texte en parties anglaise et française
		const parts = text.split(/\(Translated by Google\)|\(Original\)/);
	  
		// Supprimer les chaînes vides du tableau résultant
		const partsClean = parts.filter(p => p.trim() !== '');
		if(partsClean.length == 0) return null;
		if(partsClean.length == 1) return {default: partsClean[0]};
		
		// Créer l'objet JSON avec les propriétés 'fr' et 'en'
		const result = {
		  fr: partsClean[1].trim(),
		  en: partsClean[0].trim()
		};
	  
		return result;
	}

	isVisible(item, container) {
		const { left, right, width } = item.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		return left <= containerRect.left 
				? containerRect.left - left <= width 
				: right - containerRect.right <= width;
	};
	
}
customElements.define('ali-greviews', AliGReviews);

class AliFacebookManager extends HTMLElement{
	constructor(){
		super();
	}

	connectedCallback(){
		const pageId = this.getAttribute('page-id');
		
		this.innerHTML = this.render();

		this.addEventListener('click', () => {
			window.open(`https://m.me/${pageId}`,'_blank');
		})
	}

	render(){
		return `<i class="ali-ui ali-icon fab fa-facebook-messenger"></i>`;
	}
}
customElements.define('ali-facebook-messenger', AliFacebookManager);