import axios from '@mapstore/libs/ajax';

export function callServer(url){
    return axios.get(url);
}

export function getYears(polygon, callback){
    var slug = "/photosobliques/years?geometry=" + polygon;
    var content = [];
    axios.get(slug).then(function (response) {
        response = response.data;
        response.forEach(element => {
            content.push("<option value='" + element + "'>" + element + "</option>");
        });
        // console.log([response, content]);
        callback([response, content]);
    })
    .catch(function (error) {
        console.log(error);
    });
}