import {create} from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import { IAuth } from '../types/auth'
import { loginUser } from '../api/login';

const useAuthStore = create<IAuth>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                accessToken: null,
                tokenType: null,
                isLoading: false,
                error: null,

                login: async (username, password) => {
                    set({ isLoading: true, error: null }, false, 'AUTH/LOGIN_REQUEST')

                    try {
                        const data = await loginUser(username, password)
                        set({
                            user: data.user,
                            accessToken: data.accessToken,
                            isLoading: false,
                        }, false, 'AUTH/LOGIN_SUCCESS')
                    } catch (err: unknown) {
                        if (err instanceof Error) {
                            set({
                                error: err.message,
                                isLoading: false
                            }, false, 'AUTH/LOGIN_FAILURE')
                        }
                    }
                },

                isLoggedIn: (): boolean => {
                    const { accessToken } = get()
                    return !!accessToken
                },

                logout: () => {
                    set(
                        {
                            user: null,
                            accessToken: null,
                            tokenType: null,
                            error: null,
                        },
                        false,
                        'AUTH/LOGOUT'
                    )
                }
            }),
            {
                name: 'authStore',
                partialize: (state) => ({
                    user: state.user,
                    accessToken: state.accessToken,
                })
            }
        )
    )
)


export default useAuthStore;