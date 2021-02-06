import React, { useEffect, useRef, useState, TouchEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from './../../api/utils';

interface ITouch {
  initiated: boolean;
  startX: number;
  left: number;
}

interface IProgressBarProps {
  percentChange: (percent: number) => void;
  percent: number;
}

const ProgressBarWrapper = styled.div`
  height:30px;
  .bar-inner {
    position:relative;
    top:13px;
    height:4px;
    background:rgba(0,0,0,.3);
    .progress {
      position:absolute;
      height:100%;
      background:${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

const ProgressBar = (props: IProgressBarProps) => {
  const { percentChange, percent } = props

  const progressBar = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const progressBtn = useRef<HTMLDivElement>(null);

  const [touch, setTouch] = useState<ITouch>();

  // const progressBtnWidth = 15;
  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch?.initiated) {
      const barWidth = progressBar.current!.clientWidth
      const offsetWidth = percent * barWidth;
      _offset(offsetWidth)
    }
  }, [percent])

  const _changePercent = () => {
    const barWidth = progressBar.current!.clientWidth;
    const curPercent = progress.current!.clientWidth / barWidth; // 新的进度计算
    percentChange(curPercent)
  }

  const progressTouchStart = (event: TouchEvent) => {
    const startTouch = {
      initiated: false,
      startX: 0,
      left: 0
    };
    startTouch.initiated = true //表示滑动动作开始
    startTouch.startX = event.touches[0].pageX
    startTouch.left = progress.current!.clientWidth
    setTouch(startTouch)

  }
  const progressTouchMove = (event: TouchEvent) => {
    if (!touch!.initiated) return
    // 滑动距离
    const deltaX = event.touches[0].pageX - touch!.startX;
    const barWidth = progressBar.current!.clientWidth;
    const offsetWidth = Math.min(Math.max(0, touch!.left + deltaX), barWidth)
    _offset(offsetWidth)
  }

  const progressTouchEnd = (event: TouchEvent) => {
    const endTouch: ITouch = JSON.parse(JSON.stringify(touch))
    endTouch.initiated = false
    setTouch(endTouch)
    _changePercent()
  }

  const progressClick = (event: MouseEvent) => {
    const rect = progressBar.current!.getBoundingClientRect();
    const offsetWidth = Math.min(Math.max(0, event.pageX - rect.left), rect.width)
    _offset(offsetWidth)
    _changePercent()
  }
  // 进度条偏移量
  const _offset = (offsetWidth: number) => {
    progress.current!.style.width = `${offsetWidth}px`;
    progressBtn.current!.style.transform = `translate3d(${offsetWidth}px,0,0)`
  }

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default ProgressBar
