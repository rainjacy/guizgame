Page({
  data: {
    score: 0,
    timer: 60,
    currentWord: '准备中…',
    wordList: [],
    wordIndex: 0,
    correctWords: [],
    intervalId: null,
    wordAnimationClass: '', // 词语切换动画
    correctAudio: null, // 正确音效
    skipAudio: null, // 跳过音效
  },
  onLoad() {
    const wordList = wx.getStorageSync('currentWordList');
    if (wordList && wordList.length > 0) {
      // 打乱词库顺序
      const shuffledList = this.shuffle(wordList);
      this.setData({
        wordList: shuffledList,
        wordIndex: 0,
        currentWord: shuffledList[0],
        score: 0,
        timer: 60,
        correctWords: [],
        wordAnimationClass: 'in' // 入场动画
      });
      setTimeout(() => this.setData({ wordAnimationClass: '' }), 300);
      this.startTimer();
    } else {
      // 异常处理，如果没拿到词库则返回首页
      wx.showToast({
        title: '词库加载失败',
        icon: 'none',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }

    // 初始化音效
    const correctAudio = wx.createInnerAudioContext();
    correctAudio.src = '/assets/audio/correct.mp3';
    const skipAudio = wx.createInnerAudioContext();
    skipAudio.src = '/assets/audio/skip.mp3';
    this.setData({ correctAudio, skipAudio });
  },
  shuffle(arr) {
    let i = arr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  },
  startTimer() {
    this.data.intervalId && clearInterval(this.data.intervalId);
    const intervalId = setInterval(() => {
      if (this.data.timer <= 1) {
        clearInterval(intervalId);
        this.setData({ timer: 0 });
        this.gameOver();
      } else {
        this.setData({ timer: this.data.timer - 1 });
      }
    }, 1000);
    this.setData({ intervalId });
  },
  nextWord() {
    this.setData({ wordAnimationClass: 'out' }); // 出场动画
    setTimeout(() => {
      const nextIndex = this.data.wordIndex + 1;
      if (nextIndex < this.data.wordList.length) {
        this.setData({
          wordIndex: nextIndex,
          currentWord: this.data.wordList[nextIndex],
          wordAnimationClass: 'in' // 新词入场动画
        });
        setTimeout(() => this.setData({ wordAnimationClass: '' }), 300);
      } else {
        // 词用完了，直接结束
        this.gameOver();
      }
    }, 300);
  },
  onCorrect() {
    this.data.correctAudio.play();
    // 猜对逻辑
    const { currentWord, correctWords } = this.data;
    this.setData({
      score: this.data.score + 1,
      correctWords: correctWords.concat(currentWord)
    });
    this.nextWord();
  },
  onSkip() {
    this.data.skipAudio.play();
    // 跳过逻辑
    this.nextWord();
  },
  gameOver() {
    // 跳转到结果页，传递分数和猜对词语
    wx.redirectTo({
      url: `/pages/result/result?score=${this.data.score}&words=${encodeURIComponent(JSON.stringify(this.data.correctWords))}`
    });
  },
  onUnload() {
    // 清理定时器
    this.data.intervalId && clearInterval(this.data.intervalId);
    // 销毁音效实例
    this.data.correctAudio && this.data.correctAudio.destroy();
    this.data.skipAudio && this.data.skipAudio.destroy();
  }
}) 