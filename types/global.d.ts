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

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => Promise<void>;
            use_fedcm_for_prompt?: boolean; // 추가
            auto_select?: boolean;
            context?: string;
            ux_mode?: string;
            itp_support?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              type: string;
              theme: string;
              size: string;
              text: string;
              shape: string;
              logo_alignment: string;
            }
          ) => void;
        };
      };
    };
    handleSignInWithGoogle: (
      response: GoogleCredentialResponse
    ) => Promise<void>;
  }

  interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
    client_id: string;
  }
}
