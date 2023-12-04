
import { Box } from '@mui/material';
import { Tabs } from '@mui/base/Tabs';
import {
  StyledTab,
  StyledTabsList,
  StyledTabPanel,
} from '@/components/Tab';
import { Information } from './DetailBlocks/Information';
import { TestResult } from './DetailBlocks/TestResult';
import { useSelector } from 'react-redux';

export default function DetailInfo() {

  return (
    <Box
      sx={{
        width: 'calc(100% - 380px)',
        height: '300px',
      }}
    >
      <Tabs defaultValue={1}>
        <StyledTabsList>
          <StyledTab value={1}>详细信息</StyledTab>
          <StyledTab value={2}>测试结果</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={1}>
          <Information />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <TestResult />
        </StyledTabPanel>
      </Tabs>
      {/* </Stack> */}
    </Box>
  );
}