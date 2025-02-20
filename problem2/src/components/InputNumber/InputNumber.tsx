import RcInputNumber, { InputNumberProps as RcInputNumberProps } from "rc-input-number";
import "rc-input-number/assets/index.css";
import "./InputNumber.styles.scss";
import { formatNumber, isNumber } from "../../utils";

export type InputNumberProps = Omit<RcInputNumberProps, "controls">;

export function InputNumber(props: InputNumberProps) {
  return (
    <RcInputNumber
      {...props}
      prefixCls="app-input-number"
      max={999_999_999_999}
      formatter={(value = "") => {
        if (value !== "") {
          const numValue = +value;

          if (isNumber(numValue)) {
            return formatNumber(numValue);
          }
          return value.toString();
        }
        return "";
      }}
      controls={false}
    />
  );
}
