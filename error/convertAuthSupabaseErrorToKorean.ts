const convertAuthSupabaseErrorToKorean = (code: string | undefined) => {
  if (!code) return undefined;

  switch (code) {
    case "Invalid login credentials":
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다";

    case "Too many requests":
    case "over_request_rate_limit":
      return "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요";

    case "user_already_exists":
    case "email_exists":
      return "이미 존재하는 이메일입니다";

    case "signup_disabled":
      return "현재 회원가입이 비활성화되어 있습니다";

    case "email_not_confirmed":
      return "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요";

    case "weak_password":
      return "비밀번호가 보안 기준을 충족하지 않습니다";

    case "same_password":
      return "현재 사용 중인 비밀번호와 동일한 비밀번호는 사용할 수 없습니다";

    case "session_expired":
      return "세션이 만료되었습니다. 다시 로그인해주세요";

    case "session_not_found":
      return "세션을 찾을 수 없습니다. 다시 로그인해주세요";

    case "email_address_not_authorized":
      return "승인되지 않은 이메일 주소입니다";

    case "over_email_send_rate_limit":
      return "너무 많은 이메일이 발송되었습니다. 잠시 후 다시 시도해주세요";

    case "user_not_found":
      return "사용자를 찾을 수 없습니다";

    case "user_banned":
      return "계정이 정지되었습니다";

    case "validation_failed":
      return "입력값이 올바르지 않습니다";

    case "request_timeout":
      return "요청 시간이 초과되었습니다. 다시 시도해주세요";

    default:
      return undefined;
  }
};

export default convertAuthSupabaseErrorToKorean;
