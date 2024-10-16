import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ComprasPagos from 'src/sections/user/view/user-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <ComprasPagos />
    </>
  );
}
