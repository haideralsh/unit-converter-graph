import { expect, describe, it } from "bun:test";
import UnitConverter, { ConverstionsConfig } from "./UnitConverter";

describe("UnitConverter", () => {
	it("initalizes with a unit-converstions config", () => {
		let converterConfig: ConverstionsConfig = [
			{
				grams: {
					kilograms: 0.001,
				},
				kilograms: {
					grams: 1000.0,
				},
			},
		];

		let converter = new UnitConverter(converterConfig);

		expect(converter.convert(1000, { from: "grams", to: "kilograms" })).toBe(1);
	});

	describe("addUnit", () => {
		it("allows adding a unit", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {
						kilograms: 0.001,
					},
				},
			];

			let converter = new UnitConverter(converterConfig);
			converter.addUnit("kilograms", { grams: 1000.0 });

			expect(converter.convert(1, { from: "kilograms", to: "grams" })).toBe(
				1000,
			);
		});
	});

	describe("addUnit", () => {
		it("allows adding a converstion between any two units", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {},
					kilograms: {},
				},
			];

			let converter = new UnitConverter(converterConfig);
			converter.addConverstion({
				from: "kilograms",
				to: "grams",
				converstionMultiplier: 1000,
				revertMultiplier: 0.001,
			});

			expect(converter.convert(1, { from: "kilograms", to: "grams" })).toBe(
				1000,
			);
		});

		it("does not allow adding a converstion between unknown units", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {},
				},
			];

			let converter = new UnitConverter(converterConfig);

			expect(() => {
				converter.addConverstion({
					from: "kilograms",
					to: "grams",
					converstionMultiplier: 1000,
					revertMultiplier: 0.001,
				});
			}).toThrow(/units are unknown/);
		});
	});

	describe("addUnit", () => {
		it("converts between two units with a direct converstion and back", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {
						kilograms: 0.001,
					},
					kilograms: {
						grams: 1000.0,
					},
				},
			];

			let converter = new UnitConverter(converterConfig);

			expect(converter.convert(1, { from: "kilograms", to: "grams" })).toBe(
				1000,
			);
			expect(converter.convert(1000, { from: "grams", to: "kilograms" })).toBe(
				1,
			);
		});

		it("converts between two units without a direct converstion and back", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {
						kilograms: 0.001,
					},
					kilograms: {
						grams: 1000.0,
						pounds: 2.205,
					},
					pounds: {
						kilograms: 0.45359237,
					},
				},
			];

			let converter = new UnitConverter(converterConfig);

			expect(
				Math.round(converter.convert(454, { from: "grams", to: "pounds" })),
			).toBe(1);
			expect(
				Math.round(converter.convert(1, { from: "pounds", to: "grams" })),
			).toBe(454);
		});

		it("does not convert between units that are not for the same measurment.", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {
						kilograms: 0.001,
						pounds: 0.0022,
					},
					liters: {
						cup: 4.227,
						fluidOunce: 33.814,
					},
				},
			];

			let converter = new UnitConverter(converterConfig);

			expect(() => {
				converter.convert(123, { from: "grams", to: "liters" });
			}).toThrow(/units are not for the same measurment/);
		});

		it("does not convert between unknown units", () => {
			let converterConfig: ConverstionsConfig = [
				{
					grams: {
						kilograms: 0.001,
						pounds: 0.0022,
					},
					liters: {
						cup: 4.227,
						fluidOunce: 33.814,
					},
				},
			];

			let converter = new UnitConverter(converterConfig);
			expect(() => {
				converter.convert(123, { from: "grams", to: "foo" });
			}).toThrow(/units are unknown/);
		});
	});
});
