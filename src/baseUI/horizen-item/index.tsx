import React,{memo, useRef,useEffect} from 'react'
import Scroll from '../scroll'
import {List,ListItem} from './style'

interface IListItem {
  name:string;
  key:string;
}

interface IHorizenProps {
  list:IListItem[];
  title:string;
  oldVal?:string;
  handleClick?:(val:string) => void
}

const Horizen = (props:IHorizenProps) => {
  const { list, oldVal, title } = props;
  const { handleClick } = props;
  const  Category = useRef<HTMLDivElement>(null)

  useEffect (() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM && categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems!).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM!.style.width = `${totalWidth}px`;
  }, []);
  return (  
    <Scroll direction={"horizontal"}  >
    <div ref={Category}>
      <List>
        <span>{title}</span>
        {
          list.map((item) => {
            return (
              <ListItem 
                key={item.key}
                className={`${oldVal === item.key ? 'selected': ''}`} 
                onClick={() => handleClick && handleClick(item.key)}>
                  {item.name}
              </ListItem>
            )
          })
        }
      </List>
    </div>
  </Scroll>
  )
}

export default memo(Horizen) 

