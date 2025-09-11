import { Vector } from "../helper/Vector";
import type { LifePoint } from "../types/Types";

//Use the parametric equations of a circle to create points around the circle
// Whats we use x=r cos(t),y=r sin(t) and feta = 2πt
export function createDrawArr(testVec: LifePoint[] = []) {
  const outlinePoints: Vector[] = [];

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

    //Implementing the above formula
    const leftT = 0.25;
    const leftTheta = leftT * 2 * Math.PI;
    const leftPoint = new Vector(
      current.position.x +
        (Math.cos(leftTheta) * directionVec.x -
          Math.sin(leftTheta) * perpVec.x) *
          current.disConstraint,
      current.position.y +
        (Math.cos(leftTheta) * directionVec.y -
          Math.sin(leftTheta) * perpVec.y) *
          current.disConstraint
    );

    // Implementing the above formula
    const rightT = 0.75;
    const rightTheta = rightT * 2 * Math.PI;
    const rightPoint = new Vector(
      current.position.x +
        (Math.cos(rightTheta) * directionVec.x -
          Math.sin(rightTheta) * perpVec.x) *
          current.disConstraint,
      current.position.y +
        (Math.cos(rightTheta) * directionVec.y -
          Math.sin(rightTheta) * perpVec.y) *
          current.disConstraint
    );

    // Add the points to outline
    outlinePoints.push(leftPoint, rightPoint);
  }

  return { outlinePoints };
}
