import { world } from "../..";
import { CircleHitbox } from "../../types/math";
import { GunColor } from "../../types/misc";
import { Obstacle } from "../../types/obstacle";
import { randomBetween } from "../../utils";
import { spawnGun } from "../../utils";

export default class Stone extends Obstacle {
	type = "stone";

	constructor() {
		const salt = randomBetween(0.9, 1.1);
		super(world, new CircleHitbox(2).scaleAll(salt), new CircleHitbox(1.5).scaleAll(salt), 250, 250);
		while (world.terrainAtPos(this.position).id != "plain" || world.obstacles.find(obstacle => obstacle.collided(this.hitbox, this.position, this.direction))) this.position = world.size.scale(Math.random(), Math.random());
	}
	die(): void {
		super.die();
		spawnGun("ak47", GunColor.BLUE, this.position, 60);

	}
}