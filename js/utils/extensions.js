function remove(array, item) {
    return array.splice(array.indexOf(item), 1);
}

Math.sum = function(array, func = (x => x)) {
    const isDecimal = func(array[0]) instanceof Decimal;
    return array.reduce((a, v) => isDecimal ? (a.add(func(v))) : (a + func(v)), isDecimal ? new Decimal(0) : 0);
}

Math.mean = function(array, func) {
    return array[0] instanceof Decimal ? Math.sum(array, func).div(array.length) : Math.sum(array, func) / array.length;
}

Math.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

Math.lerp = function(va, vb, alpha) {
    return vb * alpha + va * (1 - alpha);
}