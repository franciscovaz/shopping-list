import { createAction, props } from "@ngrx/store";

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{
    email: string,
    password: string
  }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{
    email: string,
    password: string
  }>()
);

export const authenticateSuccess = createAction(
  '[Auth] Login Success',
  props<{
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean
  }>()
);

export const authenticatedFail = createAction(
  '[Auth] Login Fail',
  props<{
    errorMessage: string
  }>()
);

export const clearError = createAction(
  '[Auth] Clear Error'
);


export const autoLogin = createAction(
  '[Auth] Auto Login'
);

export const logout = createAction(
  '[Auth] Logout'
)



