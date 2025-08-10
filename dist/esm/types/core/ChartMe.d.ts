type colorEntry = string | [number, number, number] | [number, number, number, number];
type colorBundleType = {
    [key: number]: colorType;
};
type colorType = {
    fcolor: colorNumbers;
    tcolor: colorNumbers;
};
type colorPreBundled = {
    [key: number]: colorPreType;
};
type colorPreType = {
    fcolor: colorEntry;
    tcolor: colorEntry;
};
type colorNumbers = [number, number, number, number];
type constructorType = {
    image?: any;
    fillColors?: colorEntry[];
    targetColors?: colorEntry[];
    colorBundle?: colorPreBundled;
    width?: (number | undefined);
    height?: (number | undefined);
    axisEnabled?: boolean | undefined;
    xAxisSpacing?: number | undefined;
    yAxisSpacing?: number | undefined;
    xAxisTickSpacing?: number | undefined;
    yAxisTickSpacing?: number | undefined;
};
type graphType = {
    container: HTMLDivElement;
    width?: number;
    height?: number;
    margin?: {
        [key: string]: number;
    };
};
type splitTypes = {
    splits?: number;
    fillColors?: colorEntry[];
    targetColors?: colorEntry[];
    colorBundle?: colorPreBundled;
    splitstrategy?: string;
};
export default class ChartMe {
    image: any;
    data: number[][] | undefined;
    bundle: colorBundleType;
    width: number | undefined;
    height: number | undefined;
    axisEnabled: boolean;
    xAxisSpacing: number;
    yAxisSpacing: number;
    xAxisTickSpacing: number;
    yAxisTickSpacing: number;
    processed: {
        [key: string]: number;
    }[] | undefined;
    constructor({ image, fillColors, targetColors, colorBundle, width, height, axisEnabled, xAxisSpacing, yAxisSpacing, xAxisTickSpacing, yAxisTickSpacing }: constructorType);
    load(): Promise<this>;
    preview(outputPath: `${string}.${string}`): Promise<void>;
    preprocess(): void;
    saveFile(path: string): Promise<void>;
    loadJSON(data: any): Promise<void>;
    loadFile(path: string): Promise<void>;
    splitColors({ splits, fillColors, targetColors, colorBundle, splitstrategy }: splitTypes): void;
    cleanData(): void;
    graph({ container, width, height, margin }: graphType): void;
}
export {};
