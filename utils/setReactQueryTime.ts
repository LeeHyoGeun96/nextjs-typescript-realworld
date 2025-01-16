/**
 * React Query 시간 설정을 위한 유틸리티 함수
 * @param time - "분/초" 형식의 문자열 (예: "5/30" -> 5분 30초)
 * @returns 밀리초 단위의 시간값, 잘못된 입력시 0을 반환
 *
 * @example
 * setReactQueryTime("5/30")  // 5분 30초 -> 330000ms
 * setReactQueryTime("1/0")   // 1분 0초 -> 60000ms
 * setReactQueryTime("0/30")  // 0분 30초 -> 30000ms
 */
export const setReactQueryTime = (time: string): number => {
  // 기본 정규식 검사
  if (!/^\d+\/\d+$/.test(time)) {
    console.warn(
      'ReactQuery Time: 올바른 형식이 아닙니다. "분/초" 형식으로 입력해주세요.',
    );
    return 0;
  }

  const [minutes, seconds] = time.split('/').map(Number);

  // 유효성 검사
  if (minutes < 0 || seconds < 0) {
    console.warn('ReactQuery Time: 음수는 사용할 수 없습니다.');
    return 0;
  }

  if (seconds >= 60) {
    console.warn('ReactQuery Time: 초는 60 미만이어야 합니다.');
    return minutes * 60 * 1000; // 초는 무시하고 분만 계산
  }

  return (minutes * 60 + seconds) * 1000;
};
