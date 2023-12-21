// @ts-check
import React from 'react';

/**
 * @typedef SelectProps
 * @property {string} [selectedOption]
 * @property {Array<string>} options
 * @property {(value: string) => void} [onChange]
 */

/**
 * @param {SelectProps} props
 */
export function CoupledSelect({ selectedOption, options, onChange }) {
  /** @type {(event: React.ChangeEvent<HTMLSelectElement>) => void} */
  const onChangeHandler = (event) => {
    if (onChange) onChange(event.target.value);
  };
  return (
    <select onChange={onChangeHandler} value={selectedOption}>
      {options.map((option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

/**
 * @typedef HttpClient
 * @property {(url: string, options?: any) => Promise<Record<string, any>>} get
 */

/**
 * @typedef BasketProps
 * @property {string} basketId
 * @property {HttpClient} httpClient
 */

/**
 * @param {BasketProps} props
 */
export function BasketClassical({ basketId, httpClient }) {
  return (
    <form>
      <fieldset>
        <label>Class</label>
        <BasketItemsClassical basketId={basketId} httpClient={httpClient} />
      </fieldset>
    </form>
  );
}

export class BasketItemsClassical extends React.Component {
  /**
   * @param {BasketProps} props
   */
  constructor(props) {
    super(props);
    this.state = {
      basketSession: {},
    };
  }
  componentDidMount() {
    this.props.httpClient
      .get(`https://fakestoreapi.com/carts/${this.props.basketId}`)
      .then((session) => this.setBasketSession(session));
  }
  setBasketSession(session) {
    this.setState({ basketSession: session });
  }
  render() {
    return <pre>{JSON.stringify(this.state.basketSession, null, 2)}</pre>;
  }
}
