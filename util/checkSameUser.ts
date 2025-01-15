import {CurrentUserType} from '../store/userStore';
import {ArticleType} from '../types/articleTypes';

/**
 * 로그인한 유저와 응답 유저가 같은지 확인하는 함수
 * @param loggedInUser 로그인한 유저
 * @param responseUser 응답 유저
 * @returns 로그인한 유저와 응답 유저가 같으면 true, 다르면 false
 */
interface CheckSameUserParams {
  loggedInUser: CurrentUserType;
  responseUser: ArticleType;
}

export const checkSameUser = ({
  loggedInUser,
  responseUser,
}: CheckSameUserParams) => {
  return loggedInUser.username === responseUser.author.username;
};
