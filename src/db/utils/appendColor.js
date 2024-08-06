export default function appendColor(moleculesDB, options = {}) {
  const {
    dataLabel,
    propertyLabel,
    minValue,
    maxValue,
    minHue = 0,
    maxHue = 360,
    saturation = 65,
    lightness = 65,
    colorLabel = 'color',
  } = options;

  const db = moleculesDB.getDB();
  let values;
  if (dataLabel) {
    values = db.flatMap((result) =>
      result.data.map((datum) => ({ value: datum[dataLabel], data: datum })),
    );
  } else if (propertyLabel) {
    values = db.flatMap((result) =>
      result.data.map((datum) => ({
        value: result.properties[propertyLabel],
        data: datum,
      })),
    );
  } else {
    values = db.flatMap((result) =>
      result.data.map((datum) => ({ value: undefined, data: datum })),
    );
  }

  if (minValue !== undefined) {
    for (const value of values) {
      if (value.value !== undefined && value.value < minValue) {
        value.value = minValue;
      }
    }
  }

  if (maxValue !== undefined) {
    for (const value of values) {
      if (value.value !== undefined && value.value > maxValue) {
        value.value = maxValue;
      }
    }
  }

  const definedValues = values.filter((value) => value.value !== undefined);
  const min = Math.min(...definedValues.map((value) => value.value));
  const max = Math.max(...definedValues.map((value) => value.value));

  for (const value of values) {
    if (value.value !== undefined) {
      value.data[colorLabel] = `hsl(${Math.floor(
        ((value.value - min) / (max - min)) * (maxHue - minHue) + minHue,
      )},${saturation}%,${lightness}%)`;
    } else {
      value.data.color = 'black';
    }
  }
}
