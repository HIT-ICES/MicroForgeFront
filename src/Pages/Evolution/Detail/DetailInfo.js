
import { Box } from '@mui/material';
import { Tabs } from '@mui/base/Tabs';
import {
  StyledTab,
  StyledTabsList,
  StyledTabPanel,
} from '@/components/Tab';
import { Information } from './DetailBlocks/Information';
import { TestResult } from './DetailBlocks/TestResult';
import { AggregateReport } from './DetailBlocks/AggregateReport';
import { useIntl } from 'react-intl';

export default function DetailInfo() {

  const intl = useIntl();

  return (
    <Box
      sx={{
        width: 'calc(100% - 380px)',
        height: '300px',
      }}
    >
      <Tabs defaultValue={1}>
        <StyledTabsList>
          <StyledTab value={1}>{intl.messages['common.detailedInfo']}</StyledTab>
          <StyledTab value={2}>{intl.messages['evolution.evolutionGoal']}</StyledTab>
          <StyledTab value={3}>{intl.messages['evolution.triggerCondition']}</StyledTab>
          <StyledTab value={4}>{intl.messages['evolution.evolutionMean']}</StyledTab>
          <StyledTab value={5}>{intl.messages['evolution.evolutionAlgorithm']}</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={1}>
          <Information />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <TestResult />
        </StyledTabPanel>
        <StyledTabPanel value={3}>
          <AggregateReport />
        </StyledTabPanel>
      </Tabs>
    </Box>
  );
}