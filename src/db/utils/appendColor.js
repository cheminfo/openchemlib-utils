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
    values = db
      .map((result) =>
        result.data.map((datum) => ({ value: datum[dataLabel], data: datum })),
      )
      .flat();
  } else if (propertyLabel) {
    values = db
      .map((result) =>
        result.data.map((datum) => ({
          value: result.properties[propertyLabel],
          data: datum,
        })),
      )
      .flat();
  } else {
    values = db
      .map((result) =>
        result.data.map((datum) => ({ value: undefined, data: datum })),
      )
      .flat();
  }

  if (minValue !== undefined) {
    values = values.forEach((value) => {
      if (value.value !== undefined && value.value < minValue) {
        value.value = minValue;
      }
    });
  }

  if (maxValue !== undefined) {
    values = values.forEach((value) => {
      if (value.value !== undefined && value.value > maxValue) {
        value.value = maxValue;
      }
    });
  }

  const definedValues = values.filter((value) => value.value !== undefined);
  const min = Math.min(...definedValues.map((value) => value.value));
  const max = Math.max(...definedValues.map((value) => value.value));

  for (let value of values) {
    if (value.value !== undefined) {
      value.data[colorLabel] =
        `hsl(${
        Math.floor(
          ((value.value - min) / (max - min)) * (maxHue - minHue) + minHue,
        )
        },${
        saturation
        }%,${
        lightness
        }%)`;
    } else {
      value.data.color = 'black';
    }
  }
}
