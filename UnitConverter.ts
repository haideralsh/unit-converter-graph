type Converstions = Record<string, number>;
export type ConverstionsConfig = Record<string, Converstions>[];

/**
Class for a measurement unit converter that uses a graph
where each vertex is a unit and each edge is a multiplier.
Using a graph allows the class to convert between any two
units from the same measurement even if there is no
edge (multiplier) between them using other common
verticies (units).
*/
export default class UnitConverter {
	private units: Map<string, Converstions>;

	constructor(units: ConverstionsConfig = []) {
		this.units = new Map(units.map(Object.entries).flat());
	}

	addUnit(unit: string, converstions: Converstions = {}) {
		if (this.units.has(unit)) return;

		this.units.set(unit, converstions);
	}

	addConverstion({
		from,
		to,
		converstionMultiplier,
		revertMultiplier,
	}: {
		from: string;
		to: string;
		converstionMultiplier: number;
		revertMultiplier: number;
	}) {
		if (!this.units.has(from) || !this.units.has(to)) {
			throw new Error(`${from} or ${to} units are unknown`);
		}

		this.units.set(from, {
			...this.units.get(from),
			[to]: converstionMultiplier,
		});

		this.units.set(to, {
			...this.units.get(to),
			[from]: revertMultiplier,
		});
	}

	convert(value: number, { from, to }: { from: string; to: string }) {
		if (!this.units.has(from) || !this.units.has(to)) {
			throw new Error(`${from} or ${to} units are unknown`);
		}

		const multipliers = this.units.get(from)!;
		const directMultiplier = multipliers?.[to];

		if (directMultiplier !== undefined) return value * directMultiplier;

		for (const [unit, multiplier] of Object.entries(multipliers)) {
			const target = this.units.get(unit);
			if (target?.[to]) return value * multiplier * target[to];
		}

		throw new Error(
			`The "${from}" and "${to}" units are not for the same measurment. Example: you are trying to convert between a weight and a length unit.`,
		);
	}
}
