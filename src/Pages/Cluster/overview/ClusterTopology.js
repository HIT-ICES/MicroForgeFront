import { ClusterCanvas } from './canvas';
import { Box, Stack } from '@mui/material';
import ArrowDown from '@/assets/ArrowDown.svg';
import ArrowUp from '@/assets/ArrowUp.svg';
import { useState, useEffect } from 'react';
export default function ClusterTopology(props) {
  const { clusterId, graph, handleNodeClick } = props;

  const [open, setOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let nodeSet = new Set();
    let tmpLinks = [];
    let tmpNodes = [];
    for(const link of graph) {
      nodeSet.add(link.srcId);
      nodeSet.add(link.desId);
      tmpLinks.push({
        source: link.srcId,
        target: link.desId,
      });
    }
    for(const node of nodeSet) {
      tmpNodes.push({
        id: node,
        label: node,
      });
    }
    setNodes(tmpNodes);
    setLinks(tmpLinks);
  }, [graph]);

  const handleClusterClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Box
        onClick={handleClusterClick}
        sx={{
          cursor: 'pointer',
          borderRadius: '4px',
          height: '42px',
          bgcolor: 'rgba(73,204,144,.1)',
          border: '1px solid #49cc90',
          p: '5px 14px 5px 11px',
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Box
            sx={{
              borderRadius: '4px',
              height: '30px',
              minWidth: '64px',
              bgcolor: '#49cc90',
              p: "0px 12px",
              fontFamily: "Open Sans",
              fontSize: "14px",
              lineHeight: "30px",
              fontWeight: "700",
              color: "#ffffff"
            }}
          >
            {clusterId}
          </Box>
          {open ? <ArrowUp /> : <ArrowDown />}
        </Stack>
      </Box>
      {open ? <ClusterCanvas id={clusterId} nodes={nodes} links={links} handleNodeClick={handleNodeClick} /> : <></>}
    </Box>
  );
}
