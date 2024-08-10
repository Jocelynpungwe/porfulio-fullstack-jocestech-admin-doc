import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail } from '../features/user/userSlice'
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const VerifyPage = () => {
  const query = useQuery()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading: loading, isError: error } = useSelector(
    (store) => store.user
  )

  useEffect(() => {
    dispatch(
      verifyEmail({
        verificationToken: query.get('token'),
        email: query.get('email'),
      })
    )
    setTimeout(() => {
      navigate('/')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }, 7000)
  }, [])

  if (loading) {
    return (
      <Wrapper className="section-center page-100">
        <h2>Loading...</h2>
      </Wrapper>
    )
  }

  if (error) {
    return (
      <Wrapper className="section-center page-100">
        <h4>There was an error, please double check your verification link </h4>
      </Wrapper>
    )
  }

  return (
    <Wrapper className="section-center page-100">
      <div className="text-container">
        <p>Account Confirmed</p>
        <p>
          will be redirected shortly, <strong>Please be patient</strong>
        </p>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .text-container {
    padding: 2rem;
    background: var(--clr-green-light);
  }
`

export default VerifyPage
