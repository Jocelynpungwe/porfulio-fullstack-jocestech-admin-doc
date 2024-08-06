import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const UserInfo = ({ name, email, role, _id, page }) => {
  return (
    <Wrapper>
      <h4>{name}</h4>
      <h5>{email}</h5>
      <h5 className="role">{role}</h5>
      {page !== 'single-customers' && (
        <Link to={`/customers/${_id}`} className="primary-btn">
          View User
        </Link>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-bottom: 1px var(--grey-200) solid;
  padding: 1rem;
  display: grid;

  h4,
  h5 {
    font-size: 1rem;
    margin: 5px 0;
    opacity: 0.5;
  }

  h5 {
    font-weight: 700;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 100px auto;
    grid-column-gap: 2rem;

    .primary-btn {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  }
`

export default UserInfo
