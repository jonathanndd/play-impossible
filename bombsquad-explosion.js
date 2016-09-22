(function () {
    "use strict";
    var n = 0,
        ce,
        t,
        resultVec;

    // numkeys = number of key frames in the current property
    if (numKeys > 0) {
        // time = current compsition time in seconds (the time being currently evaluated)
        // nearestKey finds the keyframe closest to the current time (being evaluated)
        // find the closest keyframe to the time currently being evaluated, get the index number of that keyframe
        n = nearestKey(time).index;

        // we want the closest key frame in the past. If the previous line found a closer keyframe in the future we use the previous key frame
        if (key(n).time > time) {
            n -= 1;
        }
    }


    t = time - key(n).time;


    //[value[1], value[1]] - this positions the element to have x and y values equal to the natural y value

    ce = 1 + t;

    resultVec = mul(value, ce);
    
    return resultVec;
    
}());