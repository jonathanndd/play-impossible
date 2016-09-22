(function () {
    "use strict";
    var maxL = thisComp.layer("opacityVariables").content("Rectangle 1").content("Rectangle Path 1").size[0], // 433
        threshold = thisComp.layer("opacityVariables").content("Rectangle 1").content("Rectangle Path 1").size[1], // 0.8
        coef = thisComp.layer("opacityVariables").content("Rectangle 1").content("Stroke 1").strokeWidth, //1
        minL = threshold * maxL,
        dist = maxL - minL,
        radius = (thisLayer.scale[1] / 100) * (thisLayer.height) / 8,
        currentL = length(thisLayer.position) + (radius * coef),
        relL,
        frac,
        opacityPercentage,
        xVal = thisLayer.transform.position[0],
        yVal = thisLayer.transform.position[1],
        rawTheta = Math.atan2(yVal, xVal),
        thirtyDeg = Math.PI / 6,
        sixtyDeg = Math.PI / 3,
        relTheta = Math.abs((rawTheta + thirtyDeg) % sixtyDeg),
        hexLength;
    
    if (relTheta > thirtyDeg) {
        hexLength = (Math.sqrt(3)) / (2 * Math.cos(relTheta - thirtyDeg));
    } else {
        hexLength = (Math.sqrt(3)) / (2 * Math.sin(relTheta + sixtyDeg));
    }
    
    minL = threshold * (maxL * hexLength);
    dist = (maxL * hexLength) - minL;
    currentL = length(thisLayer.position) + (radius * hexLength * coef);
    
	if (currentL > minL) {
        relL = currentL - minL;
        frac = 1 - (relL / dist);
        opacityPercentage = frac * 100;
    } else {
        opacityPercentage = 100;
    }
    
    return opacityPercentage;
    
}());