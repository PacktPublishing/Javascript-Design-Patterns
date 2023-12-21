import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const HeadContents = () => (
  <Head>
    <title>Next Route Based Splitting</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="./reset.css" />
    <style>{`
          h1 {
            font-size: 24px;
          }
        `}</style>
  </Head>
);

const DynamicClientSideHello = dynamic(
  () => import('../components/Hello.jsx').then(({ Hello }) => Hello),
  { ssr: false },
);

const NoRender = () => null;

export default function Index() {
  const [selectedTermsAndConditions, setSelectedTermsAndConditions] =
    useState('None');

  // const TermsAndConditions = ['Short', 'Long'].includes(
  // const TermsAndConditions = ['Short', 'Long', 'LongScroll'].includes(
  const TermsAndConditions = [
    'Short',
    'Long',
    'LongScroll',
    'LongScrollAcceptForm',
  ].includes(selectedTermsAndConditions)
    ? dynamic(() =>
        import(
          `../components/TermsAndConditions${selectedTermsAndConditions}.jsx`
        ).then(({ TermsAndConditions }) => TermsAndConditions),
      )
    : NoRender;
  return (
    <>
      <HeadContents />
      <h1>Next.js route-based splitting and component lazy loading</h1>
      <DynamicClientSideHello />

      <div>
        <label htmlFor="termsAndConditionsType">
          Terms and Conditions selector:
        </label>
        <select
          id="termsAndConditionsType"
          onChange={(e) => setSelectedTermsAndConditions(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Short">Short</option>
          <option value="Long">Long</option>
          <option value="LongScroll">LongScroll</option>
          <option value="LongScrollAcceptForm">LongScrollAcceptForm</option>
        </select>
        <hr />
        <TermsAndConditions />
      </div>
    </>
  );
}
