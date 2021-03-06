/**
* Created by winter on 2014/11/19.
*/
var ORBIT ={

    max: {
        step: 100000,
        a: 10000000,
        e: 1,
        i: 180,
        Om: 180,
        om: 180,
        theta: 180,
        driftAnglenfield: 180,
        rollAnglenfield: 180,
        pitchAnglenfield: 180,
        azimuthalAnglenfield: 180,
        elevationAnglenfield: 180,
        spinSpeednfield: 1000
    },
    min: {
        step: 0,
        a: 6400,
        e: 0,
        i: -180,
        Om: -180,
        om: -180,
        theta: -180,
        driftAnglenfield: -180,
        rollAnglenfield: -180,
        pitchAnglenfield: -180,
        azimuthalAnglenfield: -180,
        elevationAnglenfield: -180,
        spinSpeednfield: 0
    },
    GravitationalConstant:{
        'sun': 1.9891e30 * 6.672e-11 / 1e9,
        'mercury': 3.30e23 * 6.672e-11 / 1e9,
        'venus': 4.869e24 * 6.672e-11 / 1e9,
        'earth': 5.976e24 * 6.672e-11 / 1e9,
        'mars': 6.4219e23 * 6.672e-11 / 1e9,
        'jupiter': 1.9e27 * 6.672e-11 / 1e9,
        'saturn': 5.688e26 * 6.672e-11 / 1e9,
        'uranus': 8.686e25 * 6.672e-11 / 1e9,
        'neptune': 1.0247e26 * 6.672e-11 / 1e9,
        'moon': 7.349e22 * 6.672e-11 / 1e9
    },
//各大行星的惯性坐标系的旋转矩阵
    PlanetJ2000Matrix:{
        'sun': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'mercury': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'venus': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'earth': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'mars': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'jupiter': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'saturn': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'uranus': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'neptune': new THREE.Matrix4(1, 0, 0, 0,
            0, 0.9174820780754089, -0.39777716994285583, 0,
            0, 0.39777716994285583, 0.9174820780754089, 0,
            0, 0, 0, 1),
        'moon': new THREE.Matrix4(1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1)
    }
};