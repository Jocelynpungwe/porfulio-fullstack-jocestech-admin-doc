import React from 'react'
import styled from 'styled-components'
import Product from './Product'
const OrderInfo = ({ image, name, price, id, amount, colors }) => {
  return (
    <Wrapper>
      <Product image={image} name={name} price={price} id={id} />
      <section style={{ marginTop: '1rem' }}>
        {amount && <p>Amount: {amount}</p>}
        {colors && colors.length > 0 && (
          <div className="color-container">
            {colors.map((color, index) => {
              return (
                <div key={index} className="color-container">
                  <div
                    style={{ backgroundColor: color }}
                    className="color-span"
                  ></div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.article`
  img {
    height: 200px;
  }
  h5,
  p {
    text-align: center;
    opacity: 0.5;
  }

  h5 {
    font-size: 1rem;
    margin: 5px 0;
  }

  p {
    margin: 1rem 0 1rem 0;
  }

  .color-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .color-span {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid var(--grey-50);
  }
`

export default OrderInfo
