import RcSelect from "rc-select";
import { SelectProps as RcSelectProps } from "rc-select/lib/Select";
import "rc-select/assets/index.css";
import "./Select.styles.scss";

type ValueType = string | number;

export type SelectOption<TValue extends ValueType = ValueType> = {
  title?: string;
  label: React.ReactNode;
  value: TValue | null;
  disabled?: boolean;
  className?: string;
};

export type SelectProps<
  TValue extends ValueType = ValueType,
  TOption extends SelectOption<TValue> = SelectOption<TValue>
> = Omit<RcSelectProps<TValue, TOption>, "prefixCls" | "dropdownClassName">;

export function Select<
  TValue extends ValueType = ValueType,
  TOption extends SelectOption<TValue> = SelectOption<TValue>
>(props: SelectProps<TValue, TOption>) {
  return (
    <RcSelect
      {...props}
      prefixCls="app-select"
      className={`app-select ${props.className}`}
      suffixIcon={
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
        </svg>
      }
      menuItemSelectedIcon={null}
    />
  );
}
