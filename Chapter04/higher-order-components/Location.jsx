import { withLocation } from './higher-order-components';

function Location({ location }) {
  return (
    <>
      location.href: {location.href}, location.origin: {location.origin}
    </>
  );
}

export default withLocation(Location);
