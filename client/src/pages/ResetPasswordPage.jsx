import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetPassword,
  resetAllText,
  setIsResetPassword,
} from '../features/user/userSlice'
import { FormRow } from '../components'
import { toast } from 'react-toastify'
const initialState = {
  password: '',
}

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const ResetPasswordPage = () => {
  const query = useQuery()
  const dispatch = useDispatch()
  const [values, setValues] = useState(initialState)
  const { isLoading, resetText } = useSelector((store) => store.user)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues((prevData) => {
      return { ...prevData, [name]: value }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { password } = values

    if (!password) {
      toast.error('Please Fill Out All Fields')
      return
    }

    dispatch(
      resetPassword({
        token: query.get('token'),
        email: query.get('email'),
        password,
      })
    )

    setValues(initialState)
    dispatch(setIsResetPassword(false))
    setTimeout(() => {
      navigate('/')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }, 7000)
  }

  useEffect(() => {
    dispatch(resetAllText())
    dispatch(setIsResetPassword(true))
  }, [])

  return (
    <Wrapper className="section-center page-100">
      {resetText ? (
        <div className="text-container">
          <p>{resetText}</p>
          <p>
            will be redirected shortly, <strong>Please be patient</strong>
          </p>
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <h3>Reset Password</h3>
          <FormRow
            name="password"
            value={values.password}
            type="password"
            handleChange={handleChange}
          />
          <button type="submit" className="btn " disabled={isLoading}>
            {isLoading ? 'Loading...' : 'New Password'}
          </button>
        </form>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-chocolate);
    box-shadow: var(--dark-shadow);
  }

  h3 {
    text-align: center;
    color: var(--primary-chocolate);
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-chocolate);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
  .text-container {
    padding: 2rem;
    background: var(--clr-green-light);
  }
`

export default ResetPasswordPage
