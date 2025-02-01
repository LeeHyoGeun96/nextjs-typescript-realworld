const convertAuthSupabaseErrorToKorean = (errorMsg: string) => {
  switch (errorMsg) {
    case "Invalid login credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다";
      break;

    case "Too many requests":
      return "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요";
      break;

    case "user_already_exists":
      return "이미 존재하는 이메일입니다";
      break;

    default:
      return `로그인에 실패했습니다. ${errorMsg}`;
      break;
  }
};

export default convertAuthSupabaseErrorToKorean;
