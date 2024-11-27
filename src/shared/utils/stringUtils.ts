export const clearSpace = (text: string) => {
  return text.trim().replace(/\s+/g, '');
};

const defaultTo = (value, defaultValue) => {
  return value == null || value === undefined ? defaultValue : value;
};


const get = (object, path, defaultValue = undefined) => {
  if (object == null || object == undefined) return defaultValue;

  const parts = Array.isArray(path) 
    ? path 
    : path.split('.').reduce((parts, part) => {
        part.replace(/\[([^\]]+)\]/g, '.$1').split('.').forEach(p => parts.push(p));
        return parts;
      }, []);

  const result = parts.reduce((obj, key) => {
    return obj != null ? obj[key] : undefined;
  }, object);

  return result === undefined ? defaultValue : result;
};

export { defaultTo, get };