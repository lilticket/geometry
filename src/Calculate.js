import { delay } from "./Constants";


export async function Calculate() {
    Clear()
    let fov = document.getElementById("fov").value;
    let lat = document.getElementById("lat").value;
    let long = document.getElementById("long").value;

    let horizontal_radius = document.getElementById("radius").value;

    Color_InnerRadius(lat, long, horizontal_radius);

    let secondary_angles = (180 - fov) / 2;

    let distance = Calc_Distance(horizontal_radius, secondary_angles, fov);

    let points = Calc_PointAlongCirCum(long, lat, distance, true);
    let inner_points = Calc_PointAlongCirCum(long, lat, horizontal_radius, false)

    let ring = Calc_RingBuildings(long, lat, horizontal_radius, distance);

    Render_Circle(long, lat, points)
    Render_Circle(long, lat, inner_points)

    let closeBy = await Handle_FindNearby(points, lat, long, horizontal_radius, ring);
    //Handle_TooTall(closeBy, lat, long);

}


function Calc_Distance(horizontal_radius, secondary_angles, fov) {
    let halfFov = Convert_ToRadian(fov / 2)
    // console.log(`AngleB Radians: ${halfFov}`)
    let hypo = horizontal_radius / Math.sin(halfFov);
    // console.log(`Hypotenuse Length: ${hypo}`)
    // console.log(`SideA Length: ${horizontal_radius}`)

    let angleA = Convert_ToRadian(secondary_angles);
    let distance = hypo * Math.sin(angleA);
    // console.log(`AngleA Radians: ${angleA}`);
    // console.log(`SideB Length: ${distance}`)
    return hypo;
}

function Calc_PointAlongCirCum(oX, oY, r, outer) {
    let t = 0;
    let points = [];
    let prefix = outer ? "O_" : "I_"
    while (t < 360) {
        let partOne = r * Math.cos(Convert_ToRadian(t));
        let partTwo = r * Math.sin(Convert_ToRadian(t))
        let p = [
            Number(partOne) + Number(oX),
            Number(partTwo) + Number(oY),
            prefix + t
        ]
        points.push(p);
        t++;
    }
    return points;
}

function Render_Circle(oX, oY, points) {
    let circle = document.getElementById("container");
    let origin = document.createElement('li');

    origin.classList.add("circle_point");
    origin.style.bottom = oY;
    origin.style.right = oX
    circle.appendChild(origin);


    let i = 0;
    while (i < points.length) {
        let e = document.createElement('li');

        e.classList.add("circle_point");
        e.style.right = `${points[i][0]}vh`;
        e.style.bottom = `${points[i][1]}vh`;
        e.id = points[i][2];

        circle.appendChild(e);

        i++;
    }
}

function Calc_TanFromDegree(degrees) {
    return Math.tan((degrees * Math.PI) / 180);
}

async function Handle_FindNearby(points, oX, oY, r, ring) {
    let buildings = document.getElementsByClassName('place');
    let closeBy = [];

    let i = 0;
    while (i < buildings.length) {
        let inner = buildings[i].classList.contains('inner-radius');
        if (inner) {
            buildings[i].style.opacity = 1;
        }
        else {
            let bottom = buildings[i].style.bottom.slice(0, -2);
            let right = buildings[i].style.right.slice(0, -2);
            let id = buildings[i].id;
            let close = await Find_NearbyBuildings(buildings[i], bottom, right, id, points, ring);
            if (!close) {
                buildings[i].style.opacity = .25;
            }
            else {
                buildings[i].classList.add('view-point');
                closeBy.push(buildings[i]);
                //i = 10000;
            }
        }
        i++;
    }
    return closeBy;
}

async function Find_NearbyBuildings(building, lat, long, id, points, ring, fov) {
    let i = 0;
    let close = false;
    let result = {
        Found_Count: 0,
        Found_Locations: []
    }
    while (i < points.length && !close) {
        let b = points[i];
        let latDistance = Math.abs(Number(lat) - Number(b[1]));
        let longDistance = Math.abs(Number(long) - Number(b[0]));
        let hyp = Math.sqrt((Number((latDistance * latDistance)) + Number((longDistance * longDistance))))
        let metric = .5;
        if (hyp <= metric) {
            close = true;
            let intheway = await Check_Tall(building, lat, long, b[2], ring);
            let faulty = Check_TooTall(building, intheway);
            if (!faulty) {
                building.style.backgroundColor = 'green'
            }
            else {
                building.style.backgroundColor = 'orange'
            }
        }
        i++;
    }
    return close;
}


async function Check_Tall(building, lat, long, id, ring) {
    let outer = document.getElementById(id);
    let outerId = Number(outer.id.split('_')[1]);

    let idOne = outerId - 90;
    let idTwo = outerId + 90;
    while (idOne < 0) {
        idOne += 360;
    }
    while (idTwo >= 360) {
        idTwo -= 360;
    }
    let innerOne = document.getElementById(`I_${idOne}`)
    let innerTwo = document.getElementById(`I_${idTwo}`)
    let A = {
        X: 100 - Math.abs(Number(innerOne.style.right.slice(0, -2))),
        Y: Math.abs(Number(innerOne.style.bottom.slice(0, -2))),
    }
    let B = {
        X: 100 - Math.abs(Number(innerTwo.style.right.slice(0, -2))),
        Y: Math.abs(Number(innerTwo.style.bottom.slice(0, -2))),
    }
    let C = {
        X: 100 - Math.abs(Number(long)),
        Y: Math.abs(Number(lat)),
    }

    let Area = Math.abs((A.X * (B.Y - C.Y)) + (B.X * (C.Y - A.Y)) + (C.X * (A.Y - B.Y))) / 2

    Area = Math.round(Area * 10000) / 10000;

    let buildings = ring;
    let i = 0;

    let intheway = []

    while (i < buildings.length) {
        let bottom = buildings[i].style.bottom.slice(0, -2);
        let right = buildings[i].style.right.slice(0, -2);
        let P = {
            X: 100 - Math.abs(Number(right)),
            Y: Math.abs(Number(bottom)),
        }

        let WO_A = Math.abs((P.X * (B.Y - C.Y)) + (B.X * (C.Y - P.Y)) + (C.X * (P.Y - B.Y))) / 2
        let WO_B = Math.abs((A.X * (P.Y - C.Y)) + (P.X * (C.Y - A.Y)) + (C.X * (A.Y - P.Y))) / 2
        let WO_C = Math.abs((A.X * (B.Y - P.Y)) + (B.X * (P.Y - A.Y)) + (P.X * (A.Y - B.Y))) / 2


        let Total = WO_A + WO_B + WO_C;
        Total = Math.round(Total * 10000) / 10000;
        if (Total == Area) {
            buildings[i].style.backgroundColor = 'red';
            buildings[i].style.opacity = .9;
            intheway.push(buildings[i]);
        }
        i++;
    }
    return intheway
}

function Check_TooTall(viewpoint, buildings) {
    let height = viewpoint.dataset.Height;
    let i = 0;
    let faulty = false;
    while (i < buildings.length) {
        let thisHeight = buildings[i].dataset.Height;
        if (thisHeight > height) {
            faulty = true;
        }
        i++;
    }
    return faulty;
}




function Calc_RingBuildings(oX, oY, r, distance) {
    let buildings = document.getElementsByClassName('place');
    let ring = []
    let i = 0;
    while (i < buildings.length) {
        let BY = Number(buildings[i].style.bottom.slice(0, -2));
        let BX = Number(buildings[i].style.right.slice(0, -2));

        let pyth = Math.sqrt((Math.abs(BX - oX) * Math.abs(BX - oX)) + (Math.abs(BY - oY) * Math.abs(BY - oY)))
        if (pyth > r && pyth <= distance) {
            ring.push(buildings[i])
        }
        i++;
    }
    return ring;
}














function Color_InnerRadius(oX, oY, r) {
    let buildings = document.getElementsByClassName('place');

    let i = 0;
    while (i < buildings.length) {
        let bottom = buildings[i].style.bottom.slice(0, -2);
        let right = buildings[i].style.right.slice(0, -2);
        let oLatDistance = Math.abs(Number(bottom) - Number(oX));
        let oLongDistane = Math.abs(Number(right) - Number(oY));
        let oHyp = Math.sqrt((Number((oLatDistance * oLatDistance)) +
            Number((oLongDistane * oLongDistane))));

        if (oHyp <= r) {
            buildings[i].classList.add('inner-radius')
        }
        else {
            buildings[i].classList.remove('inner-radius')
            buildings[i].style.backgroundColor = `rgba(256, 256, 256, 1)`
        }
        i++;
    }
}

function Clear() {
    let points = document.getElementsByClassName("circle_point");
    let i = 0;
    while (i < points.length) {
        points[i].remove();
        i++;
    }
}

function ran(max) {
    return Math.floor(Math.random() * max);
}

function Convert_ToRadian(degrees) {
    return (degrees * (Math.PI / 180));
}






























function Handle_TooTall(closeBy, lat, long) {
    let i = 5;
    while (i < closeBy.length) {
        closeBy[i].style.backgroundColor = 'green'
        let bottom = Number(closeBy[i].style.bottom.slice(0, -2));
        let right = Number(closeBy[i].style.right.slice(0, -2));
        Find_TooTall(bottom, right, Number(lat), Number(long))

        i++
        i = 1000;
    }
}

function Find_TooTall(vBottom, vRight, oBottom, oRight) {
    let buildings = document.getElementsByClassName('place');
    let i = 0;
    while (i < buildings.length) {
        if (!buildings[i].classList.contains('inner-radius')) {
            let bBottom = Number(buildings[i].style.bottom.slice(0, -2));
            let bRight = Number(buildings[i].style.right.slice(0, -2));
            if (oBottom > bBottom && oRight < bRight && vBottom < bBottom && vRight > bRight) {
                buildings[i].style.backgroundColor = 'red'
            }
        }
        i++;
    }
}