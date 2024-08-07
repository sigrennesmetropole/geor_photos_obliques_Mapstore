import axios from '@mapstore/libs/ajax';

// export function callServer(url){
//     return axios.get(url);
// }

export function getPhotos(polygon, datas){
    var slug = "/photosobliques/photos?geometry=" + polygon;
    if (datas[0]) {
        slug = slug + "&startDate=" + datas[0];
    }
    if (datas[1]) {
        slug = slug + "&endDate=" + datas[1];
    }
    if (datas[2]) {
        slug = slug + "&angleDegree=" + datas[2];
    }
    if (datas[3]) {
        slug = slug + "&provider=" + datas[3];
    }
    if (datas[4]) {
        slug = slug + "&owner=" + datas[4];
    }
    if (datas[5]) {
        slug = slug + "&offset=" + datas[5];
    }
    if (datas[6]) {
        slug = slug + "&limit=" + datas[6];
    }
    if (datas[7]) {
        slug = slug + "&order=" + datas[7];
    }
    return axios.get(slug).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function downloadPicture(datas, callback){
    var slug = "/photosobliques/photos/download";
    if (datas[0]) {
        slug = slug + "?photoIds=" + datas[0];
    }
    if (datas[1]) {
        slug = slug + "&zipName=" + datas[1];
    }
    if (datas[2]) {
        slug = slug + "&prefix=" + datas[2];
    }
    axios.get(slug).then(function (response) {
        response = response.data;
        callback([response, coent]);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getPhotoCount(polygon, datas){
    var slug = "/photosobliques/photos/count?geometry=" + polygon;
    if (datas[0]) {
        slug = slug + "&startDate=" + datas[0];
    }
    if (datas[1]) {
        slug = slug + "&endDate=" + datas[1];
    }
    if (datas[2]) {
        slug = slug + "&angleDegree=" + datas[2];
    }
    if (datas[3]) {
        slug = slug + "&provider=" + datas[3];
    }
    if (datas[4]) {
        slug = slug + "&owner=" + datas[4];
    }
    return axios.get(slug).then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getOwners(polygon, callback){
    var slug = "/photosobliques/owners?geometry=" + polygon;
    axios.get(slug).then(function (response) {
        response = response.data;
        callback([response]);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export function getYears(polygon){
    var slug = "/photosobliques/years?geometry=" + polygon;
    var content = [];
    return axios.get(slug).then(function (response) {
        response = response.data;
        return response;
    })
    .catch(function (error) {
        console.log(error);
        return null;
    });
}

export function getProviders(polygon, callback){
    var slug = "/photosobliques/providers?geometry=" + polygon;
    axios.get(slug).then(function (response) {
        response = response.data;
        callback([response]);
    })
    .catch(function (error) {
        console.log(error);
    });
}