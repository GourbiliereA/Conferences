'use strict';

app.service('DataSrv', function($http, $q){
	var data;

    this.getFileData = function() {
    	// Checkin if data already loaded
        if(!data) {
            return $http.get('data/devfest-2015.json')
                .then(resp => {
                    data = resp.data;
                    console.log(data);
                    return data;
                });
        } else {
            const deferrer = $q.defer();
            deferrer.resolve(data);

            return deferrer.promise;
        }
    }
});
