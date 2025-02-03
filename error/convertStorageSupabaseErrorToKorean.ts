const convertStorageSupabaseErrorToKorean = (errorMsg: string) => {
  switch (errorMsg) {
    case "NoSuchBucket":
      return "존재하지 않는 버킷입니다. 버킷 이름을 확인하거나 접근 권한을 확인해주세요";

    case "NoSuchKey":
      return "존재하지 않는 키입니다. 키 이름을 확인하거나 접근 권한을 확인해주세요";

    case "NoSuchUpload":
      return "존재하지 않는 업로드입니다. 업로드 ID가 유효하지 않거나 이미 중단된 업로드일 수 있습니다";

    case "InvalidJWT":
      return "유효하지 않은 JWT 토큰입니다. 토큰이 만료되었거나 잘못된 형식일 수 있습니다";

    case "InvalidRequest":
      return "잘못된 요청입니다. 요청 파라미터와 구조를 확인해주세요";

    case "TenantNotFound":
      return "테넌트를 찾을 수 없습니다. 스토리지 서비스에 문제가 있을 수 있습니다";

    case "EntityTooLarge":
      return "파일 크기가 너무 큽니다. 최대 파일 크기 제한을 확인해주세요";

    case "InternalError":
      return "내부 서버 오류가 발생했습니다";

    case "ResourceAlreadyExists":
      return "이미 존재하는 리소스입니다. 다른 이름을 사용하거나 덮어쓰기를 활성화해주세요";

    case "InvalidBucketName":
      return "유효하지 않은 버킷 이름입니다. 이름 규칙을 확인해주세요";

    case "InvalidKey":
      return "유효하지 않은 키입니다. 키 이름 규칙을 확인해주세요";

    case "InvalidRange":
      return "유효하지 않은 범위입니다. 파일 크기 범위 내에서 지정해주세요";

    case "InvalidMimeType":
      return "유효하지 않은 MIME 타입입니다. 올바른 MIME 타입 형식을 사용해주세요";

    case "InvalidUploadId":
      return "유효하지 않은 업로드 ID입니다. 활성화된 업로드 ID를 확인해주세요";

    case "KeyAlreadyExists":
      return "이미 존재하는 키입니다. 다른 키 이름을 사용하거나 덮어쓰기를 활성화해주세요";

    case "BucketAlreadyExists":
      return "이미 존재하는 버킷입니다. 다른 버킷 이름을 사용해주세요";

    case "DatabaseTimeout":
      return "데이터베이스 접근 시간이 초과되었습니다. 잠시 후 다시 시도해주세요";

    case "InvalidSignature":
      return "유효하지 않은 서명입니다. 서명 형식을 확인해주세요";

    case "SignatureDoesNotMatch":
      return "서명이 일치하지 않습니다. 인증 정보를 확인해주세요";

    case "AccessDenied":
      return "접근이 거부되었습니다. 권한을 확인해주세요";

    case "ResourceLocked":
      return "리소스가 잠겨있습니다. 잠금이 해제된 후 다시 시도해주세요";

    case "DatabaseError":
      return "데이터베이스 오류가 발생했습니다";

    case "MissingContentLength":
      return "Content-Length 헤더가 누락되었습니다";

    case "MissingParameter":
      return "필수 파라미터가 누락되었습니다";

    case "InvalidUploadSignature":
      return "유효하지 않은 업로드 서명입니다. 업로드 기록이 변경되었을 수 있습니다";

    case "LockTimeout":
      return "잠금 대기 시간이 초과되었습니다. 잠시 후 다시 시도해주세요";

    case "S3Error":
      return "S3 관련 오류가 발생했습니다";

    case "S3InvalidAccessKeyId":
      return "유효하지 않은 AWS 접근 키 ID입니다";

    case "S3MaximumCredentialsLimit":
      return "최대 자격 증명 수에 도달했습니다";

    case "InvalidChecksum":
      return "체크섬이 일치하지 않습니다. 파일 무결성을 확인해주세요";

    case "MissingPart":
      return "파일의 일부가 누락되었습니다. 모든 파일 부분이 포함되어 있는지 확인해주세요";

    case "SlowDown":
      return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요";

    default:
      return `스토리지 오류가 발생했습니다: ${errorMsg}`;
  }
};

export default convertStorageSupabaseErrorToKorean;
