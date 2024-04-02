export function deepCopy (obj) {
    if (typeof(obj) !== "object") {
        return obj;
    }
    const copy = {};
    for (const key in obj) {
        copy[key] = deepCopy(obj[key]);
    }
    return copy;
}