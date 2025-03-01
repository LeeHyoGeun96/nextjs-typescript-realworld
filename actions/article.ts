"use server";

import { translateError } from "@/error/translateError";
import {
  addCommentState,
  createArticleState,
  deleteArticleState,
  deleteCommentState,
  favoriteArticleState,
  updateArticleState,
} from "@/types/articleTypes";
import { cookies } from "next/headers";

export const favoriteArticle = async (
  slug: string
): Promise<favoriteArticleState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/favorite`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      const errorMessage =
        translateError(data.errors) || "좋아요 처리에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("좋아요 처리중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const unfavoriteArticle = async (
  slug: string
): Promise<favoriteArticleState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/favorite`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        translateError(data.errors) || "좋아요 처리에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw new Error("좋아요 처리중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const addComment = async (
  body: string,
  slug: string
): Promise<addCommentState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    if (!body.trim()) {
      return {
        success: false,
        error: new Error("댓글을 입력해주세요."),
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: { body },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(data.errors) || "댓글 작성에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }

    return {
      success: true,
      value: {
        responseData: data,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("댓글 작성중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const deleteComment = async (
  id: number,
  slug: string
): Promise<deleteCommentState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      const errorMessage =
        translateError(data.errors) || "댓글 삭제에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    throw new Error("댓글 삭제중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const deleteArticle = async (
  slug: string
): Promise<deleteArticleState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(response);
      const data = await response.json();
      const errorMessage =
        translateError(data.errors) || "게시글 삭제에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }

    return {
      success: true,
    };
  } catch (e) {
    console.error(e);
    throw new Error("게시글 삭제중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const createArticle = async (
  _: createArticleState,
  formData: FormData
): Promise<createArticleState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        error: new Error("로그인이 필요합니다."),
      };
    }

    const tagListStr = formData.get("tagList")?.toString();
    const tagList = tagListStr ? (JSON.parse(tagListStr) as string[]) : [];

    const inputData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      body: formData.get("body")?.toString() || "",
      tagList: tagList,
    };

    if (!inputData.title || !inputData.description || !inputData.body) {
      return {
        success: false,
        error: new Error("모든 필드를 입력해주세요."),
        value: { inputData },
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article: inputData,
        }),
      }
    );

    if (!response.ok) {
      console.error(response);
      const data = await response.json();
      const errorMessage =
        translateError(data.errors) || "게시글 작성에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData },
      };
    }

    return {
      success: true,
      value: { inputData },
    };
  } catch (e) {
    console.error(e);
    throw new Error("게시글 작성중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const updateArticle = async (
  _: updateArticleState,
  formData: FormData,
  slug: string
): Promise<updateArticleState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        error: new Error("로그인이 필요합니다."),
        value: {
          inputData: {
            title: "",
            description: "",
            body: "",
            tagList: [],
          },
        },
      };
    }

    const tagListStr = formData.get("tagList")?.toString();
    const tagList = tagListStr ? (JSON.parse(tagListStr) as string[]) : [];

    const inputData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      body: formData.get("body")?.toString() || "",
      tagList: tagList,
    };

    if (!inputData.title || !inputData.description || !inputData.body) {
      return {
        success: false,
        error: new Error("모든 필드를 입력해주세요."),
        value: { inputData },
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article: inputData,
        }),
      }
    );

    if (!response.ok) {
      console.error(response);
      const data = await response.json();
      const errorMessage =
        translateError(data.errors) || "게시글 수정에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData },
      };
    }

    return {
      success: true,
      value: { inputData },
    };
  } catch (e) {
    console.error(e);
    throw new Error("게시글 수정중에 예상치 못한 에러가 발생하였습니다.");
  }
};
