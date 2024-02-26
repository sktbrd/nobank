/**
 * Checks if any one of the three points can act as a midpoint (within 100 miles of the other two points).
 * @param point1 The first point with latitude and longitude.
 * @param point2 The second point with latitude and longitude.
 * @param point3 The third point with latitude and longitude.
 * @returns True if any point can be a midpoint within 100 miles of the other two, otherwise false.
 */
function canAnyPointBeMidpoint(point1, point2, point3) {
    const toRadians = degree => degree * (Math.PI / 180);

    const earthRadiusMiles = 3958.8; // Radius of the Earth in miles

    const calculateDistance = (p1, p2) => {
        const lat1Radians = toRadians(p1.lat);
        const lat2Radians = toRadians(p2.lat);
        const deltaLatRadians = toRadians(p2.lat - p1.lat);
        const deltaLngRadians = toRadians(p2.lng - p1.lng);

        const a =
            Math.sin(deltaLatRadians / 2) * Math.sin(deltaLatRadians / 2) +
            Math.cos(lat1Radians) *
            Math.cos(lat2Radians) *
            Math.sin(deltaLngRadians / 2) *
            Math.sin(deltaLngRadians / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusMiles * c;
    };

    const distance1to2 = calculateDistance(point1, point2);
    const distance2to3 = calculateDistance(point2, point3);
    const distance3to1 = calculateDistance(point3, point1);

    // Check if any point can be a midpoint within 100 miles of the other two points
    const canPoint1BeMidpoint = distance1to2 <= 100 && distance3to1 <= 100;
    const canPoint2BeMidpoint = distance1to2 <= 100 && distance2to3 <= 100;
    const canPoint3BeMidpoint = distance2to3 <= 100 && distance3to1 <= 100;

    return canPoint1BeMidpoint || canPoint2BeMidpoint || canPoint3BeMidpoint;
}

// Example usage
const point1 = { lat: 34.0522, lng: -118.2437 }; // Point 1
const point2 = { lat: 34.0522, lng: -118.2437 }; // Point 2 (Same as Point 1 for the sake of example, adjust accordingly)
const point3 = { lat: -34.0522, lng: -119.2437 }; // Point 3

const result = canAnyPointBeMidpoint(point1, point2, point3);

console.log(`Can any point be a midpoint within 100 miles of the other two? ${result}`);
