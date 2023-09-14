
export function handleLinkWithoutProtocol(link) {
  if (typeof link != 'string') {
    return link;
  }
  if (link.startsWith('https://') || link.startsWith('http://')) {
    return link;
  }
  return 'https://' + link;
}

export function transformVersion(version) {
  if (!version) {
    return "";
  }
  return version.major + "." + version.minor + "." + version.patch;
}

export function checkVersionFormat(version) {
  if (!version) {
    return null;
  }
  try {
    const version_arr = version.split(".")
    if (version_arr.length !== 3) {
      return null;
    }
    return {
      major: version_arr[0],
      minor: version_arr[1],
      patch: version_arr[2]
    }
  } catch (error) {
    return null;
  }
}

export const shadowStyle = {
  boxShadow: "0px 0px 12px 0px rgba(38, 46, 53, 0.12)",
  p: "12px"
}

export const digitInCircle = (num, circleSize=30, circleBgColor="#E45C3F", circleFontColor = "#FFFFFF") => {
  /**
   * - num: 在圆圈中显示的数字
   * - circleSize: 圆圈的大小，自动使文字适配大小，单位px
   * - circleBgColor: 圆圈背景颜色
   * - circleFontColor: 字体颜色，默认 #FFFFFF
   */
  const top = -(10 + circleSize / 2);
  const right = -(10 + circleSize / 2);
  const radius = circleSize / 2;
  const lineHeight = circleSize / 4;
  return `<div style='width:${circleSize}px; height:${circleSize}px; border-radius:${radius}px; background-color:${circleBgColor}; color:${circleFontColor}; text-align:center; position:absolute; top:${top}px; right:${right}px; font-size:${radius}px; line-height:${circleSize}px; font-family:Open Sans;'>${num}</div>`;

}