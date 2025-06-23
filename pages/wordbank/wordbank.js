Page({
  data: {
    wordbanks: [],
    selected: 0
  },
  onLoad() {
    const wordbanks = [
      { name: '交通工具', icon: '🚗', words: ['汽车', '飞机', '火车', '轮船', '地铁', '公交车', '自行车', '摩托车', '出租车', '救护车'] },
      { name: '自然现象', icon: '🌈', words: ['雷电', '彩虹', '地震', '龙卷风', '暴雨', '大雪', '日食', '月食', '流星雨', '海啸'] },
      { name: '历史人物', icon: '👨‍🏫', words: ['孔子', '秦始皇', '拿破仑', '林肯', '爱因斯坦', '牛顿', '居里夫人', '华盛顿', '成吉思汗', '克利奥帕特拉'] },
      { name: '国家城市', icon: '🏙️', words: ['中国', '法国', '纽约', '东京', '伦敦', '巴黎', '北京', '上海', '莫斯科', '悉尼'] },
      { name: '动物王国', icon: '🦁', words: ['狮子', '大象', '企鹅', '乌龟', '长颈鹿', '袋鼠', '考拉', '北极熊', '海豚', '大熊猫'] },
      { name: '食物饮料', icon: '🍕', words: ['披萨', '牛奶', '西瓜', '冰淇淋', '汉堡包', '巧克力', '爆米花', '咖啡', '可乐', '寿司'] }
    ];
    // Create random word list
    const allWords = wordbanks.reduce((acc, bank) => acc.concat(bank.words), []);
    const randomWords = { name: '随机', icon: '🎲', words: allWords };
    this.setData({
      wordbanks: [randomWords, ...wordbanks]
    });
  },
  selectWordbank(e) {
    this.setData({ selected: e.currentTarget.dataset.index })
  },
  confirm() {
    // 使用 storage 传递词库，避免url过长
    const selectedBank = this.data.wordbanks[this.data.selected];
    wx.setStorageSync('currentWordList', selectedBank.words);
    wx.navigateTo({ url: '/pages/game/game' });
  }
}) 