import '@tanstack/react-query';
import NetworkError from '../errors/NetworkError';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: NetworkError; // NetworkError를 전역 오류 타입으로 등록
  }
}
