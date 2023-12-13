import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Popper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import InfoCard from '@/components/InfoCard';
import { ContainedButton, KubeConfirmButton } from '@/components/Button';
import { fontFamily } from '@/utils/commonUtils';
import { StyledModal } from '../../../components/Modal';
import {
  StyledTableBox,
  StyledTableContainer,
  StyledTableRowCell,
  StyledTableBodyCell,
  StyledTableFooter,
  StyledTableHead,
} from '@/components/DisplayTable';
import {
  StyledAutocomplete,
  StyledTextField,
  ChipTextField,
} from '@/components/Input';
import StressTestingIcon from '@/assets/StressTesting.svg';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useIntl } from 'react-intl';
import { TestingProgress } from './TestingProgress';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EclipseTransparentButton } from '@/components/Button';
import RunningIcon from '@/assets/RunningIcon.svg';
import PendingIcon from '@/assets/PendingIcon.svg';
import FailedIcon from '@/assets/FailedIcon.svg';
import SucceededIcon from '@/assets/SucceededIcon.svg';
import Question from '@/assets/Question.svg';
import { KubeCheckbox } from '@/components/Checkbox';
import Task from '@/assets/Task.svg';
import { NormalBoldFont, SmallLightFont } from '@/components/Fonts';
import { useNavigate } from 'react-router-dom';

import {
  UPDATE_GROUP_EDIT,
  RESET_GROUP,
  RESET_PLAN,
  UPDATE_TEST_PLAN_PAGE_NUM,
  UPDATE_TEST_PLAN_PAGE_SIZE,
  getTestPlans
} from '../../../actions/applicationAction';

export const RUNNING = 'Running';
export const PENDING = 'Pending';
export const FAILED = 'Failed';
export const SUCCEEDED = 'Succeeded';

const StatusIcon = phase => {
  if (phase === RUNNING) {
    return <RunningIcon />;
  }
  if (phase === PENDING) {
    return <PendingIcon />;
  }
  if (phase === FAILED) {
    return <FailedIcon />;
  }
  return <SucceededIcon />;
};

const StatusText = phase => {
  if (phase === RUNNING) {
    return <span>Running&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
  }
  if (phase === PENDING) {
    return <span>Pending&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;
  }
  if (phase === FAILED) {
    return (
      <span>Failed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    );
  }
  return <span>Succeeded</span>;
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function createRow(
  id,
  label,
  isOrder = true,
  minWidth = '110px',
  maxWidth = '220px',
  show = true,
  align,
  colSpan = 1,
  rowSpan = 1
) {
  return {
    id,
    label,
    isOrder,
    minWidth,
    maxWidth,
    show,
    align,
    colSpan,
    rowSpan,
  };
}

const statusPattern = new RegExp(/^状态:/);
const namePattern = new RegExp(/^名称:/);

export default function StressTesting() {
  const intl = useIntl();
  const [planOpen, setPlanOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('testPlanName');

  const [searchValue, setSearchValue] = useState('');
  const [searchSelectAnchorEl, setSearchSelectAnchorEl] = useState(null);
  const searchSelectOpen = Boolean(searchSelectAnchorEl);
  const [searchBy, setSearchBy] = useState(['名称', '状态']);

  const [colDisplay, setColDisplay] = useState([true, true, true, true, true]);
  const [customContentAnchorEl, setCustomContentAnchorEl] = useState(null);
  const customContentOpen = Boolean(customContentAnchorEl);

  const [searchList, setSearchList] = useState([]);

  const { pageSize, pageNum, testPlans } =
    useSelector(state => {
      return {
        pageSize: state.Application.pageSize,
        pageNum: state.Application.pageNum,
        testPlans: state.Application.testPlans
      };
    });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTestPlans());
  }, []);

  useEffect(() => {
    setTableData(testPlans);
  }, [testPlans]);

  const headRow = [
    createRow('testPlanName', '测试名称', true, '100px', '100px', true, 'left'),
    createRow(
      'status',
      '状态',
      false,
      '100px',
      '100px',
      colDisplay[0],
      'center'
    ),
    createRow(
      'serialized',
      '序列化',
      false,
      '120px',
      '130px',
      colDisplay[1],
      'center'
    ),
    createRow(
      'functionalMode',
      '函数模式',
      false,
      '120px',
      '130px',
      colDisplay[2],
      'center'
    ),
    createRow(
      'tearDown',
      'tear down',
      false,
      '120px',
      '130px',
      colDisplay[3],
      'center'
    ),
    createRow(
      'comment',
      '描述',
      false,
      '120px',
      '130px',
      colDisplay[3],
      'center'
    ),
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filtering = () => {
    let tmpData = JSON.parse(JSON.stringify(tableData));
    searchList.forEach((value, _) => {
      if (value.startsWith('状态:')) {
        tmpData = tmpData.filter((tableRow, _) => {
          return tableRow.status.includes(value.replace(statusPattern, ''));
        });
      } else if (value.startsWith('名称:')) {
        tmpData = tmpData.filter((tableRow, _) => {
          return tableRow.testPlanName.includes(value.replace(namePattern, ''));
        });
      } else {
        tmpData = tmpData.filter((tableRow, _) => {
          return tableRow.testPlanName.includes(value);
        });
      }
    });
    return tmpData;
  };

  const visibleRows = useMemo(() => {
    const tmpData = filtering();
    if (pageSize * (pageNum - 1) > count) {
      dispatch({ type: UPDATE_TEST_PLAN_PAGE_NUM, data: 1 });
      return stableSort(tmpData, getComparator(order, orderBy)).slice(
        0,
        pageSize
      );
    }
    return stableSort(tmpData, getComparator(order, orderBy)).slice(
      (pageNum - 1) * pageSize,
      (pageNum - 1) * pageSize + pageSize
    );
  }, [order, orderBy, pageNum, pageSize, tableData, searchList]);

  const handlePlanClick = () => {
    setPlanOpen(true);
  };

  //改变每页的数量
  const handlePerPageChange = pageSize => {
    dispatch({ type: UPDATE_TEST_PLAN_PAGE_SIZE, data: pageSize });
  };

  //改变页码
  const handlePageChange = (_event, newPage) => {
    dispatch({ type: UPDATE_TEST_PLAN_PAGE_NUM, data: newPage });
  };

  const handleSearchByClick = by => {
    setSearchValue(by + ':');
    var text = document.getElementById('instance-status-search-input');
    text.focus();
  };

  const resetParameters = () => {
    dispatch({ type: UPDATE_GROUP_EDIT, data: false });
    dispatch({ type: RESET_PLAN });
    dispatch({ type: RESET_GROUP });
  };

  const isDuplicate = () => {
    return false;
  };

  const handleClose = () => {
    resetParameters();
    setPlanOpen(false);
  };

  const handleCancelClick = () => {
    resetParameters();
    setPlanOpen(false);
  };

  const handleConfirmClick = () => {
    resetParameters();
    setPlanOpen(false);
  };

  const handleSearchFocus = event => {
    if (searchBy.length === 0) {
      return;
    }
    if (searchValue === '') {
      setSearchSelectAnchorEl(event.currentTarget);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchSelectAnchorEl(null);
    }, 300);
  };

  const handleEyeClick = event => {
    setCustomContentAnchorEl(event.currentTarget);
  };

  const handleEyeClose = () => {
    setCustomContentAnchorEl(null);
  };

  const handleColEyeClick = index => {
    setColDisplay(prevDisplay => {
      let tmpDisplay = JSON.parse(JSON.stringify(prevDisplay));
      tmpDisplay[index] = !tmpDisplay[index];
      return tmpDisplay;
    });
  };

  return (
    <Stack>
      <Box
        sx={{
          borderRadius: '4px',
          backgroundColor: '#FFFFFF',
          padding: '24px 20px',
          width: 'calc(100% - 40px)',
          height: '58px',
          mb: '12px',
        }}
      >
        <Stack direction='row' spacing={1}>
          <StressTestingIcon />
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontStyle: 'normal',
                color: '#242e42',
                textShadow: '0 4px 8px rgba(36,46,66,.1)',
                fontSize: '24px',
                lineHeight: '32px',
              }}
            >
              性能压测
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontStyle: 'normal',
                color: '#79879c',
                fontSize: '12px',
                lineHeight: 1.67,
              }}
            >
              {intl.messages['stressTesting.stressTestingDescription']}
            </Typography>
          </Box>
        </Stack>
      </Box>



      <Box>
        {/* 条件过滤悬浮框 */}
        <Popper
          id='instance-status-table-search-popper'
          open={searchSelectOpen}
          anchorEl={searchSelectAnchorEl}
          placement='bottom-start'
          sx={{
            zIndex: 1000,
            boxShadow: '0 4px 16px 0 rgba(39,50,71,.28)',
            borderRadius: '4px',
            mt: '2px !important',
          }}
        >
          <Stack
            direction='column'
            sx={{
              border: '1px solid #FAFAFA',
              width: '90px',
              borderRadius: '5px',
              padding: '8px',
              bgcolor: '#242e42',
              fontSize: '12px',
              fontFamily: fontFamily,
            }}
          >
            {searchBy.map((value, index) => {
              return (
                <Box
                  sx={{
                    '&:hover': {
                      bgcolor: '#36435c',
                    },
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'center',
                    height: '30px',
                    lineHeight: '30px',
                    fontWeight: 600,
                  }}
                  onClick={handleSearchByClick.bind(this, value)}
                >
                  {value}
                </Box>
              );
            })}
          </Stack>
        </Popper>

        {/* 定制内容悬浮框 */}
        <Popover
          id='instance-status-table-custom-content-popover'
          open={customContentOpen}
          anchorEl={customContentAnchorEl}
          onClose={handleEyeClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            zIndex: 1000,
            boxShadow: '0 4px 16px 0 rgba(39,50,71,.28)',
            borderRadius: '4px',
            mt: '2px !important',
          }}
        >
          <Stack
            direction='column'
            sx={{
              width: '150px',
              borderRadius: '5px',
              padding: '8px',
              bgcolor: '#242e42',
              fontSize: '12px',
              fontFamily: fontFamily,
            }}
          >
            {colDisplay.map((value, index) => {
              return (
                <Stack
                  direction='row'
                  onClick={handleColEyeClick.bind(this, index)}
                  sx={{
                    color: '#FFFFFF',
                    '&:hover': {
                      bgcolor: '#36435c',
                    },
                    p: '0px 8px',
                  }}
                  justifyContent='flex-start'
                  alignItems='center'
                  spacing={1}
                >
                  {value === true ? (
                    <VisibilityIcon fontSize='small' />
                  ) : (
                    <VisibilityOffIcon fontSize='small' />
                  )}
                  <Box
                    sx={{
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      height: '30px',
                      lineHeight: '30px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {headRow[index + 1].label}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Popover>

        <Box
          sx={{
            height: '32px',
            padding: '10px 30px 10px 30px',
            bgcolor: '#f9fbfd',
          }}
        >
          <Stack direction='row' spacing={2}>
            <ChipTextField
              value={searchValue}
              setValue={setSearchValue}
              contentList={searchList}
              setContentList={setSearchList}
              isDuplicate={isDuplicate}
              startAdornment={<SearchIcon />}
              sx={{
                width: 'calc(100% - 600px)',
                '& .MuiOutlinedInput-input.MuiInputBase-input': {
                  // padding: '6px 12px !important',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontStyle: 'normal',
                  fontStretch: 'normal',
                  lineHeight: 1.67,
                  letterSpacing: 'normal',
                  color: '#36435c',
                  height: '20px',
                },
              }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              enterBlur={true}
              id='instance-status-search-input'
            />
            <EclipseTransparentButton
              sx={{
                bgcolor: '#f9fbfd !important',
                '&:hover': {
                  bgcolor: '#FFFFFF !important',
                },
                '& svg': {
                  color: '#3d3b4f',
                },
                height: '32px',
              }}
            >
              <RefreshIcon />
            </EclipseTransparentButton>

            <EclipseTransparentButton
              sx={{
                bgcolor: '#f9fbfd !important',
                '&:hover': {
                  bgcolor: '#FFFFFF !important',
                },
                '& svg': {
                  color: '#3d3b4f',
                },
                height: '32px',
              }}
              onClick={handleEyeClick}
            >
              <VisibilityIcon />
            </EclipseTransparentButton>
            <KubeConfirmButton sx={{
              width: "200px"
            }} onClick={handlePlanClick}>
              创建测试计划
            </KubeConfirmButton>
          </Stack>
        </Box>

        {/* <StyledTableBox> */}
        <StyledTableContainer sx={{ bgcolor: '#FFF' }}>
          <Table
            stickyHeader
            size='small'
            sx={{
              tableLayout: 'auto',
            }}
          >
            <StyledTableHead
              headRow={headRow}
              selectAll={true}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {!loading && visibleRows !== null && visibleRows.length !== 0 ? (
                visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      key={row.id + '' + index}
                      aria-checked={false}
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: 0,
                        },
                        fontWeight: 600,
                        maxWidth: '110px',
                        position: 'sticky',
                        left: 0,
                        zIndex: 6,
                      }}
                      selected={false}
                    >
                      <StyledTableBodyCell
                        align='center'
                        sx={{
                          p: '0px 16px !important',
                        }}
                      >
                        <KubeCheckbox
                          sx={{
                            bgcolor: 'transparent !important',
                          }}
                          disableRipple
                          size='small'
                        />
                      </StyledTableBodyCell>

                      <StyledTableBodyCell
                        align={'left'}
                        sx={{
                          padding: '6px 16px !important',
                        }}
                      >
                        <Stack alignItems='center' direction='row' spacing={2}>
                          <Task />
                          <Box
                            sx={{
                              height: '30px',
                              lineHeight: '30px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              '&:hover': {
                                color: '#55bc8a',
                              },
                            }}
                            onClick={() => {
                              navigate(`/detail/testplan/${row.id}`);
                            }}
                          >
                            {row.testPlanName}
                          </Box>
                        </Stack>
                      </StyledTableBodyCell>

                      <StyledTableBodyCell
                        align={'center'}
                        sx={{ display: headRow[1].show ? 'table-cell' : 'none' }}
                      >
                        <Stack
                          alignItems='center'
                          direction='row'
                          justifyContent='center'
                          spacing={2}
                        >
                          {StatusIcon(row.status)}
                          <span
                            style={{
                              height: '30px',
                              lineHeight: '30px',
                            }}
                          >
                            {StatusText(row.status)}
                          </span>
                        </Stack>
                      </StyledTableBodyCell>

                      <StyledTableBodyCell
                        align={'center'}
                        sx={{ display: headRow[2].show ? 'table-cell' : 'none' }}
                      >
                        {row.serialized ? "是" : "否"}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell
                        align={'center'}
                        sx={{ display: headRow[3].show ? 'table-cell' : 'none' }}
                      >
                        {row.functionalMode ? "是" : "否"}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell
                        align={'center'}
                        sx={{ display: headRow[4].show ? 'table-cell' : 'none' }}
                      >
                        {row.tearDown ? "是" : "否"}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell
                        align={'center'}
                        sx={{ display: headRow[4].show ? 'table-cell' : 'none' }}
                      >
                        {row.comment}
                      </StyledTableBodyCell>
                    </TableRow>
                  );
                })
              ) : !loading ? (
                <TableRow style={{ height: '220px' }}>
                  <TableCell
                    colSpan={colDisplay.reduce(
                      (accumulator, currentValue) => accumulator + (currentValue === true),
                      2,
                    )}
                    sx={{
                      textAlign: 'center',
                      fontSize: '20px',
                      fontFamily: fontFamily,
                      fontStyle: 'normal',
                    }}
                  >
                    <Question />
                    <NormalBoldFont>无数据</NormalBoldFont>

                    <SmallLightFont>您可以尝试刷新数据</SmallLightFont>
                  </TableCell>
                </TableRow>
              ) : (
                <div></div>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <StyledTableFooter
          pageNum={pageNum}
          pageSize={pageSize}
          perPageList={[10, 20, 50, 100]}
          count={count}
          handlePerPageChange={handlePerPageChange}
          handlePageChange={handlePageChange}
          sx={{
            pt: '12px',
            pb: '12px',
          }}
        />
      </Box>

      <StyledModal open={planOpen} onClose={handleClose}>
        <TestingProgress
          handleConfirmClick={handleConfirmClick}
          handleCancelClick={handleCancelClick}
          showError={showError}
          setShowError={setShowError}
        />
      </StyledModal>
    </Stack>
  );
}
