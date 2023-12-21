/**
 * @typedef SelectProps
 * @property {string} [selectedOption]
 * @property {Array<string>} options
 * @property {(string) => JSX.Element} renderOption
 * @property {(value: string) => void} [onChange]
 */

/**
 * @param {SelectProps} props
 */
export function SelectRenderProps({
  selectedOption,
  options,
  renderOption,
  onChange,
}) {
  /** @type {(event: React.ChangeEvent<HTMLSelectElement>) => void} */
  const onChangeHandler = (event) => {
    if (onChange) onChange(event.target.value);
  };
  return (
    <select onChange={onChangeHandler} value={selectedOption}>
      {options.map((option) => renderOption(option))}
    </select>
  );
}
