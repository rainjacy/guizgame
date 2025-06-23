Page({
  data: {
    score: 0,
    timer: 60,
    wordTime: 60,
    currentWord: '准备中…',
    currentEn: '',
    currentPhonetic: '',
    wordList: [],
    wordIndex: 0,
    correctWords: [],
    intervalId: null,
    wordAnimationClass: '', // 词语切换动画
    correctAudio: null, // 正确音效
    skipAudio: null, // 跳过音效
    wordMap: {},
  },
  onLoad() {
    const wordList = wx.getStorageSync('currentWordList') || [];
    const wordTime = wx.getStorageSync('wordTime') || 60;
    // 英文和音标映射
    const wordMap = {
      '汽车': { en: 'car', phonetic: "[kɑːr]" },
      '飞机': { en: 'airplane', phonetic: "['eəpleɪn]" },
      '火车': { en: 'train', phonetic: "[treɪn]" },
      '轮船': { en: 'ship', phonetic: "[ʃɪp]" },
      '地铁': { en: 'subway', phonetic: "['sʌbweɪ]" },
      '公交车': { en: 'bus', phonetic: "[bʌs]" },
      '自行车': { en: 'bicycle', phonetic: "['baɪsɪkl]" },
      '摩托车': { en: 'motorcycle', phonetic: "['məʊtəsaɪkl]" },
      '出租车': { en: 'taxi', phonetic: "['tæksi]" },
      '救护车': { en: 'ambulance', phonetic: "['æmbjʊləns]" },
      '雷电': { en: 'thunder', phonetic: "['θʌndə]" },
      '彩虹': { en: 'rainbow', phonetic: "['reɪnbəʊ]" },
      '地震': { en: 'earthquake', phonetic: "['ɜːθkweɪk]" },
      '龙卷风': { en: 'tornado', phonetic: "[tɔːˈneɪdəʊ]" },
      '暴雨': { en: 'rainstorm', phonetic: "['reɪnstɔːm]" },
      '大雪': { en: 'snowstorm', phonetic: "['snəʊstɔːm]" },
      '日食': { en: 'solar eclipse', phonetic: "['səʊlə ɪˈklɪps]" },
      '月食': { en: 'lunar eclipse', phonetic: "['luːnə ɪˈklɪps]" },
      '流星雨': { en: 'meteor shower', phonetic: "['miːtiə ˈʃaʊə]" },
      '海啸': { en: 'tsunami', phonetic: "[tsuːˈnɑːmi]" },
      '孔子': { en: 'Confucius', phonetic: "[kənˈfjuːʃəs]" },
      '秦始皇': { en: 'Qin Shi Huang', phonetic: "[tʃɪn ʃɪ hwɑːŋ]" },
      '拿破仑': { en: 'Napoleon', phonetic: "[nəˈpəʊliən]" },
      '林肯': { en: 'Lincoln', phonetic: "['lɪŋkən]" },
      '爱因斯坦': { en: 'Einstein', phonetic: "['aɪnstaɪn]" },
      '牛顿': { en: 'Newton', phonetic: "['njuːtən]" },
      '居里夫人': { en: 'Madame Curie', phonetic: "[ˈmædəm ˈkjʊəri]" },
      '华盛顿': { en: 'Washington', phonetic: "['wɒʃɪŋtən]" },
      '成吉思汗': { en: 'Genghis Khan', phonetic: "[ˈdʒɛŋɡɪs kɑːn]" },
      '克利奥帕特拉': { en: 'Cleopatra', phonetic: "[ˌkliːəˈpætrə]" },
      '中国': { en: 'China', phonetic: "['tʃaɪnə]" },
      '法国': { en: 'France', phonetic: "[frɑːns]" },
      '纽约': { en: 'New York', phonetic: "[njuː jɔːk]" },
      '东京': { en: 'Tokyo', phonetic: "['təʊkiəʊ]" },
      '伦敦': { en: 'London', phonetic: "['lʌndən]" },
      '巴黎': { en: 'Paris', phonetic: "['pærɪs]" },
      '北京': { en: 'Beijing', phonetic: "[beɪˈdʒɪŋ]" },
      '上海': { en: 'Shanghai', phonetic: "[ʃæŋˈhaɪ]" },
      '莫斯科': { en: 'Moscow', phonetic: "['mɒskaʊ]" },
      '悉尼': { en: 'Sydney', phonetic: "['sɪdni]" },
      '狮子': { en: 'lion', phonetic: "['laɪən]" },
      '大象': { en: 'elephant', phonetic: "['elɪfənt]" },
      '企鹅': { en: 'penguin', phonetic: "['peŋɡwɪn]" },
      '乌龟': { en: 'turtle', phonetic: "['tɜːtl]" },
      '长颈鹿': { en: 'giraffe', phonetic: "[dʒɪˈrɑːf]" },
      '袋鼠': { en: 'kangaroo', phonetic: "[ˌkæŋɡəˈruː]" },
      '考拉': { en: 'koala', phonetic: "[kəʊˈɑːlə]" },
      '北极熊': { en: 'polar bear', phonetic: "['pəʊlə beə]" },
      '海豚': { en: 'dolphin', phonetic: "['dɒlfɪn]" },
      '大熊猫': { en: 'giant panda', phonetic: "['dʒaɪənt 'pændə]" },
      '披萨': { en: 'pizza', phonetic: "['piːtsə]" },
      '牛奶': { en: 'milk', phonetic: "[mɪlk]" },
      '西瓜': { en: 'watermelon', phonetic: "['wɔːtəˌmelən]" },
      '冰淇淋': { en: 'ice cream', phonetic: "['aɪs kriːm]" },
      '汉堡包': { en: 'hamburger', phonetic: "['hæmbɜːɡə]" },
      '巧克力': { en: 'chocolate', phonetic: "['tʃɒklət]" },
      '爆米花': { en: 'popcorn', phonetic: "['pɒpkɔːn]" },
      '咖啡': { en: 'coffee', phonetic: "['kɒfi]" },
      '可乐': { en: 'cola', phonetic: "['kəʊlə]" },
      '寿司': { en: 'sushi', phonetic: "['suːʃi]" }
    };
    // 打乱词库顺序
    const shuffledList = this.shuffle(wordList);
    const firstWord = shuffledList[0] || '';
    const en = wordMap[firstWord]?.en || '';
    const phonetic = wordMap[firstWord]?.phonetic || '';
    this.setData({
      wordList: shuffledList,
      wordIndex: 0,
      currentWord: firstWord,
      currentEn: en,
      currentPhonetic: phonetic,
      score: 0,
      timer: wordTime,
      wordTime,
      correctWords: [],
      wordAnimationClass: 'in',
      wordMap
    });
    setTimeout(() => this.setData({ wordAnimationClass: '' }), 300);
    this.startTimer();

    // 初始化音效
    const correctAudio = wx.createInnerAudioContext();
    correctAudio.src = '/assets/audio/correct.mp3';
    const skipAudio = wx.createInnerAudioContext();
    skipAudio.src = '/assets/audio/skip.mp3';
    this.setData({ correctAudio, skipAudio });
    this.wordMap = wordMap;
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
        const nextWord = this.data.wordList[nextIndex];
        const en = this.data.wordMap[nextWord]?.en || '';
        const phonetic = this.data.wordMap[nextWord]?.phonetic || '';
        this.setData({
          wordIndex: nextIndex,
          currentWord: nextWord,
          currentEn: en,
          currentPhonetic: phonetic,
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