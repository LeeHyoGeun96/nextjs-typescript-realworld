import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import NetworkError from '../errors/NetworkError';
import {ValidationErrors} from '../types/authTypes';

// API 에러 응답 DTO
interface ErrorResponseType {
  errors: ValidationErrors;
}

// API 설정 타입
interface ApiConfig extends AxiosRequestConfig {
  token?: string;
}

export const createApi = (url: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponseType>) => {
      // error.response가 있는지 타입가드로 체크
      if (!error.response) {
        if (!error.request) {
          // 요청 자체가 실패한 경우
          throw new NetworkError({
            code: 0,
            message: '네트워크 연결을 확인해주세요.',
          });
        }
        // 요청은 보냈지만 응답을 받지 못한 경우
        throw new NetworkError({
          code: 503,
          message:
            NetworkError.errorMessages[503] || '서버에 연결할 수 없습니다.',
        });
      }

      // 여기서부터는 error.response가 있다는 것이 보장됨
      const {status, data} = error.response;

      // 422 Validation Error 특별 처리
      if (status === 422 && data?.errors) {
        throw new NetworkError({
          code: status,
          message: NetworkError.errorMessages[status],
          errors: data.errors,
        });
      }

      // 401 인증 에러 처리
      if (status === 401) {
        throw new NetworkError({
          code: status,
          message: NetworkError.errorMessages[status] || '인증이 필요합니다.',
        });
      }

      // 일반 에러 처리
      throw new NetworkError({
        code: status,
        message:
          NetworkError.errorMessages[status] || '서버 오류가 발생했습니다.',
        errors: data?.errors,
      });
    },
  );

  const request = async <ResponseType, RequestDTO = void>(
    config: ApiConfig & {data?: RequestDTO},
  ): Promise<ResponseType> => {
    if (config.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${config.token}`,
      };
    }

    const response: AxiosResponse<ResponseType> = await instance(config);
    return response.data;
  };

  return {
    get: <ResponseType, RequestDTO = void>(
      endpoint: string,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'GET',
        url: endpoint,
      }),

    post: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'POST',
        url: endpoint,
        data,
      }),

    delete: <ResponseType, RequestDTO = void>(
      endpoint: string,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'DELETE',
        url: endpoint,
      }),

    patch: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'PATCH',
        url: endpoint,
        data,
      }),

    put: <ResponseType, RequestDTO>(
      endpoint: string,
      data?: RequestDTO,
      config?: ApiConfig,
    ) =>
      request<ResponseType, RequestDTO>({
        ...config,
        method: 'PUT',
        url: endpoint,
        data,
      }),
  };
};
