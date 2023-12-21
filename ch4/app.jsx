// @ts-check
import React, { useEffect, useState } from 'react';
import {
  BasketClassical,
  BasketItemsClassical,
  CoupledSelect,
} from './coupled';
import {
  HttpClientConsumer as HttpClientConsumer,
  HttpClientProvider,
} from './context';
import { FormikIntegrationExample } from './render-props/formik-integration-example';
import { SelectRenderProps } from './render-props/select-render-props';
import Location from './higher-order-components/Location';
import { BasketHooks, BasketItemsHooksUseContext } from './hooks/basket';
import { ConnectedBasketItemsClassical } from './higher-order-components/higher-order-components';
import { httpClient } from './httpClient';
import { resetClientSidePolly } from '../polly.client';

function Example({ name, children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (process.env.ENABLE_MOCKS !== 'true') {
      return;
    }
    if (!isOpen) {
      resetClientSidePolly('chapter-4-fetches');
    }
  }, [isOpen]);

  return (
    <details
      onToggle={(event) => {
        // @ts-ignore
        setIsOpen(event.target.open);
      }}
    >
      <summary>{name}</summary>
      {isOpen ? (
        <div style={{ marginTop: 100, marginBottom: 100 }}>{children}</div>
      ) : null}
    </details>
  );
}
const options = [
  { value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' },
];

export const App = () => {
  const [selectedOption, setSelectedOption] = useState(options[3].value);
  return (
    <>
      <Example name="CoupledSelect">
        <p>Selected Option: {selectedOption}</p>
        <CoupledSelect
          selectedOption={selectedOption}
          onChange={(selectedOption) => setSelectedOption(selectedOption)}
          options={options.map((option) => option.value)}
        />
      </Example>

      <Example name="CoupledSelect limitation">
        <p>Selected Option: {selectedOption}</p>
        <CoupledSelect
          selectedOption={selectedOption}
          onChange={(selectedOption) => setSelectedOption(selectedOption)}
          options={options.map((option) => `Fruit: ${option.value}`)}
        />
      </Example>

      <Example name="SelectRenderProps">
        <p>Selected Option: {selectedOption}</p>
        <SelectRenderProps
          selectedOption={selectedOption}
          onChange={(selectedOption) => setSelectedOption(selectedOption)}
          options={options.map((option) => option.value)}
          renderOption={(option) => (
            <option value={option} key={option}>
              {option}
            </option>
          )}
        />
      </Example>

      <Example name="SelectRenderProps render prop extensibility">
        <p>Selected Option: {selectedOption}</p>
        <SelectRenderProps
          selectedOption={selectedOption}
          onChange={(selectedOption) => setSelectedOption(selectedOption)}
          options={options.map((option) => option.value)}
          renderOption={(option) => (
            <option value={option} key={option}>
              Fruit: {option}
            </option>
          )}
        />
      </Example>

      <Example name="Formik Example">
        <FormikIntegrationExample />
      </Example>

      <Example name="Higher order component">
        <Location />
      </Example>

      <Example name="Hooks vs Class">
        <BasketClassical basketId="5" httpClient={httpClient} />
        <BasketHooks basketId="5" httpClient={httpClient} />
      </Example>

      <Example name="Provider only">
        <HttpClientProvider httpClient={httpClient}>
          <HttpClientConsumer>
            {(httpClient) => (
              <BasketItemsClassical basketId="5" httpClient={httpClient} />
            )}
          </HttpClientConsumer>
        </HttpClientProvider>
      </Example>

      <Example name="Higher order component with provider">
        <HttpClientProvider httpClient={httpClient}>
          <ConnectedBasketItemsClassical basketId="5" />
        </HttpClientProvider>
      </Example>

      <Example name="Hook with provider">
        <HttpClientProvider httpClient={httpClient}>
          <BasketItemsHooksUseContext basketId="5" />
        </HttpClientProvider>
      </Example>
    </>
  );
};
