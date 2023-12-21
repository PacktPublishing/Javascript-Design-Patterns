import React, { useState } from 'react';
import Head from 'next/head';
import '../../../islands-is-land/reset.css';

export default function Home() {
  const [searchResult, setSearchResult] = useState({
    count: 0,
    matches: [],
  });
  return (
    <>
      <Head>
        <title>Search Page (Search zone)</title>
        <meta name="description" content="Search Page (Search zone)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Search</h1>
        <input
          type="search"
          onChange={async (event) => {
            const data = await fetch(
              `/search/api/search?q=${event.target.value}`,
            ).then((res) => res.json());
            setSearchResult(data);
          }}
        />

        <div>
          <h2>Results ({searchResult.count})</h2>
          {searchResult.matches.map((product) => {
            return <div key={product.id}>{product.title}</div>;
          })}
        </div>
      </main>
    </>
  );
}
