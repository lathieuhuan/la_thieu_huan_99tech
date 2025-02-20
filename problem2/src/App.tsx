import { useEffect, useState } from "react";

import { apiService, DataItem } from "./services/ApiService";
import { formatNumber, isNumber } from "./utils";

// Component
import { Select, type SelectOption } from "./components/Select";
import { InputNumber } from "./components/InputNumber";
import { ExchangeIcon } from "./icons/ExchangeIcon";

function App() {
  const [options, setOptions] = useState<SelectOption<number>[]>([]);
  const [inputId, setInputId] = useState<number>();
  const [outputId, setOutputId] = useState<number>();
  const [inputValue, setInputValue] = useState<number | null>();
  const [outputValue, setOutputValue] = useState<number>();
  const [isConverting, setIsConverting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  const outputString = isNumber(outputValue) ? formatNumber(outputValue) : undefined;

  const toOption = (item: DataItem): SelectOption<number> => {
    return {
      label: (
        <div className="flex items-center gap-1">
          <div className="p-1">
            <img src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`} />
          </div>
          <span>{item.currency}</span>
        </div>
      ),
      value: item.id,
      title: item.currency,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getCurrencyData();
      setOptions(response.map(toOption));
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!touched) {
      setOutputValue(undefined);
      setTouched(true);
    }
    if (error) {
      setError("");
    }
  }, [inputId, outputId, inputValue]);

  const onChangeInputCurrency = (id: number) => {
    setInputId(id);
  };

  const onChangeOutputCurrency = (id: number) => {
    setOutputId(id);
  };

  const onChangeInput = (value: number | null) => {
    setInputValue(value);
  };

  const convertCurrency = async () => {
    if (!inputId) {
      setError("Please select an input currency.");
      return;
    }
    if (!outputId) {
      setError("Please select an output currency.");
      return;
    }
    if (!inputValue) {
      setError("Please enter the input amount.");
      return;
    }

    setIsConverting(true);

    const value = await apiService.convert(inputId, outputId, inputValue);

    setOutputValue(value);
    setTouched(false);
    setError("");
    setIsConverting(false);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="px-4">
        <div className="p-6 bg-primary-600 rounded-lg">
          <h1 className="mb-4 text-4xl text-center font-bold fancy-text-bg">Currency Converter</h1>

          <form
            className="flex flex-col sm:flex-row gap-4 items-center sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              convertCurrency();
            }}
          >
            <div className="w-64 flex gap-2">
              <div className="w-32 shrink-0">
                <label>Currency</label>
                <Select
                  showSearch
                  placeholder="Select"
                  optionFilterProp="title"
                  disabled={isConverting}
                  options={options}
                  onChange={onChangeInputCurrency}
                />
              </div>
              <div>
                <label>Amount</label>
                <InputNumber
                  placeholder="_"
                  disabled={isConverting}
                  onChange={(value) => onChangeInput(value as number | null)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={
                  "h-8 w-8 text-xl rounded-full bg-secondary flex justify-center items-center " +
                  (isConverting ? "opacity-60" : "cursor-pointer")
                }
                disabled={isConverting}
              >
                <ExchangeIcon className="rotate-90 sm:rotate-0" />
              </button>
            </div>

            <div className="w-64 flex gap-3">
              <div className="w-32 shrink-0">
                <label>Currency</label>
                <Select
                  showSearch
                  placeholder="Select"
                  optionFilterProp="title"
                  disabled={isConverting}
                  options={options}
                  onChange={onChangeOutputCurrency}
                />
              </div>
              <div className="overflow-hidden">
                <label>Amount</label>
                <div className="h-8 flex items-center" title={outputString}>
                  <p className="text-lg font-semibold truncate">{outputString || "_"}</p>
                </div>
              </div>
            </div>
          </form>

          {error && <div className="mt-4 px-4 py-2 rounded border border-red-500 text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
