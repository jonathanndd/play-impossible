(function () {
    "use strict";
    var n = 0,
        t,
        blastSize = thisComp.layer("gravVariables").content("Rectangle 1").content("Rectangle Path 1").size[1], // 4 "Global" control for explosion magnitude
        blastMag,
        halfAcc = thisComp.layer("gravVariables").content("Rectangle 1").content("Rectangle Path 1").size[0], // 60 "Global" control for half of gravitational acceleration. Used in x = .5at^2 style equations.
        height = thisComp.layer("gravVariables").content("Rectangle 1").content("Stroke 1").strokeWidth, // 62.5, "Global" control for hexagon side length (half hex height)
        explosionControlSlider = thisComp.layer("gravVariables").effect("Slider Control")("Slider"), // "Global" control for timing explosion
        normalizeControlSlider = thisComp.layer("gravVariables").effect("Slider Control 2")("Slider"), //0 "Global" control for normalizing explosion: >1: no noramlizing; >=1: normalize;
        diagonalControlSlider = thisComp.layer("gravVariables").effect("Slider Control 3")("Slider"), // "Global" control for modifying strength of diagonal gravity. 
        longSUnit = Math.sqrt(3) / 2, // tirg value for long non-hypotenuse side of 30-60-90 triangle
        longS = longSUnit * height, // length of long non-hypotenuse side for 30-60-90 triangles within our hexes 
        shortS = 0.5 * height, // length of short side for 30-60-90 triangles within our hexes
        switchY = 3 * height, // default y value for point at which hexes should turn
        maxVertDisplacement,
        timeOfTurn,
        timeSinceTurn,
        testX,
        gravMag,
        gravUnitVec = [0, 1],
        direction = null,
        gravX,
        gravity,
        explosion,
        resultVec,
        vertGravMag,
        vertGravVec,
        diagGravUnitVec,
        diagGravVec,
        explosionVec,
        topLayerTest;
    
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

    // get time since initial keyframe
    t = time - key(n).time;
    
    //value[0] and value[1] are the starting x and y values for the layer
    
    // set explosion values, assuming we start exploding immediately
    blastMag = 1 + (t * blastSize);
            
    
    // Lots of trig produced these equations!
    testX = Math.abs(Math.round(value[0] / longS)); // converts x position into 0, 1, 2, 3 based on distance from centerline 
    
    // Fix top layer by treating all 16 hexes identically
    topLayerTest = value[1] + (testX * shortS) + height;
    if (topLayerTest <= 0) {
        //switchY = switchY - (0 * shortS);
        //maxVertDisplacement = switchY;
        // uses defaylt switchY value
        timeOfTurn = Math.sqrt((switchY) / halfAcc) - key(n).time;
        //switchY = switchY - (testX * shortS);
        switchY = switchY + value[1];
       
    } else {
        switchY = switchY - (testX * shortS); // the yPoint at which the cube should begin moving diagonally
    
        maxVertDisplacement = switchY - value[1]; // distance cube will need to travel to reach switch point
        timeOfTurn = Math.sqrt((maxVertDisplacement) / halfAcc) - key(n).time; // calculate time unti cube will turn using acc displament equation: x = .5at^2
    }
    
    explosion = mul(value, blastMag);
    
    
    // before we need to trun
    if (t < timeOfTurn) {
        //vertical
        gravMag = (halfAcc * t * t); // magnitude of gravity vector is based on t^2
        gravity = mul(gravUnitVec, gravMag); // The grav unit vector just points down
        
        // if explosion controller is > 1, don’t show any explosion until the hex reaches the turning point
        if (explosionControlSlider >= 1) {
            explosion = value;
        }
    // after or at turning time
    } else {
        // diagonal 
        
        // check if cube is in the middle
        if (value[0] === 0) {
            // if so, assign it a diagonal direction
            // this math alternates between 0 or 1 based on y position
            direction = Math.abs(value[1] / height) % 2;
        }

        // determine whether cube moves diaoganlly to the right or to left
        if (value[0] > 0 || direction === 0) {
            gravX = 0.5; // move right
        } else if (value[0] < 0 || direction === 1) {
            gravX = -0.5; // move left
        }
        
        timeSinceTurn = t - timeOfTurn;
        
        // calculate diagonal gravity vector
        diagGravUnitVec = [gravX, longSUnit]; // diagonal unit vector
        gravMag = (diagonalControlSlider * halfAcc * timeSinceTurn * timeSinceTurn);
        diagGravVec = mul(diagGravUnitVec, gravMag);
        
        // calculate vector of gravity right before the turning point
        vertGravMag = (halfAcc * timeOfTurn * timeOfTurn);
        vertGravVec = mul(gravUnitVec, vertGravMag);
        
        // add the diagonal gravity vector to vertical gravity vector 
        gravity = add(diagGravVec, vertGravVec);
        
        // if explosion controller is >= 2, base explosion size on timeSinceTurn
        if (explosionControlSlider >= 2) {
            // recalculate explosion
            blastMag = 1 + (timeSinceTurn * blastSize);
            
            //  normalize value vector and multiply switchY, so explosion size does consider initial angle but makes all explosions of (mostly) equal strength
            // if disabled, each hexagon  will explode with strength proporotional to its starting position
            // explosion strength also increases linearly over time
            if (normalizeControlSlider >= 1) {
                explosionVec = [value[0], switchY];
                gravity = diagGravVec; // just diag
                
            }
            
            explosion = mul(explosionVec, blastMag);

        }
    
    }

    resultVec = add(explosion, gravity);

    return resultVec;
    
}());