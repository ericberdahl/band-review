export function commaSeparatedListPrefix(arr: any[], index: number): string {
    const comma = 0 < index && 2 < arr.length ? "," : "";
    const conjunction = 0 < index && index + 1 == arr.length ? " and" : "";
    const space = 0 < index ? " " : "";
    return `${comma}${conjunction}${space}`;
}

export function renderCommaSeparatedList(arr: any[], renderer): string {
    return arr.map((el, index) => `${commaSeparatedListPrefix(arr, index)}${renderer(el, index)}`).join("");
}

export function renderSpaceSeparatedList(arr: any[], renderer, seprator = ' '): string {
    return arr.map((el, index) => `${renderer(el, index)}`).join(seprator);
}
