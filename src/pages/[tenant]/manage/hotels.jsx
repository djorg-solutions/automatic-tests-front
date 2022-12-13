import React, {Suspense} from 'react';
import dynamic from 'next/dynamic';
import {getHotels} from '../../../services/hotels.service';
import {getCookie} from '../../../lib/session';
import Layout from '../../../layout';
import {redirectToLogin} from '../../../utils/util';
import CircularProgress from '@mui/material/CircularProgress';

const HotelsManageContainer = dynamic(() => import('../../../containers/HotelsManageContainer'), {
    suspense: true,
  }) 

const hotels = ({data}) => {
    return (
        <Suspense fallback={<CircularProgress />}>
            <Layout page={'Gestionar hoteles'}>
                <HotelsManageContainer data={data}/>
            </Layout>
        </Suspense>
    );
};

export async function getServerSideProps(ctx) {

    let jwt = getCookie("token", ctx.req);

    if (!jwt) {
        return redirectToLogin();
    }

    const data = await getHotels(jwt);
    return { props: { data } }

}

export default hotels;