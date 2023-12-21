import React from 'react';
import Head from 'next/head';
import '../../../islands-is-land/reset.css';

export default function CareersPage({ roles }) {
  return (
    <>
      <Head>
        <title>Careers (Root zone)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Careers</h1>
        <ul>
          {roles.map((role) => {
            return (
              <li key={role.id}>
                {role.title} ({role.country})
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const { runWithHttpRecording } = await import('../../../../utils');
  return runWithHttpRecording('ch6-jobs', async () => {
    // https://github.com/Camillerkt/FakeJobs-API
    const jobs = await fetch(
      'https://apis.camillerakoto.fr/fakejobs/jobs?fulltime=true',
    ).then((res) => res.json());
    return {
      props: { roles: jobs },
    };
  });
}
