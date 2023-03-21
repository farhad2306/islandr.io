import { world } from "../..";
import { RectHitbox, Vec2 } from "../../types/math";
import { Obstacle } from "../../types/obstacle";
import { GunColor } from "../../types/misc";
import { randomBetween, spawnAmmo, spawnGun } from "../../utils";

export default class AWMCrate extends Obstacle {
	type = "AWMCrate";

	constructor() {
		const hitbox = new RectHitbox(4, 5);
		super(world, hitbox, hitbox.scaleAll(0.75), 200, 200);
		this.direction = Vec2.UNIT_X;
		while (world.terrainAtPos(this.position).id != "plain" || world.obstacles.find(obstacle => obstacle.collided(this.hitbox, this.position, this.direction))) this.position = world.size.scale(Math.random(), Math.random());
	}

	die() {
		super.die();
		// TODO: Spawn loots
		const GunIndex = Math.floor(randomBetween(0, 2));
		const gunNumAmmo = [[15, 20], [35, 35], [15, 15]];
		const gunList = ["awm", "sv98", "mosin_nagant"];
		const gunColorList = [GunColor.OLIVE, GunColor.BLUE, GunColor.BLUE];
		spawnGun(gunList[GunIndex], gunColorList[GunIndex], this.position);
		for (let ii=0; ii<2; ii++ ){spawnAmmo(gunNumAmmo[GunIndex][ii], gunColorList[GunIndex], this.position);}
	}
}