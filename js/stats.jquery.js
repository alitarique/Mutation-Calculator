var net = typeof(net)!='undefined'?net:{};
net.id3 = typeof(net.id3)!='undefined'?net.id3 : {};

net.id3.webcounters = {
    init: function () { },
    load: function () {

    },


    /*
    options:  //parameters containing all call options
    {
    data: null, // parameters to pass to the webservice
    success: function(){}
    error: function(){}
    }
    */
    register_counters: function (options) {
        return this._post('/api/register_counters', options);
    },

    /*
    options:  //parameters containing all call options
    {
    data: {counters:{[]}}, // parameters to pass to the webservice
    success: function(){}
    error: function(){}
    }
    */
    inc_counters: function (options) {
        return this._post('/api/inc_counters', options);
    },


    /*
    options:  //parameters containing all call options
    {
    data: {
    site_token: '',
    referer_url: '',
    listing_id: ''
    }, // parameters to pass to the webservice
    success: function(){}
    error: function(){}
    }
    */
    ref_counter: function (options) {
        return this._post('/api/inc_referer', options);
    },

    get_track_item_resume: function (options) {
        return this._post('/api/get_track_item_resume', options);
    },

    get_site_resume: function (options) {
        return this._post('/api/get_site_resume', options);
    },

    _post: function (url, options) {
		if (options.data.counters != null) {
            if (typeof (options.data.counters) == 'object') {
                options.data.counters = JSON.stringify(options.data.counters);
            }
        }
        return new Promise( ($resolve,$reject) => {
            
            jQuery.ajax({
                url: '//webcounters.id-3.net' + url,
                type: 'POST',
                data: options.data,
                success: function (result_data) {
                    if (typeof (options.success) == 'function') {
                        options.success(result_data);
                    }

                    $resolve(result_data);
                },
                error: function () {
                    if (typeof (options.error) == 'function') {
                        options.error();
                    }

                    $reject();
                }
            });
            
        })
    }
}