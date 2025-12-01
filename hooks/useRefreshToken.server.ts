import api from "@/services/config";

export const refreshAccessTokenServer = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  try {
    const { data } = await api.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};
