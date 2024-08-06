import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleEdit, clearNewProduct } from '../features/product/productSlice'

const AddItems = ({ name, label, linkName, page }) => {
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <div className="info wrapper-container">
        <h4 className="title">{name}</h4>
        {page === 'product-page' ? (
          <Link
            onClick={() => {
              dispatch(toggleEdit({ id: '', newEdit: false }))
              dispatch(clearNewProduct())
            }}
            to={`/${linkName}`}
            className="btn "
          >
            {label}
          </Link>
        ) : (
          <Link to={`/${linkName}`} className="btn">
            {label}
          </Link>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
`

export default AddItems
