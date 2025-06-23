Page({
  data: {
    score: 0,
    correctWords: []
  },
  onLoad(options) {
    let score = 0;
    let correctWords = [];
    if (options.score) {
      score = options.score;
    }
    if (options.words) {
      try {
        correctWords = JSON.parse(decodeURIComponent(options.words));
      } catch (e) {
        console.error('解析猜对词语列表失败', e);
      }
    }
    this.setData({
      score,
      correctWords
    });
  },
  restart() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  onShareAppMessage() {
    return {
      title: `我刚刚在疯狂猜词中获得了${this.data.score}分，快来挑战我吧！`,
      path: '/pages/index/index',
      imageUrl: '' // 可选：自定义分享图片
    }
  }
}) 