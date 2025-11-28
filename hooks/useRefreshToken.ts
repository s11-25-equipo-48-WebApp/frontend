import { UpdateSession } from "next-auth/react";

export const refreshAccessToken = async ({ accessToken, update }: { accessToken: string, update: UpdateSession }) => {
    // update debe ser la funcion que esta en {update} = useSession()
    // accessToken debe ser el nuevo accessToken que viene de la respuesta de la api
    await update({
        user: {
            accessToken,
        }
    });
}