import { DATA } from "../mock";

type InternalDataItem = {
  currency: string;
  date: string;
  price: number;
};

export type DataItem = InternalDataItem & { id: number };

class ApiService {
  private data: DataItem[] = [];

  private processData(data: InternalDataItem[]) {
    const result: DataItem[] = [];
    /** Map<currency, Set of date> */
    const itemMap = new Map<string, Set<string>>();
    let id = 1;

    for (const item of data) {
      const dates = itemMap.get(item.currency);
      let isExisted = true;

      if (!dates) {
        itemMap.set(item.currency, new Set(item.date));
        isExisted = false;
      } //
      else if (!dates.has(item.date)) {
        dates.add(item.date);
        isExisted = false;
      }

      if (!isExisted) {
        result.push({
          id: id++,
          ...item,
        });
      }
    }

    return result;
  }

  async getCurrencyData() {
    this.data = this.processData(DATA);

    // const response = await fetch("https://interview.switcheo.com/prices.json");

    // if (response.ok) {
    //   // Process data because there are duplicated items
    //   this.data = this.processData(await response.json());
    // }
    return this.data;
  }

  convert(inputId: number, outputId: number, inputValue: number) {
    const input = this.data.find((item) => item.id === inputId);
    const output = this.data.find((item) => item.id === outputId);

    return new Promise<number>((resolve, reject) => {
      setTimeout(() => {
        if (input && output) {
          resolve((inputValue * input.price) / output.price);
        } else {
          reject("Error");
        }
      }, 200);
    });
  }
}

export const apiService = new ApiService();
