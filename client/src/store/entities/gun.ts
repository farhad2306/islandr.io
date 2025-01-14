import { Ammo, ENTITY_SUPPLIERS } from ".";
import { GunColor } from "../../constants";
import { getWeaponImagePath } from "../../textures";
import { Entity } from "../../types/entity";
import { MinEntity } from "../../types/minimized";
import { EntitySupplier } from "../../types/supplier";
import { circleFromCenter } from "../../utils";
import Player from "./player";

interface AdditionalEntity {
	name: string;
	color: GunColor;
}

class GunSupplier implements EntitySupplier {
	create(minEntity: MinEntity & AdditionalEntity) {
		return new Gun(minEntity);
	}
}

export default class Gun extends Entity {
	static readonly gunImages = new Map<string, HTMLImageElement & { loaded: boolean }>();
	static readonly TYPE = "gun";
	type = Gun.TYPE;
	name!: string;
	color!: GunColor;
	zIndex = 8;

	constructor(minEntity: MinEntity & AdditionalEntity) {
		super(minEntity);
		this.copy(minEntity);
	}

	static {
		ENTITY_SUPPLIERS.set(Gun.TYPE, new GunSupplier());
	}

	copy(minEntity: MinEntity & AdditionalEntity) {
		super.copy(minEntity);
		this.name = minEntity.name;
		this.color = minEntity.color;
	}

	render(you: Player, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number) {
		const relative = this.position.addVec(you.position.inverse());
		const radius = scale * this.hitbox.comparable;
		ctx.translate(canvas.width / 2 + relative.x * scale, canvas.height / 2 + relative.y * scale);
		ctx.rotate(-this.direction.angle());
		ctx.strokeStyle = `#${Ammo.colorScheme[this.color][2]}`;
		ctx.lineWidth = scale * 0.25;
		circleFromCenter(ctx, 0, 0, radius, false, true);
		ctx.fillStyle = `#${Ammo.colorScheme[this.color][2]}66`;
		circleFromCenter(ctx, 0, 0, radius, true, false);
		const img = Gun.gunImages.get(this.name);
		if (!img?.loaded) {
			if (!img) {
				const image: HTMLImageElement & { loaded: boolean } = Object.assign(new Image(), { loaded: false });
				image.onload = () => image.loaded = true;
				image.src = getWeaponImagePath(this.name);
				Gun.gunImages.set(this.name, image);
			}
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#fff";
			ctx.font = `${canvas.height / 54}px Arial`;
			ctx.fillText(this.name, 0, 0);
		} else
			ctx.drawImage(img, -0.7*radius, -0.7*radius, 1.4*radius, 1.4*radius);
		ctx.resetTransform();
	}
}