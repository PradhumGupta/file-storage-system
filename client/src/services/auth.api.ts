import api from "../lib/axios"

export class AuthServices {
    public static signup = async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password })
        return response.data;
    }

    public static login = async (email: string, password: string) => {
        const response = await api.post('/auth/sign-in', { email, password })
        return response.data;
    }

    // public static logout = async () => {
    //     await api.post('/auth/sign-out')
    // }

    public static refreshToken = async () => {
        const response = await api.post('/auth/refresh')
        return response.data;
    }
}