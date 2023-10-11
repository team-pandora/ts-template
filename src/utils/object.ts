export const isSubsetArray = <T>(a: Array<T>, b: Array<T>) => a.every((val) => b.includes(val));

export const getSubObject = <T extends object>(obj: T, keys: Array<keyof T>) => {
    const result: Partial<T> = {};
    for (const key of keys) result[key] = obj[key];
    return result;
};

export const objectAssignSpecific = <T extends object>(obj: T, source: T, keys: Array<keyof T>) => {
    for (const key of keys) if (key in source) obj[key] = source[key];
    return obj;
};

export const subtractObjects = <T extends object>(obj1: T, obj2: T) => {
    const result: Partial<T> = {};
    for (const [key, value] of Object.entries(obj1)) if (!(key in obj2)) result[key] = value;
    return result;
};

export const removeUndefinedFields = <T extends object>(obj: T) => {
    const result: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) if (value !== undefined) result[key] = value;
    return result;
};
