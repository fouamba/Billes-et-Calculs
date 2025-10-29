type Range = [number, number];

const clampRange = ([min, max]: Range): Range => {
	const lower = Math.max(0, Math.min(min, max));
	const upper = Math.max(lower, max);
	return [lower, upper];
};

const randomInt = (min: number, max: number): number => {
	const lower = Math.ceil(min);
	const upper = Math.floor(max);
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

export interface CompositionActivity {
	type: 'COMPOSITION';
	marbleConfiguration: {
		red: number;
		blue: number;
		total: number;
	};
}

export interface DecompositionActivity {
	type: 'DECOMPOSITION';
	marbleConfiguration: {
		total: number;
		known: number;
		unknown: number;
	};
}

export type GeneratedActivity = CompositionActivity | DecompositionActivity;

export const generateCompositionActivity = (range: Range): CompositionActivity => {
	const [min, max] = clampRange(range);
	const red = randomInt(min, max);
	const blue = randomInt(min, max);
	return {
		type: 'COMPOSITION',
		marbleConfiguration: {
			red,
			blue,
			total: red + blue,
		},
	};
};

export const generateDecompositionActivity = (range: Range): DecompositionActivity => {
	const [min, max] = clampRange(range);
	const known = randomInt(min, max);
	const complement = randomInt(min, max);
	return {
		type: 'DECOMPOSITION',
		marbleConfiguration: {
			total: known + complement,
			known,
			unknown: complement,
		},
	};
};
