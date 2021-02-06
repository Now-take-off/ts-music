import React, {
  forwardRef,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useImperativeHandle,
  useMemo
} from 'react'
import BScroll from 'better-scroll'
import { ScrollContainer, PullUpLoading, PullDownLoading } from './style'

import Loading from '../loading'
import LoadingV2 from '../loading-v2'

import { Debounce } from '../../api/utils'

type direction = 'vertical' | 'horizontal'

interface IScrollProps {
  direction?: direction;
  click?: boolean;
  refresh?: boolean; // 是否刷新
  pullUpLoading?: boolean;
  pullDownLoading?: boolean;
  bounceTop?: boolean;
  bounceBottom?: boolean;
  onScroll?: Function;
  pullUp?: () => void;
  pullDown?: () => void;
  className?: string;
  children: ReactNode;
}

export interface IScrollHandles {
  refresh(): void;
  getBScroll(): BScroll | undefined
}

const Scroll = forwardRef<IScrollHandles, IScrollProps>((props, ref) => {
  const {
    direction = "vertical",
    click = true,
    refresh = true,
    pullUpLoading = false,
    pullDownLoading = false,
    bounceTop = true,
    bounceBottom = true,
    onScroll = null,
    pullUp = null,
    pullDown = null,
  } = props
  const [bScroll, setBScroll] = useState<BScroll | null>(null)
  const scrollContaninerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current!, {
      scrollX: direction === 'horizontal',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      }
    })
    setBScroll(scroll);
    return () => {
      setBScroll(null)
    }
  }, [])
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })
  useEffect(() => {
    if (onScroll && bScroll) {
      bScroll.on('scroll', onScroll)
      return () => {
        bScroll.off('scroll', onScroll)
      }
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if (bScroll && pullDown) {
      bScroll.on('touchEnd', (pos: { x: number, y: number }) => {
        if (pos.y > 50) {
          pullDown()
        }
      })
      return () => {
        bScroll.off('touchEnd')
      }
    }
  }, [bScroll, pullDown])


  // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。根据依赖执行
  let pullUpDebounce = useMemo(() => {
    return Debounce.use(pullUp!, 300)
  }, [pullUp])

  //进行上拉到底的判断，调用上拉加载的函数
  useEffect(() => {
    if (!bScroll || !pullUp) return
    bScroll.on('scrollEnd', () => {
      // 判断是否滑到底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    })
    return () => {
      bScroll.off('scrollEnd')
    }
  }, [bScroll, pullUp, pullUpDebounce])
  // 暴漏方法
  useImperativeHandle(
    ref,
    () => {
      return {
        refresh() {
          if (bScroll) {
            bScroll.refresh()
            bScroll.scrollTo(0, 0)
          }
        },
        getBScroll() {
          if (bScroll) {
            return bScroll
          }
        }
      }
    }
  )




  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {pullUpLoading && <PullUpLoading><Loading></Loading></PullUpLoading>}
      {pullDownLoading && <PullDownLoading><LoadingV2></LoadingV2></PullDownLoading>}
    </ScrollContainer>
  )
})
export default Scroll