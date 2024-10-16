import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import Escaner from './escaner';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Escaner - ${CONFIG.appName}`}</title>
      </Helmet>

      <Escaner />
    </>
  );
}