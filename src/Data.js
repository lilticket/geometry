import { Get_AllPoints, Save_NewPoint } from "./Connect";
import { GenerateFakeList } from "./Constants";
const async = require('async');

let maxLng = -100;
let maxLat = 0;
let minLng = 0;
let minLat = 100;

let maxHeight = 0;
let minHeight = 10000;

let refresh = false;


export async function Handle_Render_Offline() {
    document.getElementById('loading_container').style.display = 'none';


    let ps = GenerateFakeList();
    console.log('got em')

    // ps = ps.filter(p => p.BIN[0] == '1');


    // ps = ps.sort(p => p.Latitude);

    // // ps = ps.filter(p => p.Height > 100);

    let maxLat = ps.sort(p => p.Latitude)[0].Latitude;
    let minLat = ps.sort(p => p.Latitude).reverse()[0].Latitude;
    let maxLong = ps.sort(p => p.Longitude)[0].Longitude;
    let minLong = ps.sort(p => p.Longitude).reverse()[0].Longitude;

    let i = 0;
    let lis = [];
    console.log('starting')

    while (i < ps.length) {
        Render_Points(ps[i], maxLat, minLat, maxLong, minLong).then(p => {
            console.log(p)
            lis.push(p);
            i++;
        })
        i++;
    }

    return;
}


export async function MainHandler() {

    document.getElementById('loading_container').style.display = 'none';
    let running = true;
    let i = 0;

    let places = [];


    while (running) {
        let newPlaces = await GetInfo(i);
        if (newPlaces == null) {
            running = false;
            return;
        }
        // console.log(i);

        newPlaces.forEach(thisPlace => {
            if (thisPlace.bin.toString()[0] === "1") {
                places.push(thisPlace);
                let thisCoords = normalizeTheseCoordinates(thisPlace.the_geom.coordinates[1], thisPlace.the_geom.coordinates[0]);
                thisPlace.latitude = thisCoords[1]
                thisPlace.longitude = thisCoords[0]
                CreateElement(thisPlace);
                if (refresh) {
                    refresh = false;
                    places.forEach(p => {
                        //console.log('eaching')
                        let pCoords = normalizeTheseCoordinates(p.the_geom.coordinates[1], p.the_geom.coordinates[0]);
                        p.latitude = pCoords[1];
                        p.longitude = pCoords[0];
                        AlterElement(p.globalid, p);
                    });
                }
            }
        });
        console.log(i);
        i += 50;
    }
    console.log('done')
}

function CreateElement(place) {
    var container = document.getElementById('container');
    var element = document.createElement('li');
    element.className = 'place'
    element.id = place.globalid;
    element.style.bottom = place.latitude + "%";
    element.style.right = (place.longitude) + "%";
    element.style.width = "1px";
    element.style.height = "1px";
    element.style.backgroundColor = "yellow"
    // let height = (place.heightroof + place.groundelev);
    // var normalizedHeight = ((height - minHeight) / (maxHeight - minHeight));

    // let color = "";
    // switch (place.feat_code) {
    //     case ("1000"): { //Parking
    //         color = "0";
    //         break;
    //     }
    //     case ("1001"): { //Gas Station Canopy
    //         color = "61";
    //         break;
    //     }
    //     case ("1002"): { // Storage Tank
    //         color = "97";
    //         break;
    //     }
    //     case ("1003"): { //Placeholder (triangle for permitted bldg)
    //         color = "178";
    //         break;
    //     }
    //     case ("1004"): { //Auxiliary Structure (eg non-addressable, not garage)
    //         color = "274";
    //         break;
    //     }
    //     case ("1005"): { //Temp Structure (eg construction trailer)
    //         color = "270";
    //         break;
    //     }
    //     case ("1006"): { //Cantilevered Building
    //         color = "30";
    //         break;
    //     }
    //     case ("2100"): { //Building
    //         color = "39" //60
    //         break;
    //     }
    //     case ("2110"): { //SkyBridge
    //         color = "187"
    //         break;
    //     }
    //     case ("5100"): { //Building Under Construction
    //         color = "328";
    //         break;
    //     }
    //     case ("5110"): { //Garage
    //         color = "228";
    //         if (height > 50) {
    //             color = "0"
    //         }
    //         break;
    //     }
    // }



    // element.style.backgroundColor = `hsl(${color}, 100%, 50%)`
    // if (height > maxHeight) {
    //     maxHeight = height;
    //     refresh = true;
    // }
    // if (height < minHeight) {
    //     minHeight = height;
    //     refresh = true;
    // }
    // element.style.height = (normalizedHeight * 5) + "px";
    // element.style.width = "1px";


    container.appendChild(element);
}


function AlterElement(id, place) {
    var element = document.getElementById(id);
    element.remove();
    CreateElement(place)
}


// export async function HandleData() {
//     let data = await GetInfo();
//     data = data.filter(d => d.bin.toString()[0] == 1 || d.bin.toString()[0] == 3)
//     data = NormalizeCoords(data);

//     return data;
// }



async function GetInfo(i) {
    let place = null;
    try {
        console.log('placing call...')
        let response = await fetch(`https://data.cityofnewyork.us/resource/7w4b-tj9d.json?$offset=${i}&$limit=50000&$where=heightroof>0`);
        let json = await response.json();
        //document.getElementById('loading').innerText = `${i} Places Loaded... ${places.length} Places Found.`s
        if (json.length > 0) {
            place = json;
        }
    }
    catch (e) {

    }
    return place;
}


// export async function Get_To_Save() {

//     document.getElementById('loading_container').style.display = 'none';

//     let running = true;
//     let i = 0;

//     let total = await Get_AllPoints();
//     console.log(total.length)

//     while (running) {
//         let newPlaces = await GetInfo(i);
//         console.log("\n \n \n \n \n \n \n \n \n \n \n \n ")
//         console.log(i)
//         await delay(1000);
//         if (newPlaces == null) {
//             running = false;
//             return;
//         }
//         let np = 0;
//         while (np < newPlaces.length) {
//             let thisPlace = newPlaces[np];
//             thisPlace.latitude = thisPlace.the_geom.coordinates[1]
//             thisPlace.longitude = thisPlace.the_geom.coordinates[0]
//             if (total.filter(t => t.BIN == thisPlace.bin).length > 0) {
//                 console.log("---")
//             }
//             else {
//                 if (thisPlace.latitude > 0 && thisPlace.longitude < 0 && thisPlace.bin > 0) {
//                     if (thisPlace.cnstrct_yr == undefined) thisPlace.cnstrct_yr = null;
//                     if (thisPlace.heightroof == undefined) thisPlace.heightroof = 0;
//                     if (thisPlace.groundelev == undefined) thisPlace.groundelev = 0;
//                     Save_NewPoint(thisPlace.latitude, thisPlace.longitude, thisPlace.bin, thisPlace.heightroof, thisPlace.groundelev, thisPlace.cnstrct_yr, thisPlace.bin)
//                     console.log("----------------------------------")
//                     await delay(1)
//                 }
//                 else {
//                     console.log('XXXXXXXXXXXXXX')
//                 }
//             }
//             np++;
//         }
//         i += 50000;
//     };
// }

export async function Handle_Render_Points() {
    document.getElementById('loading_container').style.display = 'none';


    let ps = await Get_AllPoints();
    console.log('got em')

    // ps = ps.filter(p => p.BIN[0] == '1');


    ps = ps.sort(p => p.Latitude);

    // ps = ps.filter(p => p.Height > 100);

    let maxLat = ps.sort(p => p.Latitude)[0].Latitude;
    let minLat = ps.sort(p => p.Latitude).reverse()[0].Latitude;
    let maxLong = ps.sort(p => p.Latitude)[0].Longitude;
    let minLong = ps.sort(p => p.Latitude).reverse()[0].Longitude;

    let i = 0;
    let lis = [];
    console.log('starting')

    while (i < ps.length) {
        Render_Points(ps[i], maxLat, minLat, maxLong, minLong).then(p => {
            console.log(p)
            lis.push(p);
            i++;
        })
        i++;
    }

    return;
}

async function Render_Points(p, maxLat, minLat, maxLong, minLong) {
    return new Promise(() => {
        //console.log("Rendering")
        let e = document.createElement("li");
        let thisCoords = normalizeTheseCoordinates(
            p.Latitude,
            p.Longitude,
            maxLat,
            minLat,
            maxLong,
            minLong
        );
        // p.latitude = thisCoords[1]
        // p.longitude = thisCoords[0]

        e.style.bottom = p.Latitude + "vh";
        e.style.right = p.Longitude + "vh";
        e.style.width = "2px";
        e.style.height = `${p.Height * .05}px`;
        // e.style.height = `${2}px`;
        e.style.backgroundColor = `rgba(256, 256, 256, 1)`
        e.dataset.Height = p.Height;
        e.dataset.Latitude = p.Latitude;
        e.dataset.Longitude = p.Longitude;


        e.onclick = () => {
            document.getElementById("lat").value = p.Latitude;
            document.getElementById("long").value = p.Longitude;
        }

        e.className = 'place'
        e.id = p.Id;

        let container = document.getElementById("container");
        container.appendChild(e);

        return e;
    })
}

// function Calc_Norms(ps) {
//     return new Promise(() => {

//         let maxLat = Math.max(...ps.map(ps => ps.Latitude))
//         let minLat = Math.min(...ps.map(ps => ps.Latitude))

//         let maxLong = Math.max(...ps.map(ps => ps.Longitude))
//         let minLong = Math.min(...ps.map(ps => ps.Longitude))

//         return [maxLat, minLat, maxLong, minLong];
//     })
// }

// function ran(max) {
//     return Math.floor(Math.random() * max);
// }


// function NormalizeCoords(data) {
//     data.forEach(d => {
//         d.latitude = d.the_geom.coordinates[0]
//         d.longitude = d.the_geom.coordinates[1] * -1
//     });

//     let lats = data.map(a => a.latitude);
//     let longs = data.map(a => a.longitude);
//     let maxLat = Math.max.apply(Math, lats);
//     let maxLong = Math.max.apply(Math, longs);

//     let minLat = Math.min.apply(Math, lats);
//     let minLong = Math.min.apply(Math, longs);

//     data.forEach(d => {
//         let coords = normalizeTheseCoordinates(d.latitude, d.longitude, minLat, maxLat, minLong, maxLong);
//         d.latitude *= coords[1] * -1
//         d.longitude *= coords[0] * -1
//         console.log(d.latitude)
//     })

//     return data;
// }


function normalizeTheseCoordinates(lat, long, maxLat, minLat, maxLng, minLng) {

    // if (lat > maxLat) {
    //     maxLat = lat;
    //     refresh = true;
    // }
    // if (lat < minLat) {
    //     minLat = lat;
    //     refresh = true;
    // }
    // if (long > maxLng) {
    //     maxLng = long;
    //     refresh = true;
    // }
    // if (long < minLng) {
    //     minLng = long;
    //     refresh = true;
    // }


    var normalizedCoords = [];

    var normalizedLat = (lat - minLat) / (maxLng - minLng);
    var normalizedLng = (long - minLng) / (maxLng - minLng);
    normalizedLat *= 100;
    normalizedLng *= 100;
    normalizedCoords.push([normalizedLat, normalizedLng]);
    return [normalizedLat, normalizedLng];
}

// const delay = ms => new Promise(res => setTimeout(res, ms));