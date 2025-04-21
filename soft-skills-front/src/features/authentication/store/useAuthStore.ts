import {create} from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IAuth } from '../types/auth.store'
import { loginUser } from '../api/login'
import { RegisterPayload } from '../types/register.api'
import { registerUser } from '../api/register'

const useAuthStore = create<IAuth>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        tokenType: null,
        isLoading: false,
        error: null,
        successMessage: null,

        clearError: () => {
          set({
             error: null 
            }, false, 'AUTH/CLEAR_ERROR')
        },

        clearSuccessMessage: () => {
          set({
             successMessage: null 
            }, false, 'AUTH/CLEAR_SUCCESS_MESSAGE')
        },

        login: async (username, password) => {
          set({
            isLoading: true, error: null, successMessage: null 
          }, false, 'AUTH/LOGIN_REQUEST')

          try {
            const data = await loginUser(username, password)
            set({
              user: data.user,
              accessToken: data.accessToken,
            }, false, 'AUTH/LOGIN_SUCCESS')

          } catch (err: unknown) {
            if (err instanceof Error) {
              set({
                error: err.message,
                isLoading: false
              }, false, 'AUTH/LOGIN_FAILURE')
            }
          } finally {
            set({
              isLoading: false,
            }, false, 'AUTH/LOGIN_COMPLETE') 
          }
        },

        signUp: async (userData: RegisterPayload) => {
          set({
             isLoading: true, error: null, successMessage: null 
            }, false, 'AUTH/SIGNUP_REQUEST')
          try {
            const data = await registerUser(userData) 

            set({
              successMessage: data.message,
            }, false, 'AUTH/SIGNUP_SUCCESS')

          } catch (err: unknown) {
            if (err instanceof Error) {
              set({
                error: err.message,
                isLoading: false
              }, false, 'AUTH/SIGNUP_FAILURE')
            }
          } finally {
            set({
              isLoading: false,
            }, false, 'AUTH/SIGNUP_COMPLETE')
          }
        },

        isLoggedIn: (): boolean => {
          const { accessToken } = get()
          return !!accessToken
        },

        logout: () => {
          set({
              user: null,
              accessToken: null,
              tokenType: null,
              error: null,
              successMessage: null,
            },false,'AUTH/LOGOUT')
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


export default useAuthStore