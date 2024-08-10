import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { newsLetterJoin } from '../features/user/userSlice'
import styled from 'styled-components'

const initialState = {
  email: '',
}
const Contact = () => {
  const [values, setValues] = useState(initialState)
  const { isLoading } = useSelector((store) => store.user)

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

    dispatch(newsLetterJoin(email))
    setValues(initialState)
  }

  return (
    <Wrapper>
      <div className="section-center">
        <h3>Join our newsletter and get 20% off</h3>
        <div className="content">
          <p>
            Join our tech community and stay ahead with the latest in
            innovation, exclusive deals, and tech insights. Sign up for our
            newsletter to unlock access to special offers, expert
            recommendations, and stay informed about the newest gadgets and
            trends. Elevate your tech experience – subscribe now to be part of
            our dynamic tech community!
          </p>
          <form className="contact-form" onSubmit={onSubmit}>
            <input
              name="email"
              type="email"
              value={values.email}
              className="form-input"
              placeholder="enter email"
              onChange={handleChange}
            />
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'subscribe'}
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  padding: 5rem 0;
  h3 {
    text-transform: none;
  }
  p {
    line-height: 2;
    max-width: 45em;
    color: var(--clr-grey-5);
  }
  .contact-form {
    width: 90vw;
    max-width: 500px;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .form-input,
  .submit-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid var(--clr-black);
  }
  .form-input {
    border-right: none;
    color: var(--clr-grey-3);
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }
  .submit-btn {
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
  }
  .form-input::placeholder {
    color: var(--clr-black);
    text-transform: capitalize;
  }
  .submit-btn {
    background: var(--primary-chocolate);
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    cursor: pointer;
    transition: var(--transition);
    color: var(--clr-black);
  }
  .submit-btn:hover {
    background: var(--secondy-chocolate);
  }
  @media (min-width: 992px) {
    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 8rem;
      margin-top: 2rem;
    }
    p {
      margin-bottom: 0;
    }
  }
  @media (min-width: 1280px) {
    padding: 15rem 0;
  }
`

export default Contact
