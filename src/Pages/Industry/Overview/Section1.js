import { Stack } from "@mui/material";
import ServiceStatusBox, { SERVICE_STATUS } from "../components/ServiceStatusBox";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getServiceStatus} from '../../../actions/industryAction';



export function Section1() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getServiceStatus());
  },[]);

  const {publish, run, abnormal, stop} = useSelector(state=>state.Industry)

  return (
    <Stack sx={{
      flexDirection: 'row',
      backgroundColor:'#fff',
      justifyContent:'space-between',
      padding:'16px',
      gap:'16px',
      boxShadow: '0px 4px 10px rgb( 46 38 61 / 0.12)'
    }}>
      <ServiceStatusBox status={SERVICE_STATUS.PUBLISH} title={publish} />
      <ServiceStatusBox status={SERVICE_STATUS.RUN} title={run} />
      <ServiceStatusBox status={SERVICE_STATUS.ABNORMAL} title={abnormal} />
      <ServiceStatusBox status={SERVICE_STATUS.STOP} title={stop} />
    </Stack>
  )
}