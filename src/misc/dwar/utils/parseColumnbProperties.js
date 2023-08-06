export function parseColumnbProperties(lines) {
  lines = lines.map((line) => {
    const [key, value] = line.slice(1, -1).split('=');
    return { key, value: value.slice(1, -1) };
  });
  const columnProperties = {};
  let currentColumnName = '';
  for (const line of lines) {
    switch (line.key) {
      case 'columnName':
        currentColumnName = line.value;
        columnProperties[currentColumnName] = {};
        break;
      case 'columnProperty':
        {
          if (!currentColumnName) {
            throw new Error('This should not happen');
          }
          const [key, value] = line.value.split('\t');
          columnProperties[currentColumnName][key] = value;
        }
        break;
      default:
        throw new Error('This should not happen');
    }
  }
  for (const key in columnProperties) {
    const columnPropery = columnProperties[key];
    if (columnProperties[key].parent) {
      const target = columnProperties[columnPropery.parent];
      if (!target) {
        throw new Error('Parent column not found');
      }
      if (!target.related) {
        target.related = {};
      }
      target.related[columnPropery.specialType] = key;
    }
  }

  return columnProperties;
}
