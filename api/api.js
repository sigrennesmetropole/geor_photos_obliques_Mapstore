import axios from '@mapstore/libs/ajax';

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
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

export function downloadPicture(datas){
    var slug = "/photosobliques/photos/download";
    if (datas[0]) {
        slug = slug + "?";
        datas[0].forEach(element => {
            slug = slug + "&photoIds=" + element;
        });
    }
    if (datas[1]) {
        slug = slug + "&zipName=" + datas[1];
    }
    if (datas[2]) {
        slug = slug + "&prefix=" + datas[2];
    }
    return axios.get(slug, {responseType:"blob"}).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
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
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

export function getOwners(polygon){
    var slug = "/photosobliques/owners?geometry=" + polygon;
    axios.get(slug).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

export function getYears(polygon){
    var slug = "/photosobliques/years?geometry=" + polygon;
    var content = [];
    return axios.get(slug).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

export function getProviders(polygon){
    var slug = "/photosobliques/providers?geometry=" + polygon;
    axios.get(slug).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error
    });
}

export function getConfigs(){
    var slug = "/photosobliques/configuration";
    return axios.get(slug).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}