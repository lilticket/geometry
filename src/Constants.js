export const delay = ms => new Promise(res => setTimeout(res, ms));

export const GenerateFakeList = () => {
    let i = 0;
    let ps = []
    while (i < 10000) {
        ps.push({
            PointId: 1055499,
            Latitude: Math.random() * 100,
            Longitude: Math.random() * 100,
            BIN: 1055499,
            Height: Math.random() * 100,
            Elevation: 25,
            ConstructionYear: 1817,
        })
        i++;
    }
    return ps;
}

// b / cos(theta)