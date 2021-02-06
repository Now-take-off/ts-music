import React, { forwardRef, memo } from 'react'
import styled from 'styled-components'
import style from '../../assets/global-style'



const HeaderContainer = styled.div`
  position:fixed;
  padding:5px 10px;
  padding-top:0;
  height:40px;
  width:100%;
  z-index:100;
  display:flex;
  line-height:40px;
  color:${style["font-color-light"]};
  .back {
    margin-right:5px;
    font-size:20px;
    width:20px;
  }
  >h1 {
    font-size:${style["font-size-l"]};
    font-weight:700;
  }
  .Marquee {
    width: 100%;
    height: 35px;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
  }
  .text {
    position: absolute;
    animation: marquee 10s linear infinite;
  }
  @keyframes marquee {
    0% {
      left: 100%;
    }
    100% {
      left: -100%
    }
  }
`

interface IHeaderProps {
  handleClick: () => void;
  title: string;
  isMarquee?: boolean;
}

const Header = forwardRef<HTMLDivElement, IHeaderProps>((props, ref) => {
  const { title, handleClick, isMarquee } = props;
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
      {
        isMarquee ? <div className="Marquee"><h1 className="text">{title}</h1></div> :
          <h1>{title}</h1>
      }
    </HeaderContainer>
  )
})
export default memo(Header)