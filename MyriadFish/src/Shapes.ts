import { Vector } from "./Vector";
import type { LifePoint } from "./Types";

export function createDrawArr(testVec: LifePoint[] = [], steps: number = 100) {
  const leftPoints: Vector[] = [];
  const rightPoints: Vector[] = [];

  // Not enough points to form a shape
  if (testVec.length < 2) return { leftPoints, rightPoints };

  // Parameter t goes from 0 to 1
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;

    // Find position along the spine using parametric interpolation
    let spinePos = new Vector(0, 0);
    let radius = 0;

    // For a simple linear interpolation between spine points
    const segmentCount = testVec.length - 1;
    const segmentIndex = Math.min(
      Math.floor(t * segmentCount),
      segmentCount - 1
    );
    const segmentT = t * segmentCount - segmentIndex;

    const current = testVec[segmentIndex];
    const next = testVec[segmentIndex + 1];

    // Interpolate position
    spinePos.x =
      current.position.x + (next.position.x - current.position.x) * segmentT;
    spinePos.y =
      current.position.y + (next.position.y - current.position.y) * segmentT;

    // Interpolate radius (disConstraint)
    radius =
      current.disConstraint +
      (next.disConstraint - current.disConstraint) * segmentT;

    // Calculate direction vector
    let directionVec = new Vector(
      next.position.x - current.position.x,
      next.position.y - current.position.y
    ).normalize();

    // Calculate perpendicular vectors
    const perpLeft = new Vector(-directionVec.y, directionVec.x);
    const perpRight = new Vector(directionVec.y, -directionVec.x);

    // Special case for head (front point)
    const isHead = segmentIndex === 0 && segmentT < 0.1;
    // Special case for tail (back point)
    const isTail = segmentIndex === segmentCount - 1 && segmentT > 0.9;

    // Scale factor adjustments for head and tail
    let scaleFactor = 1;
    if (isHead) {
      scaleFactor = 1.5; // Original head scaling
    } else if (isTail) {
      // Taper the tail to a point
      const tailProgress = (segmentT - 0.9) * 10; // 0 to 1 for tail portion
      scaleFactor = 3 + tailProgress * 7; // Gradually increases from 3 to 10
    }

    // Calculate left and right points
    const leftPoint = new Vector(
      spinePos.x + perpLeft.x * (radius / scaleFactor),
      spinePos.y + perpLeft.y * (radius / scaleFactor)
    );

    const rightPoint = new Vector(
      spinePos.x + perpRight.x * (radius / scaleFactor),
      spinePos.y + perpRight.y * (radius / scaleFactor)
    );

    leftPoints.push(leftPoint);
    rightPoints.push(rightPoint);
  }

  // Add connecting points to create a closed shape
  // Tail tip - where left and right points nearly meet
  const tailTipPos = new Vector(
    (leftPoints[leftPoints.length - 1].x +
      rightPoints[rightPoints.length - 1].x) /
      2,
    (leftPoints[leftPoints.length - 1].y +
      rightPoints[rightPoints.length - 1].y) /
      2
  );

  // Nose tip - where left and right points meet at the front
  const noseTipPos = new Vector(
    (leftPoints[0].x + rightPoints[0].x) / 2,
    (leftPoints[0].y + rightPoints[0].y) / 2
  );

  // Complete the outline by connecting the points
  const outlinePoints: Vector[] = [
    ...leftPoints, // Left side from front to back
    tailTipPos, // Tail tip
    ...rightPoints.reverse(), // Right side from back to front
    noseTipPos, // Close the loop at the nose
  ];

  return { outlinePoints };
}
