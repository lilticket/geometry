// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, push, query, orderByChild, update, remove } from "firebase/database";

// const { getDatabase } = require('firebase-admin/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtfZfzFdLNkQDhYFunhyX7emrT0LdAchk",
    authDomain: "nycheights-9d8ab.firebaseapp.com",
    projectId: "nycheights-9d8ab",
    storageBucket: "nycheights-9d8ab.appspot.com",
    messagingSenderId: "1064755296635",
    appId: "1:1064755296635:web:0de876032c53b0e1d765de"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyCPS6qbx4SvXIIl4gzPGLdgW9FAf_OvyH0",
//     authDomain: "nycbuildings-bad55.firebaseapp.com",
//     projectId: "nycbuildings-bad55",
//     storageBucket: "nycbuildings-bad55.appspot.com",
//     messagingSenderId: "431514440257",
//     appId: "1:431514440257:web:256d14c0e435106a4eecc0"
// };

const app = initializeApp(firebaseConfig);
const delay = ms => new Promise(res => setTimeout(res, ms));


export async function Save_NewPoint(lat, long, bin, height, elevation, constructYr, id) {
    const db = getDatabase(app);
    return set(ref(db, 'points/' + id), {
        PointId: id,
        Latitude: lat,
        Longitude: long,
        BIN: bin,
        Height: height,
        Elevation: elevation,
        ConstructionYear: constructYr,
        TotalHeight: height + elevation,
    });
}

export async function Get_AllPoints() {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `points/`)).then((points) => {
        console.log('got object')
        let allPoints = Object.values(points.val());
        console.log('converted to list')
        return allPoints;
    });
}


export async function Erase_ThisPoint(Id) {
    console.log('deleiting')
    const dbRef = ref(getDatabase());
    return remove(child(dbRef, `points/${Id}`));
}