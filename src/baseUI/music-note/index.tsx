import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import styled from 'styled-components'
import { prefixStyle } from '../../api/utils'
import style from '../../assets/global-style'

const Container = styled.div`
  .icon_wrapper {
    position:fixed;
    z-index:1000;
    margin-top:-10px;
    margin-left:-10px;
    color:${style["theme-color"]};
    font-size:14px;
    display:none;
    transition:transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform:translate3d(0,0,0);
  }
  > div  {
    transition:transform 1s
  }
`

export interface IMusicNoteHandle {
  startAnimation: (x: number, y: number) => void
}
type IIcon = HTMLDivElement & { running?: boolean }


const MusicNote = forwardRef<IMusicNoteHandle>((props, ref) => {
  const ICON_NUMBER = 3
  const transform = prefixStyle('transform')
  const iconsRef = useRef(document.createElement('div'))




  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node: IIcon = createNode(`<div class="iconfont">&#xe642;</div>`)!

      iconsRef.current!.appendChild(node!)
      let domArray: IIcon[] = [].slice.call(iconsRef.current?.children)
      domArray.forEach((item) => {
        item.running = false
        item.addEventListener('transitionend', function () {
          this.style.display = 'none';
          this.style[transform] = 'translate3d(0,0,0)';
          this['running'] = false
          let icon = this.querySelector('div');
          icon!.style[transform] = 'translate3d(0,0,0)';
        }, false)
      })
    }
  }, [])

  // 原生dom操作，返回一个dom节点对象
  const createNode = (txt: string) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`
    const tempNode = document.createElement('div')
    tempNode.innerHTML = template
    return tempNode.firstChild as HTMLDivElement
  }

  const startAnimation = (x: number, y: number) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let domArray = [...iconsRef.current!.children]
      let item = domArray[i] as IIcon

      if (item.running === false) {

        item.style.left = x + "px"
        item.style.top = y + "px"
        item.style.display = "inline-block"

        setTimeout(() => {
          item.running = true
          item.style[transform] = `translate3d(0,750px,0)`
          let icon = item.querySelector('div')
          icon!.style[transform] = `translate3d(-40px,0,0)`
        }, 20)
        break
      }
    }
  }
  useImperativeHandle(ref, () => ({
    startAnimation
  }))
  return (
    <Container ref={iconsRef}>
    </Container>
  )
})

export default memo(MusicNote)
