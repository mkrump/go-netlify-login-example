import "whatwg-fetch";
import netlifyIdentity from "netlify-identity-widget";

const getExampleUrl = `/.netlify/functions/example`;

export function generateHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (netlifyIdentity.currentUser()) {
    return netlifyIdentity
      .currentUser()
      .jwt()
      .then((token) => {
        return { ...headers, Authorization: `Bearer ${token}` };
      });
  }
  return Promise.resolve(headers);
}

export default function getExample({ headers }) {
  const submit = (headers) => {
    return window
      .fetch(`${getExampleUrl}`, {
        headers,
      })
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        console.error(error);
        return error.message;
      });
  };

  if (headers) {
    return submit(headers);
  }
  return generateHeaders().then((headers) => {
    return submit(headers);
  });
}
