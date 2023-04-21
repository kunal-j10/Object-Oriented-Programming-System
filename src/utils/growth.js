export const transformGraphData = (standardData, userDataForGraph, type) => [
  {
    data: standardData.p2SD_list,
    // color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    color: () => `rgb(255, 0, 0)`,
  },
  {
    data: standardData.p1SD_list,
    // color: (opacity = 1) => `rgba(153, 153, 0, ${opacity})`,
    color: () => `rgb(153, 153, 0)`,
  },
  {
    data: userDataForGraph[type],
    // color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    color: () => `rgb(0, 0, 255)`,
  },
  {
    data: standardData.n1SD_list,
    // color: (opacity = 1) => `rgba(153, 153, 0, ${opacity})`,
    color: () => `rgb(153, 153, 0)`,
  },
  {
    data: standardData.n2SD_list,
    // color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    color: () => `rgb(255, 0, 0)`,
  },
];
