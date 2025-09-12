import { Vector } from "../helper/Vector";
import type { LifePoint } from "../types/Types";

//Use the parametric equations of a circle to create points around the circle
// Whats we use x=r cos(t),y=r sin(t) and feta = 2πt
export function createDrawArr(testVec: LifePoint[] = []) {
  let outlinePoints: Vector[] = [];
  let leftPoints: Vector[] = [];
  let rightPoints: Vector[] = [];

  // Not enough points to form a shape
  if (testVec.length < 2) return { outlinePoints: [] };

  // For each circle (except the last one)
  for (let i = 0; i < testVec.length - 1; i++) {
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

    let leftPoint: Vector | undefined;
    let rightPoint: Vector | undefined;
    let tailPoints: Vector[] | undefined;
    let headPoints: Vector[] | undefined;
    if (i !== 0 && i !== testVec.length - 2) {
      //Implementing the above formula
      const leftT = 0.25;
      const leftTheta = leftT * 2 * Math.PI;
      leftPoint = new Vector(
        current.position.x +
          (Math.cos(leftTheta) * directionVec.x -
            Math.sin(leftTheta) * perpVec.x) *
            current.radius,
        current.position.y +
          (Math.cos(leftTheta) * directionVec.y -
            Math.sin(leftTheta) * perpVec.y) *
            current.radius
      );

      // Implementing the above formula
      const rightT = 0.75;
      const rightTheta = rightT * 2 * Math.PI;
      rightPoint = new Vector(
        current.position.x +
          (Math.cos(rightTheta) * directionVec.x -
            Math.sin(rightTheta) * perpVec.x) *
            current.radius,
        current.position.y +
          (Math.cos(rightTheta) * directionVec.y -
            Math.sin(rightTheta) * perpVec.y) *
            current.radius
      );
    }
    if (i === 0) {
      tailPoints = headOrTail(6, perpVec, directionVec, current, "tail");
      tailPoints?.forEach((p) => rightPoints.push(p));
    }
    if (i === testVec.length - 2) {
      headPoints = headOrTail(6, perpVec, directionVec, next, "head");
      headPoints?.forEach((p) => leftPoints.push(p));
    }

    // Add the points to outline
    if (leftPoint && rightPoint) {
      leftPoints.push(leftPoint);
      rightPoints.push(rightPoint);
    }
  }
  outlinePoints = [...leftPoints, ...rightPoints.reverse()];

  return { outlinePoints };
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
    const point = new Vector(
      current.position.x +
        (Math.cos(theta) * directionVec.x - Math.sin(theta) * perpVec.x) *
          current.radius,
      current.position.y +
        (Math.cos(theta) * directionVec.y - Math.sin(theta) * perpVec.y) *
          current.radius
    );
    points.push(point);
  }

  return points;
}
