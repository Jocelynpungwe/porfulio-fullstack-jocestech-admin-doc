import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { forgotPassword, resetAllText } from '../features/user/userSlice'
import styled from 'styled-components'
import { FormRow } from '../components'
import { toast } from 'react-toastify'
const initialState = {
  email: '',
}

const ForgotPasswordPage = () => {
  const [values, setValues] = useState(initialState)
  const { isLoading, resetText } = useSelector((store) => store.user)

  const dispatch = useDispatch()
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setValues((prevData) => {
      return { ...prevData, [name]: value }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { email } = values

    if (!email) {
      toast.error('Please Fill Out All Fields')
      return
    }

    dispatch(forgotPassword(email))
    setValues(initialState)
  }

  useEffect(() => {
    dispatch(resetAllText())
  }, [])

  return (
    <Wrapper
      className={`${resetText ? 'section-center page-100' : 'full-page'}`}
    >
      {resetText ? (
        <div className="text-container">
          <p>{resetText}</p>
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <h3>Forgot Password</h3>
          <FormRow
            name="email"
            value={values.email}
            type="email"
            handleChange={handleChange}
          />
          <button type="submit" className="btn " disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Reset Password Link'}
          </button>
          <p>
            Already a member?
            <Link to="/register" className="member-btn">
              login
            </Link>
          </p>
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

export default ForgotPasswordPage
