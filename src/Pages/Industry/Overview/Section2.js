import { Grid, Stack } from "@mui/material";
import SummaryBox, { SUMMARY_TYPE } from "../components/SummaryBox";
import BarChart from "../components/ECharts/BarChar";
import {useSelector} from "react-redux";

export function Section2() {
  const { serviceList } = useSelector(state => state.Industry)
  const services = serviceList.map(item => item.name)
  const cpuUsed = serviceList.map(item => item.cpu)
  const memUsed = serviceList.map(item => item.mem)
  const dataLength = services.length

  return (
    <Stack sx={{
      width: '100%',
      flexGrow:7,
      height:'100%',
    }}>
      <Grid container spacing={2} sx={{
        height:'100%',
      }}>
      {/*<Grid item xs={4} sx={{height:'100%'}}>*/}
      {/*  <SummaryBox title={"服务管理统计"} type={SUMMARY_TYPE.GRAPH} children={<BarChart label={services} value={cpuUsed} num={3} />} />*/}
      {/*</Grid>*/}
      <Grid item xs={6} sx={{height:'100%'}}>
        <SummaryBox title={"服务CPU占用排名"} type={SUMMARY_TYPE.GRAPH} children={<BarChart label={services} value={cpuUsed} num={dataLength} />}/>
      </Grid>
      <Grid item xs={6} sx={{height:'100%'}}>
        <SummaryBox title={"服务内存占用排名(Bytes)"} type={SUMMARY_TYPE.GRAPH} children={<BarChart label={services} value={memUsed} num={dataLength} />}/>
      </Grid>
    </Grid>
    </Stack>
  )
}