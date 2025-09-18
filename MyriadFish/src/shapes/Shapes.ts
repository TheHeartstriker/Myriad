import { Vector } from "../helper/Vector";
import type { LifePoint } from "../types/Types";
import { parametricEquation } from "./Math";

//Use the parametric equations of a circle to create points around the circle
// Whats we use x=r cos(t),y=r sin(t) and feta = 2πt
export function createDrawArr(testVec: LifePoint[] = []) {
  let outlinePoints: Vector[] = [];
  let eyes: Vector[] = [];
  let leftPoints: Vector[] = [];
  let rightPoints: Vector[] = [];
  let logTest: LifePoint[] = [];

  // Not enough points to form a shape
  if (testVec.length < 2) return { outlinePoints: [], eyes: [] };

  // Loop over all points excepts the first aka tail point and the last two points of the head area
  for (let i = 2; i < testVec.length - 2; i++) {
    logTest.push(testVec[i]);
    const current = testVec[i];
    const next = testVec[i + 1];

    // At first we calculate the next x and y from the current and next point
    // Which then represents the step that next would take to get to current
    // We then normalize this vector to get the direction which is the front of the circle where t = 0
    const directionVec = new Vector(
      next.position.x - current.position.x,
      next.position.y - current.position.y
    ).normalize();

    // The direction vector is the x axis of the circle direction this is the y the top and bottom of the circle
    const perpVec = new Vector(-directionVec.y, directionVec.x);

    // Ok we have the equation we are using above but we are not centered at origin
    // So we have something like x=cx+rcos(2πt),y=cy+rsin(2πt) where we ad cx and cy to center it around some new point
    // Great but really t = x + radius aka the right it never changes so we cant use that we want t to equal the 'front'
    // We defined what direction that is above so we can plug that in to this new formula to get the new t = 0 point
    // P=center+r(cos(2πt)⋅directionVec+sin(2πt)⋅perpVec)

    angleContraint(
      90,
      testVec[i - 2].position,
      testVec[i - 1].position,
      current.position
    );

    let leftPoint: Vector | undefined;
    let rightPoint: Vector | undefined;
    let tailPoints: Vector[] | undefined;
    let headPoints: Vector[] | undefined;
    if (i !== 2 && i !== testVec.length - 3) {
      //Implementing the above formula
      const leftT = 0.25;
      const leftTheta = leftT * 2 * Math.PI;
      leftPoint = parametricEquation(
        current.position,
        leftTheta,
        directionVec,
        perpVec,
        current.radius
      );

      // Implementing the above formula
      const rightT = 0.75;
      const rightTheta = rightT * 2 * Math.PI;
      rightPoint = parametricEquation(
        current.position,
        rightTheta,
        directionVec,
        perpVec,
        current.radius
      );
    }
    if (i === 2) {
      tailPoints = headOrTail(6, perpVec, directionVec, current, "tail");
      tailPoints?.forEach((p) => rightPoints.push(p));
    }
    if (i === testVec.length - 3) {
      headPoints = headOrTail(6, perpVec, directionVec, current, "head");
      headPoints?.forEach((p) => leftPoints.push(p));
    }
    //Right before head we use this to get the eyes
    if (i === testVec.length - 5) {
      const eyeOffset = 0.15;
      const eye1T = 0.25 - eyeOffset;
      const eye2T = 0.75 + eyeOffset;
      const eye1Theta = eye1T * 2 * Math.PI;
      const eye2Theta = eye2T * 2 * Math.PI;
      const eye1 = parametricEquation(
        current.position,
        eye1Theta,
        directionVec,
        perpVec,
        current.radius
      );
      const eye2 = parametricEquation(
        current.position,
        eye2Theta,
        directionVec,
        perpVec,
        current.radius
      );
      eyes.push(eye1, eye2);
    }

    // Add the points to outline
    if (leftPoint && rightPoint) {
      leftPoints.push(leftPoint);
      rightPoints.push(rightPoint);
    }
  }
  outlinePoints = [...leftPoints, ...rightPoints.reverse()];

  return { outlinePoints, eyes };
}
// The goal is we pass the life point of either head or tail and how defined its head or tail is
function headOrTail(
  definedLevel: number,
  perpVec: Vector,
  directionVec: Vector,
  current: LifePoint,
  whichEnd: "head" | "tail"
) {
  // Assuming tail for now
  let start: number = 0.25;
  let end: number = 0.75;
  let normT: number[] = [];
  if (whichEnd === "tail") {
    for (let i = 0; i <= definedLevel; i++) {
      normT.push(start + (i / definedLevel) * (end - start));
    }
  }
  if (whichEnd === "head") {
    //Idea transfer normalize to angles 0 to 260degrees then chose evenly spaced angles
    let arr = [0.25, 0.1, 0.9, 0.75];
    normT.push(...arr);
  }
  let points: Vector[] = [];
  for (let t of normT) {
    const theta = t * 2 * Math.PI;
    const point = parametricEquation(
      current.position,
      theta,
      directionVec,
      perpVec,
      current.radius
    );
    points.push(point);
  }

  return points;
}

function angleContraint(angle: number, a: Vector, b: Vector, c: Vector) {
  const ab = new Vector(a.x - b.x, a.y - b.y);
  const cb = new Vector(c.x - b.x, c.y - b.y);

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

  // Clamp value to avoid NaN due to floating point errors
  const cosTheta = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  const thetaRad = Math.acos(cosTheta);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  //The angles are getting too close together we need to move c
  if (thetaDeg < angle) {
    console.log(
      `BEFORE adjustment: c = (${c.x.toFixed(2)}, ${c.y.toFixed(2)})`
    );
    // Convert minimum angle to radians
    const minAngleRad = (angle * Math.PI) / 180;

    // Normalize the vectors
    const abNorm = ab.normalize();

    // Calculate the rotation matrix for the minimum angle
    const cosMinAngle = Math.cos(minAngleRad);
    const sinMinAngle = Math.sin(minAngleRad);

    // Create a new vector that's rotated by the minimum angle from ab
    // Determining which direction to rotate based on the current orientation
    const crossProduct = ab.x * cb.y - ab.y * cb.x;
    const direction = crossProduct < 0 ? -1 : 1;

    // Create the new direction for c from b
    const newCBx =
      magCB * (abNorm.x * cosMinAngle - direction * abNorm.y * sinMinAngle);
    const newCBy =
      magCB * (abNorm.y * cosMinAngle + direction * abNorm.x * sinMinAngle);

    // Update c's position based on b and the new direction
    c.x = b.x + newCBx;
    c.y = b.y + newCBy;

    console.log(`AFTER adjustment: c = (${c.x.toFixed(2)}, ${c.y.toFixed(2)})`);
  }
}
