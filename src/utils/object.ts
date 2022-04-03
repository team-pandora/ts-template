export const isSubsetArray = (a: any[], b: any[]) => {
    return a.every((val) => b.includes(val));
};
