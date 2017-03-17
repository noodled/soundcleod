'use strict'

const { TouchBar } = require('electron')
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar

module.exports = function touchBarMenu(window, soundcloud) {

  const nextTrack = new TouchBarButton({
    icon: './app/res/next.png',
    click: () => {
      soundcloud.nextTrack()
    }
  })

  const previousTrack = new TouchBarButton({
    icon: './app/res/previous.png',
    click: () => {
      soundcloud.previousTrack()
    }
  })

  const playPause = new TouchBarButton({
    icon: './app/res/play.png',
    click: () => {
      soundcloud.playPause()
      soundcloud.isPlaying().then(({ isPlaying }) => {
        if (isPlaying)
          playPause.icon = './app/res/pause.png'
        else
          playPause.icon = './app/res/play.png'
      })
    }
  })

  const likeUnlike = new TouchBarButton({
    icon: './app/res/like.png',
    click: () => {
      soundcloud.likeUnlike()
    }
  })

  const trackInfo = new TouchBarLabel()

  soundcloud.on('play', ({ title, subtitle }) => {
    trackInfo.label = title + ' by ' + subtitle
  })

  const touchBar = new TouchBar([
    previousTrack,
    playPause,
    nextTrack,
    likeUnlike,
    new TouchBarSpacer({size: 'flexible'}),
    trackInfo,
    new TouchBarSpacer({size: 'flexible'})
  ])

  window.setTouchBar(touchBar)
}