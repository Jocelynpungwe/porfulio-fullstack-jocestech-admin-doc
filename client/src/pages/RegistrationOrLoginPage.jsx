import { useEffect, useState } from 'react'
import { FormRow } from '../components'
import {
  registerUser,
  loginUser,
  resetAllText,
  setIsResetPassword,
} from '../features/user/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: false,
}

const RegistrationOrLoginPage = () => {
  const [values, setValues] = useState(initialState)
  const { isLoading, user, verifiedText, isResetPassword } = useSelector(
    (store) => store.user
  )
  const navigate = useNavigate()

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
    const { name, email, password, isMember } = values

    if (!email || !password || (!isMember && !name)) {
      toast.error('Please Fill Out All Fields')
      return
    }

    if (!isMember) {
      dispatch(registerUser({ name, email, password }))

      return
    }

    dispatch(loginUser({ email, password }))
  }

  const toggleMember = () => {
    setValues((prevData) => {
      return { ...prevData, isMember: !prevData.isMember }
    })
  }

  useEffect(() => {
    if (user) {
      if (isResetPassword) {
        navigate('/')
        dispatch(setIsResetPassword(false))
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        navigate('/products')
      }
    }
  }, [user, navigate])

  useEffect(() => {
    dispatch(resetAllText())
    window.scrollTo(0, 0)
  }, [])

  return (
    <Wrapper
      className={`${verifiedText ? 'section-center page-100' : 'full-page'}`}
    >
      {verifiedText ? (
        <div className="text-container">
          <p>{verifiedText}</p>
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit}>
          <h3>{values.isMember ? 'Login' : 'Register'}</h3>

          {/* name field */}
          {!values.isMember && (
            <FormRow
              name="name"
              value={values.name}
              type="text"
              handleChange={handleChange}
            />
          )}
          <FormRow
            name="email"
            value={values.email}
            type="email"
            handleChange={handleChange}
          />
          <FormRow
            name="password"
            value={values.password}
            type="password"
            handleChange={handleChange}
          />
          <button type="submit" className="btn " disabled={isLoading}>
            {isLoading ? 'Loading...' : 'submit'}
          </button>
          <p>
            {values.isMember ? 'Not a member yet?' : 'Already a member?'}

            <button type="button" onClick={toggleMember} className="member-btn">
              {values.isMember ? 'Register' : 'Login'}
            </button>
          </p>
          <p>
            Forgot passwords?
            <Link to="/forgot-password" className="member-btn">
              reset
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

export default RegistrationOrLoginPage
