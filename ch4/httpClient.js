// @ts-check
/** @type {import("./coupled").HttpClient} */
export const httpClient = {
  async get(url) {
    const response = await fetch(url);
    return await response.json();
  },
};
