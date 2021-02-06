/**version:1.0.0
 * 传入歌词，按照正则表达式解析
 * 解析的数据结构为：
 * {
 *   txt:歌词，
 *   time:ms
 * }
 */
// eslint-disable-next-line

const timeExp = /\[(\d{2,}):(\d{2})(?:[\.\:](\d{2,3}))?]/g


// type IState = 0 | 1

let STATE_PLAYING = 1
let STATE_PAUSE = 0

interface ILyricProps {
  lrc: string;
  handler: (ops: IHandlerOps) => void;
}

interface ILyricState {
  speed: number;
  curLineIndex: number
  startStamp: number;
  state: number;
  hooks: { time: number, txt: string }[];
  timer: NodeJS.Timeout | null
}

interface IHandlerOps {
  txt: string; lineNum: number
}

const getDefaultOptions = () => ({
  lrc: '',
  handler: () => { },
  speed: 1,
  curLineIndex: 0,
  startStamp: 0,
  state: STATE_PAUSE,
  hooks: [],
  timer: null
});





export default class Lyric {

  options: ILyricProps & ILyricState

  constructor(options: ILyricProps) {
    this.options = getDefaultOptions()
    this.setOption(options)
    this._initLines()
  }

  setOption(options: ILyricProps) {
    this.options = {
      ...this.options,
      ...options
    }
  }
  private _initLines() {
    const { lrc, hooks } = this.options
    const lines = lrc.split('\n');
    for (let i = 0; i <= lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (!result) continue
      const txt = line.replace(timeExp, '').trim()
      if (txt) {
        if (result[3].length === 3) {

          result[3] = (+result[3] / 10).toString()

        }
        hooks.push({
          time: +result[1] * 60 * 1000 + +result[2] * 1000 + (+result[3] || 0) * 10,
          // 转化具体到毫秒的时间，result [3] * 10 可理解为 (result / 100) * 1000
          txt
        })
      }
    }
    hooks.sort((a, b) => {
      return a.time - b.time
    })
  }
  // 找到当前所在的行
  private _findcurLineIndex(time: number) {
    const { hooks } = this.options
    for (let i = 0; i < hooks.length; i++) {
      if (time <= hooks[i].time) {
        return i
      }
    }
    return hooks.length - 1

  }
  private _callHandler(i: number) {
    const { handler, hooks } = this.options
    if (i < 0) {
      return
    }
    handler({
      txt: hooks[i].txt,
      lineNum: i
    })

  }
  // 继续播放
  private _playRest(isSeek = false) {
    let { hooks, curLineIndex, startStamp, state, speed } = this.options
    let line = hooks[curLineIndex];
    if (!line) return
    let delay
    if (isSeek) {
      delay = line.time - (+new Date() - startStamp);
    } else {
      // 拿到上一行的歌词开始时间，算间隔
      let preTime = hooks[curLineIndex - 1] ? hooks[curLineIndex - 1].time : 0;
      delay = line.time - preTime;
    }
    this.options.timer = setTimeout(() => {

      this._callHandler(this.options.curLineIndex++)

      if (curLineIndex < hooks.length && state === STATE_PLAYING) {

        this._playRest()
      }
    }, delay / speed)
  }
  play(offset = 0, isSeek = false) {
    let { hooks, curLineIndex, startStamp } = this.options
    if (!hooks.length) return

    this.options.state = STATE_PLAYING

    this.options.curLineIndex = this._findcurLineIndex(offset)
    // 立即定位，方式是调用传来的回调函数，并把当前歌词信息传给它
    this._callHandler(curLineIndex - 1);
    // 根据时间进度判断歌曲开始的时间戳
    startStamp = +new Date() - offset

    if (curLineIndex < hooks.length) {
      this.options.timer && clearTimeout(this.options.timer)
      this._playRest(isSeek)
    }
  }
  togglePlay(offset: number) {
    let { state } = this.options
    if (state === STATE_PLAYING) {
      this.stop()
    } else {
      this.options.state = STATE_PLAYING
      this.play(offset, true)
    }
  }
  stop() {
    this.options.state = STATE_PAUSE
    this.options.timer && clearTimeout(this.options.timer)
  }
  seek(offset: number) {
    this.play(offset, true)
  }
  changeSpeed(speed: number) {
    this.options.speed = speed;
  }

}