export interface ErrorResponse {
  errors: {
    body: string[];
  };
}

interface ProfileType {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
  isCurrentUser: boolean;
}
