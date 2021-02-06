import React, { memo } from 'react'
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'
import { SliderContainer } from './style';
import { IBannerList } from '../../application/Recommend/type'


import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css'




export interface ISilderProps {
  bannerList: IBannerList
}

SwiperCore.use([Pagination])

const Slider = (props: ISilderProps) => {

  const { bannerList } = props

  return (
    <SliderContainer>
      <div className="before"></div>
      <Swiper
        pagination={{ clickable: true }}
        controller={{}}
      >
        {
          bannerList.map((slider, i) => {
            return (
              <SwiperSlide className="swiper-slide" key={slider.imageUrl + i}>
                <div className="slider-nav">
                  <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                </div>
              </SwiperSlide>
            );
          })
        }
      </Swiper>
    </SliderContainer>
  )
}
export default memo(Slider)