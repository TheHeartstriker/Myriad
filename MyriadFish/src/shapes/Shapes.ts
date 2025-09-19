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

  // Not enough points to form a shape
  if (testVec.length < 2) return { outlinePoints: [], eyes: [] };

  // Loop over all points excepts the first aka tail point and the last two points of the head area
  for (let i = 8; i < testVec.length - 2; i++) {
    const current = testVec[i];
    const next = testVec[i + 1];
    if (i >= 2) {
      angleConstraint(
        90,
        135,
        testVec[i - 2].position,
        testVec[i - 1].position,
        current.position,
        0.5
      );
    }

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

    let leftPoint: Vector | undefined;
    let rightPoint: Vector | undefined;
    let tailPoints: Vector[] | undefined;
    let headPoints: Vector[] | undefined;
    if (i !== 8 && i !== testVec.length - 3) {
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
    if (i === 8) {
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

function angleConstraint(
  angle: number, // Minimum angle threshold (e.g., 90 degrees)
  scaleTo: number, // Target angle to scale to (e.g., 100 degrees)
  a: Vector,
  b: Vector,
  c: Vector,
  lerpFactor: number = 0.1 // Interpolation factor for smooth movement (0 to 1)
) {
  // Compute vectors ab and cb
  const ab = new Vector(a.x - b.x, a.y - b.y);
  const cb = new Vector(c.x - b.x, c.y - b.y);

  // Compute dot product and magnitudes
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

  // Avoid division by zero
  if (magAB === 0 || magCB === 0) return;

  // Compute current angle
  const cosTheta = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  const thetaRad = Math.acos(cosTheta);
  const thetaDeg = (thetaRad * 180) / Math.PI;

  // Check if angle is too small
  if (thetaDeg < angle) {
    // Convert target angle to radians
    const targetAngleRad = (scaleTo * Math.PI) / 180;

    // Normalize ab
    const abNorm = ab.normalize();

    // Determine rotation direction
    const crossProduct = ab.x * cb.y - ab.y * cb.x;
    const direction = crossProduct < 0 ? -1 : 1;

    // Compute new direction for cb by rotating abNorm
    const cosTargetAngle = Math.cos(targetAngleRad);
    const sinTargetAngle = Math.sin(targetAngleRad);
    const newCBx =
      abNorm.x * cosTargetAngle - direction * abNorm.y * sinTargetAngle;
    const newCBy =
      abNorm.y * cosTargetAngle + direction * abNorm.x * sinTargetAngle;

    // Scale to original cb magnitude
    const newCB = new Vector(newCBx, newCBy).normalize().scale(magCB);

    // Compute target position for c
    const targetCx = b.x + newCB.x;
    const targetCy = b.y + newCB.y;

    // Interpolate toward the target position for smoothness
    c.x = c.x + (targetCx - c.x) * lerpFactor;
    c.y = c.y + (targetCy - c.y) * lerpFactor;
  }
}
