const convertServerErrorToKorean = (error: string) => {
  switch (error) {
    case "has already been taken":
      return "이미 사용 중입니다";

    case "can't be blank":
      return "필수 입력 항목입니다";

    case "is invalid":
      return "유효하지 않습니다";

    case "User not found":
      return "사용자를 찾을 수 없습니다";

    case "Current and new password are required":
      return "현재 비밀번호와 새 비밀번호를 입력해주세요";

    case "New password must be at least 8 characters long":
      return "새 비밀번호는 최소 8자 이상이어야 합니다";

    case "An unexpected error occurred":
      return "예상치 못한 오류가 발생했습니다";

    case "User successfully deleted":
      return "사용자가 성공적으로 삭제되었습니다";

    default:
      return error;
  }
};

const formatError = (error: Record<string, string[]> | undefined) => {
  if (!error) return undefined;

  const errorMessage = Object.entries(error).map(
    ([key, messages]) =>
      `${key}: ${convertServerErrorToKorean(messages.join(", "))}`
  );

  return errorMessage;
};

export default formatError;
