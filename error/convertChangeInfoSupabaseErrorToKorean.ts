const convertChangeInfoSupabaseErrorToKorean = (errorMsg: string) => {
  switch (errorMsg) {
    case "same_password":
      return "비밀번호를 업데이트하는 사용자는 현재 사용 중인 것과 다른 비밀번호를 사용해야 합니다.";
      break;

    default:
      return `정보 수정에 실패했습니다. ${errorMsg}`;
      break;
  }
};

export default convertChangeInfoSupabaseErrorToKorean;
