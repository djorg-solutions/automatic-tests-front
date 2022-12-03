import * as React from 'react';
import ToursContainer from '../../containers/ToursContainer';
// import { getHotelsActive } from '../../services/hotels.service';
import {getCookie} from '../../lib/session';
import {redirectToLogin} from '../../utils/util';
import Layout from '../../layout';

const Booking = ({ data }) => {
  return (
    <Layout page={'Tours'}>
      <ToursContainer data={data} />
    </Layout>
  );

}


export async function getServerSideProps(ctx) {

  let jwt = getCookie("token", ctx.req);
	
	if (!jwt) {
		return redirectToLogin();
	}

 const data = [] //  await getHotelsActive(jwt);
  return { props: { data } }

}


export default Booking;
