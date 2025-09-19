import { Vector } from "../helper/Vector";

export function parametricEquation(
  position: Vector,
  theta: number,
  directionVec: Vector,
  perpVec: Vector,
  radius: number
): Vector {
  return new Vector(
    position.x +
      (Math.cos(theta) * directionVec.x - Math.sin(theta) * perpVec.x) * radius,
    position.y +
      (Math.cos(theta) * directionVec.y - Math.sin(theta) * perpVec.y) * radius
  );
}
