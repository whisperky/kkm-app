import { ColorRange, InputData } from "./pixer-color";

export class RangeColorMap {
  private colorMap: string[] = [];
  private maxLine: number;

  constructor(data: InputData, maxLine: number = 120) {
    this.maxLine = maxLine;
    this.processData(data);
  }

  private processData(data: InputData): void {
    this.colorMap = new Array(this.maxLine).fill(null);

    data.forEach(([ranges, color]) => {
      this.processRanges(ranges, color);
    });
  }

  private processRanges(ranges: ColorRange[], color: string): void {
    ranges.forEach((range) => {
      if (Array.isArray(range)) {
        if (
          range.length === 2 &&
          typeof range[0] === "number" &&
          typeof range[1] === "number"
        ) {
          for (let i = range[0]; i <= range[1]; i++) {
            this.colorMap[i % this.maxLine] = color;
          }
        } else {
          this.processRanges(range, color);
        }
      } else {
        this.colorMap[range % this.maxLine] = color;
      }
    });
  }

  getLineColor(lineIndex: number): string | null {
    return this.colorMap[lineIndex % this.maxLine];
  }
}
