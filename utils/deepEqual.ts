export const deepEqual = (
  obj1: any,
  obj2: any,
  keysToCheck?: string[],
): boolean => {
  // 두 객체가 같은 타입인지 확인
  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return obj1 === obj2; // 기본 타입 비교
  }

  // 비교할 키 목록 설정
  const keys1 = keysToCheck || Object.keys(obj1);
  const keys2 = keysToCheck || Object.keys(obj2);

  // 속성의 수가 같지 않으면 false
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 모든 키에 대해 값이 동일한지 재귀적으로 비교
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
