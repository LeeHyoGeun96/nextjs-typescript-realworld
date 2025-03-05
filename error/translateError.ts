interface ErrorMessages {
  [key: string]: {
    [key: string]: string;
  };
}

const errorMessages: ErrorMessages = {
  "email or password": {
    "is invalid": "이메일 또는 비밀번호가 올바르지 않습니다",
  },
  user: {
    "can't be blank": "필수 입력 항목입니다",
    "has already been taken": "이미 사용중입니다",
    "is invalid": "올바르지 않은 형식입니다",
    "or password is invalid": "이메일 또는 비밀번호가 올바르지 않습니다",
  },
  email: {
    "can't be blank": "이메일을 입력해주세요",
    "has already been taken": "이미 등록된 이메일입니다",
    "is invalid": "올바른 이메일 형식이 아닙니다",
  },
  password: {
    "can't be blank": "비밀번호를 입력해주세요",
    "is too short": "비밀번호가 너무 짧습니다",
    "is invalid": "올바르지 않은 비밀번호입니다",
  },
  username: {
    "can't be blank": "사용자 이름을 입력해주세요",
    "has already been taken": "이미 사용중인 사용자 이름입니다",
  },
  article: {
    "not found": "게시글을 찾을 수 없습니다",
  },
  title: {
    "can't be blank": "제목을 입력해주세요",
    "must be unique": "이미 존재하는 제목입니다",
  },
  description: {
    "can't be blank": "설명을 입력해주세요",
  },
  body: {
    "can't be blank": "내용을 입력해주세요",
  },
  comment: {
    "not found": "댓글을 찾을 수 없습니다",
    "can't be blank": "댓글 내용을 입력해주세요",
  },
};

/**
 * 에러 메시지를 한글로 변환하여 문자열로 반환
 * @param errors - 에러 객체
 * @returns 번역된 에러 메시지 (여러 개인 경우 줄바꿈으로 구분)
 */
export const translateError = (
  errors: Record<string, string[]>
): string | undefined => {
  const messages: string[] = [];

  for (const [field, fieldErrors] of Object.entries(errors)) {
    const translatedErrors = fieldErrors
      .map((error) => {
        return errorMessages[field]?.[error];
      })
      .filter((msg): msg is string => msg !== undefined);

    messages.push(...translatedErrors);
  }

  // 번역된 메시지가 없으면 undefined 반환
  return messages.length > 0 ? [...new Set(messages)].join("\n") : undefined;
};
