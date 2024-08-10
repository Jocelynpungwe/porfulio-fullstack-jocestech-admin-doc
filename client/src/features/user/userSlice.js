import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  removeCartFromLocalStorage,
} from '../../utils/localStorage'
import customeFetch from '../../utils/customeFetch'
import { clearCart } from '../cart/cartSlice'
import { clearReview } from '../review/reviewSlice'
import { clearOrder } from '../order/orderSlice'

const initialState = {
  isLoading: false,
  isError: false,
  user: getUserFromLocalStorage(),
  verifiedText: '',
  resetText: '',
  isResetPassword: false,
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/register', user)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/login', user)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await customeFetch.get('/auth/logout')

      thunkAPI.dispatch(clearCart())
      thunkAPI.dispatch(clearReview())
      thunkAPI.dispatch(clearOrder())

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'user/verify-email',
  async ({ verificationToken, email }, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/verify-email', {
        verificationToken,
        email,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'user/reset-password',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/reset-password', user)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'user/forgot-password',
  async (email, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/forgot-Password', {
        email,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.patch('/user/updateUser', user)

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const newsLetterJoin = createAsyncThunk(
  'user/newsLetterJoin',
  async (email, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/newsLetter', {
        email,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.patch(
        '/user/updateUserPassword',
        user
      )

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    resetAllText: (state, { payload }) => {
      state.verifiedText = ''
      state.resetText = ''
    },
    setIsResetPassword: (state, { payload }) => {
      state.isResetPassword = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Updated Credential Successfully`)
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserPassword.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Password Changed Successfully`)
      })
      .addCase(updateUserPassword.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.verifiedText = msg
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(verifyEmail.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.isLoading = false
        state.isError = false
        toast.success(msg)
      })
      .addCase(verifyEmail.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        toast.error(payload)
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Hello There ${user.name}`)
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.isLoading = false
        state.user = null
        removeUserFromLocalStorage()
        removeCartFromLocalStorage()
        toast.success(msg)
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.isLoading = false
        state.isError = false
        state.resetText = msg
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        toast.error(payload)
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(resetPassword.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.isLoading = false
        state.isError = false
        state.resetText = msg
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = false
        toast.error(payload)
      })
      .addCase(newsLetterJoin.pending, (state) => {
        state.isLoading = true
        state.isError = false
      })
      .addCase(newsLetterJoin.fulfilled, (state, { payload }) => {
        const { msg } = payload
        state.isLoading = false
        state.isError = false
        toast.success(msg)
      })
      .addCase(newsLetterJoin.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isError = true
        toast.error(payload)
      })
  },
})

export const { resetAllText, setIsResetPassword } = userSlice.actions
export default userSlice.reducer
